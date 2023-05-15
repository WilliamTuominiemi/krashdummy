import { useState, useEffect } from 'react'
import Canvas from '@/components/Canvas'
import Link from 'next/link'

import { io } from 'socket.io-client'
const socket = io('http://localhost:8080')

export default function Home() {
    const [roomSize, setRoomSize] = useState(0)

    useEffect(() => {
        socket.emit('get_room')
        socket.on('get_room', (room) => {
            setRoomSize(room)
        })
    }, [])

    return (
        <div className="flex flex-col justify-center items-center h-screen w-screen">
            {roomSize < 2 ? (
                <Link href="/play" className="text-blue-500 hover:text-blue-800 font-bold text-2xl">
                    PLAY
                </Link>
            ) : (
                <h1 className="text-blue-500 font-bold text-2xl">THE ROOM IS CURRENTLY FULL</h1>
            )}
            <p className="text-blue-600">Players: {roomSize}</p>
        </div>
    )
}
