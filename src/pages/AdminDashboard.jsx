import { useEffect, useState } from 'react'
import { getAdminMetrics, getPendingPayouts, approvePayout } from '../api/admin.js'
import { errorMessage } from '../api/axiosClient.js'
import Loader from '../components/Loader.jsx'

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState(null)
  const [pendingPayouts, setPendingPayouts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [approvingId, setApprovingId] = useState(null)

  function load() {
    setLoading(true)
    Promise.all([
      getAdminMetrics(),
      getPendingPayouts().catch(() => ({ data: [] }))
    ])
      .then(([mRes, pRes]) => {
        setMetrics(mRes.data)
        setPendingPayouts(pRes.data)
      })
      .catch((err) => setError(errorMessage(err, 'Failed to load admin metrics.')))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  async function handleApprovePayout(id) {
    setError('')
    setSuccess('')
    setApprovingId(id)
    try {
      const ref = `BANK_TXN_${Date.now()}`
      await approvePayout(id, ref)
      setSuccess(`Payout #${id} approved! Ref: ${ref}`)
      load()
    } catch (err) {
      setError(errorMessage(err, 'Failed to approve payout.'))
    } finally {
      setApprovingId(null)
    }
  }

  if (loading) return <Loader label="Loading KDP Cloud Admin..." />

  return (
    <div className="admin-container">
      <h1 className="page-title">📊 KDP Cloud Platform Administration</h1>

      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      {/* Platform Financial & Growth KPIs */}
      <div className="admin-stat-grid">
        <div className="admin-card">
          <span className="stat-label">Total Platform Readers / Users</span>
          <span className="stat-value">{metrics?.totalUsers || 0}</span>
        </div>

        <div className="admin-card">
          <span className="stat-label">Registered Publishers &amp; Authors</span>
          <span className="stat-value">{metrics?.totalPublishers || 0}</span>
        </div>

        <div className="admin-card">
          <span className="stat-label">Total Published Books</span>
          <span className="stat-value">{metrics?.totalBooks || 0}</span>
        </div>

        <div className="admin-card highlight-vol">
          <span className="stat-label">Gross Platform Sales Volume</span>
          <span className="stat-value">₹{metrics ? Number(metrics.grossVolume).toFixed(0) : '0'}</span>
        </div>

        <div className="admin-card highlight-profit">
          <span className="stat-label">Platform 3% Commission Profit</span>
          <span className="stat-value">₹{metrics ? Number(metrics.platform3PercentProfit).toFixed(2) : '0.00'}</span>
        </div>
      </div>

      {/* Publisher Payout Queue */}
      <section className="admin-section" style={{ marginTop: 32 }}>
        <div className="section-header">
          <h2>💳 Publisher Royalty Withdrawal Queue ({pendingPayouts.length} Pending)</h2>
        </div>

        {pendingPayouts.length === 0 ? (
          <div className="empty-state">
            <p>✓ All publisher royalty payouts are up to date. No pending withdrawals.</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Request ID</th>
                  <th>Amount</th>
                  <th>Method</th>
                  <th>Payout Credentials</th>
                  <th>Requested Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {pendingPayouts.map((pr) => (
                  <tr key={pr.id}>
                    <td>#{pr.id}</td>
                    <td><strong style={{ color: '#16a34a' }}>₹{Number(pr.amount).toFixed(2)}</strong></td>
                    <td><span className="method-tag">{pr.payoutMethod}</span></td>
                    <td>{pr.payoutDetails}</td>
                    <td>{new Date(pr.requestedAt).toLocaleString()}</td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        onClick={() => handleApprovePayout(pr.id)}
                        disabled={approvingId === pr.id}
                      >
                        {approvingId === pr.id ? 'Approving...' : '✓ Approve & Transfer'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}
