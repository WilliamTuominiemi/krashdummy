import React, { useRef, useEffect, useCallback, useState } from 'react'
import { convertTypeAcquisitionFromJson, isConditionalExpression } from 'typescript'

interface Props {
    width: number
    height: number
}

const Canvas: React.FC<Props> = (props) => {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    const [x, setX] = useState(0)
    const [y, setY] = useState(0)

    const [changing, setChanging] = useState(false)

    const [xDir, setXDir] = useState(0)
    const [yDir, setYDir] = useState(0)

    const draw = useCallback(
        (ctx: CanvasRenderingContext2D) => {
            const time = Date.now()
            if (time % 10000 === 0) {
                ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
                ctx.fillStyle = '#140a14'
                ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
            }
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
                    const speed = 5
                    if (!isNaN(xDir / speed + x) || !isNaN(yDir / speed + y)) {
                        setX(xDir / speed + x)
                        setY(yDir / speed + y)
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
    }, [draw, x, y, changing, xDir, yDir])

    const followMouse = (e: any) => {
        if (e.buttons === 1) {
            let v_i = e.clientX - e.target.offsetLeft - x
            let v_j = e.clientY - e.target.offsetTop - y

            const len = Math.sqrt((Math.abs(v_i) ^ 2) + (Math.abs(v_j) ^ 2))
            let unit_v_i = v_i / len
            let unit_v_j = v_j / len

            if (len > 3) {
                setXDir(unit_v_i)
                setYDir(unit_v_j)
            }

            // console.log(`[${mouseX}; ${mouseY}]`)
        }
    }

    return <canvas onMouseMove={(e) => followMouse(e)} ref={canvasRef} {...props} />
}

export default Canvas
