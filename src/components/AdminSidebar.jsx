import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAdminAuth } from '../context/AdminAuthContext.jsx'

export default function AdminSidebar() {
  const { logout, admin } = useAdminAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/')
  }

  const linkClass = ({ isActive }) => 'admin-nav-link' + (isActive ? ' active' : '')

  return (
    <aside className="admin-sidebar">
      <Link to="/" className="admin-back-link">← Back to site</Link>
      <div className="admin-brand">
        <span className="brand-mark">MV</span>
        <span>Admin</span>
      </div>
      <nav className="admin-nav">
        <NavLink to="/admin" end className={linkClass}>Dashboard</NavLink>
        <NavLink to="/admin/content" className={linkClass}>Content</NavLink>
        <NavLink to="/admin/users" className={linkClass}>Users</NavLink>
      </nav>
      <div className="admin-sidebar-footer">
        <span className="admin-email">{admin?.email}</span>
        <button className="btn btn-ghost btn-sm" onClick={handleLogout}>Log out</button>
      </div>
    </aside>
  )
}
