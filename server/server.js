const io = require('socket.io')(8080, {
    cors: {
        origin: ['http://localhost:3000'],
    },
})

io.on('connect', (socket) => {
    let prev_coord = { x: 0, y: 0 }

    socket.on('join', () => {
        socket.join('room1')
        let rooms = io.sockets.adapter.rooms
        let room_size = rooms.get('room1')
        socket.emit('get_room', room_size)
    })

    socket.on('get_room', () => {
        let rooms = io.sockets.adapter.rooms
        let room_size = rooms.get('room1')
        console.log(room_size)
        socket.emit('get_room', room_size)
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
