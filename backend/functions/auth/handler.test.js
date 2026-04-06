const mockSend = jest.fn()

jest.mock('@aws-sdk/client-cognito-identity-provider', () => ({
  CognitoIdentityProviderClient: jest.fn().mockImplementation(() => ({ send: mockSend })),
  SignUpCommand: jest.fn().mockImplementation(input => ({ input })),
  InitiateAuthCommand: jest.fn().mockImplementation(input => ({ input })),
  ConfirmSignUpCommand: jest.fn().mockImplementation(input => ({ input })),
  ResendConfirmationCodeCommand: jest.fn().mockImplementation(input => ({ input })),
}))

const { signUp, verifyEmail, resendCode, signIn, refreshToken, handler } = require('./handler')

beforeEach(() => jest.clearAllMocks())

// ─── signUp ──────────────────────────────────────────────────────────────────

describe('signUp', () => {
  const event = body => ({ body: JSON.stringify(body) })

  test('creates account for valid .ac.za email', async () => {
    mockSend.mockResolvedValue({})

    const res = await signUp(event({ email: 'student@uct.ac.za', password: 'Password1!' }))

    expect(res.statusCode).toBe(201)
    expect(JSON.parse(res.body).message).toMatch(/verification/i)
  })

  test('rejects non-.ac.za email', async () => {
    const res = await signUp(event({ email: 'student@gmail.com', password: 'Password1!' }))

    expect(res.statusCode).toBe(400)
    expect(JSON.parse(res.body).error).toMatch(/\.ac\.za/i)
  })

  test('rejects password shorter than 8 characters', async () => {
    const res = await signUp(event({ email: 'student@uct.ac.za', password: 'short' }))

    expect(res.statusCode).toBe(400)
    expect(JSON.parse(res.body).error).toMatch(/8 characters/i)
  })

  test('returns 400 when email is missing', async () => {
    const res = await signUp(event({ password: 'Password1!' }))

    expect(res.statusCode).toBe(400)
  })

  test('returns 400 when password is missing', async () => {
    const res = await signUp(event({ email: 'student@uct.ac.za' }))

    expect(res.statusCode).toBe(400)
  })

  test('returns 400 when email already exists', async () => {
    const err = new Error('exists')
    err.name = 'UsernameExistsException'
    mockSend.mockRejectedValue(err)

    const res = await signUp(event({ email: 'student@uct.ac.za', password: 'Password1!' }))

    expect(res.statusCode).toBe(400)
    expect(JSON.parse(res.body).error).toMatch(/already exists/i)
  })

  test('returns 400 when Cognito rejects the password', async () => {
    const err = new Error('weak')
    err.name = 'InvalidPasswordException'
    mockSend.mockRejectedValue(err)

    const res = await signUp(event({ email: 'student@uct.ac.za', password: 'Password1!' }))

    expect(res.statusCode).toBe(400)
    expect(JSON.parse(res.body).error).toMatch(/requirements/i)
  })

  test('returns 500 on unexpected Cognito error', async () => {
    mockSend.mockRejectedValue(new Error('service unavailable'))

    const res = await signUp(event({ email: 'student@uct.ac.za', password: 'Password1!' }))

    expect(res.statusCode).toBe(500)
  })
})

// ─── verifyEmail ─────────────────────────────────────────────────────────────

describe('verifyEmail', () => {
  const event = body => ({ body: JSON.stringify(body) })

  test('confirms email with valid code', async () => {
    mockSend.mockResolvedValue({})

    const res = await verifyEmail(event({ email: 'student@uct.ac.za', code: '123456' }))

    expect(res.statusCode).toBe(200)
    expect(JSON.parse(res.body).message).toMatch(/verified/i)
  })

  test('returns 400 when email or code is missing', async () => {
    const res = await verifyEmail(event({ email: 'student@uct.ac.za' }))
    expect(res.statusCode).toBe(400)
  })

  test('returns 400 for wrong code', async () => {
    const err = new Error('mismatch')
    err.name = 'CodeMismatchException'
    mockSend.mockRejectedValue(err)

    const res = await verifyEmail(event({ email: 'student@uct.ac.za', code: '000000' }))

    expect(res.statusCode).toBe(400)
    expect(JSON.parse(res.body).error).toMatch(/invalid/i)
  })

  test('returns 400 for expired code', async () => {
    const err = new Error('expired')
    err.name = 'ExpiredCodeException'
    mockSend.mockRejectedValue(err)

    const res = await verifyEmail(event({ email: 'student@uct.ac.za', code: '123456' }))

    expect(res.statusCode).toBe(400)
    expect(JSON.parse(res.body).error).toMatch(/expired/i)
  })

  test('returns 400 when account is already verified', async () => {
    const err = new Error('already verified')
    err.name = 'NotAuthorizedException'
    mockSend.mockRejectedValue(err)

    const res = await verifyEmail(event({ email: 'student@uct.ac.za', code: '123456' }))

    expect(res.statusCode).toBe(400)
  })
})

// ─── resendCode ───────────────────────────────────────────────────────────────

describe('resendCode', () => {
  const event = body => ({ body: JSON.stringify(body) })

  test('resends code for valid email', async () => {
    mockSend.mockResolvedValue({})

    const res = await resendCode(event({ email: 'student@uct.ac.za' }))

    expect(res.statusCode).toBe(200)
    expect(JSON.parse(res.body).message).toMatch(/resent/i)
  })

  test('returns 400 when email is missing', async () => {
    const res = await resendCode(event({}))
    expect(res.statusCode).toBe(400)
  })

  test('returns 400 when account does not exist', async () => {
    const err = new Error('not found')
    err.name = 'UserNotFoundException'
    mockSend.mockRejectedValue(err)

    const res = await resendCode(event({ email: 'nobody@uct.ac.za' }))

    expect(res.statusCode).toBe(400)
    expect(JSON.parse(res.body).error).toMatch(/no account/i)
  })

  test('returns 400 when account is already verified', async () => {
    const err = new Error('invalid param')
    err.name = 'InvalidParameterException'
    mockSend.mockRejectedValue(err)

    const res = await resendCode(event({ email: 'student@uct.ac.za' }))

    expect(res.statusCode).toBe(400)
  })
})

// ─── signIn ──────────────────────────────────────────────────────────────────

describe('signIn', () => {
  const event = body => ({ body: JSON.stringify(body) })

  test('returns tokens on valid credentials', async () => {
    mockSend.mockResolvedValue({
      AuthenticationResult: {
        AccessToken: 'access-token',
        IdToken: 'id-token',
        RefreshToken: 'refresh-token',
        ExpiresIn: 3600,
      },
    })

    const res = await signIn(event({ email: 'student@uct.ac.za', password: 'Password1!' }))

    expect(res.statusCode).toBe(200)
    const body = JSON.parse(res.body)
    expect(body.accessToken).toBe('access-token')
    expect(body.refreshToken).toBe('refresh-token')
    expect(body.expiresIn).toBe(3600)
  })

  test('returns 400 when email or password is missing', async () => {
    const res = await signIn(event({ email: 'student@uct.ac.za' }))
    expect(res.statusCode).toBe(400)
  })

  test('returns 401 for wrong password', async () => {
    const err = new Error('not authorized')
    err.name = 'NotAuthorizedException'
    mockSend.mockRejectedValue(err)

    const res = await signIn(event({ email: 'student@uct.ac.za', password: 'wrong' }))

    expect(res.statusCode).toBe(401)
    expect(JSON.parse(res.body).error).toMatch(/incorrect/i)
  })

  test('returns 400 when email is not verified', async () => {
    const err = new Error('not confirmed')
    err.name = 'UserNotConfirmedException'
    mockSend.mockRejectedValue(err)

    const res = await signIn(event({ email: 'student@uct.ac.za', password: 'Password1!' }))

    expect(res.statusCode).toBe(400)
    expect(JSON.parse(res.body).error).toMatch(/verify/i)
  })

  test('returns 401 when user does not exist (same message as wrong password)', async () => {
    const err = new Error('not found')
    err.name = 'UserNotFoundException'
    mockSend.mockRejectedValue(err)

    const res = await signIn(event({ email: 'nobody@uct.ac.za', password: 'Password1!' }))

    expect(res.statusCode).toBe(401)
  })
})

// ─── refreshToken ─────────────────────────────────────────────────────────────

describe('refreshToken', () => {
  const event = body => ({ body: JSON.stringify(body) })

  test('returns new access and id tokens', async () => {
    mockSend.mockResolvedValue({
      AuthenticationResult: {
        AccessToken: 'new-access',
        IdToken: 'new-id',
        ExpiresIn: 3600,
      },
    })

    const res = await refreshToken(event({ refreshToken: 'valid-refresh-token' }))

    expect(res.statusCode).toBe(200)
    const body = JSON.parse(res.body)
    expect(body.accessToken).toBe('new-access')
    expect(body.idToken).toBe('new-id')
  })

  test('returns 400 when refreshToken is missing', async () => {
    const res = await refreshToken(event({}))
    expect(res.statusCode).toBe(400)
  })

  test('returns 401 when refresh token is invalid or expired', async () => {
    const err = new Error('not authorized')
    err.name = 'NotAuthorizedException'
    mockSend.mockRejectedValue(err)

    const res = await refreshToken(event({ refreshToken: 'expired' }))

    expect(res.statusCode).toBe(401)
    expect(JSON.parse(res.body).error).toMatch(/invalid or has expired/i)
  })
})

// ─── handler dispatcher ──────────────────────────────────────────────────────

describe('handler (dispatcher)', () => {
  const event = (routeKey, body) => ({ routeKey, body: JSON.stringify(body) })

  test('routes POST /auth/signup', async () => {
    mockSend.mockResolvedValue({})
    const res = await handler(event('POST /auth/signup', { email: 'student@uct.ac.za', password: 'Password1!' }))
    expect(res.statusCode).toBe(201)
  })

  test('routes POST /auth/signin', async () => {
    mockSend.mockResolvedValue({
      AuthenticationResult: { AccessToken: 'a', IdToken: 'b', RefreshToken: 'c', ExpiresIn: 3600 },
    })
    const res = await handler(event('POST /auth/signin', { email: 'student@uct.ac.za', password: 'Password1!' }))
    expect(res.statusCode).toBe(200)
  })

  test('routes POST /auth/verify', async () => {
    mockSend.mockResolvedValue({})
    const res = await handler(event('POST /auth/verify', { email: 'student@uct.ac.za', code: '123456' }))
    expect(res.statusCode).toBe(200)
  })

  test('routes POST /auth/resend', async () => {
    mockSend.mockResolvedValue({})
    const res = await handler(event('POST /auth/resend', { email: 'student@uct.ac.za' }))
    expect(res.statusCode).toBe(200)
  })

  test('routes POST /auth/refresh', async () => {
    mockSend.mockResolvedValue({
      AuthenticationResult: { AccessToken: 'a', IdToken: 'b', ExpiresIn: 3600 },
    })
    const res = await handler(event('POST /auth/refresh', { refreshToken: 'tok' }))
    expect(res.statusCode).toBe(200)
  })

  test('returns 404 for unknown route', async () => {
    const res = await handler({ routeKey: 'GET /auth/whoami' })
    expect(res.statusCode).toBe(404)
  })
})
