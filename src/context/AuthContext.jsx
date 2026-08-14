import { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const storedToken = localStorage.getItem('mv_user_token')
    const storedUser = localStorage.getItem('mv_user_info')
    if (storedToken && storedUser) {
      setToken(storedToken)
      setUser(JSON.parse(storedUser))
    }
    setReady(true)
  }, [])

  function login(newToken, userInfo) {
    localStorage.setItem('mv_user_token', newToken)
    localStorage.setItem('mv_user_info', JSON.stringify(userInfo))
    setToken(newToken)
    setUser(userInfo)
  }

  function logout() {
    localStorage.removeItem('mv_user_token')
    localStorage.removeItem('mv_user_info')
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!token, ready, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
