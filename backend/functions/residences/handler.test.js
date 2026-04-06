jest.mock('../../shared/utils/dynamo', () => ({
  dynamo: { send: jest.fn() },
}))

const { dynamo } = require('../../shared/utils/dynamo')
const { getResidence, searchResidences, handler } = require('./handler')

beforeEach(() => jest.clearAllMocks())

// ─── getResidence ────────────────────────────────────────────────────────────

describe('getResidence', () => {
  test('returns residence when found', async () => {
    const residence = { residenceId: 'r1', name: 'Leo Marquard' }
    dynamo.send.mockResolvedValue({ Item: residence })

    const res = await getResidence({ pathParameters: { id: 'r1' } })

    expect(res.statusCode).toBe(200)
    expect(JSON.parse(res.body)).toEqual({ residence })
  })

  test('returns 404 when residence does not exist', async () => {
    dynamo.send.mockResolvedValue({ Item: undefined })

    const res = await getResidence({ pathParameters: { id: 'unknown' } })

    expect(res.statusCode).toBe(404)
    expect(JSON.parse(res.body).error).toMatch(/unknown/)
  })

  test('returns 500 when DynamoDB throws', async () => {
    dynamo.send.mockRejectedValue(new Error('timeout'))

    const res = await getResidence({ pathParameters: { id: 'r1' } })

    expect(res.statusCode).toBe(500)
  })
})

// ─── searchResidences ────────────────────────────────────────────────────────

describe('searchResidences', () => {
  const baseItems = [
    { residenceId: 'r1', name: 'Leo Marquard', avgRating: 4.5, reviewCount: 10, onCampus: true, amenities: ['wifi'], roomTypes: ['single'] },
    { residenceId: 'r2', name: 'Tugwell Hall', avgRating: 3.2, reviewCount: 25, onCampus: false, amenities: ['wifi', 'gym'], roomTypes: ['double'] },
    { residenceId: 'r3', name: 'Fuller Hall', avgRating: 2.1, reviewCount: 5, onCampus: true, amenities: [], roomTypes: ['single'] },
  ]

  test('returns all residences (scan) when no filters given', async () => {
    dynamo.send.mockResolvedValue({ Items: baseItems })

    const res = await searchResidences({ queryStringParameters: {} })

    expect(res.statusCode).toBe(200)
    expect(JSON.parse(res.body).total).toBe(3)
  })

  test('queries universityId-index when universityId is provided', async () => {
    dynamo.send.mockResolvedValue({ Items: [] })

    await searchResidences({ queryStringParameters: { universityId: 'uct' } })

    expect(dynamo.send).toHaveBeenCalledWith(
      expect.objectContaining({
        input: expect.objectContaining({ IndexName: 'universityId-index' }),
      })
    )
  })

  test('queries province-index when province is provided', async () => {
    dynamo.send.mockResolvedValue({ Items: [] })

    await searchResidences({ queryStringParameters: { province: 'Western Cape' } })

    expect(dynamo.send).toHaveBeenCalledWith(
      expect.objectContaining({
        input: expect.objectContaining({ IndexName: 'province-index' }),
      })
    )
  })

  test('filters by text query (q)', async () => {
    dynamo.send.mockResolvedValue({ Items: baseItems })

    const res = await searchResidences({ queryStringParameters: { q: 'leo' } })

    const body = JSON.parse(res.body)
    expect(body.residences).toHaveLength(1)
    expect(body.residences[0].residenceId).toBe('r1')
  })

  test('filters by minRating', async () => {
    dynamo.send.mockResolvedValue({ Items: baseItems })

    const res = await searchResidences({ queryStringParameters: { minRating: '4' } })

    const body = JSON.parse(res.body)
    expect(body.residences.every(r => r.avgRating >= 4)).toBe(true)
  })

  test('filters by amenities (all must be present)', async () => {
    dynamo.send.mockResolvedValue({ Items: baseItems })

    const res = await searchResidences({ queryStringParameters: { amenities: 'wifi,gym' } })

    const body = JSON.parse(res.body)
    expect(body.residences).toHaveLength(1)
    expect(body.residences[0].residenceId).toBe('r2')
  })

  test('filters by roomType', async () => {
    dynamo.send.mockResolvedValue({ Items: baseItems })

    const res = await searchResidences({ queryStringParameters: { roomType: 'double' } })

    const body = JSON.parse(res.body)
    expect(body.residences).toHaveLength(1)
    expect(body.residences[0].residenceId).toBe('r2')
  })

  test('filters by onCampus=true', async () => {
    dynamo.send.mockResolvedValue({ Items: baseItems })

    const res = await searchResidences({ queryStringParameters: { onCampus: 'true' } })

    const body = JSON.parse(res.body)
    expect(body.residences.every(r => r.onCampus === true)).toBe(true)
  })

  test('filters by onCampus=false', async () => {
    dynamo.send.mockResolvedValue({ Items: baseItems })

    const res = await searchResidences({ queryStringParameters: { onCampus: 'false' } })

    const body = JSON.parse(res.body)
    expect(body.residences.every(r => r.onCampus === false)).toBe(true)
  })

  test('sorts by rating (default)', async () => {
    dynamo.send.mockResolvedValue({ Items: [...baseItems] })

    const res = await searchResidences({ queryStringParameters: { sort: 'rating' } })

    const body = JSON.parse(res.body)
    expect(body.residences[0].residenceId).toBe('r1') // 4.5 is highest
  })

  test('sorts by reviews', async () => {
    dynamo.send.mockResolvedValue({ Items: [...baseItems] })

    const res = await searchResidences({ queryStringParameters: { sort: 'reviews' } })

    const body = JSON.parse(res.body)
    expect(body.residences[0].residenceId).toBe('r2') // 25 reviews
  })

  test('sorts by name', async () => {
    dynamo.send.mockResolvedValue({ Items: [...baseItems] })

    const res = await searchResidences({ queryStringParameters: { sort: 'name' } })

    const body = JSON.parse(res.body)
    expect(body.residences[0].name).toBe('Fuller Hall') // F < L < T
  })

  test('respects limit param (max 50)', async () => {
    const manyItems = Array.from({ length: 100 }, (_, i) => ({ residenceId: `r${i}`, avgRating: 0, reviewCount: 0 }))
    dynamo.send.mockResolvedValue({ Items: manyItems })

    const res = await searchResidences({ queryStringParameters: { limit: '5' } })

    expect(JSON.parse(res.body).residences).toHaveLength(5)
  })

  test('caps limit at 50 even when larger value requested', async () => {
    const manyItems = Array.from({ length: 100 }, (_, i) => ({ residenceId: `r${i}`, avgRating: 0, reviewCount: 0 }))
    dynamo.send.mockResolvedValue({ Items: manyItems })

    const res = await searchResidences({ queryStringParameters: { limit: '200' } })

    expect(JSON.parse(res.body).residences).toHaveLength(50)
  })

  test('returns 500 when DynamoDB throws', async () => {
    dynamo.send.mockRejectedValue(new Error('error'))

    const res = await searchResidences({ queryStringParameters: {} })

    expect(res.statusCode).toBe(500)
  })
})

// ─── handler dispatcher ──────────────────────────────────────────────────────

describe('handler (dispatcher)', () => {
  test('routes GET /residences/{id} to getResidence', async () => {
    dynamo.send.mockResolvedValue({ Item: { residenceId: 'r1' } })
    const res = await handler({ routeKey: 'GET /residences/{id}', pathParameters: { id: 'r1' } })
    expect(res.statusCode).toBe(200)
  })

  test('routes GET /residences/search to searchResidences', async () => {
    dynamo.send.mockResolvedValue({ Items: [] })
    const res = await handler({ routeKey: 'GET /residences/search', queryStringParameters: {} })
    expect(res.statusCode).toBe(200)
  })

  test('returns 404 for unknown route', async () => {
    const res = await handler({ routeKey: 'POST /residences' })
    expect(res.statusCode).toBe(404)
  })
})
