import React, { useRef, useEffect, useCallback, useState } from 'react'
import { io } from 'socket.io-client'

interface Props {
    width: number
    height: number
}

const socket = io('http://localhost:8080')

const Canvas: React.FC<Props> = (props) => {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    const [x, setX] = useState(10)
    const [y, setY] = useState(10)

    const [changing, setChanging] = useState(false)

    const [xDir, setXDir] = useState(5)
    const [yDir, setYDir] = useState(5)

    const [frameX, setFrameX] = useState(10)
    const [frameY, setFrameY] = useState(0)

    const [resetCanvas, setResetCanvas] = useState(true)
    const [updateFrame, setUpdateFrame] = useState(true)

    const [spawnImmunity, setSpawnImmunity] = useState(true)

    const [speed, setSpeed] = useState(10)

    const [prevUpdateX, setPrevUpdateX] = useState(0)
    const [prevUpdateY, setPrevUpdateY] = useState(0)

    const draw = useCallback(
        (ctx: CanvasRenderingContext2D) => {
            if (resetCanvas) {
                setTimeout(() => {
                    setSpawnImmunity(true)
                    setTimeout(function () {
                        setSpawnImmunity(false)
                    }, 2000)
                    setResetCanvas(false)
                    setFrameX(10)
                    setFrameY(0)

                    setX(5)
                    setY(5)

                    setXDir(10)
                    setYDir(10)

                    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
                    ctx.fillStyle = '#242424'
                    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
                }, 50)
            }
            if (updateFrame && !resetCanvas) {
                setUpdateFrame(false)

                ctx.beginPath()
                ctx.rect(frameX, frameY, 20, 20)
                let r = Math.floor(Math.random() * 50)
                let g = Math.floor(Math.random() * 50)
                let b = 256
                let color = 'rgb(' + r + ', ' + g + ', ' + b + ')'
                ctx.fillStyle = color
                ctx.fill()

                const alternator = 2

                if (frameX < ctx.canvas.width - 20 && frameY === 0) {
                    setFrameX(frameX + speed / alternator)
                }
                if (frameX === ctx.canvas.width - 20 && frameY < ctx.canvas.height - 20) {
                    setFrameY(frameY + speed / alternator)
                }
                if (frameY === ctx.canvas.height - 20 && frameX > 0) {
                    setFrameX(frameX - speed / alternator)
                }
                if (frameX === 0 && frameY > 0) {
                    setFrameY(frameY - speed / alternator)
                }
                if (frameX === 0 && frameY === 0) {
                    setResetCanvas(true)
                }
            }

            function getPixelColor(x: number, y: number): string {
                const p = ctx.getImageData(x, y, 1, 1).data
                return `rgb(${p[0]},${p[1]},${p[2]})`
            }

            if (
                getPixelColor(Math.round(x + xDir * 5), Math.round(y + yDir * 5)) != `rgb(36,36,36)` &&
                !spawnImmunity
            ) {
                setResetCanvas(true)
            }

            if (x < 0 || x > ctx.canvas.width) setResetCanvas(true)
            if (y < 0 || y > ctx.canvas.height) setResetCanvas(true)

            let r = 256
            let g = Math.floor(Math.random() * 100)
            let b = Math.floor(Math.random() * 100)
            let color = 'rgb(' + r + ', ' + g + ', ' + b + ')'

            ctx.fillStyle = color
            ctx.beginPath()
            ctx.arc(x, y, 15, 0, 2 * Math.PI)
            ctx.fill()
        },
        [frameX, frameY, x, y, resetCanvas, updateFrame, xDir, yDir, spawnImmunity]
    )

    useEffect(() => {
        const step = 100

        setInterval(function () {
            setUpdateFrame(true)
        }, step)

        setTimeout(function () {
            setSpawnImmunity(false)
        }, 2000)
    }, [])

    useEffect(() => {
        const canvas = canvasRef.current
        const context = canvas!.getContext('2d')

        let animationFrameId: number

        const render = () => {
            if (!changing || !resetCanvas) {
                setChanging(true)

                setTimeout(() => {
                    if (!isNaN(xDir / speed + x) || (!isNaN(yDir / speed + y) && !resetCanvas)) {
                        let r_n = 50
                        const X = Math.round(x / r_n) * r_n
                        const Y = Math.round(x / r_n) * r_n

                        if (prevUpdateX != X && prevUpdateY != Y) {
                            socket.emit('place', {
                                x: X,
                                y: Y,
                            })
                            setPrevUpdateX(X)
                            setPrevUpdateY(Y)
                        }

                        setX(xDir / speed + x)
                        setY(yDir / speed + y)
                    }

                    socket.on('place-client', (coord) => {
                        // console.log(coord)
                    })

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
