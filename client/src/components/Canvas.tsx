import React, { useRef, useEffect, useCallback, useState } from 'react'
import { convertTypeAcquisitionFromJson, isConditionalExpression } from 'typescript'

interface Props {
    width: number
    height: number
}

const Canvas: React.FC<Props> = (props) => {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    const [mouseX, setMouseX] = useState(0)
    const [mouseY, setMouseY] = useState(0)

    const [x, setX] = useState(0)
    const [y, setY] = useState(0)

    const [changing, setChanging] = useState(false)

    const draw = useCallback(
        (ctx: CanvasRenderingContext2D) => {
            // ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
            ctx.fillStyle = '#140a14'
            ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
            ctx.fillStyle = '#000000'
            ctx.beginPath()
            ctx.arc(x, y, 5, 0, 2 * Math.PI)
            ctx.fill()
        },
        [x, y]
    )

    useEffect(() => {
        const canvas = canvasRef.current
        const context = canvas!.getContext('2d')

        let animationFrameId: number

        //Our draw came here
        const render = () => {
            draw(context!)
            animationFrameId = window.requestAnimationFrame(render)
        }
        render()

        if (!changing) {
            setChanging(true)
            console.log('chanign')
            setTimeout(() => {
                let v_i = mouseX - x
                let v_j = mouseY - y
                console.log(`${x}: ${y}`)

                const len = Math.sqrt((Math.abs(v_i) ^ 2) + (Math.abs(v_j) ^ 2))
                console.log(`${len}`)

                let unit_v_i = v_i / len
                let unit_v_j = v_j / len
                console.log(`${v_i}: ${v_j}`)

                if (!isNaN(unit_v_i) || !isNaN(unit_v_j)) {
                    setX(unit_v_i / 2 + x)
                    setY(unit_v_j / 2 + y)
                }

                console.log(`${unit_v_i}: ${unit_v_j}`)
                setChanging(false)
            }, 10)
        }

        return () => {
            window.cancelAnimationFrame(animationFrameId)
        }
    }, [draw])

    const followMouse = (e: any) => {
        setMouseX(e.clientX - e.target.offsetLeft)
        setMouseY(e.clientY - e.target.offsetTop)

        // console.log(`[${mouseX}; ${mouseY}]`)
    }
    return <canvas onMouseMove={(e) => followMouse(e)} ref={canvasRef} {...props} />
}

export default Canvas
