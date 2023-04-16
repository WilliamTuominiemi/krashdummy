import { useState, useEffect } from 'react'
import { io } from 'socket.io-client'

const socket = io('http://localhost:8080')

export default function Home() {
    useEffect(() => {}, [])

    return (
        <div>
            <h1 className="text-lg p-5">Krash</h1>
            <button>PLAY</button>
        </div>
    )
}
