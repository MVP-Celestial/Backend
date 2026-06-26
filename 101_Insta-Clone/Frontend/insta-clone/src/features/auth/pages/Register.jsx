import React, { useState } from 'react'
import { Link } from 'react-router'
import axios from 'axios'


const Register = () => {
  
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  
  async function handleFormSubmit(e) {
    e.preventDefault()
    axios.post("http://localhost:3000/api/auth/register", {
      username,
      email,
      password
    },{
      withCredentials: true
    }).then(res => {
      console.log(res.data);
    })
    
  }
  return (
    <div>
      <main>

       <form onSubmit={handleFormSubmit}>
        <h1>Register</h1>
            <input
            onInput={(e)=>{setUsername(e.target.value)}}
            type="text" 
            name='username'
            placeholder='Enter Username' />

            <input
            onInput={(e)=>{setEmail(e.target.value)}}
            type="text" name='email' placeholder='Enter your email' />
            <input onInput={(e)=>{setPassword(e.target.value)}} type="text" name='password' placeholder='Enter your password' />
            <button>Register</button>
            <h3>Already Registered ? <Link to="/Login"> Login Here</Link></h3>
        </form>
      </main>
    </div>
    
  )
}

export default Register