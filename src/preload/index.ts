import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { MoveMouseParams, PreloadAPITypes, ScrollMouseParams } from '../types'

// Custom APIs for renderer
const api: PreloadAPITypes = {
  moveMouseSmooth: (left: number, top: number): void => {
    const data: MoveMouseParams = { left, top }
    ipcRenderer.send('move-mouse-from-renderer', data)
  },
  scrollMouse: ({ right, top }: ScrollMouseParams): void => {
    const data: ScrollMouseParams = { right, top }
    ipcRenderer.send('scroll-mouse-from-renderer', data)
  },
  mouseClick({ button, double }) {
    console.log('i got hhh');
    
    ipcRenderer.send('mouse-click-from-renderer', { button, double })
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
