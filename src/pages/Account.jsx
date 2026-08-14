import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Account() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <div className="page-container">
      <h1 className="page-title">Account</h1>
      <div className="account-card">
        {user?.email && (
          <div className="account-row">
            <span>Email</span>
            <strong>{user.email}</strong>
          </div>
        )}
        {user?.mobile && (
          <div className="account-row">
            <span>Mobile</span>
            <strong>{user.mobile}</strong>
          </div>
        )}
        <button className="btn btn-secondary btn-block" onClick={handleLogout}>Log out</button>
      </div>

      <h2 className="section-title">Shopping</h2>
      <div className="account-card legal-links-card">
        <Link to="/wishlist" className="legal-links-row">My Wishlist</Link>
        <Link to="/cart" className="legal-links-row">My Cart</Link>
      </div>

      <h2 className="section-title">Legal &amp; Policies</h2>
      <div className="account-card legal-links-card">
        <Link to="/terms" className="legal-links-row">Terms &amp; Conditions</Link>
        <Link to="/privacy-policy" className="legal-links-row">Privacy Policy</Link>
        <Link to="/refund-policy" className="legal-links-row">Refund &amp; Cancellation Policy</Link>
        <Link to="/shipping-policy" className="legal-links-row">Shipping &amp; Delivery Policy</Link>
        <Link to="/contact-us" className="legal-links-row">Contact Us</Link>
      </div>
    </div>
  )
}
