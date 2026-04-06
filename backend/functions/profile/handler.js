const { ok, unauthorized, notFound, serverError } = require('../../shared/utils/response')
const { dynamo } = require('../../shared/utils/dynamo')
const { QueryCommand } = require('@aws-sdk/lib-dynamodb')

const REVIEWS_TABLE = process.env.REVIEWS_TABLE

async function getUserReviews(event) {
  try {
    const userId = event.requestContext?.authorizer?.jwt?.claims?.sub
    if (!userId) return unauthorized('You must be signed in')

    const result = await dynamo.send(new QueryCommand({
      TableName: REVIEWS_TABLE,
      IndexName: 'userId-index',
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: { ':userId': userId },
    }))

    return ok({ reviews: result.Items || [] })
  } catch (err) {
    console.error('getUserReviews error:', err)
    return serverError()
  }
}

module.exports = { getUserReviews }

module.exports.handler = async (event) => {
  if (event.routeKey === 'GET /users/me/reviews') return getUserReviews(event)
  return notFound('Route not found')
}
