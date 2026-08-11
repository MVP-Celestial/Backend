import React, {useEffect} from 'react'
import {useSelector} from "react-redux"
import { useChat } from '../hooks/useChat'


const dashboard = () => {

  const chat = useChat()

    const { user } = useSelector((state) => state.auth)
    console.log('User from Redux store:', user)

    useEffect(() => {
      chat.initializeSocketConnection()
    }, [])


  return (
    <div>dashboard</div>
  )
}

export default dashboard