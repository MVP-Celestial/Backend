import React, { useState } from 'react'
import '../pages/style/form.scss'
import { Link, useNavigate } from 'react-router'
import axios from 'axios' 
import { useAuth } from '../hooks/useAuth'


const Login = () => {         

  const [username, setusername] = useState("")
  const [password, setPassword] = useState("")
  const {handleLogin, loading} = useAuth()
  const navigate = useNavigate()

  if (loading) {
    return(
      <h1>Loading...</h1>
    )
  }

  async function handleFormSubmit(e) {
    e.preventDefault();

    try {
        const res = await handleLogin(username, password);

        console.log(res);

        navigate("/");
    } catch (err) {
        alert(err.response?.data?.message || "Login failed");
    }
}

  
  return (
    <main>

    <div>
        <form onSubmit={handleFormSubmit}>
        <h1>Login</h1>
            <input onInput={(e)=>setusername(e.target.value)} type="text" name='username' placeholder='Enter Username' />
            <input onInput={(e)=>{setPassword(e.target.value)}} type="text" name='password' placeholder='Enter your password' />
            <button>Submit</button>
            <h3>Dont have an account ?<Link to="/Register"> Register here</Link> </h3>
        </form>
    </div>
  </main>
  )
}

export default Login


/*
What it does ?
Shows username/email input
Shows password input
Handles button clicks
Calls handleLogin()
Redirects user after login
 */
