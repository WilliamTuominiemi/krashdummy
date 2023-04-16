import React, { useEffect, useState } from 'react'
import { io } from 'socket.io-client'

const socket = io('http://localhost:8080')

const Home = () => {
    useEffect(() => {
        socket.on('connect', () => {
            console.log(`You connected with id: ${socket.id}`)
        })
    })

    return (
        <div>
            <h1>KRash</h1>
        </div>
    )
}

export default Home
