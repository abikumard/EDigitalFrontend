import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signup } from '../api/auth.js'
import { errorMessage } from '../api/axiosClient.js'
import PasswordInput from '../components/PasswordInput.jsx'

export default function Signup() {
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!identifier.trim()) {
      setError('Please enter your email or mobile number.')
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
      await signup(identifier.trim(), password, confirmPassword)
      navigate('/login', { state: { justSignedUp: true } })
    } catch (err) {
      setError(errorMessage(err, 'Could not create your account. Please try again.'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <Link to="/" className="admin-back-link">← Back to site</Link>
        <div className="auth-header">
          <span className="brand-mark lg">MV</span>
          <h1>Create your account</h1>
          <p>Sign up to buy and access content on MediaVault.</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <label htmlFor="identifier">Email or Mobile Number</label>
          <input
            id="identifier"
            type="text"
            placeholder="you@example.com or 98765 43210"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            autoFocus
            required
          />

          <label htmlFor="password">Password</label>
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

          <button className="btn btn-primary btn-block" type="submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>

          <p className="auth-switch">
            Already have an account? <Link to="/login">Log in</Link>
          </p>
        </form>
      </div>
    </div>
  )
}
