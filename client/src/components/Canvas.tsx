import React, { useRef, useEffect, useCallback, useState } from 'react'
import { convertTypeAcquisitionFromJson, isConditionalExpression } from 'typescript'

interface Props {
    width: number
    height: number
}

const Canvas: React.FC<Props> = (props) => {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    const [x, setX] = useState(10)
    const [y, setY] = useState(10)

    const [changing, setChanging] = useState(false)

    const [xDir, setXDir] = useState(1)
    const [yDir, setYDir] = useState(1)

    const [frameX, setFrameX] = useState(10)
    const [frameY, setFrameY] = useState(0)

    const [resetCanvas, setResetCanvas] = useState(true)
    const [updateFrame, setUpdateFrame] = useState(true)

    const draw = useCallback(
        (ctx: CanvasRenderingContext2D) => {
            if (resetCanvas) {
                setTimeout(() => {
                    setResetCanvas(false)
                    setFrameX(10)
                    setFrameY(0)

                    setX(10)
                    setY(10)

                    setXDir(1)
                    setYDir(1)

                    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
                    ctx.fillStyle = '#140a14'
                    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
                }, 50)
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
                if (frameX === 0 && frameY === 0) {
                    console.log(`${frameX}:::${frameY}`)
                    setResetCanvas(true)
                }
            }

            console.log(`${x}:${y}`)
            if (x < 0 || x > ctx.canvas.width) setResetCanvas(true)
            if (y < 0 || y > ctx.canvas.height) setResetCanvas(true)

            ctx.fillStyle = '#000000'
            ctx.beginPath()
            ctx.arc(x, y, 5, 0, 2 * Math.PI)
            ctx.fill()
        },
        [frameX, frameY, x, y, resetCanvas, updateFrame]
    )

    useEffect(() => {
        const step = 100

        setInterval(function () {
            setUpdateFrame(true)
        }, step)
    }, [])

    useEffect(() => {
        const canvas = canvasRef.current
        const context = canvas!.getContext('2d')

        let animationFrameId: number

        const render = () => {
            if (!changing || !resetCanvas) {
                setChanging(true)

                setTimeout(() => {
                    const speed = 5
                    if (!isNaN(xDir / speed + x) || (!isNaN(yDir / speed + y) && !resetCanvas)) {
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
