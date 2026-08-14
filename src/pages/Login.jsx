import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { login as loginRequest } from '../api/auth.js'
import { errorMessage } from '../api/axiosClient.js'
import { useAuth } from '../context/AuthContext.jsx'
import PasswordInput from '../components/PasswordInput.jsx'

export default function Login() {
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const redirectTo = location.state?.from || '/'
  const justSignedUp = Boolean(location.state?.justSignedUp)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!identifier.trim() || !password) {
      setError('Please enter your email/mobile and password.')
      return
    }
    setLoading(true)
    try {
      const res = await loginRequest(identifier.trim(), password)
      login(res.data.token, {
        id: res.data.userId,
        email: res.data.email,
        mobile: res.data.mobile,
        name: res.data.name,
      })
      navigate(redirectTo, { replace: true })
    } catch (err) {
      setError(errorMessage(err, 'Incorrect email/mobile or password.'))
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
          <h1>Welcome back</h1>
          <p>Log in with your email or mobile number.</p>
        </div>

        {justSignedUp && (
          <div className="alert alert-info">Account created! Please log in to continue.</div>
        )}
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
            placeholder="Your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button className="btn btn-primary btn-block" type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Log In'}
          </button>

          <p className="auth-switch">
            New here? <Link to="/signup">Create an account</Link>
          </p>
        </form>
      </div>
    </div>
  )
}
