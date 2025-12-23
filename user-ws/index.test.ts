import { resolve } from 'bun'
import { describe, expect, it } from 'bun:test'

const wsUrl1 = 'ws://localhost:8080'
const wsUrl2 = 'ws://localhost:8082'

describe('Testing chat app', () => {
    it("User msg inside room1 reaches all", async () => {
        const ws1 = new WebSocket(wsUrl1)
        const ws2 = new WebSocket(wsUrl2)

        // await new Promise<void>((resolve, reject) => {
        //     let cnt = 0;

        //     ws1.onopen = () => {
        //         cnt += 1;
        //         if (cnt == 2) resolve()
        //     }

        //     ws2.onopen = () => {
        //         cnt += 1
        //         if (cnt == 2) resolve()
        //     }
        // })

        await Promise.all([
            new Promise<void>((resolve, reject) => {
                ws1.onopen = () => resolve()
            }),

            new Promise<void>((resolve, reject) => {
                ws2.onopen = () => resolve()
            }),
        ])

        ws1.send(JSON.stringify({
            type: "join",
            room: "room1"
        }))

        ws2.send(JSON.stringify({
            type: "join",
            room: "room1"
        }))

        await new Promise<void>((resolve, reject) => {
            ws2.onmessage = ({ data }) => {
                const dt = JSON.parse(data)

                expect(dt.type === 'chat')
                expect(dt.message === 'yellooooooooooo')

                resolve()
            }

            ws1.send(JSON.stringify({
                type: "chat",
                room: "room1",
                message: "yellooooooooooo!"
            }))
        })
    })
})