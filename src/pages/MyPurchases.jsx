import { useEffect, useState } from 'react'
import { myPurchases } from '../api/payment.js'
import { errorMessage } from '../api/axiosClient.js'
import ContentCard from '../components/ContentCard.jsx'
import Loader from '../components/Loader.jsx'

export default function MyPurchases() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true
    myPurchases()
      .then((res) => { if (mounted) setItems(res.data) })
      .catch((err) => { if (mounted) setError(errorMessage(err)) })
      .finally(() => { if (mounted) setLoading(false) })
    return () => { mounted = false }
  }, [])

  return (
    <div className="page-container">
      <h1 className="page-title">My Library</h1>
      {loading && <Loader label="Loading your library..." />}
      {error && <div className="alert alert-error">{error}</div>}
      {!loading && !error && (
        items.length === 0 ? (
          <div className="empty-state">
            <p>You haven't unlocked anything yet.</p>
            <a href="/" className="btn btn-primary">Browse content</a>
          </div>
        ) : (
          <div className="content-grid">
            {items.map((item) => <ContentCard key={item.id} item={item} />)}
          </div>
        )
      )}
    </div>
  )
}
