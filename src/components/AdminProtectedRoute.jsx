import { Navigate } from 'react-router-dom'
import { useAdminAuth } from '../context/AdminAuthContext.jsx'

export default function AdminProtectedRoute({ children }) {
  const { isAdminAuthenticated, ready } = useAdminAuth()

  if (!ready) return null
  if (!isAdminAuthenticated) {
    return <Navigate to="/admin/login" replace />
  }
  return children
}
