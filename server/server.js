const io = require('socket.io')(8080, {
    cors: {
        origin: ['http://localhost:3000'],
    },
})

io.on('connect', (socket) => {
    console.log(socket.id)

    let prev_coord = { x: 0, y: 0 }

    socket.on('place', (coord) => {
        if (coord.x != prev_coord.x && prev_coord.y != coord.y) {
            // console.log(coord)
            prev_coord = coord
            socket.emit('place-client', coord)
        }
        // console.log(coord)
        // socket.emit('place-client', coord)
    })

    socket.on('disconnect', function () {
        socket.disconnect()

        console.log('disconnect')
    })
})

// io.sockets.clients().forEach(function (socket) {
//     socket.disconnect()
// })
