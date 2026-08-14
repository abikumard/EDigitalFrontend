import { useEffect, useState } from 'react'
import { listContent } from '../api/content.js'
import { errorMessage } from '../api/axiosClient.js'
import ContentCard from '../components/ContentCard.jsx'
import Loader from '../components/Loader.jsx'

export default function Home() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true
    listContent()
      .then((res) => { if (mounted) setItems(res.data) })
      .catch((err) => { if (mounted) setError(errorMessage(err, 'Could not load content right now.')) })
      .finally(() => { if (mounted) setLoading(false) })
    return () => { mounted = false }
  }, [])

  return (
    <div className="page-container">
      <section className="hero">
        <h1>Premium videos, PDFs &amp; photos</h1>
        <p>Unlock any item with a one-time payment. Once you buy it, it's yours to watch or read anytime.</p>
      </section>

      {loading && <Loader label="Loading content..." />}
      {error && <div className="alert alert-error">{error}</div>}

      {!loading && !error && (
        items.length === 0 ? (
          <div className="empty-state">
            <p>No content has been published yet. Please check back soon.</p>
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
