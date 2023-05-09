import { useState, useEffect } from 'react'
import Canvas from '@/components/Canvas'
import Link from 'next/link'

export default function Home() {
    return (
        <div className="flex justify-center items-center h-screen w-screen">
            <Link href="/play">PLAY</Link>
        </div>
    )
}
