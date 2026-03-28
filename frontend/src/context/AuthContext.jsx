import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const idToken = localStorage.getItem('idToken')
    if (idToken) {
      try {
        // Decode JWT payload (no verification — server validates)
        const payload = JSON.parse(atob(idToken.split('.')[1]))
        if (payload.exp * 1000 > Date.now()) {
          setUser({ email: payload.email, sub: payload.sub, universityId: payload['custom:university_id'] })
        } else {
          localStorage.removeItem('idToken')
          localStorage.removeItem('accessToken')
          localStorage.removeItem('refreshToken')
        }
      } catch {
        localStorage.removeItem('idToken')
      }
    }
    setLoading(false)
  }, [])

  function login(tokens) {
    localStorage.setItem('idToken', tokens.idToken)
    localStorage.setItem('accessToken', tokens.accessToken)
    localStorage.setItem('refreshToken', tokens.refreshToken)
    const payload = JSON.parse(atob(tokens.idToken.split('.')[1]))
    setUser({ email: payload.email, sub: payload.sub, universityId: payload['custom:university_id'] })
  }

  function logout() {
    localStorage.removeItem('idToken')
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
