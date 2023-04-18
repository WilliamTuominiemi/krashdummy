import { useState, useEffect } from 'react'
import Canvas from '@/components/Canvas'

export default function Home() {
    useEffect(() => {}, [])

    return (
        <div className="flex justify-center items-center h-screen w-screen">
            <Canvas width={window.outerHeight} height={window.outerHeight} />
        </div>
    )
}
