import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

// Attach auth token if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('idToken')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Refresh expired tokens automatically
let isRefreshing = false
let failedQueue = []

function processQueue(error, token = null) {
  failedQueue.forEach(p => error ? p.reject(error) : p.resolve(token))
  failedQueue = []
}

api.interceptors.response.use(
  response => response,
  async (error) => {
    const original = error.config
    if (error.response?.status !== 401 || original._retry) {
      return Promise.reject(error)
    }

    const storedRefreshToken = localStorage.getItem('refreshToken')
    if (!storedRefreshToken) {
      localStorage.removeItem('idToken')
      localStorage.removeItem('accessToken')
      window.location.href = '/signin'
      return Promise.reject(error)
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject })
      }).then(token => {
        original.headers.Authorization = `Bearer ${token}`
        return api(original)
      })
    }

    original._retry = true
    isRefreshing = true

    try {
      const { data } = await axios.post(`${BASE_URL}/auth/refresh`, { refreshToken: storedRefreshToken })
      localStorage.setItem('idToken', data.idToken)
      localStorage.setItem('accessToken', data.accessToken)
      processQueue(null, data.idToken)
      original.headers.Authorization = `Bearer ${data.idToken}`
      return api(original)
    } catch (refreshError) {
      processQueue(refreshError, null)
      localStorage.removeItem('idToken')
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      window.location.href = '/signin'
      return Promise.reject(refreshError)
    } finally {
      isRefreshing = false
    }
  }
)

export default api
