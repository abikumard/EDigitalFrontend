import { Link } from 'react-router-dom'
import { thumbnailUrl } from '../api/axiosClient'
import { useAuth } from '../context/AuthContext.jsx'
import { useWishlist } from '../context/WishlistContext.jsx'
import { useCart } from '../context/CartContext.jsx'

const typeLabels = { VIDEO: 'Video', PDF: 'PDF', PHOTO: 'Photo' }

const LockIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="10" width="16" height="10" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" />
  </svg>
)

const HeartIcon = ({ filled }) => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z" />
  </svg>
)

const CartIcon = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" />
  </svg>
)

export default function ContentCard({ item }) {
  const { isAuthenticated } = useAuth()
  const wishlist = useWishlist()
  const cart = useCart()

  const wishlisted = Boolean(isAuthenticated && wishlist?.isWishlisted(item.id))
  const inCart = Boolean(isAuthenticated && cart?.isInCart(item.id))

  function handleWishlistClick(e) {
    e.preventDefault()
    e.stopPropagation()
    if (isAuthenticated) wishlist?.toggle(item.id)
  }

  function handleCartClick(e) {
    e.preventDefault()
    e.stopPropagation()
    if (isAuthenticated && !inCart) cart?.add(item.id)
  }

  return (
    <Link to={`/content/${item.id}`} className="content-card">
      <div className="content-card-thumb">
        <img src={thumbnailUrl(item.thumbnailUrl)} alt={item.title} loading="lazy" />
        <span className="type-badge">{typeLabels[item.contentType] || item.contentType}</span>
        {!item.purchased && (
          <span className="lock-badge"><LockIcon /></span>
        )}
        {isAuthenticated && (
          <button
            type="button"
            className={'wishlist-heart-btn' + (wishlisted ? ' active' : '')}
            onClick={handleWishlistClick}
            aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <HeartIcon filled={wishlisted} />
          </button>
        )}
      </div>
      <div className="content-card-body">
        <h3>{item.title}</h3>
        <p className="content-card-desc">{item.description}</p>
        {item.purchasedAt && (
          <p className="content-card-purchased">
            Purchased on {new Date(item.purchasedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
          </p>
        )}
        <div className="content-card-footer">
          <span className="price-tag">₹{Number(item.price).toFixed(0)}</span>
          <span className={'status-pill ' + (item.purchased ? 'unlocked' : 'locked')}>
            {item.purchased ? 'Unlocked' : 'Locked'}
          </span>
        </div>
        {isAuthenticated && !item.purchased && (
          <button
            type="button"
            className="btn btn-secondary btn-sm btn-block add-to-cart-btn"
            onClick={handleCartClick}
            disabled={inCart}
          >
            <CartIcon /> {inCart ? 'In Cart' : 'Add to Cart'}
          </button>
        )}
      </div>
    </Link>
  )
}
