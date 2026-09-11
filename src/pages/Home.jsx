import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { listContent } from '../api/content.js'
import { errorMessage } from '../api/axiosClient.js'
import BookCard from '../components/BookCard.jsx'
import BookReader from '../components/BookReader.jsx'
import Loader from '../components/Loader.jsx'

const CATEGORIES = [
  { id: '', label: '✨ All Blueprints' },
  { id: 'AI & Technology', label: '🤖 AI & Automation' },
  { id: 'Health & Mindset', label: '🧠 Dopamine & Focus' },
  { id: 'Self-Help & Wellness', label: '🧘 Somatic & Vagus Nerve' },
  { id: 'Psychology & Healing', label: '🌙 Shadow Work & Healing' }
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
      .catch((err) => { if (mounted) setError(errorMessage(err, 'Could not load bookstore.')) })
      .finally(() => { if (mounted) setLoading(false) })
    return () => { mounted = false }
  }, [activeCategory, searchQuery])

  function selectCategory(catId) {
    if (!catId) {
      searchParams.delete('category')
    } else {
      searchParams.set('category', catId)
    }
    setSearchParams(searchParams)
  }

  // Spotlight Book (The 2-Hour AI Side Hustle or 1st book)
  const heroBook = items.find((b) => b.title?.includes('2-Hour AI Side Hustle')) || items[0]

  return (
    <div className="modern-home-wrapper">
      {/* LUXURY CREATOR SPOTLIGHT HERO */}
      {!searchQuery && !activeCategory && heroBook && (
        <section className="modern-hero-section">
          <div className="hero-glow-sphere" />
          <div className="hero-content-container">
            <div className="hero-text-block">
              <div className="hero-pill-badge">
                <span className="badge-pulse" />
                <span>#1 FEATURED BLUEPRINT • 2026 EDITION</span>
              </div>

              <h1 className="hero-main-title">{heroBook.title}</h1>
              <p className="hero-sub-title">{heroBook.subtitle}</p>

              <div className="hero-author-byline">
                <span>Authored by</span>
                <strong className="author-highlight">{heroBook.authorName || 'Abikumar Dharmaraj'}</strong>
                <span className="verified-author">✓ Verified Author</span>
              </div>

              <div className="hero-tags-row">
                <span className="hero-tag">★ 4.9 Rating (48 Reviews)</span>
                <span className="hero-tag">36 Pages • Complete System</span>
                <span className="hero-tag">Instant In-Browser Reading</span>
              </div>

              <p className="hero-synopsis">
                {heroBook.description}
              </p>

              <div className="hero-buttons-row">
                <Link to={`/content/${heroBook.id}`} className="btn-hero-primary">
                  <span>Instant Unlock (₹{Number(heroBook.price).toFixed(0)})</span>
                  <span className="arrow">→</span>
                </Link>
                <button
                  type="button"
                  className="btn-hero-secondary"
                  onClick={() => setHeroSampleOpen(true)}
                >
                  <span>👁 Read Free Sample</span>
                </button>
              </div>
            </div>

            {/* 3D Floating Book Cover Showcase */}
            <div className="hero-cover-block">
              <div className="floating-cover-card" onClick={() => setHeroSampleOpen(true)}>
                <img
                  src={heroBook.thumbnailUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80'}
                  alt={heroBook.title}
                  className="hero-book-img"
                />
                <div className="cover-read-pill">
                  <span>✦ Click to Read Sample</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* PLATFORM VALUE HIGHLIGHTS */}
      <section className="modern-values-grid">
        <div className="val-card">
          <div className="val-icon-box">⚡</div>
          <div className="val-text">
            <strong>Instant In-Browser Reading</strong>
            <p>Read seamlessly on any device without installing apps</p>
          </div>
        </div>

        <div className="val-card">
          <div className="val-icon-box">💰</div>
          <div className="val-text">
            <strong>97% Direct Author Royalties</strong>
            <p>Industry-leading creator payouts with a flat 3% platform fee</p>
          </div>
        </div>

        <div className="val-card">
          <div className="val-icon-box">🔒</div>
          <div className="val-text">
            <strong>Razorpay Instant Checkout</strong>
            <p>UPI, Cards, and NetBanking protected with 256-bit encryption</p>
          </div>
        </div>

        <div className="val-card">
          <div className="val-icon-box">🚀</div>
          <div className="val-text">
            <strong>Creator Publishing Studio</strong>
            <p>Self-publish eBooks and launch digital revenue streams</p>
          </div>
        </div>
      </section>

      {/* CATEGORY FILTER PILLS */}
      <section className="modern-filter-bar">
        <div className="filter-pills-wrap">
          {CATEGORIES.map((c) => {
            const isSelected = activeCategory === c.id || (!activeCategory && c.id === '')
            return (
              <button
                key={c.id}
                type="button"
                className={`filter-pill-btn ${isSelected ? 'active' : ''}`}
                onClick={() => selectCategory(c.id)}
              >
                {c.label}
              </button>
            )
          })}
        </div>
      </section>

      {/* CATALOGUE GRID */}
      <section className="modern-catalog-section">
        <div className="catalog-header-row">
          <div>
            <h2 className="catalog-title">
              {searchQuery ? `Search Results for "${searchQuery}"` : activeCategory ? `${activeCategory} Collection` : 'Curated Best-Selling eBooks'}
            </h2>
            <p className="catalog-sub">High-impact, actionable digital books authored for peak performance and income automation.</p>
          </div>
          <span className="total-books-counter">{items.length} Titles</span>
        </div>

        {loading && <Loader label="Loading library collection..." />}
        {error && <div className="alert alert-error">{error}</div>}

        {!loading && !error && (
          items.length === 0 ? (
            <div className="empty-catalog-card">
              <span className="empty-icon">📖</span>
              <h3>No matching eBooks found</h3>
              <p>Try searching for different keywords or explore other categories.</p>
              <button type="button" className="btn-hero-primary" onClick={() => selectCategory('')}>
                Explore All eBooks
              </button>
            </div>
          ) : (
            <div className="modern-book-grid">
              {items.map((item) => (
                <BookCard key={item.id} item={item} />
              ))}
            </div>
          )
        )}
      </section>

      {/* Hero Sample Reader Modal */}
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
