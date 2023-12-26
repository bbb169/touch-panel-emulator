import express from 'express'
import http from 'http'
import { Server as ServerIO } from 'socket.io'

export function setUpWebsocket(): void {
  const app = express()
  const server = http.createServer(app)
  const io = new ServerIO(server)

  io.on('connection', (socket) => {
    console.log('A client connected')

    // 监听来自客户端的消息
    socket.on('messageFromClient', (data) => {
      console.log('Message from client:', data)

      // 向客户端发送消息
      io.emit('messageFromServer', 'Hello from server')
    })

    socket.on('disconnect', () => {
      console.log('Client disconnected')
    })
  })

  const PORT = 3000
  server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
  })
}
