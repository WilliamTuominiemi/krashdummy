import { useState, useEffect } from 'react'
import Canvas from '@/components/Canvas'

export default function Home() {
    useEffect(() => {}, [])

    return (
        <div>
            <h1 className="text-lg p-5">Krash</h1>
            <button>PLAY</button>
            <div className="outline">
                <Canvas />
            </div>
        </div>
    )
}
