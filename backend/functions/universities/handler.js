const { ok, notFound, serverError } = require('../../shared/utils/response')
const { dynamo } = require('../../shared/utils/dynamo')
const { GetCommand, QueryCommand, ScanCommand } = require('@aws-sdk/lib-dynamodb')

const UNIVERSITIES_TABLE = process.env.UNIVERSITIES_TABLE
const RESIDENCES_TABLE = process.env.RESIDENCES_TABLE

async function listUniversities(event) {
  try {
    const { province, city } = event.queryStringParameters || {}

    let result

    if (province) {
      result = await dynamo.send(new QueryCommand({
        TableName: UNIVERSITIES_TABLE,
        IndexName: 'province-index',
        KeyConditionExpression: 'province = :province',
        ExpressionAttributeValues: { ':province': province },
      }))
    } else if (city) {
      result = await dynamo.send(new QueryCommand({
        TableName: UNIVERSITIES_TABLE,
        IndexName: 'city-index',
        KeyConditionExpression: 'city = :city',
        ExpressionAttributeValues: { ':city': city },
      }))
    } else {
      result = await dynamo.send(new ScanCommand({ TableName: UNIVERSITIES_TABLE }))
    }

    return ok({ universities: result.Items || [] })
  } catch (err) {
    console.error('listUniversities error:', err)
    return serverError()
  }
}

async function getUniversity(event) {
  try {
    const { id } = event.pathParameters

    const result = await dynamo.send(new GetCommand({
      TableName: UNIVERSITIES_TABLE,
      Key: { universityId: id },
    }))

    if (!result.Item) return notFound(`University '${id}' not found`)

    return ok({ university: result.Item })
  } catch (err) {
    console.error('getUniversity error:', err)
    return serverError()
  }
}

async function listResidences(event) {
  try {
    const { id } = event.pathParameters
    const { campus, sort = 'rating' } = event.queryStringParameters || {}

    const params = {
      TableName: RESIDENCES_TABLE,
      IndexName: 'universityId-index',
      KeyConditionExpression: 'universityId = :universityId',
      ExpressionAttributeValues: { ':universityId': id },
    }

    if (campus) {
      params.FilterExpression = 'campus = :campus'
      params.ExpressionAttributeValues[':campus'] = campus
    }

    const result = await dynamo.send(new QueryCommand(params))
    const residences = result.Items || []

    if (sort === 'rating') {
      residences.sort((a, b) => (b.avgRating || 0) - (a.avgRating || 0))
    } else if (sort === 'reviews') {
      residences.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0))
    }

    return ok({ residences, total: residences.length })
  } catch (err) {
    console.error('listResidences error:', err)
    return serverError()
  }
}

module.exports = { listUniversities, getUniversity, listResidences }

module.exports.handler = async (event) => {
  const { routeKey } = event
  if (routeKey === 'GET /universities')                    return listUniversities(event)
  if (routeKey === 'GET /universities/{id}')               return getUniversity(event)
  if (routeKey === 'GET /universities/{id}/residences')    return listResidences(event)
  return notFound('Route not found')
}
