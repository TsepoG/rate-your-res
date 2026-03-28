import api from './api'

export const signUp = (data) =>
  api.post('/auth/signup', data).then(r => r.data)

export const verifyEmail = (data) =>
  api.post('/auth/verify', data).then(r => r.data)

export const resendCode = (data) =>
  api.post('/auth/resend', data).then(r => r.data)

export const signIn = (data) =>
  api.post('/auth/signin', data).then(r => r.data)
