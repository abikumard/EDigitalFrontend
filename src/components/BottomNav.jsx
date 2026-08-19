import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useCart } from '../context/CartContext.jsx'

const HomeIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 11.5 12 4l9 7.5" /><path d="M5 10v9a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1v-9" />
  </svg>
)
const LibraryIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="7" height="16" rx="1" /><rect x="14" y="4" width="7" height="16" rx="1" />
  </svg>
)
const CartIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" />
  </svg>
)
const UserIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="4" /><path d="M4 20c0-3.3 3.6-6 8-6s8 2.7 8 6" />
  </svg>
)
const SellIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9 5 3h14l2 6" /><path d="M3 9v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9" /><path d="M3 9h18" /><path d="M9 21v-6h6v6" />
  </svg>
)

export default function BottomNav() {
  const { isAuthenticated } = useAuth()
  const cart = useCart()
  return (
    <nav className="bottom-nav">
      <NavLink to="/" end className={({ isActive }) => 'bottom-nav-item' + (isActive ? ' active' : '')}>
        <HomeIcon /><span>Browse</span>
      </NavLink>
      <NavLink to="/library" className={({ isActive }) => 'bottom-nav-item' + (isActive ? ' active' : '')}>
        <LibraryIcon /><span>Library</span>
      </NavLink>
      <NavLink to="/sell" className={({ isActive }) => 'bottom-nav-item' + (isActive ? ' active' : '')}>
        <SellIcon /><span>Sell</span>
      </NavLink>
      {isAuthenticated && (
        <NavLink to="/cart" className={({ isActive }) => 'bottom-nav-item' + (isActive ? ' active' : '')}>
          <span className="bottom-nav-icon-wrap">
            <CartIcon />
            {cart?.count > 0 && <span className="cart-badge">{cart.count}</span>}
          </span>
          <span>Cart</span>
        </NavLink>
      )}
      <NavLink to={isAuthenticated ? '/account' : '/login'} className={({ isActive }) => 'bottom-nav-item' + (isActive ? ' active' : '')}>
        <UserIcon /><span>{isAuthenticated ? 'Account' : 'Log in'}</span>
      </NavLink>
    </nav>
  )
}
