import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useCart } from '../context/CartContext.jsx'

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth()
  const cart = useCart()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <header className="navbar">
      <Link to="/" className="brand">
        <span className="brand-mark">MV</span>
        <span className="brand-name">MediaVault</span>
      </Link>

      <nav className="navbar-links">
        <Link to="/">Browse</Link>
        <Link to="/sell" className="sell-link">Sell on MediaVault</Link>
        {isAuthenticated && <Link to="/library">My Library</Link>}
        {isAuthenticated && <Link to="/wishlist">Wishlist</Link>}
        {isAuthenticated && (
          <Link to="/cart" className="navbar-cart-link">
            Cart
            {cart?.count > 0 && <span className="cart-badge">{cart.count}</span>}
          </Link>
        )}
        {isAuthenticated ? (
          <div className="navbar-user">
            <span className="navbar-email" title={user?.email || user?.mobile}>{user?.email || user?.mobile}</span>
            <button className="btn btn-ghost btn-sm" onClick={handleLogout}>Log out</button>
          </div>
        ) : (
          <Link to="/login" className="btn btn-primary btn-sm">Log in</Link>
        )}
      </nav>
    </header>
  )
}
