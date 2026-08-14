import { useEffect, useState, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getContent } from '../api/content.js'
import { createOrder, verifyPayment } from '../api/payment.js'
import { errorMessage, protectedFileUrl, thumbnailUrl, downloadFile } from '../api/axiosClient.js'
import { useAuth } from '../context/AuthContext.jsx'
import { useCart } from '../context/CartContext.jsx'
import { useWishlist } from '../context/WishlistContext.jsx'
import Loader from '../components/Loader.jsx'

const typeLabels = { VIDEO: 'Video', PDF: 'PDF', PHOTO: 'Photo' }

export default function ContentDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuth()
  const cart = useCart()
  const wishlist = useWishlist()

  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [paying, setPaying] = useState(false)

  const load = useCallback(() => {
    setLoading(true)
    getContent(id)
      .then((res) => setItem(res.data))
      .catch((err) => setError(errorMessage(err, 'Could not load this item.')))
      .finally(() => setLoading(false))
  }, [id])

  useEffect(() => { load() }, [load])

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
        return load()
      }

      if (!window.Razorpay) {
        setError('Payment could not start. Please refresh the page and try again.')
        setPaying(false)
        return
      }

      const options = {
        key: data.razorpayKeyId,
        amount: data.amountInPaise,
        currency: data.currency,
        name: 'MediaVault',
        description: item.title,
        order_id: data.razorpayOrderId,
        prefill: { email: user?.email },
        theme: { color: '#2563eb' },
        handler: async function (response) {
          try {
            await verifyPayment({
              purchaseId: data.purchaseId,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            })
            load()
          } catch (err) {
            setError(errorMessage(err, 'Payment verification failed. If money was deducted, it will be refunded.'))
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
        setError('Payment failed. Please try again.')
        setPaying(false)
      })
      rzp.open()
    } catch (err) {
      setError(errorMessage(err, 'Could not start payment. Please try again.'))
      setPaying(false)
    }
  }

  if (loading) return <div className="page-container"><Loader label="Loading..." /></div>
  if (error && !item) return <div className="page-container"><div className="alert alert-error">{error}</div></div>
  if (!item) return null

  return (
    <div className="page-container">
      <div className="detail-layout">
        <div className="detail-media">
          {hasAccess ? (
            <Viewer item={item} id={id} />
          ) : (
            <div className="detail-thumb-locked">
              <img src={thumbnailUrl(item.thumbnailUrl)} alt={item.title} />
              <div className="locked-overlay">
                <LockBig />
                <span>Purchase to unlock</span>
              </div>
            </div>
          )}
        </div>

        <div className="detail-info">
          <span className="type-badge standalone">{typeLabels[item.contentType] || item.contentType}</span>
          <h1>{item.title}</h1>
          <p className="detail-description">{item.description}</p>

          {error && <div className="alert alert-error">{error}</div>}

          {hasAccess && (
            <div className="alert alert-success">✓ You own this — enjoy!</div>
          )}

          {!hasAccess && (
            <div className="detail-purchase-box">
              <div className="price-row">
                <span>Price</span>
                <strong>₹{Number(item.price).toFixed(0)}</strong>
              </div>
              <button className="btn btn-primary btn-block" onClick={handleBuy} disabled={paying}>
                {paying ? 'Opening payment...' : isAuthenticated ? `Unlock for ₹${Number(item.price).toFixed(0)}` : 'Log in to unlock'}
              </button>
              {isAuthenticated && (
                <div className="detail-secondary-actions">
                  <button
                    className="btn btn-secondary btn-block"
                    disabled={cart?.isInCart(item.id)}
                    onClick={() => cart?.add(item.id)}
                  >
                    {cart?.isInCart(item.id) ? 'In Cart' : 'Add to Cart'}
                  </button>
                  <button
                    className={'btn btn-secondary btn-block' + (wishlist?.isWishlisted(item.id) ? ' wishlist-active' : '')}
                    onClick={() => wishlist?.toggle(item.id)}
                  >
                    {wishlist?.isWishlisted(item.id) ? '♥ Wishlisted' : '♡ Add to Wishlist'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function Viewer({ item, id }) {
  const url = protectedFileUrl(id)
  const [downloading, setDownloading] = useState(false)
  const [downloadError, setDownloadError] = useState('')

  async function handleDownload() {
    setDownloadError('')
    setDownloading(true)
    try {
      await downloadFile(id, item.title)
    } catch (err) {
      setDownloadError('Could not download. Please try again.')
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div className="viewer-wrap">
      {item.contentType === 'VIDEO' && (
        <video className="media-video" src={url} controls />
      )}
      {item.contentType === 'PDF' && (
        <div className="media-pdf-wrap">
          <iframe className="media-pdf" src={url} title={item.title} />
        </div>
      )}
      {item.contentType === 'PHOTO' && (
        <img className="media-photo" src={url} alt={item.title} />
      )}

      <button className="btn btn-secondary btn-block download-btn" onClick={handleDownload} disabled={downloading}>
        <DownloadIcon /> {downloading ? 'Downloading...' : 'Download'}
      </button>
      {downloadError && <div className="alert alert-error">{downloadError}</div>}
    </div>
  )
}

function DownloadIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v12" /><path d="m7 10 5 5 5-5" /><path d="M5 21h14" />
    </svg>
  )
}

function LockBig() {
  return (
    <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="10" width="16" height="10" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </svg>
  )
}
