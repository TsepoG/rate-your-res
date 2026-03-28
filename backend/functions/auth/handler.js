const { ok, created, badRequest, unauthorized, serverError } = require('../../shared/utils/response')
const {
  CognitoIdentityProviderClient,
  SignUpCommand,
  InitiateAuthCommand,
  ConfirmSignUpCommand,
  ResendConfirmationCodeCommand,
} = require('@aws-sdk/client-cognito-identity-provider')

const cognito = new CognitoIdentityProviderClient({ region: process.env.AWS_REGION || 'af-south-1' })
const CLIENT_ID = process.env.COGNITO_CLIENT_ID

// South African university email domains (.ac.za)
function isValidUniversityEmail(email) {
  return /^[^\s@]+@[^\s@]+\.ac\.za$/.test(email)
}

async function signUp(event) {
  try {
    const { email, password, universityId } = JSON.parse(event.body || '{}')

    if (!email || !password) return badRequest('email and password are required')
    if (!isValidUniversityEmail(email)) {
      return badRequest('Only South African university email addresses (.ac.za) are accepted')
    }
    if (password.length < 8) return badRequest('Password must be at least 8 characters')

    await cognito.send(new SignUpCommand({
      ClientId: CLIENT_ID,
      Username: email,
      Password: password,
      UserAttributes: [
        { Name: 'email', Value: email },
        ...(universityId ? [{ Name: 'custom:university_id', Value: universityId }] : []),
      ],
    }))

    return created({ message: 'Verification code sent to your email' })
  } catch (err) {
    if (err.name === 'UsernameExistsException') {
      return badRequest('An account with this email already exists')
    }
    if (err.name === 'InvalidPasswordException') {
      return badRequest('Password does not meet requirements')
    }
    console.error('signUp error:', err)
    return serverError()
  }
}

async function verifyEmail(event) {
  try {
    const { email, code } = JSON.parse(event.body || '{}')

    if (!email || !code) return badRequest('email and code are required')

    await cognito.send(new ConfirmSignUpCommand({
      ClientId: CLIENT_ID,
      Username: email,
      ConfirmationCode: code,
    }))

    return ok({ message: 'Email verified successfully. You can now sign in.' })
  } catch (err) {
    if (err.name === 'CodeMismatchException') {
      return badRequest('Invalid verification code')
    }
    if (err.name === 'ExpiredCodeException') {
      return badRequest('Verification code has expired. Please request a new one.')
    }
    if (err.name === 'NotAuthorizedException') {
      return badRequest('Account is already verified')
    }
    console.error('verifyEmail error:', err)
    return serverError()
  }
}

async function resendCode(event) {
  try {
    const { email } = JSON.parse(event.body || '{}')

    if (!email) return badRequest('email is required')

    await cognito.send(new ResendConfirmationCodeCommand({
      ClientId: CLIENT_ID,
      Username: email,
    }))

    return ok({ message: 'Verification code resent' })
  } catch (err) {
    if (err.name === 'UserNotFoundException') {
      return badRequest('No account found with this email')
    }
    if (err.name === 'InvalidParameterException') {
      return badRequest('Account is already verified')
    }
    console.error('resendCode error:', err)
    return serverError()
  }
}

async function signIn(event) {
  try {
    const { email, password } = JSON.parse(event.body || '{}')

    if (!email || !password) return badRequest('email and password are required')

    const result = await cognito.send(new InitiateAuthCommand({
      ClientId: CLIENT_ID,
      AuthFlow: 'USER_PASSWORD_AUTH',
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password,
      },
    }))

    const tokens = result.AuthenticationResult
    return ok({
      accessToken: tokens.AccessToken,
      idToken: tokens.IdToken,
      refreshToken: tokens.RefreshToken,
      expiresIn: tokens.ExpiresIn,
    })
  } catch (err) {
    if (err.name === 'NotAuthorizedException') {
      return unauthorized('Incorrect email or password')
    }
    if (err.name === 'UserNotConfirmedException') {
      return badRequest('Please verify your email before signing in')
    }
    if (err.name === 'UserNotFoundException') {
      return unauthorized('Incorrect email or password')
    }
    console.error('signIn error:', err)
    return serverError()
  }
}

module.exports = { signUp, verifyEmail, resendCode, signIn }
