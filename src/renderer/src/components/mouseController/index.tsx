import { Button } from 'antd'
// import { ipcRenderer } from 'electron'
import { PreloadAPITypes } from 'src/types'

const moveMouse = (window.api as PreloadAPITypes).moveMouseSmooth

export default function MouseController(): JSX.Element {
  return (
    <div style={{ width: '100vw', height: 30, display: 'flex', justifyContent: 'space-around' }}>
      <Button
        type="primary"
        onClick={() => {
          moveMouse(100, 100)
        }}
      >
        left
      </Button>
      <Button
        type="primary"
        onClick={() => {
          moveMouse(-100, -100)
        }}
      >
        top
      </Button>
    </div>
  )
}
