import React, { useRef, useEffect, useCallback, useState } from 'react'
import { isConditionalExpression } from 'typescript'

interface Props {
    width: number
    height: number
}

const Canvas: React.FC<Props> = (props) => {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    const [mouseX, setMouseX] = useState(0)
    const [mouseY, setMouseY] = useState(0)

    const draw = useCallback(
        (ctx: CanvasRenderingContext2D, frameCount: number) => {
            console.log('change')
            console.log(`[${mouseX}; ${mouseY}]`)
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
            ctx.fillStyle = '#140a14'
            ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
            ctx.fillStyle = '#000000'
            ctx.beginPath()
            ctx.arc(mouseX, mouseY, 50, 0, 2 * Math.PI)
            ctx.fill()
        },
        [mouseX, mouseY]
    )

    useEffect(() => {
        const canvas = canvasRef.current
        const context = canvas!.getContext('2d')

        let frameCount = 0
        let animationFrameId: number

        //Our draw came here
        const render = () => {
            frameCount++
            draw(context!, frameCount)
            animationFrameId = window.requestAnimationFrame(render)
        }
        render()

        return () => {
            window.cancelAnimationFrame(animationFrameId)
        }
    }, [draw])

    const followMouse = (e: any) => {
        setMouseX(e.clientX - e.target.offsetLeft)
        setMouseY(e.clientY - e.target.offsetTop)

        console.log(`[${mouseX}; ${mouseY}]`)
    }
    return <canvas onMouseMove={(e) => followMouse(e)} ref={canvasRef} {...props} />
}

export default Canvas
