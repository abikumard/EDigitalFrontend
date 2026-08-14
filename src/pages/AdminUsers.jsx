import React, { useEffect, useState } from 'react'
import { adminUsers, adminUserDetail } from '../api/admin.js'
import { errorMessage } from '../api/axiosClient.js'
import Loader from '../components/Loader.jsx'

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [expandedId, setExpandedId] = useState(null)
  const [detail, setDetail] = useState(null)
  const [detailLoading, setDetailLoading] = useState(false)

  useEffect(() => {
    adminUsers()
      .then((res) => setUsers(res.data))
      .catch((err) => setError(errorMessage(err)))
      .finally(() => setLoading(false))
  }, [])

  function toggleExpand(user) {
    if (expandedId === user.id) {
      setExpandedId(null)
      setDetail(null)
      return
    }
    setExpandedId(user.id)
    setDetail(null)
    setDetailLoading(true)
    adminUserDetail(user.id)
      .then((res) => setDetail(res.data))
      .catch((err) => setDetail({ error: errorMessage(err) }))
      .finally(() => setDetailLoading(false))
  }

  if (loading) return <Loader label="Loading users..." />
  if (error) return <div className="alert alert-error">{error}</div>

  return (
    <div>
      <h1 className="page-title">Users</h1>

      {users.length === 0 ? (
        <div className="empty-state"><p>No users have logged in yet.</p></div>
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Email / Mobile</th>
                <th>Joined</th>
                <th>Last login</th>
                <th>Purchases</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <React.Fragment key={u.id}>
                  <tr className="clickable-row" onClick={() => toggleExpand(u)}>
                    <td>{u.email || u.mobile}</td>
                    <td>{new Date(u.joinedAt).toLocaleDateString()}</td>
                    <td>{u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleString() : '—'}</td>
                    <td>{u.purchaseCount}</td>
                    <td className="expand-indicator">{expandedId === u.id ? '▲' : '▼'}</td>
                  </tr>
                  {expandedId === u.id && (
                    <tr className="expand-row">
                      <td colSpan={5}>
                        {detailLoading && <Loader label="Loading purchases..." />}
                        {detail?.error && <div className="alert alert-error">{detail.error}</div>}
                        {detail && !detail.error && (
                          detail.purchases?.length ? (
                            <table className="data-table nested">
                              <thead>
                                <tr>
                                  <th>Content</th>
                                  <th>Type</th>
                                  <th>Amount</th>
                                  <th>Purchased on</th>
                                </tr>
                              </thead>
                              <tbody>
                                {detail.purchases.map((p) => (
                                  <tr key={p.purchaseId}>
                                    <td>{p.contentTitle}</td>
                                    <td><span className="type-badge inline">{p.contentType}</span></td>
                                    <td>₹{Number(p.amount).toFixed(0)}</td>
                                    <td>{new Date(p.purchasedAt).toLocaleString()}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          ) : (
                            <p className="muted">This user hasn't purchased anything yet.</p>
                          )
                        )}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
