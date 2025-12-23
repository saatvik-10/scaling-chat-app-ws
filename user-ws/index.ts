import { WebSocketServer, WebSocket } from 'ws'

interface Room {
    sockets: WebSocket[]
}

const rooms: Record<string, Room> = {}

const wss = new WebSocketServer({ port: 8080 })

wss.on("connection", (socket) => {
    socket.on('error', console.error)

    socket.on("message", function message(data: string) {
        const msg = JSON.parse(data)

        const room = msg.room

        if (msg.type === 'join') {
            if (!rooms[room]) {
                rooms[room] = {
                    sockets: []
                }
            }

            rooms[room].sockets.push(socket)
        }

        if (msg.type === 'chat') {
            rooms[room]?.sockets.map(socket => socket.send(data))
        }
    })

})