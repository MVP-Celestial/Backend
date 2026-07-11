import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../Hooks/useAuth'
import '../style/login.scss'

const Register = () => {
  const { handleRegister } = useAuth()
  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await handleRegister({ username, email, password })
      navigate('/')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="form-page">
      <div className="form-container">
        <div className="form-brand">
          <div className="form-icon">✦</div>
          <h1 className="form-title">Create account</h1>
          <p className="form-subtitle">Join Moodify and start your personal soundtrack.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
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
            {isSubmitting ? 'Registering...' : 'Register'}
          </button>
        </form>

        <p className="form-switch">
          Already have an account?
          <Link to="/login" className="form-link">Login</Link>
        </p>
      </div>
    </div>
  )
}

export default Register;