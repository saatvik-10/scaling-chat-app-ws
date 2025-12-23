import { WebSocketServer, WebSocket } from "ws";

const servers: WebSocket[] = []

const wss = new WebSocketServer({ port: 8081 })

wss.on("connection", function connection(socket) {
    socket.on('err', console.error)

    servers.push(socket)

    socket.on("message", function (data: string) {
        servers.map(server => {
            server.send(data)
        })
    })
})