import React from 'react'
import { Link } from 'react-router'

const Register = () => {
  return (
    <div>
         <div>
        <div className="form-page">
            <div className="form-container">
                <h1>Register</h1>
                <form >
                    <input type="text" placeholder='Username' />
                    <input type="text" placeholder='Email' />
                    <input type="text" placeholder='password' />
                    <button>LOGIN</button>

                    <h1> have an account ? <Link to="/login">Login</Link></h1>


                </form>
            </div>
        </div>
    </div>
    </div>
  )
}

export default Register