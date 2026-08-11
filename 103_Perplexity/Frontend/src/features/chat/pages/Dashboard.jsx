import React from 'react'
import {useSelector} from "react-redux"

const dashboard = () => {
    const {user } = useSelector((state) => state.auth)
    console.log('User from Redux store:', user)
  return (
    <div>dashboard</div>
  )
}

export default dashboard