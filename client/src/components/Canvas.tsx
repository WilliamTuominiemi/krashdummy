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
            if (!changing) {
                setChanging(true)
                setTimeout(() => {
                    let v_i = mouseX - x
                    let v_j = mouseY - y

                    const len = Math.sqrt((Math.abs(v_i) ^ 2) + (Math.abs(v_j) ^ 2))

                    let unit_v_i = v_i / len
                    let unit_v_j = v_j / len

                    if (!isNaN(unit_v_i / 2 + x) || !isNaN(unit_v_j / 2 + y)) {
                        setX(unit_v_i / 2 + x)
                        setY(unit_v_j / 2 + y)
                    }

                    setChanging(false)
                }, 10)
            }
            draw(context!)
            animationFrameId = window.requestAnimationFrame(render)
        }
        render()

        return () => {
            window.cancelAnimationFrame(animationFrameId)
        }
    }, [draw, mouseX, mouseY, x, y, changing])

    const followMouse = (e: any) => {
        setMouseX(e.clientX - e.target.offsetLeft)
        setMouseY(e.clientY - e.target.offsetTop)

        // console.log(`[${mouseX}; ${mouseY}]`)
    }
    return <canvas onMouseMove={(e) => followMouse(e)} ref={canvasRef} {...props} />
}

export default Canvas
