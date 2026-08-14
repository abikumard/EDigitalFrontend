import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getWishlist } from '../api/wishlist.js'
import { errorMessage, thumbnailUrl } from '../api/axiosClient.js'
import { useWishlist } from '../context/WishlistContext.jsx'
import { useCart } from '../context/CartContext.jsx'
import Loader from '../components/Loader.jsx'

export default function Wishlist() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { toggle } = useWishlist()
  const { add: addToCart, isInCart } = useCart()

  useEffect(() => {
    getWishlist()
      .then((res) => setItems(res.data))
      .catch((err) => setError(errorMessage(err, 'Could not load your wishlist.')))
      .finally(() => setLoading(false))
  }, [])

  async function handleRemove(id) {
    await toggle(id)
    setItems((prev) => prev.filter((i) => i.id !== id))
  }

  if (loading) return <Loader />

  return (
    <div className="page-container">
      <h1 className="page-title">My Wishlist</h1>

      {error && <div className="alert alert-error">{error}</div>}
      {!error && items.length === 0 && (
        <p className="empty-state">Nothing here yet — tap the heart on any item to save it for later.</p>
      )}

      <div className="cart-list">
        {items.map((item) => (
          <div className="cart-row" key={item.id}>
            <Link to={`/content/${item.id}`} className="cart-row-main">
              <img src={thumbnailUrl(item.thumbnailUrl)} alt="" className="cart-thumb" />
              <div>
                <h3>{item.title}</h3>
                <span className="price-tag">₹{Number(item.price).toFixed(0)}</span>
              </div>
            </Link>
            <div className="cart-row-actions">
              {!item.purchased && (
                <button
                  className="btn btn-primary btn-sm"
                  disabled={isInCart(item.id)}
                  onClick={() => addToCart(item.id)}
                >
                  {isInCart(item.id) ? 'In Cart' : 'Add to Cart'}
                </button>
              )}
              <button className="btn btn-secondary btn-sm" onClick={() => handleRemove(item.id)}>Remove</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
