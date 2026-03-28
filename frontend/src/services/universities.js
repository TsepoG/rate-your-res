import api from './api'

export const getUniversities = (params) =>
  api.get('/universities', { params }).then(r => r.data)

export const getUniversity = (id) =>
  api.get(`/universities/${id}`).then(r => r.data)

export const getUniversityResidences = (id, params) =>
  api.get(`/universities/${id}/residences`, { params }).then(r => r.data)
