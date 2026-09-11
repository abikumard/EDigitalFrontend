import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getBookshelf, getPublisherAnalytics, requestPayout, getPayoutHistory } from '../api/seller.js'
import { errorMessage } from '../api/axiosClient.js'
import Loader from '../components/Loader.jsx'

export default function KdpDashboard() {
  const [books, setBooks] = useState([])
  const [analytics, setAnalytics] = useState(null)
  const [payouts, setPayouts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Payout Modal
  const [showPayoutModal, setShowPayoutModal] = useState(false)
  const [payoutAmount, setPayoutAmount] = useState('')
  const [payoutMethod, setPayoutMethod] = useState('UPI')
  const [payoutDetails, setPayoutDetails] = useState('')
  const [submittingPayout, setSubmittingPayout] = useState(false)
  const [payoutSuccess, setPayoutSuccess] = useState('')

  useEffect(() => {
    let mounted = true
    Promise.all([
      getBookshelf(),
      getPublisherAnalytics().catch(() => ({ data: null })),
      getPayoutHistory().catch(() => ({ data: [] }))
    ])
      .then(([bRes, aRes, pRes]) => {
        if (!mounted) return
        setBooks(bRes.data)
        setAnalytics(aRes.data)
        setPayouts(pRes.data)
      })
      .catch((err) => {
        if (mounted) setError(errorMessage(err, 'Could not load your KDP Author Bookshelf.'))
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })
    return () => { mounted = false }
  }, [])

  async function handleRequestPayout(e) {
    e.preventDefault()
    setError('')
    setPayoutSuccess('')

    const amt = Number(payoutAmount)
    if (!amt || amt < 100) {
      return setError('Minimum withdrawal amount is ₹100.00.')
    }
    if (analytics && amt > Number(analytics.availableBalance)) {
      return setError(`Insufficient balance. Available: ₹${Number(analytics.availableBalance).toFixed(2)}`)
    }

    setSubmittingPayout(true)
    try {
      await requestPayout({
        amount: amt,
        payoutMethod,
        payoutDetails: payoutDetails || 'Direct Transfer'
      })
      setPayoutSuccess('Withdrawal request submitted! Funds will be credited after processing.')
      setShowPayoutModal(false)
      setPayoutAmount('')
      // refresh analytics & payouts
      const a = await getPublisherAnalytics()
      const p = await getPayoutHistory()
      setAnalytics(a.data)
      setPayouts(p.data)
    } catch (err) {
      setError(errorMessage(err, 'Failed to submit withdrawal request.'))
    } finally {
      setSubmittingPayout(false)
    }
  }

  if (loading) return <div className="page-container"><Loader label="Loading KDP Author Studio..." /></div>

  return (
    <div className="kdp-dashboard-container">
      {/* KDP Studio Header */}
      <div className="kdp-studio-header">
        <div className="header-left">
          <h1>✍️ KDP Author Studio &amp; Bookshelf</h1>
          <p>Manage your published titles, live sales, and automatic 97% royalty earnings.</p>
        </div>
        <div className="header-actions">
          <Link to="/kdp/publish" className="btn btn-primary btn-lg">
            + Create &amp; Publish New Title
          </Link>
          <Link to="/publisher/profile" className="btn btn-secondary">
            Bank &amp; Profile Settings
          </Link>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {payoutSuccess && <div className="alert alert-success">{payoutSuccess}</div>}

      {/* Analytics KPI Cards */}
      <div className="kdp-analytics-grid">
        <div className="kdp-stat-card">
          <span className="stat-subtitle">Gross Sales Volume</span>
          <strong className="stat-number">₹{analytics ? Number(analytics.grossRevenue).toFixed(0) : '0'}</strong>
          <span className="stat-hint">{analytics?.totalSalesCount || 0} Total Copies Sold</span>
        </div>

        <div className="kdp-stat-card">
          <span className="stat-subtitle">Platform Fee (3%)</span>
          <strong className="stat-number fee-color">₹{analytics ? Number(analytics.platformCommission).toFixed(2) : '0.00'}</strong>
          <span className="stat-hint">Platform upkeep &amp; hosting</span>
        </div>

        <div className="kdp-stat-card highlight-royalty">
          <span className="stat-subtitle">Your Net Royalties (97%)</span>
          <strong className="stat-number royalty-color">₹{analytics ? Number(analytics.netAuthorEarnings).toFixed(2) : '0.00'}</strong>
          <span className="stat-hint">97% credited to your balance</span>
        </div>

        <div className="kdp-stat-card wallet-card">
          <span className="stat-subtitle">Available Wallet Balance</span>
          <strong className="stat-number">₹{analytics ? Number(analytics.availableBalance).toFixed(2) : '0.00'}</strong>
          <button
            type="button"
            className="btn btn-primary btn-sm withdraw-btn"
            onClick={() => setShowPayoutModal(true)}
          >
            💳 Withdraw Royalty
          </button>
        </div>
      </div>

      {/* Bookshelf Section */}
      <section className="bookshelf-section">
        <div className="bookshelf-header">
          <h2>Your KDP Bookshelf ({books.length} Titles)</h2>
          <span className="bookshelf-sub">All formats: Kindle eBook &amp; Paperback Interior</span>
        </div>

        {books.length === 0 ? (
          <div className="empty-bookshelf">
            <span className="bookshelf-empty-icon">📚</span>
            <h3>No books published yet</h3>
            <p>Start self-publishing on KDP Cloud and earn 97% net royalties on every sale.</p>
            <Link to="/kdp/publish" className="btn btn-primary">
              + Publish Your First Title
            </Link>
          </div>
        ) : (
          <div className="bookshelf-table-wrap">
            <table className="bookshelf-table">
              <thead>
                <tr>
                  <th>Book Cover</th>
                  <th>Title &amp; Subtitle</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Kindle Price</th>
                  <th>Your Royalty (97%)</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {books.map((b) => (
                  <tr key={b.id}>
                    <td className="td-cover">
                      <img
                        src={b.thumbnailUrl || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=300&q=80'}
                        alt={b.title}
                        className="bookshelf-thumb-img"
                      />
                    </td>
                    <td className="td-title">
                      <strong className="book-name">{b.title}</strong>
                      {b.subtitle && <p className="book-sub">{b.subtitle}</p>}
                      <span className="book-isbn">By: {b.authorName || 'Abikumar Dharmaraj'} • {b.printLength || 33} pages</span>
                    </td>
                    <td><span className="category-tag">{b.category || 'eBook'}</span></td>
                    <td>
                      <span className="status-badge live">● LIVE</span>
                    </td>
                    <td><strong>₹{Number(b.price).toFixed(0)}</strong></td>
                    <td className="royalty-cell">
                      <strong>₹{(Number(b.price) * 0.97).toFixed(0)}</strong>
                      <span className="royalty-rate">(97%)</span>
                    </td>
                    <td>
                      <Link to={`/content/${b.id}`} className="btn btn-secondary btn-sm">
                        View in Store
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Payout History Ledger */}
      {payouts.length > 0 && (
        <section className="payout-history-section">
          <h2>Royalty Payout Ledger</h2>
          <div className="payout-table-wrap">
            <table className="payout-table">
              <thead>
                <tr>
                  <th>Requested Date</th>
                  <th>Amount</th>
                  <th>Method</th>
                  <th>Details</th>
                  <th>Status</th>
                  <th>Transaction Reference</th>
                </tr>
              </thead>
              <tbody>
                {payouts.map((p) => (
                  <tr key={p.id}>
                    <td>{new Date(p.requestedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                    <td><strong>₹{Number(p.amount).toFixed(2)}</strong></td>
                    <td><span className="method-tag">{p.payoutMethod}</span></td>
                    <td>{p.payoutDetails}</td>
                    <td>
                      <span className={`status-badge ${p.status === 'PROCESSED' ? 'live' : 'pending'}`}>
                        {p.status}
                      </span>
                    </td>
                    <td><code>{p.transactionRef || 'Processing in queue'}</code></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Withdraw Modal */}
      {showPayoutModal && (
        <div className="reader-modal-overlay">
          <div className="payout-modal-box">
            <div className="modal-header">
              <h3>Withdraw Royalty Balance</h3>
              <button type="button" className="close-btn" onClick={() => setShowPayoutModal(false)}>✕</button>
            </div>

            <form onSubmit={handleRequestPayout} className="payout-form">
              <p className="available-hint">
                Available to withdraw: <strong>₹{analytics ? Number(analytics.availableBalance).toFixed(2) : '0.00'}</strong>
              </p>

              <label>Withdrawal Amount (₹)</label>
              <input
                type="number"
                min="100"
                step="1"
                value={payoutAmount}
                onChange={(e) => setPayoutAmount(e.target.value)}
                placeholder="Enter amount (e.g. 500)"
                required
              />

              <label>Payout Method</label>
              <select value={payoutMethod} onChange={(e) => setPayoutMethod(e.target.value)}>
                <option value="UPI">Instant UPI (GPay / PhonePe / Paytm)</option>
                <option value="BANK_TRANSFER">NEFT / IMPS Bank Transfer</option>
              </select>

              <label>Payout Details (UPI ID / Account Number)</label>
              <input
                type="text"
                value={payoutDetails}
                onChange={(e) => setPayoutDetails(e.target.value)}
                placeholder={payoutMethod === 'UPI' ? 'yourname@upi' : 'A/C Number & IFSC'}
                required
              />

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowPayoutModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={submittingPayout}>
                  {submittingPayout ? 'Submitting...' : 'Confirm Withdrawal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
