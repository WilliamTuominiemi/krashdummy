import { useState, useEffect } from 'react'
import Canvas from '@/components/Canvas'

export default function Home() {
    useEffect(() => {}, [])

    return (
        <>
            <h1 className="text-lg p-5">KrashDummy</h1>
            <Canvas />
        </>
    )
}
