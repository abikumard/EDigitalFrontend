import { createContext, useContext, useEffect, useState } from 'react'

const AdminAuthContext = createContext(null)

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(null)
  const [token, setToken] = useState(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const storedToken = localStorage.getItem('mv_admin_token')
    const storedAdmin = localStorage.getItem('mv_admin_info')
    if (storedToken && storedAdmin) {
      setToken(storedToken)
      setAdmin(JSON.parse(storedAdmin))
    }
    setReady(true)
  }, [])

  function login(newToken, adminInfo) {
    localStorage.setItem('mv_admin_token', newToken)
    localStorage.setItem('mv_admin_info', JSON.stringify(adminInfo))
    setToken(newToken)
    setAdmin(adminInfo)
  }

  function logout() {
    localStorage.removeItem('mv_admin_token')
    localStorage.removeItem('mv_admin_info')
    setToken(null)
    setAdmin(null)
  }

  return (
    <AdminAuthContext.Provider value={{ admin, token, isAdminAuthenticated: !!token, ready, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  )
}

export function useAdminAuth() {
  return useContext(AdminAuthContext)
}
