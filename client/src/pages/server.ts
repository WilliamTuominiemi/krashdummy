import io from 'socket.io'

const socketServer = io(3000, {
    cors: {
        origin: ['http://localhost:3000'],
    },
})

socketServer.on('connect', (socket) => {
    console.log(socket.id)

    socket.on('disconnect', function () {
        console.log('disconnect')
    })
})
