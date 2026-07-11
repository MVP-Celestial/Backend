import React from 'react'
import { useAuth } from '../Hooks/useAuth'
import { useNavigate } from 'react-router'

const LogoutButton = () => {
  const { handleLogOut } = useAuth()
  const navigate = useNavigate()

  const onClick = async () => {
    await handleLogOut()
    navigate('/login')
  }

  return (
    <button onClick={onClick} style={styles.button}>
      Logout
    </button>
  )
}

const styles = {
  button: {
    background: 'transparent',
    border: '1px solid #ffffff40',
    color: '#fff',
    padding: '8px 16px',
    borderRadius: 8,
    cursor: 'pointer',
  },
}

export default LogoutButton