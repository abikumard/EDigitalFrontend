import { useState } from 'react'
import { Link } from 'react-router-dom'
import { thumbnailUrl } from '../api/axiosClient'
import { useAuth } from '../context/AuthContext.jsx'
import { useWishlist } from '../context/WishlistContext.jsx'
import { useCart } from '../context/CartContext.jsx'
import BookReader from './BookReader.jsx'

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
      <div className="modern-book-card">
        {/* Card Header Media */}
        <div className="card-media-wrapper">
          <Link to={`/content/${item.id}`} className="card-cover-link">
            <img src={coverImage} alt={item.title} className="card-cover-img" loading="lazy" />
            <div className="cover-glow-backdrop" />
          </Link>

          <span className="card-category-tag">{item.category || 'Digital eBook'}</span>

          <button
            type="button"
            className="card-quick-read-btn"
            onClick={handleLookInside}
            title="Preview Free Sample"
          >
            <span>📖 Read Sample</span>
          </button>

          {isAuthenticated && (
            <button
              type="button"
              className={`card-wishlist-toggle ${wishlisted ? 'active' : ''}`}
              onClick={handleWishlistClick}
              aria-label="Wishlist"
            >
              ♥
            </button>
          )}
        </div>

        {/* Card Body */}
        <div className="card-body">
          <div className="rating-pill">
            <span className="star">★</span>
            <span className="score">{Number(item.averageRating || 4.9).toFixed(1)}</span>
            <span className="reviews">({item.reviewCount || 42})</span>
          </div>

          <h3 className="card-title">
            <Link to={`/content/${item.id}`}>{item.title}</Link>
          </h3>

          <p className="card-author">By <span>{item.authorName || item.sellerName || 'Abikumar Dharmaraj'}</span></p>

          <p className="card-excerpt">
            {item.description ? item.description.slice(0, 110) + '...' : ''}
          </p>

          {/* Pricing & Formats */}
          <div className="card-price-row">
            <div className="price-tag-wrap">
              <span className="price-currency">₹</span>
              <span className="price-val">{Number(item.price).toFixed(0)}</span>
              <span className="price-type">eBook</span>
            </div>
            {item.paperbackPrice && (
              <span className="print-pill">Print: ₹{Number(item.paperbackPrice).toFixed(0)}</span>
            )}
          </div>

          {/* Action Button */}
          <div className="card-actions-row">
            <Link to={`/content/${item.id}`} className="btn-modern-buy">
              {item.purchased ? '📖 Read Now' : 'Instant Unlock ⚡'}
            </Link>
            {isAuthenticated && !item.purchased && (
              <button
                type="button"
                className={`btn-modern-cart ${inCart ? 'in-cart' : ''}`}
                onClick={handleCartClick}
                disabled={inCart}
                title={inCart ? 'In Cart' : 'Add to Cart'}
              >
                {inCart ? '✓' : '🛒'}
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
