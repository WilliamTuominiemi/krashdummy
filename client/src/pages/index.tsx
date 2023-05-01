import { useState, useEffect } from 'react'
import Canvas from '@/components/Canvas'

export default function Home() {
    const [resolution, setResolution] = useState<any[]>([])

    useEffect(() => {
        console.log('window.innerHeight', window.innerHeight)
        setResolution([window.innerWidth, window.innerHeight])
    }, [])

    return (
        <div className="flex justify-center items-center h-screen w-screen">
            <Canvas
                width={Math.round(resolution[0] / 2 / 10) * 10}
                height={Math.round((resolution[1] * (2 / 3)) / 10) * 10}
            />
        </div>
    )
}
