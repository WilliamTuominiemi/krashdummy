import { io } from 'socket.io-client'

import React, { useRef, useEffect } from 'react'

const socket = io('http://localhost:8080')

const Canvas = (props: any) => {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (canvas) {
            const context = canvas.getContext('2d')
            if (context) {
                //Our first draw
                context.fillStyle = '#FFFFFF'
                context.fillRect(0, 0, context.canvas.width, context.canvas.height)

                const shortcut = (e: KeyboardEvent) => {
                    if (e.key === 'w') {
                        context.fillStyle = '#000000'
                        context.fillRect(1, 1, 10, 10)
                        socket.emit('place', 'test')
                    }

                    if (e.key === 's') {
                        console.log('KEY Z')
                        context.fillStyle = '#000000'
                        context.fillRect(1, 25, 10, 10)
                    }
                }

                document.addEventListener('keydown', shortcut)
                return () => document.removeEventListener('keydown', shortcut)
            }
        }
    }, [])

    return <canvas ref={canvasRef} {...props} />
}

export default Canvas
