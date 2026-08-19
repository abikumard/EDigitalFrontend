import { useEffect, useState } from 'react'
import { adminListSellers, adminApproveSeller, adminRejectSeller } from '../api/admin.js'
import { errorMessage } from '../api/axiosClient.js'
import Loader from '../components/Loader.jsx'

export default function AdminSellers() {
  const [sellers, setSellers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [busyId, setBusyId] = useState(null)

  function load() {
    setLoading(true)
    adminListSellers()
      .then((res) => setSellers(res.data))
      .catch((err) => setError(errorMessage(err)))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  async function handleApprove(id) {
    setBusyId(id)
    try {
      await adminApproveSeller(id)
      load()
    } catch (err) {
      alert(errorMessage(err))
    } finally {
      setBusyId(null)
    }
  }

  async function handleReject(id) {
    const reason = window.prompt('Reason for rejecting (shown to the applicant, optional):') || ''
    setBusyId(id)
    try {
      await adminRejectSeller(id, reason)
      load()
    } catch (err) {
      alert(errorMessage(err))
    } finally {
      setBusyId(null)
    }
  }

  if (loading) return <Loader label="Loading seller applications..." />
  if (error) return <div className="alert alert-error">{error}</div>

  return (
    <div>
      <h1 className="page-title">Seller Applications</h1>
      {sellers.length === 0 ? (
        <div className="empty-state"><p>No seller applications yet.</p></div>
      ) : (
        <div className="admin-sellers-list">
          {sellers.map((s) => (
            <div className="admin-seller-card" key={s.id}>
              <div className="admin-seller-header">
                <h3>{s.businessName}</h3>
                <span className={'status-pill ' + (s.status === 'APPROVED' ? 'unlocked' : s.status === 'REJECTED' ? '' : 'locked')}>
                  {s.status}
                </span>
              </div>
              <div className="admin-seller-grid">
                <div><span>User</span><strong>{s.userEmail || s.userMobile}</strong></div>
                <div><span>Account holder</span><strong>{s.accountHolderName}</strong></div>
                <div><span>Bank account no.</span><strong>{s.bankAccountNumber}</strong></div>
                <div><span>IFSC</span><strong>{s.ifscCode}</strong></div>
                <div><span>Bank</span><strong>{s.bankName}</strong></div>
                <div><span>PAN</span><strong>{s.panNumber}</strong></div>
                <div><span>Phone</span><strong>{s.phone}</strong></div>
                <div><span>Address</span><strong>{s.address}</strong></div>
                <div><span>Applied</span><strong>{new Date(s.appliedAt).toLocaleDateString('en-IN')}</strong></div>
              </div>
              {s.status === 'PENDING' && (
                <div className="admin-content-actions">
                  <button className="btn btn-primary btn-sm" disabled={busyId === s.id} onClick={() => handleApprove(s.id)}>Approve</button>
                  <button className="btn btn-danger btn-sm" disabled={busyId === s.id} onClick={() => handleReject(s.id)}>Reject</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
