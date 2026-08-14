import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { createCartOrder, verifyCartPayment } from '../api/cart.js'
import { errorMessage, thumbnailUrl } from '../api/axiosClient.js'

export default function Cart() {
  const { cart, remove, refresh } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [paying, setPaying] = useState(false)
  const [error, setError] = useState('')

  const chargeableItems = cart.items.filter((i) => !i.alreadyOwned)

  async function handleCheckout() {
    setError('')
    setPaying(true)
    try {
      const res = await createCartOrder()
      const data = res.data

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
        description: `${data.itemCount} item(s) from your cart`,
        order_id: data.razorpayOrderId,
        prefill: { email: user?.email },
        theme: { color: '#2563eb' },
        handler: async function (response) {
          try {
            await verifyCartPayment({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            })
            await refresh()
            navigate('/library')
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
      setError(errorMessage(err, 'Could not start checkout.'))
      setPaying(false)
    }
  }

  return (
    <div className="page-container">
      <h1 className="page-title">My Cart</h1>

      {error && <div className="alert alert-error">{error}</div>}

      {cart.items.length === 0 ? (
        <p className="empty-state">Your cart is empty. <Link to="/">Browse content</Link> to add something.</p>
      ) : (
        <>
          <div className="cart-list">
            {cart.items.map((item) => (
              <div className="cart-row" key={item.contentId}>
                <Link to={`/content/${item.contentId}`} className="cart-row-main">
                  <img src={thumbnailUrl(item.thumbnailUrl)} alt="" className="cart-thumb" />
                  <div>
                    <h3>{item.title}</h3>
                    {item.alreadyOwned ? (
                      <span className="status-pill unlocked">Already owned</span>
                    ) : (
                      <span className="price-tag">₹{Number(item.price).toFixed(0)}</span>
                    )}
                  </div>
                </Link>
                <button className="btn btn-secondary btn-sm" onClick={() => remove(item.contentId)}>Remove</button>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <div className="cart-summary-row">
              <span>Total ({chargeableItems.length} item{chargeableItems.length === 1 ? '' : 's'})</span>
              <strong>₹{Number(cart.totalAmount).toFixed(0)}</strong>
            </div>
            <button
              className="btn btn-primary btn-block"
              onClick={handleCheckout}
              disabled={paying || chargeableItems.length === 0}
            >
              {paying ? 'Opening payment...' : 'Checkout'}
            </button>
            {chargeableItems.length === 0 && (
              <p className="cart-note">Everything in your cart is already unlocked.</p>
            )}
          </div>
        </>
      )}
    </div>
  )
}
