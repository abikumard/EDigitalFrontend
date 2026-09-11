import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useCart } from '../context/CartContext.jsx'

const CATEGORIES = [
  'All Departments',
  'AI & Technology',
  'Health & Mindset',
  'Self-Help & Wellness',
  'Psychology & Healing'
]

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth()
  const cart = useCart()
  const navigate = useNavigate()

  const [searchCategory, setSearchCategory] = useState('All Departments')
  const [query, setQuery] = useState('')

  function handleLogout() {
    logout()
    navigate('/')
  }

  function handleSearch(e) {
    e.preventDefault()
    const cat = searchCategory === 'All Departments' ? '' : searchCategory
    const searchParams = new URLSearchParams()
    if (cat) searchParams.append('category', cat)
    if (query.trim()) searchParams.append('search', query.trim())
    navigate(`/?${searchParams.toString()}`)
  }

  return (
    <header className="kindle-navbar">
      {/* Top Main Navigation Bar */}
      <div className="navbar-top-row">
        {/* Brand Logo */}
        <Link to="/" className="kdp-brand">
          <span className="kdp-logo-icon">📖</span>
          <div className="kdp-logo-text">
            <span className="brand-main">KDP Cloud</span>
            <span className="brand-sub">Kindle eBook Store</span>
          </div>
        </Link>

        {/* Global Search Bar with Category Dropdown */}
        <form onSubmit={handleSearch} className="kdp-search-bar">
          <select
            value={searchCategory}
            onChange={(e) => setSearchCategory(e.target.value)}
            className="search-category-select"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search eBooks, authors, AI blueprints, mindset protocols..."
            className="search-input"
          />
          <button type="submit" className="search-submit-btn" aria-label="Search">
            🔍
          </button>
        </form>

        {/* Right Action Icons */}
        <div className="navbar-user-actions">
          <Link to="/kdp" className="kdp-author-studio-btn">
            <span className="studio-icon">✍️</span>
            <div className="studio-text">
              <span className="studio-sub">Self-Publishing</span>
              <span className="studio-main">KDP Studio</span>
            </div>
          </Link>

          {isAuthenticated ? (
            <Link to="/library" className="nav-action-item">
              <span className="action-sub">Reader</span>
              <span className="action-main">My Library</span>
            </Link>
          ) : null}

          {isAuthenticated ? (
            <Link to="/wishlist" className="nav-action-item">
              <span className="action-sub">Saved</span>
              <span className="action-main">Wishlist</span>
            </Link>
          ) : null}

          {isAuthenticated ? (
            <Link to="/cart" className="nav-cart-btn">
              <span className="cart-icon">🛒</span>
              {cart?.count > 0 && <span className="cart-count-badge">{cart.count}</span>}
            </Link>
          ) : null}

          {isAuthenticated ? (
            <div className="nav-account-dropdown">
              <Link to="/publisher/profile" className="nav-action-item">
                <span className="action-sub">Hello, {user?.name ? user.name.split(' ')[0] : 'Author'}</span>
                <span className="action-main">Account &amp; Wallet ▾</span>
              </Link>
              <button onClick={handleLogout} className="nav-logout-btn">
                Log Out
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary btn-sm nav-signin-btn">
              Sign In
            </Link>
          )}
        </div>
      </div>

      {/* Secondary Ribbon Navigation */}
      <div className="navbar-sub-row">
        <div className="sub-row-links">
          <Link to="/" className="sub-link active">📚 All Kindle eBooks</Link>
          <Link to="/?category=AI%20%26%20Technology" className="sub-link">🤖 AI &amp; Tech Blueprints</Link>
          <Link to="/?category=Health%20%26%20Mindset" className="sub-link">🧠 Dopamine &amp; Neurobiology</Link>
          <Link to="/?category=Self-Help%20%26%20Wellness" className="sub-link">🧘 Somatic &amp; Nervous System</Link>
          <Link to="/?category=Psychology%20%26%20Healing" className="sub-link">✨ Shadow Work &amp; Healing</Link>
          <Link to="/kdp/publish" className="sub-link highlight-link">🚀 Publish Your eBook (97% Royalty)</Link>
        </div>
      </div>
    </header>
  )
}
