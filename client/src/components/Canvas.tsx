import React, { useRef, useEffect } from 'react'

const Canvas = (props: any) => {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (canvas) {
            const context = canvas.getContext('2d')
            if (context) {
                //Our first draw
                context.fillStyle = '#000000'
                context.fillRect(0, 0, context.canvas.width, context.canvas.height)
            }
        }
    }, [])

    return <canvas ref={canvasRef} {...props} />
}

export default Canvas
