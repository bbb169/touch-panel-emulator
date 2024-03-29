import { app, shell, BrowserWindow, screen, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { keyTap, keys, mouseClick, moveMouse, scrollMouse } from '@hurdlegroup/robotjs'
import {
  AppleScript,
  KeyTapParams,
  MouseClickParams,
  MoveMouseParams,
  ScrollMouseParams
} from '../types'
import { threeFingerSwitchWindow, zoomInOrOut } from './applescripts/index'
import applescript from 'applescript'
import { getWiFiIPAddress, setUpWebsocket } from './websocket'
const appleScript: AppleScript = applescript

export let platform: NodeJS.Platform

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 400,
    height: 800,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  // ======================== get operation system =====================
  console.log(process.platform)

  platform = process.platform

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })

  // ================== ask permissions =================
  app.setSecureKeyboardEntryEnabled(true)
  app.setAccessibilitySupportEnabled(true)

  // ======= set up webscocket to listen messages from mobile =====
  setUpWebsocket()

  // ================= communication between main and renderer =============
  ipcMain.on('move-mouse-from-renderer', (_, { left, top }: MoveMouseParams) => {
    const mousePosition = screen.getCursorScreenPoint()
    appleScript.execString(threeFingerSwitchWindow(left > 0 ? 'right' : 'top'), (err) => {
      if (err) {
        appleScript.execString(`display dialog "err: ${err}"`)
      }
    })
    console.log(mousePosition.x, mousePosition.x + left, mousePosition.y, mousePosition.y + top)

    moveMouse(mousePosition.x + left, mousePosition.y + top)
  })

  ipcMain.on('scroll-mouse-from-renderer', (_, { right, top }: ScrollMouseParams) => {
    scrollMouse(right || 0, top || 0)
  })

  ipcMain.on('mouse-click-from-renderer', (_, { button, double }: MouseClickParams) => {
    mouseClick(button, double)
  })

  ipcMain.on('mouse-click-from-renderer', (_, { key, modified }: KeyTapParams) => {
    keyTap(key as keys, modified)
  })

  ipcMain.on('zoom-change-from-renderer', (_, isIn: boolean | undefined) => {
    appleScript.execString(zoomInOrOut(isIn), (err) => {
      if (err) {
        appleScript.execString(`display dialog "err: ${err}"`)
      }
    })
  })

  // =============================== main =====================================
  ipcMain.handle('getWiFiIPAddress', () => {
    return getWiFiIPAddress()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
// In this fil e you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
