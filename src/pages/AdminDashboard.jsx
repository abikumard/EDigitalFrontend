import { useEffect, useState } from 'react'
import { adminStats, adminPurchases } from '../api/admin.js'
import { errorMessage } from '../api/axiosClient.js'
import Loader from '../components/Loader.jsx'

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [recent, setRecent] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true
    Promise.all([adminStats(), adminPurchases()])
      .then(([statsRes, purchasesRes]) => {
        if (!mounted) return
        setStats(statsRes.data)
        setRecent(purchasesRes.data.slice(0, 8))
      })
      .catch((err) => { if (mounted) setError(errorMessage(err)) })
      .finally(() => { if (mounted) setLoading(false) })
    return () => { mounted = false }
  }, [])

  if (loading) return <Loader label="Loading dashboard..." />
  if (error) return <div className="alert alert-error">{error}</div>

  return (
    <div>
      <h1 className="page-title">Dashboard</h1>

      <div className="stat-grid">
        <div className="stat-card">
          <span className="stat-label">Total Visitors / Users</span>
          <span className="stat-value">{stats.totalUsers}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Videos/Items Purchased</span>
          <span className="stat-value">{stats.totalPurchases}</span>
        </div>
        <div className="stat-card highlight">
          <span className="stat-label">Total Revenue</span>
          <span className="stat-value">₹{Number(stats.totalRevenue).toFixed(0)}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Content Items Uploaded</span>
          <span className="stat-value">{stats.totalContentItems}</span>
        </div>
      </div>

      <h2 className="section-title">Recent purchases</h2>
      {recent.length === 0 ? (
        <div className="empty-state"><p>No purchases yet.</p></div>
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Content</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((p) => (
                <tr key={p.purchaseId}>
                  <td>{p.userEmail}</td>
                  <td>{p.contentTitle}</td>
                  <td><span className="type-badge inline">{p.contentType}</span></td>
                  <td>₹{Number(p.amount).toFixed(0)}</td>
                  <td>{new Date(p.purchasedAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
