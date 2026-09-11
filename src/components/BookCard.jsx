import { useState } from 'react'
import { Link } from 'react-router-dom'
import { thumbnailUrl } from '../api/axiosClient'
import { useAuth } from '../context/AuthContext.jsx'
import { useWishlist } from '../context/WishlistContext.jsx'
import { useCart } from '../context/CartContext.jsx'
import BookReader from './BookReader.jsx'

const StarRating = ({ rating = 4.9, count = 42 }) => (
  <div className="rating-container" title={`${rating} out of 5 stars`}>
    <div className="stars-gold">
      {'★'.repeat(Math.round(rating))}
      {'☆'.repeat(5 - Math.round(rating))}
    </div>
    <span className="rating-score">{Number(rating).toFixed(1)}</span>
    <span className="rating-count">({count})</span>
  </div>
)

export default function BookCard({ item }) {
  const { isAuthenticated } = useAuth()
  const wishlist = useWishlist()
  const cart = useCart()
  const [showReader, setShowReader] = useState(false)

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

  function handleLookInside(e) {
    e.preventDefault()
    e.stopPropagation()
    setShowReader(true)
  }

  const coverImage = item.thumbnailUrl
    ? thumbnailUrl(item.thumbnailUrl)
    : 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80'

  return (
    <>
      <div className="kdp-book-card">
        {/* 3D Book Cover Wrapper */}
        <div className="book-cover-wrapper">
          <Link to={`/content/${item.id}`} className="book-cover-link">
            <div className="book-3d">
              <img src={coverImage} alt={item.title} className="book-cover-img" loading="lazy" />
              <div className="book-spine-shine" />
            </div>
          </Link>

          <button type="button" className="look-inside-badge" onClick={handleLookInside}>
            <span>👁 Look Inside</span>
          </button>

          {isAuthenticated && (
            <button
              type="button"
              className={`book-wishlist-btn ${wishlisted ? 'active' : ''}`}
              onClick={handleWishlistClick}
              aria-label="Wishlist"
            >
              ♥
            </button>
          )}
        </div>

        {/* Book Details */}
        <div className="book-card-info">
          <span className="book-category-pill">{item.category || 'Kindle Edition'}</span>

          <h3 className="book-title">
            <Link to={`/content/${item.id}`}>{item.title}</Link>
          </h3>

          <p className="book-author">by <span className="author-name">{item.authorName || item.sellerName || 'Abikumar Dharmaraj'}</span></p>

          <StarRating rating={item.averageRating || 4.9} count={item.reviewCount || 48} />

          {/* Pricing formats */}
          <div className="book-pricing-grid">
            <div className="pricing-box active">
              <span className="format-title">Kindle Edition</span>
              <span className="format-price">₹{Number(item.price).toFixed(0)}</span>
            </div>
            {item.paperbackPrice && (
              <div className="pricing-box">
                <span className="format-title">Paperback</span>
                <span className="format-price">₹{Number(item.paperbackPrice).toFixed(0)}</span>
              </div>
            )}
          </div>

          <div className="book-card-actions">
            <Link to={`/content/${item.id}`} className="btn btn-primary btn-sm btn-block">
              {item.purchased ? '📖 Read Now' : '⚡ 1-Click Buy'}
            </Link>
            {isAuthenticated && !item.purchased && (
              <button
                type="button"
                className="btn btn-secondary btn-sm btn-block"
                onClick={handleCartClick}
                disabled={inCart}
              >
                {inCart ? '✓ In Cart' : '🛒 Add to Cart'}
              </button>
            )}
          </div>
        </div>
      </div>

      {showReader && (
        <BookReader
          title={item.title}
          author={item.authorName || item.sellerName}
          sampleText={item.sampleText || item.description}
          isSample={!item.purchased}
          price={Number(item.price).toFixed(0)}
          onClose={() => setShowReader(false)}
          onBuy={() => {
            setShowReader(false)
            window.location.href = `/content/${item.id}`
          }}
        />
      )}
    </>
  )
}
