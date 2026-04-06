const { ok, created, badRequest, unauthorized, serverError } = require('../../shared/utils/response')
const { dynamo } = require('../../shared/utils/dynamo')
const { QueryCommand, PutCommand, UpdateCommand } = require('@aws-sdk/lib-dynamodb')
const { randomUUID } = require('crypto')

const REVIEWS_TABLE = process.env.REVIEWS_TABLE
const RESIDENCES_TABLE = process.env.RESIDENCES_TABLE

async function listReviews(event) {
  try {
    const { id } = event.pathParameters
    const { sort = 'recent', limit = '10', lastKey } = event.queryStringParameters || {}

    const params = {
      TableName: REVIEWS_TABLE,
      KeyConditionExpression: 'residenceId = :residenceId',
      ExpressionAttributeValues: { ':residenceId': id },
      Limit: Math.min(parseInt(limit, 10), 50),
      ScanIndexForward: sort !== 'recent', // false = descending (newest first)
    }

    if (sort === 'recent') {
      params.IndexName = 'createdAt-index'
      params.ScanIndexForward = false
    }

    if (lastKey) {
      try {
        params.ExclusiveStartKey = JSON.parse(Buffer.from(lastKey, 'base64').toString())
      } catch {
        return badRequest('Invalid pagination key')
      }
    }

    const result = await dynamo.send(new QueryCommand(params))

    const nextKey = result.LastEvaluatedKey
      ? Buffer.from(JSON.stringify(result.LastEvaluatedKey)).toString('base64')
      : null

    return ok({
      reviews: result.Items || [],
      count: result.Count || 0,
      nextKey,
    })
  } catch (err) {
    console.error('listReviews error:', err)
    return serverError()
  }
}

async function createReview(event) {
  try {
    const { id: residenceId } = event.pathParameters

    // Extract userId from Cognito JWT claims (injected by API Gateway)
    const userId = event.requestContext?.authorizer?.jwt?.claims?.sub
    if (!userId) return unauthorized('You must be signed in to submit a review')

    const body = JSON.parse(event.body || '{}')
    const { ratings, roomType, cleaningFrequency, recommend, amenities, kitchenType, bathroomType, comment, year } = body

    // Validate required fields
    if (!ratings?.roomQuality || !ratings?.buildingSafety || !ratings?.bathroom || !ratings?.location) {
      return badRequest('All four ratings (roomQuality, buildingSafety, bathroom, location) are required')
    }

    if (recommend === undefined) return badRequest('recommend field is required')

    const overall = parseFloat(
      ((ratings.roomQuality + ratings.buildingSafety + ratings.bathroom + ratings.location) / 4).toFixed(1)
    )

    const reviewId = randomUUID()
    const createdAt = new Date().toISOString()

    const review = {
      residenceId,
      reviewId,
      userId,
      ratings: {
        roomQuality: ratings.roomQuality,
        buildingSafety: ratings.buildingSafety,
        bathroom: ratings.bathroom,
        location: ratings.location,
        overall,
      },
      roomType: roomType || null,
      cleaningFrequency: cleaningFrequency || null,
      recommend: Boolean(recommend),
      amenities: amenities || [],
      kitchenType: kitchenType || null,
      bathroomType: bathroomType || null,
      comment: comment?.trim() || null,
      year: year || null,
      createdAt,
    }

    await dynamo.send(new PutCommand({
      TableName: REVIEWS_TABLE,
      Item: review,
      // Prevent duplicate reviews from the same user for the same residence
      ConditionExpression: 'attribute_not_exists(residenceId) OR userId <> :userId',
      ExpressionAttributeValues: { ':userId': userId },
    }))

    // Update residence aggregate rating atomically
    await dynamo.send(new UpdateCommand({
      TableName: RESIDENCES_TABLE,
      Key: { residenceId },
      UpdateExpression: `
        SET reviewCount = if_not_exists(reviewCount, :zero) + :one,
            ratingSum = if_not_exists(ratingSum, :zero) + :overall,
            avgRating = (if_not_exists(ratingSum, :zero) + :overall) / (if_not_exists(reviewCount, :zero) + :one)
      `,
      ExpressionAttributeValues: {
        ':zero': 0,
        ':one': 1,
        ':overall': overall,
      },
    }))

    return created({ review })
  } catch (err) {
    if (err.name === 'ConditionalCheckFailedException') {
      return badRequest('You have already reviewed this residence')
    }
    console.error('createReview error:', err)
    return serverError()
  }
}

module.exports = { listReviews, createReview }

module.exports.handler = async (event) => {
  const { routeKey } = event
  if (routeKey === 'GET /residences/{id}/reviews')    return listReviews(event)
  if (routeKey === 'POST /residences/{id}/reviews')   return createReview(event)
  return notFound('Route not found')
}
