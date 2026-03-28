import api from './api'

export const getResidence = (id) =>
  api.get(`/residences/${id}`).then(r => r.data)

export const searchResidences = (params) =>
  api.get('/residences/search', { params }).then(r => r.data)
