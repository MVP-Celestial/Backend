import React from 'react'
import "../style/login.scss"
import { Link } from 'react-router'

const Login = () => {
  return (
    <div>
        <div className="form-page">
            <div className="form-container">
                <h1>LOGIN</h1>
                <form >
                    <input type="text" placeholder='Email' />
                    <input type="text" placeholder='password' />
                    <button>LOGIN</button>


                </form>
                <h1>Dont have an account ? <Link to="/register">Register</Link></h1>
            </div>
        </div>
    </div>
  )
}

export default Login