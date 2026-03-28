const { ok, notFound, badRequest, serverError } = require('../../shared/utils/response')
const { dynamo } = require('../../shared/utils/dynamo')
const { GetCommand, QueryCommand, ScanCommand } = require('@aws-sdk/lib-dynamodb')

const RESIDENCES_TABLE = process.env.RESIDENCES_TABLE

async function getResidence(event) {
  try {
    const { id } = event.pathParameters

    const result = await dynamo.send(new GetCommand({
      TableName: RESIDENCES_TABLE,
      Key: { residenceId: id },
    }))

    if (!result.Item) return notFound(`Residence '${id}' not found`)

    return ok({ residence: result.Item })
  } catch (err) {
    console.error('getResidence error:', err)
    return serverError()
  }
}

async function searchResidences(event) {
  try {
    const {
      q,
      province,
      universityId,
      minRating,
      amenities,
      roomType,
      onCampus,
      sort = 'rating',
      limit = '20',
    } = event.queryStringParameters || {}

    let items = []

    if (universityId) {
      // Efficient: query by university GSI
      const result = await dynamo.send(new QueryCommand({
        TableName: RESIDENCES_TABLE,
        IndexName: 'universityId-index',
        KeyConditionExpression: 'universityId = :universityId',
        ExpressionAttributeValues: { ':universityId': universityId },
      }))
      items = result.Items || []
    } else if (province) {
      // Query by province GSI
      const result = await dynamo.send(new QueryCommand({
        TableName: RESIDENCES_TABLE,
        IndexName: 'province-index',
        KeyConditionExpression: 'province = :province',
        ExpressionAttributeValues: { ':province': province },
      }))
      items = result.Items || []
    } else {
      // Full scan — acceptable for ~200 residences
      const result = await dynamo.send(new ScanCommand({ TableName: RESIDENCES_TABLE }))
      items = result.Items || []
    }

    // Apply in-memory filters
    if (q) {
      const query = q.toLowerCase()
      items = items.filter(r =>
        r.name?.toLowerCase().includes(query) ||
        r.universityName?.toLowerCase().includes(query)
      )
    }

    if (minRating) {
      items = items.filter(r => (r.avgRating || 0) >= parseFloat(minRating))
    }

    if (amenities) {
      const required = amenities.split(',').map(a => a.trim().toLowerCase())
      items = items.filter(r =>
        required.every(a => (r.amenities || []).map(x => x.toLowerCase()).includes(a))
      )
    }

    if (roomType) {
      items = items.filter(r => (r.roomTypes || []).includes(roomType))
    }

    if (onCampus !== undefined) {
      const isOnCampus = onCampus === 'true'
      items = items.filter(r => r.onCampus === isOnCampus)
    }

    // Sort
    if (sort === 'rating') {
      items.sort((a, b) => (b.avgRating || 0) - (a.avgRating || 0))
    } else if (sort === 'reviews') {
      items.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0))
    } else if (sort === 'name') {
      items.sort((a, b) => (a.name || '').localeCompare(b.name || ''))
    }

    const pageSize = Math.min(parseInt(limit, 10), 50)
    return ok({ residences: items.slice(0, pageSize), total: items.length })
  } catch (err) {
    console.error('searchResidences error:', err)
    return serverError()
  }
}

module.exports = { getResidence, searchResidences }
