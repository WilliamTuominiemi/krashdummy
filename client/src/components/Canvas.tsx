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

    const [frameX, setFrameX] = useState(0)
    const [frameY, setFrameY] = useState(0)

    const [resetCanvas, setResetCanvas] = useState(true)
    const [updateFrame, setUpdateFrame] = useState(true)

    const draw = useCallback(
        (ctx: CanvasRenderingContext2D) => {
            if (resetCanvas) {
                setResetCanvas(false)
                setFrameX(0)
                setFrameY(0)

                ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
                ctx.fillStyle = '#140a14'
                ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
            }
            if (updateFrame) {
                setUpdateFrame(false)

                ctx.beginPath()
                ctx.rect(frameX, frameY, 10, 10)
                ctx.fill()

                if (frameX < ctx.canvas.width - 10 && frameY === 0) {
                    setFrameX(frameX + 10)
                }
                if (frameX === ctx.canvas.width - 10 && frameY < ctx.canvas.height - 10) {
                    setFrameY(frameY + 10)
                }
                if (frameY === ctx.canvas.height - 10 && frameX > 0) {
                    setFrameX(frameX - 10)
                }
                if (frameX === 0 && frameY > 0) {
                    setFrameY(frameY - 10)
                }
            }

            ctx.fillStyle = '#000000'
            ctx.beginPath()
            ctx.arc(x, y, 5, 0, 2 * Math.PI)
            ctx.fill()
        },
        [frameX, frameY, x, y, resetCanvas, updateFrame]
    )

    useEffect(() => {
        const step = 100

        if (canvasRef.current) {
            const wait = (canvasRef.current?.width / 10) * step * 2 + (canvasRef.current?.height / 10) * step * 2

            console.log((canvasRef.current?.width / 10) * step * 2)
            console.log((canvasRef.current?.height / 10) * step * 2)

            console.log(wait)

            setInterval(function () {
                setResetCanvas(true)
                setFrameX(0)
                setFrameY(0)
            }, (canvasRef.current?.width / 10) * step * 2 + (canvasRef.current?.height / 10) * step * 2)
        }

        setInterval(function () {
            setUpdateFrame(true)
        }, step)
    }, [])

    useEffect(() => {
        const canvas = canvasRef.current
        const context = canvas!.getContext('2d')

        let animationFrameId: number

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
        }
    }

    return <canvas onMouseMove={(e) => followMouse(e)} ref={canvasRef} {...props} />
}

export default Canvas
