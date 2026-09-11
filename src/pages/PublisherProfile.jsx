import { useEffect, useState } from 'react'
import { getPublisherProfile, updatePublisherProfile, getPublisherAnalytics, requestPayout } from '../api/seller.js'
import { errorMessage } from '../api/axiosClient.js'
import Loader from '../components/Loader.jsx'

export default function PublisherProfile() {
  const [profile, setProfile] = useState(null)
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  // Form Fields
  const [penName, setPenName] = useState('')
  const [bio, setBio] = useState('')
  const [accountHolderName, setAccountHolderName] = useState('')
  const [bankAccountNumber, setBankAccountNumber] = useState('')
  const [ifscCode, setIfscCode] = useState('')
  const [bankName, setBankName] = useState('')
  const [upiId, setUpiId] = useState('')
  const [panNumber, setPanNumber] = useState('')
  const [phone, setPhone] = useState('')

  useEffect(() => {
    let mounted = true
    Promise.all([
      getPublisherProfile(),
      getPublisherAnalytics().catch(() => ({ data: null }))
    ])
      .then(([profRes, aRes]) => {
        if (!mounted) return
        const p = profRes.data
        setProfile(p)
        setPenName(p.penName || '')
        setBio(p.bio || '')
        setAccountHolderName(p.accountHolderName || '')
        setBankAccountNumber(p.bankAccountNumber || '')
        setIfscCode(p.ifscCode || '')
        setBankName(p.bankName || '')
        setUpiId(p.upiId || '')
        setPanNumber(p.panNumber || '')
        setPhone(p.phone || '')
        setAnalytics(aRes.data)
      })
      .catch((err) => setError(errorMessage(err, 'Could not load publisher profile.')))
      .finally(() => setLoading(false))
    return () => { mounted = false }
  }, [])

  async function handleSave(e) {
    e.preventDefault()
    setError('')
    setSuccess('')
    setSaving(true)

    try {
      const res = await updatePublisherProfile({
        penName,
        bio,
        accountHolderName,
        bankAccountNumber,
        ifscCode,
        bankName,
        upiId,
        panNumber,
        phone
      })
      setProfile(res.data)
      setSuccess('Publisher & Bank payout details saved successfully!')
    } catch (err) {
      setError(errorMessage(err, 'Failed to update profile.'))
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="page-container"><Loader label="Loading Publisher Profile..." /></div>

  return (
    <div className="publisher-profile-container">
      <div className="profile-header">
        <h1>👤 Publisher Profile &amp; Bank Settings</h1>
        <p>Manage your author pen name, biography, and verified bank/UPI payout credentials.</p>
      </div>

      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      {/* Wallet Balance Summary */}
      <div className="wallet-balance-banner">
        <div className="wallet-info">
          <span className="wallet-label">Available Royalty Balance</span>
          <strong className="wallet-amt">₹{analytics ? Number(analytics.availableBalance).toFixed(2) : '0.00'}</strong>
          <span className="wallet-rate">97% Net Payout Guarantee</span>
        </div>
        <div className="wallet-badge">
          <span>✓ Direct Bank &amp; UPI Enabled</span>
        </div>
      </div>

      {/* Profile & Payout Form */}
      <form onSubmit={handleSave} className="publisher-settings-form">
        <section className="form-section">
          <h3>Author &amp; Pen Name Information</h3>
          <div className="form-row-2">
            <div className="wizard-form-group">
              <label>Pen Name / Author Name *</label>
              <input
                type="text"
                value={penName}
                onChange={(e) => setPenName(e.target.value)}
                placeholder="e.g. Abikumar Dharmaraj"
                required
              />
            </div>
            <div className="wizard-form-group">
              <label>Contact Phone Number *</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="9876543210"
                required
              />
            </div>
          </div>

          <div className="wizard-form-group">
            <label>Author Biography</label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell your readers about yourself and your background."
            />
          </div>
        </section>

        <section className="form-section">
          <h3>Bank Payout &amp; UPI Credentials</h3>
          <p className="section-sub">Earnings will be transferred to these details when you request withdrawals.</p>

          <div className="form-row-2">
            <div className="wizard-form-group">
              <label>Bank Account Holder Name *</label>
              <input
                type="text"
                value={accountHolderName}
                onChange={(e) => setAccountHolderName(e.target.value)}
                required
              />
            </div>
            <div className="wizard-form-group">
              <label>Bank Name *</label>
              <input
                type="text"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                placeholder="e.g. State Bank of India / HDFC"
                required
              />
            </div>
          </div>

          <div className="form-row-2">
            <div className="wizard-form-group">
              <label>Bank Account Number *</label>
              <input
                type="text"
                value={bankAccountNumber}
                onChange={(e) => setBankAccountNumber(e.target.value)}
                required
              />
            </div>
            <div className="wizard-form-group">
              <label>IFSC Code *</label>
              <input
                type="text"
                value={ifscCode}
                onChange={(e) => setIfscCode(e.target.value)}
                placeholder="SBIN0001234"
                required
              />
            </div>
          </div>

          <div className="form-row-2">
            <div className="wizard-form-group">
              <label>Instant Payout UPI ID (GPay / PhonePe / Paytm)</label>
              <input
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="author@upi"
              />
            </div>
            <div className="wizard-form-group">
              <label>PAN Card Number</label>
              <input
                type="text"
                value={panNumber}
                onChange={(e) => setPanNumber(e.target.value)}
                placeholder="ABCDE1234F"
              />
            </div>
          </div>
        </section>

        <button type="submit" className="btn btn-primary btn-lg save-profile-btn" disabled={saving}>
          {saving ? 'Saving Settings...' : 'Save Changes'}
        </button>
      </form>
    </div>
  )
}
