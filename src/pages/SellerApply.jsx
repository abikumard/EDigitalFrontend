import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { applySeller, getSellerStatus } from '../api/seller.js'
import { errorMessage } from '../api/axiosClient.js'
import { useAuth } from '../context/AuthContext.jsx'
import Loader from '../components/Loader.jsx'
import SellerProductManager from '../components/SellerProductManager.jsx'

const emptyForm = {
  businessName: '', accountHolderName: '', bankAccountNumber: '', ifscCode: '',
  bankName: '', panNumber: '', phone: '', address: '',
}

export default function SellerApply() {
  const { isAuthenticated } = useAuth()
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(emptyForm)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false)
      return
    }
    getSellerStatus()
      .then((res) => setStatus(res.data))
      .catch(() => setStatus({ hasApplied: false }))
      .finally(() => setLoading(false))
  }, [isAuthenticated])

  function update(field) {
    return (e) => setForm({ ...form, [field]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    const ifsc = form.ifscCode.trim().toUpperCase()
    const pan = form.panNumber.trim().toUpperCase()
    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifsc)) return setError('Enter a valid IFSC code (e.g. HDFC0001234).')
    if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan)) return setError('Enter a valid PAN number (e.g. ABCDE1234F).')
    if (!Object.values(form).every((v) => v.trim())) return setError('Please fill in every field — none can be left blank.')

    setSubmitting(true)
    try {
      const res = await applySeller({ ...form, ifscCode: ifsc, panNumber: pan })
      setStatus(res.data)
    } catch (err) {
      setError(errorMessage(err, 'Could not submit your application.'))
    } finally {
      setSubmitting(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="page-container">
        <h1 className="page-title">Become a Seller</h1>
        <p className="empty-state">
          Please <Link to="/login" state={{ from: '/sell' }}>log in</Link> or{' '}
          <Link to="/signup">create an account</Link> first — you'll need to be logged in to apply as a seller.
        </p>
      </div>
    )
  }

  if (loading) return <div className="page-container"><Loader label="Checking your seller status..." /></div>

  if (status?.hasApplied) {
    return (
      <div className="page-container">
        <h1 className="page-title">Seller Application</h1>
        <div className="account-card">
          <div className="account-row">
            <span>Business name</span>
            <strong>{status.businessName}</strong>
          </div>
          <div className="account-row">
            <span>Status</span>
            <span className={'status-pill ' + (status.status === 'APPROVED' ? 'unlocked' : status.status === 'REJECTED' ? '' : 'locked')}>
              {status.status}
            </span>
          </div>
        </div>
        {status.status === 'PENDING' && (
          <p className="empty-state">Your application is under review. We'll get back to you soon.</p>
        )}
        {status.status === 'APPROVED' && (
          <div style={{ marginTop: 24 }}>
            <div className="alert alert-success">You're an approved seller — manage your products below.</div>
            <SellerProductManager />
          </div>
        )}
        {status.status === 'REJECTED' && (
          <div className="alert alert-error">
            Your application wasn't approved{status.rejectionReason ? `: ${status.rejectionReason}` : '.'}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="page-container">
      <h1 className="page-title">Become a Seller</h1>
      <p className="detail-description">Fill in your business and bank details below. Our team reviews every application before approving — every field is required.</p>

      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSubmit} className="admin-form seller-form">
        <label>Business / Store name</label>
        <input type="text" value={form.businessName} onChange={update('businessName')} required />

        <label>Account holder name</label>
        <input type="text" value={form.accountHolderName} onChange={update('accountHolderName')} required />

        <div className="form-row">
          <div>
            <label>Bank account number</label>
            <input type="text" inputMode="numeric" value={form.bankAccountNumber} onChange={update('bankAccountNumber')} required />
          </div>
          <div>
            <label>IFSC code</label>
            <input type="text" value={form.ifscCode} onChange={update('ifscCode')} placeholder="HDFC0001234" required />
          </div>
        </div>

        <label>Bank name</label>
        <input type="text" value={form.bankName} onChange={update('bankName')} required />

        <div className="form-row">
          <div>
            <label>PAN number</label>
            <input type="text" value={form.panNumber} onChange={update('panNumber')} placeholder="ABCDE1234F" required />
          </div>
          <div>
            <label>Phone number</label>
            <input type="text" inputMode="numeric" value={form.phone} onChange={update('phone')} required />
          </div>
        </div>

        <label>Address</label>
        <textarea rows={3} value={form.address} onChange={update('address')} required />

        <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
          {submitting ? 'Submitting...' : 'Submit Application'}
        </button>
      </form>
    </div>
  )
}
