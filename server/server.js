const io = require('socket.io')(8080, {
    cors: {
        origin: ['http://localhost:3000'],
    },
})

io.on('connect', (socket) => {
    socket.join('room1')
    let rooms = io.sockets.adapter.rooms
    let room_size = rooms.get('room1')
    socket.emit('room-size', room_size)

    let prev_coord = { x: 0, y: 0 }

    socket.on('join', () => {
        socket.join('room1')
    })

    socket.on('place', (coord) => {
        if (coord.x != prev_coord.x || prev_coord.y != coord.y) {
            prev_coord = coord
            socket.emit('place-client', coord)
        }
    })

    socket.on('disconnect', function () {
        socket.disconnect()

        console.log('disconnect')
    })
})

// io.sockets.clients().forEach(function (socket) {
//     socket.disconnect()
// })
