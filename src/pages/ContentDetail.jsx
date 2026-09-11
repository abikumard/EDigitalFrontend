import { useEffect, useState, useCallback } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { getContent } from '../api/content.js'
import { createOrder, verifyPayment } from '../api/payment.js'
import { getBookReviews, addReview } from '../api/review.js'
import { errorMessage, protectedFileUrl, thumbnailUrl, downloadFile } from '../api/axiosClient.js'
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
  const [selectedFormat, setSelectedFormat] = useState('KINDLE')

  // Review form state
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewHeadline, setReviewHeadline] = useState('')
  const [reviewComment, setReviewComment] = useState('')
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
        setReviews(resReviews.data)
      })
      .catch((err) => setError(errorMessage(err, 'Could not load this eBook details.')))
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
        setError('Payment gateway failed to initialize. Please refresh.')
        setPaying(false)
        return
      }

      const options = {
        key: data.razorpayKeyId,
        amount: data.amountInPaise,
        currency: data.currency,
        name: 'KDP Cloud • eBook Store',
        description: item.title,
        order_id: data.razorpayOrderId,
        prefill: { email: user?.email, name: user?.name },
        theme: { color: '#f08804' },
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
            setError(errorMessage(err, 'Payment verification failed. Please check with your bank.'))
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
        setError('Payment was not completed. Please try again.')
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
    if (!reviewHeadline.trim() || !reviewComment.trim()) return

    setSubmittingReview(true)
    try {
      await addReview({
        contentId: Number(id),
        rating: reviewRating,
        headline: reviewHeadline.trim(),
        comment: reviewComment.trim()
      })
      setReviewSuccess('Thank you! Your verified reader review has been published.')
      setReviewHeadline('')
      setReviewComment('')
      const updatedReviews = await getBookReviews(id)
      setReviews(updatedReviews.data)
    } catch (err) {
      setError(errorMessage(err, 'Could not post your review.'))
    } finally {
      setSubmittingReview(false)
    }
  }

  if (loading) return <div className="page-container"><Loader label="Loading book details..." /></div>
  if (error && !item) return <div className="page-container"><div className="alert alert-error">{error}</div></div>
  if (!item) return null

  const coverSrc = item.thumbnailUrl ? thumbnailUrl(item.thumbnailUrl) : 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'

  return (
    <div className="product-page-container">
      {/* Breadcrumb */}
      <nav className="product-breadcrumbs">
        <Link to="/">Kindle Store</Link> › <Link to={`/?category=${encodeURIComponent(item.category || '')}`}>{item.category || 'eBooks'}</Link> › <span>{item.title}</span>
      </nav>

      <div className="product-main-grid">
        {/* Column 1: 3D Cover & Look Inside Preview */}
        <div className="product-cover-column">
          <div className="product-3d-cover-wrap" onClick={() => setShowReader(true)}>
            <img src={coverSrc} alt={item.title} className="product-cover-image" />
            <div className="product-cover-ribbon">
              <span>👁 Click to Look Inside</span>
            </div>
          </div>

          <button
            type="button"
            className="btn btn-secondary btn-block look-inside-action-btn"
            onClick={() => setShowReader(true)}
          >
            📖 {hasAccess ? 'Open Kindle Reader' : 'Read Free Sample Preview'}
          </button>

          {/* Formats Selector */}
          <div className="product-format-selector">
            <h4>Available Formats</h4>
            <div
              className={`format-option-box ${selectedFormat === 'KINDLE' ? 'active' : ''}`}
              onClick={() => setSelectedFormat('KINDLE')}
            >
              <div className="format-left">
                <strong>Kindle Edition</strong>
                <span>Instant In-Browser &amp; PDF</span>
              </div>
              <strong className="format-price-bold">₹{Number(item.price).toFixed(0)}</strong>
            </div>

            {item.paperbackPrice && (
              <div
                className={`format-option-box ${selectedFormat === 'PAPERBACK' ? 'active' : ''}`}
                onClick={() => setSelectedFormat('PAPERBACK')}
              >
                <div className="format-left">
                  <strong>Paperback (Print)</strong>
                  <span>6x9" Amazon Print-Ready</span>
                </div>
                <strong className="format-price-bold">₹{Number(item.paperbackPrice).toFixed(0)}</strong>
              </div>
            )}
          </div>
        </div>

        {/* Column 2: Editorial Details & Description */}
        <div className="product-info-column">
          <span className="product-category-tag">{item.category || 'Kindle Edition'}</span>
          <h1 className="product-title">{item.title}</h1>
          {item.subtitle && <h2 className="product-subtitle">{item.subtitle}</h2>}

          <div className="product-byline-row">
            <span className="byline-label">by</span>
            <span className="byline-author">{item.authorName || item.sellerName || 'Abikumar Dharmaraj'}</span>
            <span className="byline-tag">(Author)</span>
          </div>

          {/* Rating Summary */}
          <div className="product-rating-row">
            <div className="stars-gold large">
              {'★'.repeat(Math.round(item.averageRating || 4.9))}
              {'☆'.repeat(5 - Math.round(item.averageRating || 4.9))}
            </div>
            <span className="rating-number">{Number(item.averageRating || 4.9).toFixed(1)}</span>
            <span className="rating-reviews-link">{item.reviewCount || reviews.length || 48} ratings</span>
            <span className="bestseller-rank-pill">#1 Best Seller</span>
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          {/* Metadata Specifications Grid */}
          <div className="product-specs-card">
            <div className="spec-item">
              <span className="spec-label">Print Length</span>
              <strong className="spec-value">{item.printLength || 36} pages</strong>
            </div>
            <div className="spec-item">
              <span className="spec-label">Language</span>
              <strong className="spec-value">{item.language || 'English'}</strong>
            </div>
            <div className="spec-item">
              <span className="spec-label">Publisher</span>
              <strong className="spec-value">KDP Cloud / MediaVault (2026 Edition)</strong>
            </div>
            <div className="spec-item">
              <span className="spec-label">Delivery</span>
              <strong className="spec-value">Instant Cloud Access</strong>
            </div>
          </div>

          {/* Description */}
          <div className="product-description-section">
            <h3>Book Description</h3>
            <div className="description-text">
              {item.description}
            </div>
          </div>

          {/* Key Topics / Keywords */}
          {item.keywords && (
            <div className="product-tags-section">
              <strong>Tags &amp; Keywords:</strong>
              <div className="tag-pill-list">
                {item.keywords.split(',').map((k, i) => (
                  <span key={i} className="keyword-pill">{k.trim()}</span>
                ))}
              </div>
            </div>
          )}

          {/* Verified Customer Reviews Section */}
          <section className="product-reviews-section">
            <div className="reviews-header">
              <h3>Customer Reviews &amp; Ratings</h3>
              <span className="verified-badge">✓ Verified Amazon KDP Purchases</span>
            </div>

            {/* Reviews List */}
            <div className="reviews-list">
              {reviews.length === 0 ? (
                <p className="no-reviews">Be the first verified reader to review this title.</p>
              ) : (
                reviews.map((r) => (
                  <div key={r.id} className="review-item">
                    <div className="review-user-row">
                      <div className="review-avatar">{r.userName ? r.userName.charAt(0).toUpperCase() : 'R'}</div>
                      <div>
                        <strong>{r.userName || 'Verified Reader'}</strong>
                        <span className="review-verified-tag">✓ Verified Purchase</span>
                      </div>
                    </div>
                    <div className="review-rating-stars">
                      {'★'.repeat(r.rating || 5)}{'☆'.repeat(5 - (r.rating || 5))}
                      <strong className="review-headline">{r.headline}</strong>
                    </div>
                    <p className="review-comment-text">{r.comment}</p>
                    <span className="review-date">Reviewed on {new Date(r.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>
                ))
              )}
            </div>

            {/* Add Review Form */}
            {hasAccess && (
              <form onSubmit={handleReviewSubmit} className="add-review-card">
                <h4>Write a Customer Review</h4>
                {reviewSuccess && <div className="alert alert-success">{reviewSuccess}</div>}

                <div className="review-form-rating">
                  <label>Overall Rating:</label>
                  <select value={reviewRating} onChange={(e) => setReviewRating(Number(e.target.value))}>
                    <option value={5}>★★★★★ (5 Stars - Excellent)</option>
                    <option value={4}>★★★★☆ (4 Stars - Good)</option>
                    <option value={3}>★★★☆☆ (3 Stars - Average)</option>
                    <option value={2}>★★☆☆☆ (2 Stars - Fair)</option>
                    <option value={1}>★☆☆☆☆ (1 Star - Poor)</option>
                  </select>
                </div>

                <input
                  type="text"
                  placeholder="Headline / Summary of your review"
                  value={reviewHeadline}
                  onChange={(e) => setReviewHeadline(e.target.value)}
                  required
                />
                <textarea
                  rows={3}
                  placeholder="Write your review here. What did you like or dislike?"
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  required
                />

                <button type="submit" className="btn btn-primary btn-sm" disabled={submittingReview}>
                  {submittingReview ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            )}
          </section>
        </div>

        {/* Column 3: Amazon Buy Box */}
        <div className="product-buybox-column">
          <div className="amazon-buybox-card">
            {hasAccess ? (
              <div className="owned-buybox">
                <div className="owned-icon">✓</div>
                <h3>You own this eBook!</h3>
                <p>Read seamlessly inside your browser or download the PDF interior manuscript.</p>
                <button type="button" className="btn btn-primary btn-block" onClick={() => setShowReader(true)}>
                  📖 Read in Browser
                </button>
                <button
                  type="button"
                  className="btn btn-secondary btn-block"
                  style={{ marginTop: 10 }}
                  onClick={() => downloadFile(`/api/content/${id}/file`, item.title)}
                >
                  ⬇ Download eBook / PDF
                </button>
              </div>
            ) : (
              <div className="purchase-buybox">
                <div className="buybox-price-row">
                  <span className="buybox-label">Kindle Price:</span>
                  <strong className="buybox-price">₹{Number(item.price).toFixed(0)}</strong>
                </div>
                <div className="inclusive-taxes">Includes all applicable taxes &amp; instant cloud delivery</div>

                <div className="buybox-guarantee">
                  <span>⚡ Instant 1-Click Delivery to your KDP Library</span>
                  <span>💰 97% of your purchase supports the author directly</span>
                  <span>🔒 Protected by 256-bit Razorpay Gateway</span>
                </div>

                <button
                  type="button"
                  className="btn btn-primary btn-block buybox-buy-now-btn"
                  onClick={handleBuy}
                  disabled={paying}
                >
                  {paying ? 'Connecting to Razorpay...' : isAuthenticated ? `⚡ Buy Now (₹${Number(item.price).toFixed(0)})` : 'Sign in to Buy'}
                </button>

                {isAuthenticated && (
                  <button
                    type="button"
                    className="btn btn-secondary btn-block buybox-add-cart-btn"
                    disabled={cart?.isInCart(item.id)}
                    onClick={() => cart?.add(item.id)}
                  >
                    {cart?.isInCart(item.id) ? '✓ In Cart' : '🛒 Add to Cart'}
                  </button>
                )}

                {isAuthenticated && (
                  <button
                    type="button"
                    className={`btn btn-ghost btn-block buybox-wishlist-btn ${wishlist?.isWishlisted(item.id) ? 'active' : ''}`}
                    onClick={() => wishlist?.toggle(item.id)}
                  >
                    {wishlist?.isWishlisted(item.id) ? '♥ In Wishlist' : '♡ Add to Wishlist'}
                  </button>
                )}

                <div className="buybox-author-badge">
                  <div className="author-avatar-circle">
                    {(item.authorName || 'AD').substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <span className="author-badge-title">Publisher</span>
                    <strong>{item.authorName || item.sellerName || 'Abikumar Dharmaraj'}</strong>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reader Modal */}
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
