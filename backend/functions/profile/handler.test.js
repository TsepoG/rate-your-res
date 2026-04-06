jest.mock('../../shared/utils/dynamo', () => ({
  dynamo: { send: jest.fn() },
}))

const { dynamo } = require('../../shared/utils/dynamo')
const { getUserReviews, handler } = require('./handler')

beforeEach(() => jest.clearAllMocks())

// ─── getUserReviews ──────────────────────────────────────────────────────────

describe('getUserReviews', () => {
  const authedEvent = (userId = 'user-123') => ({
    requestContext: { authorizer: { jwt: { claims: { sub: userId } } } },
  })

  test('returns reviews for authenticated user', async () => {
    const reviews = [{ reviewId: 'rev1', residenceId: 'r1' }]
    dynamo.send.mockResolvedValue({ Items: reviews })

    const res = await getUserReviews(authedEvent())

    expect(res.statusCode).toBe(200)
    expect(JSON.parse(res.body)).toEqual({ reviews })
  })

  test('returns empty array when user has no reviews', async () => {
    dynamo.send.mockResolvedValue({ Items: [] })

    const res = await getUserReviews(authedEvent())

    expect(res.statusCode).toBe(200)
    expect(JSON.parse(res.body).reviews).toEqual([])
  })

  test('queries userId-index with the correct userId', async () => {
    dynamo.send.mockResolvedValue({ Items: [] })

    await getUserReviews(authedEvent('specific-user-id'))

    expect(dynamo.send).toHaveBeenCalledWith(
      expect.objectContaining({
        input: expect.objectContaining({
          IndexName: 'userId-index',
          ExpressionAttributeValues: { ':userId': 'specific-user-id' },
        }),
      })
    )
  })

  test('returns 401 when JWT claims are missing', async () => {
    const res = await getUserReviews({ requestContext: {} })

    expect(res.statusCode).toBe(401)
    expect(JSON.parse(res.body).error).toMatch(/signed in/i)
  })

  test('returns 500 when DynamoDB throws', async () => {
    dynamo.send.mockRejectedValue(new Error('timeout'))

    const res = await getUserReviews(authedEvent())

    expect(res.statusCode).toBe(500)
  })
})

// ─── handler dispatcher ──────────────────────────────────────────────────────

describe('handler (dispatcher)', () => {
  test('routes GET /users/me/reviews to getUserReviews', async () => {
    dynamo.send.mockResolvedValue({ Items: [] })
    const res = await handler({
      routeKey: 'GET /users/me/reviews',
      requestContext: { authorizer: { jwt: { claims: { sub: 'user-123' } } } },
    })
    expect(res.statusCode).toBe(200)
  })

  test('returns 404 for unknown route', async () => {
    const res = await handler({ routeKey: 'GET /users/me/profile' })
    expect(res.statusCode).toBe(404)
  })
})
