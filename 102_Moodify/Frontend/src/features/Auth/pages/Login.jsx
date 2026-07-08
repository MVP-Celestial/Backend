import React, { useState } from 'react'
import "../style/login.scss"
import { Link } from 'react-router'
import { useAuth } from '../Hooks/useAuth'
import { useNavigate } from 'react-router'


const Login = () => {

    const { loading, handleLogin } = useAuth()
    const navigate = useNavigate()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    async function handleSubmit(e) {
        e.preventDefault()
        await handleLogin({ email, password })
        navigate("/")
    }

    return (
        <div className="form-page">
            <div className="form-container">
                <h1>LOGIN</h1>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder='Email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder='Password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button>
                        {loading ? "Logging in..." : "LOGIN"}
                    </button>
                </form>
                <h1>Don't have an account? <Link to="/register">Register</Link></h1>
            </div>
        </div>
    )
}

export default Login