import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signup, login as loginRequest } from '../api/auth.js'
import { errorMessage } from '../api/axiosClient.js'
import { useAuth } from '../context/AuthContext.jsx'
import PasswordInput from '../components/PasswordInput.jsx'

export default function Signup() {
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [alreadyExists, setAlreadyExists] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setAlreadyExists(false)

    const cleanIdentifier = identifier.trim()
    if (!cleanIdentifier) {
      setError('Please enter your email or 10-digit mobile number.')
      return
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters long.')
      return
    }
    if (password !== confirmPassword) {
      setError('Password and Confirm Password do not match.')
      return
    }

    setLoading(true)
    try {
      const res = await signup(cleanIdentifier, password, confirmPassword)
      
      // If backend returned auth response directly
      if (res.data?.token) {
        login(res.data.token, {
          id: res.data.userId,
          email: res.data.email,
          mobile: res.data.mobile,
          name: res.data.name,
        })
        navigate('/library', { state: { justSignedUp: true } })
        return
      }

      // If backend returned a generic success message, log in automatically
      const loginRes = await loginRequest(cleanIdentifier, password)
      login(loginRes.data.token, {
        id: loginRes.data.userId,
        email: loginRes.data.email,
        mobile: loginRes.data.mobile,
        name: loginRes.data.name,
      })
      navigate('/library', { state: { justSignedUp: true } })
    } catch (err) {
      const msg = errorMessage(err, 'Could not create your account. Please try again.')
      setError(msg)
      if (msg.toLowerCase().includes('already exists')) {
        setAlreadyExists(true)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <Link to="/" className="admin-back-link">← Back to Store</Link>
        <div className="auth-header">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '1.8rem' }}>📚</span>
            <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-primary-dark, #0284c7)', letterSpacing: '-0.02em' }}>
              DigitalDeals
            </span>
          </div>
          <h1>Create your account</h1>
          <p>Join thousands of authors and readers on DigitalDeals.</p>
        </div>

        {error && (
          <div className="alert alert-error">
            {error}
            {alreadyExists && (
              <div style={{ marginTop: '0.5rem' }}>
                <Link 
                  to="/login" 
                  state={{ identifier }} 
                  style={{ color: 'var(--color-primary, #0284c7)', fontWeight: 700, textDecoration: 'underline' }}
                >
                  Click here to Log in instead →
                </Link>
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <label htmlFor="identifier">Email or Mobile Number</label>
          <input
            id="identifier"
            type="text"
            placeholder="you@example.com or 10-digit mobile"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            autoFocus
            required
          />

          <label htmlFor="password">Password (min 8 characters)</label>
          <PasswordInput
            id="password"
            placeholder="At least 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={8}
            required
          />

          <label htmlFor="confirmPassword">Confirm Password</label>
          <PasswordInput
            id="confirmPassword"
            placeholder="Re-enter your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            minLength={8}
            required
          />

          <button className="btn btn-primary btn-block" type="submit" disabled={loading} style={{ marginTop: '0.5rem' }}>
            {loading ? 'Creating account...' : 'Create Account & Start Reading'}
          </button>

          <p className="auth-switch">
            Already have an account? <Link to="/login" state={{ identifier }}>Log in</Link>
          </p>
        </form>
      </div>
    </div>
  )
}
