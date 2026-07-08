import React from 'react'
import { useAuth } from '../Hooks/useAuth'
import { useNavigate } from 'react-router'


const Protected = ({children}) => {


    const {user, loading} = useAuth()
    const navigate = useNavigate()

    
    if(loading) {
        return <h1>Loading</h1>
    }
    if( !user) {
        return <navigate to="/login"/>

    }


  return children
}

export default Protected