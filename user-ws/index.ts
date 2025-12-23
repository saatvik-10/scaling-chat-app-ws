import { WebSocketServer, WebSocket as WebSocketWS } from 'ws'

interface Room {
    sockets: WebSocketWS[]
}

const rooms: Record<string, Room> = {}

const relayerSocket = new WebSocket('ws://localhost:8081')

const wss = new WebSocketServer({ port: 8080 })

relayerSocket.onmessage = ({ data }) => {
    const msg = JSON.parse(data)
    const room = msg.room

    if (msg.type === 'chat') {
        rooms[room]?.sockets.map(socket => socket.send(data))
    }
}

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
            relayerSocket.send(data)
        }
    })

})