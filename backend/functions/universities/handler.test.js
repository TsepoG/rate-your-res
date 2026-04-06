jest.mock('../../shared/utils/dynamo', () => ({
  dynamo: { send: jest.fn() },
}))

const { dynamo } = require('../../shared/utils/dynamo')
const { listUniversities, getUniversity, listResidences, handler } = require('./handler')

beforeEach(() => jest.clearAllMocks())

// ─── listUniversities ────────────────────────────────────────────────────────

describe('listUniversities', () => {
  test('scans all universities when no filters given', async () => {
    dynamo.send.mockResolvedValue({ Items: [{ universityId: 'u1', name: 'UCT' }] })

    const res = await listUniversities({ queryStringParameters: null })

    expect(res.statusCode).toBe(200)
    expect(JSON.parse(res.body)).toEqual({ universities: [{ universityId: 'u1', name: 'UCT' }] })
  })

  test('returns empty array when table has no items', async () => {
    dynamo.send.mockResolvedValue({ Items: [] })

    const res = await listUniversities({ queryStringParameters: {} })

    expect(res.statusCode).toBe(200)
    expect(JSON.parse(res.body).universities).toEqual([])
  })

  test('queries province-index when province filter is provided', async () => {
    dynamo.send.mockResolvedValue({ Items: [] })

    await listUniversities({ queryStringParameters: { province: 'Western Cape' } })

    expect(dynamo.send).toHaveBeenCalledWith(
      expect.objectContaining({
        input: expect.objectContaining({ IndexName: 'province-index' }),
      })
    )
  })

  test('queries city-index when city filter is provided', async () => {
    dynamo.send.mockResolvedValue({ Items: [] })

    await listUniversities({ queryStringParameters: { city: 'Cape Town' } })

    expect(dynamo.send).toHaveBeenCalledWith(
      expect.objectContaining({
        input: expect.objectContaining({ IndexName: 'city-index' }),
      })
    )
  })

  test('returns 500 when DynamoDB throws', async () => {
    dynamo.send.mockRejectedValue(new Error('DynamoDB unavailable'))

    const res = await listUniversities({ queryStringParameters: null })

    expect(res.statusCode).toBe(500)
  })
})

// ─── getUniversity ───────────────────────────────────────────────────────────

describe('getUniversity', () => {
  test('returns university when found', async () => {
    const university = { universityId: 'uct', name: 'UCT' }
    dynamo.send.mockResolvedValue({ Item: university })

    const res = await getUniversity({ pathParameters: { id: 'uct' } })

    expect(res.statusCode).toBe(200)
    expect(JSON.parse(res.body)).toEqual({ university })
  })

  test('returns 404 when university does not exist', async () => {
    dynamo.send.mockResolvedValue({ Item: undefined })

    const res = await getUniversity({ pathParameters: { id: 'unknown' } })

    expect(res.statusCode).toBe(404)
    expect(JSON.parse(res.body).error).toMatch(/unknown/)
  })

  test('returns 500 when DynamoDB throws', async () => {
    dynamo.send.mockRejectedValue(new Error('timeout'))

    const res = await getUniversity({ pathParameters: { id: 'uct' } })

    expect(res.statusCode).toBe(500)
  })
})

// ─── listResidences ──────────────────────────────────────────────────────────

describe('listResidences', () => {
  test('returns residences sorted by rating (default)', async () => {
    dynamo.send.mockResolvedValue({
      Items: [
        { residenceId: 'r1', avgRating: 3.5 },
        { residenceId: 'r2', avgRating: 4.8 },
      ],
    })

    const res = await listResidences({
      pathParameters: { id: 'uct' },
      queryStringParameters: {},
    })

    expect(res.statusCode).toBe(200)
    const body = JSON.parse(res.body)
    expect(body.residences[0].residenceId).toBe('r2') // highest first
    expect(body.total).toBe(2)
  })

  test('sorts by review count when sort=reviews', async () => {
    dynamo.send.mockResolvedValue({
      Items: [
        { residenceId: 'r1', reviewCount: 5 },
        { residenceId: 'r2', reviewCount: 20 },
      ],
    })

    const res = await listResidences({
      pathParameters: { id: 'uct' },
      queryStringParameters: { sort: 'reviews' },
    })

    const body = JSON.parse(res.body)
    expect(body.residences[0].residenceId).toBe('r2')
  })

  test('applies campus filter', async () => {
    dynamo.send.mockResolvedValue({ Items: [] })

    await listResidences({
      pathParameters: { id: 'uct' },
      queryStringParameters: { campus: 'Upper' },
    })

    expect(dynamo.send).toHaveBeenCalledWith(
      expect.objectContaining({
        input: expect.objectContaining({ FilterExpression: 'campus = :campus' }),
      })
    )
  })

  test('returns 500 when DynamoDB throws', async () => {
    dynamo.send.mockRejectedValue(new Error('error'))

    const res = await listResidences({
      pathParameters: { id: 'uct' },
      queryStringParameters: {},
    })

    expect(res.statusCode).toBe(500)
  })
})

// ─── handler dispatcher ──────────────────────────────────────────────────────

describe('handler (dispatcher)', () => {
  test('routes GET /universities to listUniversities', async () => {
    dynamo.send.mockResolvedValue({ Items: [] })
    const res = await handler({ routeKey: 'GET /universities', queryStringParameters: null })
    expect(res.statusCode).toBe(200)
  })

  test('routes GET /universities/{id} to getUniversity', async () => {
    dynamo.send.mockResolvedValue({ Item: { universityId: 'uct' } })
    const res = await handler({ routeKey: 'GET /universities/{id}', pathParameters: { id: 'uct' } })
    expect(res.statusCode).toBe(200)
  })

  test('routes GET /universities/{id}/residences to listResidences', async () => {
    dynamo.send.mockResolvedValue({ Items: [] })
    const res = await handler({
      routeKey: 'GET /universities/{id}/residences',
      pathParameters: { id: 'uct' },
      queryStringParameters: {},
    })
    expect(res.statusCode).toBe(200)
  })

  test('returns 404 for unknown route', async () => {
    const res = await handler({ routeKey: 'DELETE /universities' })
    expect(res.statusCode).toBe(404)
  })
})
