import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useCart } from '../context/CartContext.jsx'

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth()
  const cart = useCart()
  const navigate = useNavigate()
  const location = useLocation()

  const [query, setQuery] = useState('')

  function handleLogout() {
    logout()
    navigate('/')
  }

  function handleSearch(e) {
    e.preventDefault()
    if (query.trim()) {
      navigate(`/?search=${encodeURIComponent(query.trim())}`)
    } else {
      navigate('/')
    }
  }

  return (
    <header className="modern-navbar">
      <div className="navbar-inner">
        {/* Brand Logo */}
        <Link to="/" className="brand-logo">
          <div className="brand-icon-wrap">
            <span className="brand-icon">⚡</span>
          </div>
          <div className="brand-text">
            <span className="brand-name">DigitalDeals</span>
            <span className="brand-badge">PRO</span>
          </div>
        </Link>

        {/* Global Search Pill */}
        <form onSubmit={handleSearch} className="modern-search-pill">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search AI blueprints, protocols, authors, eBooks..."
            className="search-input"
          />
          {query && (
            <button type="button" className="clear-btn" onClick={() => setQuery('')}>✕</button>
          )}
        </form>

        {/* Navigation Links & User Actions */}
        <div className="navbar-actions">
          <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
            Explore
          </Link>

          <Link to="/kdp" className="publish-cta-btn">
            <span className="sparkle">✦</span>
            <span>Creator Studio</span>
          </Link>

          {isAuthenticated && (
            <Link to="/library" className={`nav-link ${location.pathname === '/library' ? 'active' : ''}`}>
              My Library
            </Link>
          )}

          {isAuthenticated && (
            <Link to="/cart" className="cart-pill-btn">
              <span>🛒</span>
              {cart?.count > 0 && <span className="cart-badge">{cart.count}</span>}
            </Link>
          )}

          {isAuthenticated ? (
            <div className="user-profile-menu">
              <Link to="/publisher/profile" className="user-avatar-btn" title="Wallet & Settings">
                <span className="user-initial">{(user?.name || 'A').charAt(0).toUpperCase()}</span>
                <span className="user-name-label">{user?.name ? user.name.split(' ')[0] : 'Author'}</span>
              </Link>
              <button onClick={handleLogout} className="logout-btn" title="Sign Out">
                Log Out
              </button>
            </div>
          ) : (
            <div className="guest-actions">
              <Link to="/login" className="login-btn">
                Sign In
              </Link>
              <Link to="/signup" className="signup-btn">
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
