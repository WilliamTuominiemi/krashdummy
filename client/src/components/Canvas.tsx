import { io } from 'socket.io-client'

import React, { useRef, useEffect } from 'react'

const socket = io('http://localhost:8080')

const Canvas = (props: any) => {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    let mouseX: number
    let mouseY: number

    useEffect(() => {
        
        
        const canvas = canvasRef.current
        if (canvas) {
            const context = canvas.getContext('2d')
            const canvasRect = canvas.getBoundingClientRect();

            if (context) {
                canvas.height = window.innerHeight * (2 /3) ;
                canvas.width = window.innerWidth / 2;
                const width = canvas.width;
                const height = canvas.height;

                console.log(`[${width}, ${height}]`)

                context.fillStyle = '#FFFFFF'
                context.fillRect(0, 0, context.canvas.width, context.canvas.height)

                 canvas.addEventListener('mousemove', (e) => {
                    mouseX = e.clientX - canvasRect.left;
                    mouseY = e.clientY - canvasRect.top;

                    console.log(`client: ${e.clientX}, ${e.clientY}`)
                    console.log(`rect: ${canvasRect.left}, ${canvasRect.top}`)

                    console.log(`[${mouseX}, ${mouseY}]`)

                    context.beginPath();
                    context.arc(mouseX,mouseY, 1, 0, Math.PI*2, false);
                    context.fillStyle = 'red';
                    context.fill();
                })              
            }
        }
    }, [])

    return (
        <div className="">
            <canvas ref={canvasRef} {...props} />
        </div>
    )
}

export default Canvas
