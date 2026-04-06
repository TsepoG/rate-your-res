jest.mock('../../shared/utils/dynamo', () => ({
  dynamo: { send: jest.fn() },
}))

const { dynamo } = require('../../shared/utils/dynamo')
const { listReviews, createReview, handler } = require('./handler')

beforeEach(() => jest.clearAllMocks())

// ─── listReviews ─────────────────────────────────────────────────────────────

describe('listReviews', () => {
  test('returns reviews with pagination key', async () => {
    const lastKey = { residenceId: 'r1', reviewId: 'rev1' }
    dynamo.send.mockResolvedValue({
      Items: [{ reviewId: 'rev2', comment: 'Great' }],
      Count: 1,
      LastEvaluatedKey: lastKey,
    })

    const res = await listReviews({
      pathParameters: { id: 'r1' },
      queryStringParameters: { limit: '10' },
    })

    expect(res.statusCode).toBe(200)
    const body = JSON.parse(res.body)
    expect(body.reviews).toHaveLength(1)
    expect(body.count).toBe(1)
    expect(body.nextKey).toBe(Buffer.from(JSON.stringify(lastKey)).toString('base64'))
  })

  test('returns null nextKey when no more pages', async () => {
    dynamo.send.mockResolvedValue({ Items: [], Count: 0 })

    const res = await listReviews({
      pathParameters: { id: 'r1' },
      queryStringParameters: {},
    })

    expect(JSON.parse(res.body).nextKey).toBeNull()
  })

  test('uses createdAt-index and descending order for sort=recent', async () => {
    dynamo.send.mockResolvedValue({ Items: [], Count: 0 })

    await listReviews({
      pathParameters: { id: 'r1' },
      queryStringParameters: { sort: 'recent' },
    })

    expect(dynamo.send).toHaveBeenCalledWith(
      expect.objectContaining({
        input: expect.objectContaining({
          IndexName: 'createdAt-index',
          ScanIndexForward: false,
        }),
      })
    )
  })

  test('returns 400 for malformed lastKey', async () => {
    const res = await listReviews({
      pathParameters: { id: 'r1' },
      queryStringParameters: { lastKey: 'not-valid-base64-json!!!' },
    })

    expect(res.statusCode).toBe(400)
    expect(JSON.parse(res.body).error).toMatch(/pagination key/i)
  })

  test('returns 500 when DynamoDB throws', async () => {
    dynamo.send.mockRejectedValue(new Error('error'))

    const res = await listReviews({
      pathParameters: { id: 'r1' },
      queryStringParameters: {},
    })

    expect(res.statusCode).toBe(500)
  })
})

// ─── createReview ────────────────────────────────────────────────────────────

const validBody = {
  ratings: { roomQuality: 4, buildingSafety: 5, bathroom: 3, location: 4 },
  recommend: true,
  comment: 'Great place',
}

const authedEvent = (body, userId = 'user-123') => ({
  pathParameters: { id: 'r1' },
  requestContext: { authorizer: { jwt: { claims: { sub: userId } } } },
  body: JSON.stringify(body),
})

describe('createReview', () => {
  test('creates review and returns 201', async () => {
    dynamo.send.mockResolvedValue({}) // PutCommand, UpdateCommand both succeed

    const res = await createReview(authedEvent(validBody))

    expect(res.statusCode).toBe(201)
    const body = JSON.parse(res.body)
    expect(body.review.residenceId).toBe('r1')
    expect(body.review.userId).toBe('user-123')
    expect(body.review.ratings.overall).toBe(4) // (4+5+3+4)/4
    expect(body.review.recommend).toBe(true)
  })

  test('calculates overall rating correctly', async () => {
    dynamo.send.mockResolvedValue({})

    const res = await createReview(authedEvent({
      ...validBody,
      ratings: { roomQuality: 3, buildingSafety: 3, bathroom: 3, location: 3 },
    }))

    expect(JSON.parse(res.body).review.ratings.overall).toBe(3)
  })

  test('returns 401 when JWT claims are missing', async () => {
    const res = await createReview({
      pathParameters: { id: 'r1' },
      requestContext: {},
      body: JSON.stringify(validBody),
    })

    expect(res.statusCode).toBe(401)
  })

  test('returns 400 when ratings are incomplete', async () => {
    const res = await createReview(authedEvent({
      ratings: { roomQuality: 4 }, // missing 3 required fields
      recommend: true,
    }))

    expect(res.statusCode).toBe(400)
    expect(JSON.parse(res.body).error).toMatch(/ratings/i)
  })

  test('returns 400 when recommend field is missing', async () => {
    const res = await createReview(authedEvent({
      ratings: { roomQuality: 4, buildingSafety: 5, bathroom: 3, location: 4 },
      // recommend omitted
    }))

    expect(res.statusCode).toBe(400)
    expect(JSON.parse(res.body).error).toMatch(/recommend/i)
  })

  test('returns 400 when user has already reviewed this residence', async () => {
    const err = new Error('Conditional check failed')
    err.name = 'ConditionalCheckFailedException'
    dynamo.send.mockRejectedValue(err)

    const res = await createReview(authedEvent(validBody))

    expect(res.statusCode).toBe(400)
    expect(JSON.parse(res.body).error).toMatch(/already reviewed/i)
  })

  test('returns 500 when DynamoDB throws unexpectedly', async () => {
    dynamo.send.mockRejectedValue(new Error('network error'))

    const res = await createReview(authedEvent(validBody))

    expect(res.statusCode).toBe(500)
  })

  test('trims whitespace from comment', async () => {
    dynamo.send.mockResolvedValue({})

    const res = await createReview(authedEvent({ ...validBody, comment: '  Great!  ' }))

    expect(JSON.parse(res.body).review.comment).toBe('Great!')
  })
})

// ─── handler dispatcher ──────────────────────────────────────────────────────

describe('handler (dispatcher)', () => {
  test('routes GET /residences/{id}/reviews to listReviews', async () => {
    dynamo.send.mockResolvedValue({ Items: [], Count: 0 })
    const res = await handler({
      routeKey: 'GET /residences/{id}/reviews',
      pathParameters: { id: 'r1' },
      queryStringParameters: {},
    })
    expect(res.statusCode).toBe(200)
  })

  test('routes POST /residences/{id}/reviews to createReview', async () => {
    dynamo.send.mockResolvedValue({})
    const res = await handler({
      routeKey: 'POST /residences/{id}/reviews',
      ...authedEvent(validBody),
    })
    expect(res.statusCode).toBe(201)
  })

  test('returns 404 for unknown route', async () => {
    const res = await handler({ routeKey: 'DELETE /residences/{id}/reviews' })
    expect(res.statusCode).toBe(404)
  })
})
