import express from 'express'
import http from 'http'
import cors from 'cors'
import os from 'os'
import { Server as ServerIO } from 'socket.io'
import applescript from 'applescript'
import { AppleScript } from '../types'
import { threeFingerSwitchWindow } from './applescripts'
const appleScript: AppleScript = applescript

const getWiFiIPAddress = (): string => {
  const interfaces = os.networkInterfaces()
  for (const key in interfaces) {
    const item = interfaces[key]

    if (item) {
      for (const entry of item) {
        if (entry.family === 'IPv4' && !entry.internal) {
          return entry.address
        }
      }
    }
  }
  return 'localhost' // 默认返回 localhost
}

export function setUpWebsocket(): void {
  const app = express()
  app.use(cors())

  app.use(
    '/index',
    express.Router().get('/', (req, res) => {
      res.send('respond with a resource')
    })
  )
  app.set('port', 3000)
  const server = http.createServer(app)
  const io = new ServerIO(server, {
    cors: {
      origin: `http://localhost:3000`, // allowed front-end ip
      methods: ['GET', 'POST'], // allowed HTTP methods
      allowedHeaders: ['my-custom-header']
    }
  })

  io.on('connection', (socket) => {
    console.log('A client connected')

    // 监听来自客户端的消息
    socket.on('messageFromClient', (data) => {
      console.log('Message from client:', data)

      // 向客户端发送消息
      io.emit('messageFromServer', 'Hello from server')
    })

    socket.on('threeFingerSwitchWindow', (data) => {
      console.log('threeFingerSwitchWindow', data);
      
      appleScript.execString(threeFingerSwitchWindow(data), (err, rtn) => {
        if (err) {
          appleScript.execString(`display dialog "err: ${err}"`)
        }
      })
    })

    socket.on('disconnect', () => {
      console.log('Client disconnected')
    })
  })

  const PORT = 3000
  server.listen(PORT, getWiFiIPAddress(), () => {
    console.log(`Server listening on port ${PORT}`)
    console.log(server.address())
  })
}