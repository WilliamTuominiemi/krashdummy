const io = require('socket.io')(8080, {
    cors: {
        origin: ['http://localhost:3000'],
    },
})

io.on('connect', (socket) => {
    console.log(socket.id)

    socket.on('disconnect', function () {
        console.log('disconnect')
    })
})
