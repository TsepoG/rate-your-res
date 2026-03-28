import api from './api'

export const getReviews = (residenceId, params) =>
  api.get(`/residences/${residenceId}/reviews`, { params }).then(r => r.data)

export const createReview = (residenceId, data) =>
  api.post(`/residences/${residenceId}/reviews`, data).then(r => r.data)
