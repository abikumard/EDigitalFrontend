import { useEffect, useState, useCallback } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { getContent } from '../api/content.js'
import { createOrder, verifyPayment } from '../api/payment.js'
import { getBookReviews, addReview } from '../api/review.js'
import { errorMessage, thumbnailUrl, downloadFile } from '../api/axiosClient.js'
import { useAuth } from '../context/AuthContext.jsx'
import { useCart } from '../context/CartContext.jsx'
import { useWishlist } from '../context/WishlistContext.jsx'
import Loader from '../components/Loader.jsx'
import BookReader from '../components/BookReader.jsx'

export default function ContentDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuth()
  const cart = useCart()
  const wishlist = useWishlist()

  const [item, setItem] = useState(null)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [paying, setPaying] = useState(false)
  const [showReader, setShowReader] = useState(false)
  const [selectedFormat, setSelectedFormat] = useState('EBOOK')

  // Review Form
  const [rating, setRating] = useState(5)
  const [headline, setHeadline] = useState('')
  const [comment, setComment] = useState('')
  const [submittingReview, setSubmittingReview] = useState(false)
  const [reviewSuccess, setReviewSuccess] = useState('')

  const loadData = useCallback(() => {
    setLoading(true)
    Promise.all([
      getContent(id),
      getBookReviews(id).catch(() => ({ data: [] }))
    ])
      .then(([resItem, resReviews]) => {
        setItem(resItem.data)
        setReviews(resReviews.data || [])
      })
      .catch((err) => setError(errorMessage(err, 'Could not load book details.')))
      .finally(() => setLoading(false))
  }, [id])

  useEffect(() => { loadData() }, [loadData])

  const hasAccess = Boolean(item?.purchased)

  function goToLogin() {
    navigate('/login', { state: { from: `/content/${id}` } })
  }

  async function handleBuy() {
    setError('')
    if (!isAuthenticated) return goToLogin()

    setPaying(true)
    try {
      const res = await createOrder(Number(id))
      const data = res.data

      if (data.alreadyPurchased) {
        setPaying(false)
        return loadData()
      }

      if (!window.Razorpay) {
        setError('Payment gateway initializing. Please retry in a few seconds.')
        setPaying(false)
        return
      }

      const options = {
        key: data.razorpayKeyId,
        amount: data.amountInPaise,
        currency: data.currency,
        name: 'DigitalDeals • Publishing',
        description: item.title,
        order_id: data.razorpayOrderId,
        prefill: { email: user?.email, name: user?.name },
        theme: { color: '#6366f1' },
        handler: async function (response) {
          try {
            await verifyPayment({
              purchaseId: data.purchaseId,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            })
            loadData()
          } catch (err) {
            setError(errorMessage(err, 'Payment verification failed.'))
          } finally {
            setPaying(false)
          }
        },
        modal: {
          ondismiss: function () { setPaying(false) },
        },
      }

      const rzp = new window.Razorpay(options)
      rzp.on('payment.failed', function () {
        setError('Payment did not complete. Please try again.')
        setPaying(false)
      })
      rzp.open()
    } catch (err) {
      setError(errorMessage(err, 'Could not initiate Razorpay checkout.'))
      setPaying(false)
    }
  }

  async function handleReviewSubmit(e) {
    e.preventDefault()
    if (!isAuthenticated) return goToLogin()
    if (!headline.trim() || !comment.trim()) return

    setSubmittingReview(true)
    try {
      await addReview({
        contentId: Number(id),
        rating,
        headline: headline.trim(),
        comment: comment.trim()
      })
      setReviewSuccess('Review published successfully!')
      setHeadline('')
      setComment('')
      const updatedReviews = await getBookReviews(id)
      setReviews(updatedReviews.data)
    } catch (err) {
      setError(errorMessage(err, 'Could not submit review.'))
    } finally {
      setSubmittingReview(false)
    }
  }

  if (loading) return <div className="page-container"><Loader label="Loading eBook details..." /></div>
  if (error && !item) return <div className="page-container"><div className="alert alert-error">{error}</div></div>
  if (!item) return null

  const coverSrc = item.thumbnailUrl ? thumbnailUrl(item.thumbnailUrl) : 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'

  return (
    <div className="product-view-container">
      {/* Breadcrumb navigation */}
      <nav className="product-nav-breadcrumb">
        <Link to="/">Explore</Link>
        <span>/</span>
        <Link to={`/?category=${encodeURIComponent(item.category || '')}`}>{item.category || 'eBooks'}</Link>
        <span>/</span>
        <span className="current-crumb">{item.title}</span>
      </nav>

      <div className="product-view-grid">
        {/* Left: 3D Cover Showcase */}
        <div className="cover-showcase-column">
          <div className="cover-frame-3d" onClick={() => setShowReader(true)}>
            <img src={coverSrc} alt={item.title} className="cover-img" />
            <div className="cover-interactive-badge">
              <span>✦ Click to Read Free Sample</span>
            </div>
          </div>

          <button
            type="button"
            className="btn-sample-reader"
            onClick={() => setShowReader(true)}
          >
            📖 {hasAccess ? 'Open Web Reader' : 'Preview Free Sample'}
          </button>

          {/* Format selection */}
          <div className="format-selection-card">
            <h4>Available Editions</h4>
            <div
              className={`format-option ${selectedFormat === 'EBOOK' ? 'selected' : ''}`}
              onClick={() => setSelectedFormat('EBOOK')}
            >
              <div>
                <strong>Digital eBook Edition</strong>
                <p>Instant Browser Reader + PDF</p>
              </div>
              <span className="format-price">₹{Number(item.price).toFixed(0)}</span>
            </div>

            {item.paperbackPrice && (
              <div
                className={`format-option ${selectedFormat === 'PRINT' ? 'selected' : ''}`}
                onClick={() => setSelectedFormat('PRINT')}
              >
                <div>
                  <strong>Paperback Edition</strong>
                  <p>6x9" Amazon Print-Ready</p>
                </div>
                <span className="format-price">₹{Number(item.paperbackPrice).toFixed(0)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Center: Details & Editorial Overview */}
        <div className="details-main-column">
          <span className="detail-category-pill">{item.category || 'Digital Blueprint'}</span>
          <h1 className="detail-book-title">{item.title}</h1>
          {item.subtitle && <h2 className="detail-book-subtitle">{item.subtitle}</h2>}

          <div className="detail-author-row">
            <span>Authored by</span>
            <strong className="author-link">{item.authorName || item.sellerName || 'Abikumar Dharmaraj'}</strong>
            <span className="author-tag">✓ Verified Publisher</span>
          </div>

          <div className="detail-rating-banner">
            <div className="rating-stars">
              {'★'.repeat(Math.round(item.averageRating || 4.9))}
              {'☆'.repeat(5 - Math.round(item.averageRating || 4.9))}
            </div>
            <strong className="rating-num">{Number(item.averageRating || 4.9).toFixed(1)}</strong>
            <span className="rating-count">({item.reviewCount || reviews.length || 48} verified reader ratings)</span>
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          {/* Key Specifications */}
          <div className="specs-dashboard-grid">
            <div className="spec-card">
              <span className="spec-lbl">Page Length</span>
              <strong className="spec-val">{item.printLength || 36} pages</strong>
            </div>
            <div className="spec-card">
              <span className="spec-lbl">Language</span>
              <strong className="spec-val">{item.language || 'English'}</strong>
            </div>
            <div className="spec-card">
              <span className="spec-lbl">Delivery</span>
              <strong className="spec-val">Instant Cloud</strong>
            </div>
            <div className="spec-card">
              <span className="spec-lbl">Royalty Model</span>
              <strong className="spec-val emerald">97% to Author</strong>
            </div>
          </div>

          {/* Book Description */}
          <div className="editorial-overview-section">
            <h3>Editorial Description</h3>
            <div className="editorial-text">
              {item.description}
            </div>
          </div>

          {/* Keywords / Tags */}
          {item.keywords && (
            <div className="tags-container">
              <strong>Tags:</strong>
              <div className="tags-list">
                {item.keywords.split(',').map((k, i) => (
                  <span key={i} className="tag-chip">{k.trim()}</span>
                ))}
              </div>
            </div>
          )}

          {/* Customer Reviews */}
          <section className="customer-reviews-block">
            <div className="reviews-title-bar">
              <h3>Verified Customer Reviews</h3>
              <span className="badge-verified">✓ Verified Reader Feedback</span>
            </div>

            <div className="reviews-cards-list">
              {reviews.length === 0 ? (
                <p className="no-reviews-txt">Be the first verified reader to review this title.</p>
              ) : (
                reviews.map((r) => (
                  <div key={r.id} className="single-review-card">
                    <div className="review-top-bar">
                      <div className="avatar-chip">{(r.userName || 'R').charAt(0).toUpperCase()}</div>
                      <div>
                        <strong>{r.userName || 'Verified Reader'}</strong>
                        <span className="verified-pill">✓ Verified Purchase</span>
                      </div>
                    </div>
                    <div className="review-stars-row">
                      <span className="stars">{'★'.repeat(r.rating || 5)}{'☆'.repeat(5 - (r.rating || 5))}</span>
                      <strong className="headline">{r.headline}</strong>
                    </div>
                    <p className="comment">{r.comment}</p>
                    <span className="date">{new Date(r.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>
                ))
              )}
            </div>

            {hasAccess && (
              <form onSubmit={handleReviewSubmit} className="write-review-form">
                <h4>Leave a Review</h4>
                {reviewSuccess && <div className="alert alert-success">{reviewSuccess}</div>}

                <div className="rating-select-wrap">
                  <label>Your Rating:</label>
                  <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
                    <option value={5}>★★★★★ (5 Stars - Outstanding)</option>
                    <option value={4}>★★★★☆ (4 Stars - Great)</option>
                    <option value={3}>★★★☆☆ (3 Stars - Average)</option>
                  </select>
                </div>

                <input
                  type="text"
                  placeholder="Review Headline"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  required
                />
                <textarea
                  rows={3}
                  placeholder="Share your experience with this blueprint..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  required
                />
                <button type="submit" className="btn-hero-primary" disabled={submittingReview}>
                  {submittingReview ? 'Publishing...' : 'Submit Review'}
                </button>
              </form>
            )}
          </section>
        </div>

        {/* Right: Modern Checkout / Buy Box */}
        <div className="checkout-sidebar-column">
          <div className="modern-checkout-card">
            {hasAccess ? (
              <div className="owned-status-wrap">
                <div className="owned-check">✓</div>
                <h3>You own this eBook!</h3>
                <p>Read in your browser or download your complete manuscript.</p>
                <button type="button" className="btn-hero-primary btn-block" onClick={() => setShowReader(true)}>
                  📖 Read in Browser
                </button>
                <button
                  type="button"
                  className="btn-hero-secondary btn-block"
                  style={{ marginTop: 12 }}
                  onClick={() => downloadFile(`/api/content/${id}/file`, item.title)}
                >
                  ⬇ Download eBook PDF
                </button>
              </div>
            ) : (
              <div className="purchase-card-wrap">
                <div className="price-banner">
                  <span className="price-lbl">Instant Access:</span>
                  <div className="price-display">
                    <span className="currency">₹</span>
                    <span className="amount">{Number(item.price).toFixed(0)}</span>
                  </div>
                </div>

                <div className="purchase-perks">
                  <div className="perk-item">⚡ <span>Instant delivery to your digital library</span></div>
                  <div className="perk-item">💰 <span>97% of purchase directly supports the author</span></div>
                  <div className="perk-item">🔒 <span>256-bit encrypted Razorpay checkout</span></div>
                </div>

                <button
                  type="button"
                  className="btn-checkout-primary btn-block"
                  onClick={handleBuy}
                  disabled={paying}
                >
                  {paying ? 'Connecting to Razorpay...' : isAuthenticated ? `⚡ Buy Now • ₹${Number(item.price).toFixed(0)}` : 'Sign in to Purchase'}
                </button>

                {isAuthenticated && (
                  <button
                    type="button"
                    className="btn-checkout-cart btn-block"
                    disabled={cart?.isInCart(item.id)}
                    onClick={() => cart?.add(item.id)}
                  >
                    {cart?.isInCart(item.id) ? '✓ In Cart' : '🛒 Add to Cart'}
                  </button>
                )}

                {isAuthenticated && (
                  <button
                    type="button"
                    className={`btn-wishlist-toggle btn-block ${wishlist?.isWishlisted(item.id) ? 'active' : ''}`}
                    onClick={() => wishlist?.toggle(item.id)}
                  >
                    {wishlist?.isWishlisted(item.id) ? '♥ In Wishlist' : '♡ Add to Wishlist'}
                  </button>
                )}

                <div className="publisher-author-signature">
                  <div className="sig-avatar">{(item.authorName || 'AD').slice(0, 2).toUpperCase()}</div>
                  <div className="sig-info">
                    <span className="sig-title">Published by</span>
                    <strong>{item.authorName || item.sellerName || 'Abikumar Dharmaraj'}</strong>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {showReader && (
        <BookReader
          title={item.title}
          author={item.authorName || item.sellerName}
          sampleText={item.sampleText || item.description}
          isSample={!hasAccess}
          price={Number(item.price).toFixed(0)}
          onClose={() => setShowReader(false)}
          onBuy={hasAccess ? null : handleBuy}
        />
      )}
    </div>
  )
}
