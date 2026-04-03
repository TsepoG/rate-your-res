import api from './api'

export const getUserReviews = () =>
  api.get('/users/me/reviews').then(r => r.data)
