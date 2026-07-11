import React, { useEffect } from 'react'
import { useAuth } from '../Hooks/useAuth'
import { useNavigate } from 'react-router'

const Protected = ({ children }) => {
    const { user, loading } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        if (!loading && !user) {
            navigate("/login")
        }
    }, [loading, user, navigate])

    if (loading) {
        return <h1>Loading</h1>
    }

    if (!user) {
        return null
    }

    return children
}

export default Protected