import React, { useRef, useEffect, useCallback, useState, use } from 'react'
import { io } from 'socket.io-client'

interface Props {
    width: number
    height: number
}

const socket = io('http://localhost:8080')

const Canvas: React.FC<Props> = (props) => {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    // Mouse position
    const [mouseX, setMouseX] = useState(0)
    const [mouseY, setMouseY] = useState(0)

    // Player positions
    const [x, setX] = useState(10)
    const [y, setY] = useState(10)

    // Opponent position
    const [o_x, setO_x] = useState(0)
    const [o_y, setO_y] = useState(0)

    // Frame ticker position
    const [frameX, setFrameX] = useState(10)
    const [frameY, setFrameY] = useState(0)

    const [resetCanvas, setResetCanvas] = useState(true)
    const [updateFrame, setUpdateFrame] = useState(true)

    const [spawnImmunity, setSpawnImmunity] = useState(true)

    const draw = useCallback(
        (ctx: CanvasRenderingContext2D) => {
            ctx.fillStyle = '#242424'
            ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
        },
        [x, y, o_x, o_y]
    )

    useEffect(() => {
        if (updateFrame) {
            setUpdateFrame(false)
            socket.on('req-move-data', () => {
                setUpdateFrame(true)

                const data = {
                    currentPosition: { x: x, y: y },
                    mousePosition: { x: mouseX, y: mouseY },
                    canvasSize: { width: canvasRef!.current?.width, height: canvasRef!.current?.height },
                }
                socket.emit('set-move-data', data)
            })
        }
    }, [x, y, mouseX, mouseY])

    useEffect(() => {
        socket.emit('join')
    }, [])

    const followMouse = (e: any) => {
        if (e.buttons === 1) {
            setMouseX(e.clientX - e.target.offsetLeft)
            setMouseY(e.clientY - e.target.offsetTop)
            // let v_i = e.clientX - e.target.offsetLeft - x
            // let v_j = e.clientY - e.target.offsetTop - y
            // const len = Math.sqrt((Math.abs(v_i) ^ 2) + (Math.abs(v_j) ^ 2))
            // let unit_v_i = v_i / len
            // let unit_v_j = v_j / len
            // if (len > 3) {
            // }
        }
    }

    return <canvas onMouseMove={(e) => followMouse(e)} ref={canvasRef} {...props} />
}

export default Canvas
