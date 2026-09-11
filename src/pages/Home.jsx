import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { listContent } from '../api/content.js'
import { errorMessage } from '../api/axiosClient.js'
import BookCard from '../components/BookCard.jsx'
import BookReader from '../components/BookReader.jsx'
import Loader from '../components/Loader.jsx'

const CATEGORIES = [
  'All eBooks',
  'AI & Technology',
  'Health & Mindset',
  'Self-Help & Wellness',
  'Psychology & Healing'
]

export default function Home() {
  const [searchParams, setSearchParams] = useSearchParams()
  const activeCategory = searchParams.get('category') || ''
  const searchQuery = searchParams.get('search') || ''

  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [heroSampleOpen, setHeroSampleOpen] = useState(false)

  useEffect(() => {
    let mounted = true
    setLoading(true)
    listContent(activeCategory, searchQuery)
      .then((res) => { if (mounted) setItems(res.data) })
      .catch((err) => { if (mounted) setError(errorMessage(err, 'Could not load Kindle catalogue.')) })
      .finally(() => { if (mounted) setLoading(false) })
    return () => { mounted = false }
  }, [activeCategory, searchQuery])

  function selectCategory(cat) {
    if (cat === 'All eBooks' || !cat) {
      searchParams.delete('category')
    } else {
      searchParams.set('category', cat)
    }
    setSearchParams(searchParams)
  }

  // Find hero book (The 2-Hour AI Side Hustle or first item)
  const heroBook = items.find((b) => b.title?.includes('2-Hour AI Side Hustle')) || items[0]

  return (
    <div className="kindle-home-container">
      {/* Hero Showcase Banner */}
      {!searchQuery && !activeCategory && heroBook && (
        <section className="kindle-hero-showcase">
          <div className="hero-grid">
            <div className="hero-text-content">
              <span className="hero-badge">🔥 #1 BESTSELLER IN ARTIFICIAL INTELLIGENCE &amp; SIDE HUSTLES</span>
              <h1 className="hero-title">{heroBook.title}</h1>
              <p className="hero-subtitle">{heroBook.subtitle}</p>
              <p className="hero-byline">By <span className="author-highlight">{heroBook.authorName || 'Abikumar Dharmaraj'}</span> (Author)</p>

              <div className="hero-meta-row">
                <span className="meta-tag">★ 4.9 Rating (48 Reviews)</span>
                <span className="meta-tag">36 Pages • 2026 Print Edition</span>
                <span className="meta-tag">Instant In-Browser Kindle Delivery</span>
              </div>

              <p className="hero-desc">
                {heroBook.description}
              </p>

              <div className="hero-cta-group">
                <Link to={`/content/${heroBook.id}`} className="btn btn-primary btn-lg hero-buy-btn">
                  ⚡ 1-Click Buy Kindle Edition (₹{Number(heroBook.price).toFixed(0)})
                </Link>
                <button
                  type="button"
                  className="btn btn-secondary btn-lg hero-sample-btn"
                  onClick={() => setHeroSampleOpen(true)}
                >
                  👁 Read Free Sample
                </button>
              </div>
            </div>

            <div className="hero-cover-column">
              <div className="hero-cover-3d" onClick={() => setHeroSampleOpen(true)}>
                <img
                  src={heroBook.thumbnailUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80'}
                  alt={heroBook.title}
                  className="hero-3d-img"
                />
                <div className="hero-ribbon">LOOK INSIDE</div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Platform Value Proposition Bar */}
      <section className="platform-highlights-bar">
        <div className="highlight-item">
          <span className="hl-icon">⚡</span>
          <div>
            <strong>Instant Cloud Reading</strong>
            <p>Read in any web browser without downloading bulky apps</p>
          </div>
        </div>
        <div className="highlight-item">
          <span className="hl-icon">💰</span>
          <div>
            <strong>97% Author Royalties</strong>
            <p>Direct publisher payouts with industry-lowest 3% platform fee</p>
          </div>
        </div>
        <div className="highlight-item">
          <span className="hl-icon">🔒</span>
          <div>
            <strong>Razorpay Secure Checkout</strong>
            <p>UPI, Cards, NetBanking, and Wallets protected by bank-grade SSL</p>
          </div>
        </div>
        <div className="highlight-item">
          <span className="hl-icon">📚</span>
          <div>
            <strong>Multi-Format Access</strong>
            <p>Read online or download print-ready PDF interior editions</p>
          </div>
        </div>
      </section>

      {/* Category Pills Filter */}
      <section className="category-filter-section">
        <div className="category-pills">
          {CATEGORIES.map((cat) => {
            const isSelected = (cat === 'All eBooks' && !activeCategory) || activeCategory === cat
            return (
              <button
                key={cat}
                type="button"
                className={`category-pill ${isSelected ? 'active' : ''}`}
                onClick={() => selectCategory(cat)}
              >
                {cat}
              </button>
            )
          })}
        </div>
      </section>

      {/* Main Books Catalog */}
      <section className="catalogue-section">
        <div className="section-header">
          <h2>
            {searchQuery ? `Search Results for "${searchQuery}"` : activeCategory ? `${activeCategory} Bestsellers` : 'Featured Kindle & KDP Bestsellers'}
          </h2>
          <span className="catalog-count">{items.length} Titles Available</span>
        </div>

        {loading && <Loader label="Loading Kindle bookstore..." />}
        {error && <div className="alert alert-error">{error}</div>}

        {!loading && !error && (
          items.length === 0 ? (
            <div className="empty-catalog-state">
              <span className="empty-icon">📖</span>
              <h3>No matching eBooks found</h3>
              <p>Try searching for different keywords or clear the category filters.</p>
              <button type="button" className="btn btn-primary" onClick={() => selectCategory('All eBooks')}>
                Browse All eBooks
              </button>
            </div>
          ) : (
            <div className="kdp-book-grid">
              {items.map((item) => (
                <BookCard key={item.id} item={item} />
              ))}
            </div>
          )
        )}
      </section>

      {/* Look Inside Modal for Hero Book */}
      {heroSampleOpen && heroBook && (
        <BookReader
          title={heroBook.title}
          author={heroBook.authorName || 'Abikumar Dharmaraj'}
          sampleText={heroBook.sampleText || heroBook.description}
          isSample={true}
          price={Number(heroBook.price).toFixed(0)}
          onClose={() => setHeroSampleOpen(false)}
          onBuy={() => {
            setHeroSampleOpen(false)
            window.location.href = `/content/${heroBook.id}`
          }}
        />
      )}
    </div>
  )
}
