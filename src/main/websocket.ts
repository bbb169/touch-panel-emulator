import express from 'express'
import http from 'http'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import logger from 'morgan'
import os from 'os'
import { Server as ServerIO } from 'socket.io'
import applescript from 'applescript'
import { AppleScript, DeviceInfo, MoveMouseParams } from '../types'
import { threeFingerSwitchWindow } from './applescripts'
import {
  dragMouse,
  getMousePos,
  mouseClick,
  mouseToggle,
  moveMouse,
  scrollMouse
} from '@hurdlegroup/robotjs'
import { ipcMain } from 'electron'
const appleScript: AppleScript = applescript

export const getWiFiIPAddress = (): string => {
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
  app.use(logger('dev'))
  app.use(express.json())
  app.use(express.urlencoded({ extended: false }))
  app.use(cookieParser())
  app.use(cors())

  app.use(
    '/index',
    express.Router().get('/', (_, res) => {
      res.send('respond with a resource')
    })
  )
  const PORT = 3000
  app.set('port', PORT)
  const server = http.createServer(app)
  const io = new ServerIO(server)
  let deviceInfo: DeviceInfo | null

  ipcMain.handle('getDeviceInfo', () => {
    return deviceInfo || null
  })

  io.on('connection', (socket) => {
    console.log('A client connected', getWiFiIPAddress())
    socket.removeAllListeners()
    ipcMain.on('confirm-connect-device', (_, isConnect: boolean) => {
      if (isConnect) {
        socket.on('threeFingerSwitchWindow', (data) => {
          console.log('threeFingerSwitchWindow', data)

          appleScript.execString(threeFingerSwitchWindow(data), (err) => {
            if (err) {
              appleScript.execString(`display dialog "err: ${err}"`)
            }
          })
        })

        socket.on('moveMouse', ({ left, top, isDraging }: MoveMouseParams) => {
          const mousePosition = getMousePos()
          isDraging
            ? dragMouse(mousePosition.x + left, mousePosition.y + top)
            : moveMouse(mousePosition.x + left, mousePosition.y + top)
        })

        socket.on(
          'mouseToggle',
          ({ down, button }: { down?: 'down' | 'up'; button?: 'left' | 'right' | 'middle' }) => {
            mouseToggle(down || 'down', button || 'left')
          }
        )

        socket.on(
          'mouseClick',
          ({
            button = 'left',
            double = false
          }: {
            button?: 'left' | 'right' | 'middle'
            double?: boolean
          }) => {
            mouseClick(button, double)
          }
        )

        socket.on('scrollMouse', ({ x, y }: { x: number; y: number }) => {
          scrollMouse(x, y)
        })

        socket.emit('confirm-connect-device')
      } else {
        socket.disconnect()
      }
    })

    // ========================== deviceInfo ===========================
    socket.on('deviceInfo', (res: DeviceInfo) => {
      console.log('deviceInfo', res)

      deviceInfo = res
    })
    // ========================== disconnect ===========================
    socket.on('disconnect', () => {
      console.log('Client disconnected')
      deviceInfo = null
    })
  })

  server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`, getWiFiIPAddress())
    console.log(server.address())
  })
  // server.listen(PORT, '172.25.141.240', () => {
  //   console.log(`Server listening on port 172.25.141.240`, '172.25.141.240')
  // })
}
