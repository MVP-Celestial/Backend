import React, { useState } from 'react'
import '../style/login.scss'
import { Link } from 'react-router'
import { useAuth } from '../Hooks/useAuth'
import { useNavigate } from 'react-router'

const Login = () => {
  const { handleLogin } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await handleLogin({ email, password })
      navigate('/')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="form-page">
      <div className="form-container">
        <div className="form-brand">
          <div className="form-icon">♪</div>
          <h1 className="form-title">Welcome back</h1>
          <p className="form-subtitle">Sign in to continue your mood journey.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Logging in...' : 'LOGIN'}
          </button>
        </form>

        <p className="form-switch">
          Don’t have an account?
          <Link to="/register" className="form-link">Register</Link>
        </p>
      </div>
    </div>
  )
}

export default Login