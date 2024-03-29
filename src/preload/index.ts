import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { MoveMouseParams, PreloadAPITypes, ScrollMouseParams } from '../types'

console.log('getWiFiIPAddress',ipcRenderer.invoke('getWiFiIPAddress'));


// Custom APIs for renderer
const api: PreloadAPITypes = {
  moveMouseSmooth: (left: number, top: number): void => {
    const data: MoveMouseParams = { left, top, isDraging: false }
    ipcRenderer.send('move-mouse-from-renderer', data)
  },
  scrollMouse: ({ right, top }: ScrollMouseParams): void => {
    const data: ScrollMouseParams = { right, top }
    ipcRenderer.send('scroll-mouse-from-renderer', data)
  },
  mouseClick({ button, double }) {
    ipcRenderer.send('mouse-click-from-renderer', { button, double })
  },
  keyTap({ key, modified }) {
    ipcRenderer.send('mouse-click-from-renderer', { key, modified })
  },
  zoomInOrOut(isIn) {
    ipcRenderer.send('zoom-change-from-renderer', isIn)
  },
  confirmConnectDevice(isConnect) {
    ipcRenderer.send('confirm-connect-device', isConnect)
  },
  disConnectDevice() {
    ipcRenderer.send('dis-connect-device')
  },
  async getWiFiIPAddress() {
    return await ipcRenderer.invoke('getWiFiIPAddress')
  },
  async getDeviceInfo() {
    return await ipcRenderer.invoke('getDeviceInfo')
  }
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
