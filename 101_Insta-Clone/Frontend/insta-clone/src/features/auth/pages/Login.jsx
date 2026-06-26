import React, { useState } from 'react'
import '../pages/style/form.scss'
import { Link } from 'react-router'
import axios from 'axios' 

const Login = () => {         

  const [username, setusername] = useState("")
  const [password, setPassword] = useState("")

  async function handleFormSubmit(e) {
    e.preventDefault()
    
  }

  
  return (
    <main>

    <div>
        <form onSubmit={()=>{handleFormSubmit}}>
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