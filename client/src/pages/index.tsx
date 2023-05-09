import { useState, useEffect } from 'react'
import Canvas from '@/components/Canvas'
import Link from 'next/link'

export default function Home() {
    return (
        <div className="flex flex-col justify-center items-center h-screen w-screen">
            <Link href="/play" className="text-blue-500 hover:text-blue-800 font-bold text-2xl">
                PLAY
            </Link>
            <p className="text-blue-600">Queue: x</p>
        </div>
    )
}
