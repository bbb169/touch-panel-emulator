import { Button, List } from 'antd'
// import { ipcRenderer } from 'electron'
import { PreloadAPITypes } from 'src/types'

const moveMouse = (window.api as PreloadAPITypes).moveMouseSmooth
const scrollMouse = (window.api as PreloadAPITypes).scrollMouse;

export default function MouseController(): JSX.Element {
  return (
    <>
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

      <div style={{ height: 100, overflow: 'scroll', backgroundColor: 'white' }} onClick={() => { scrollMouse({ top: -50 }) }}>
        <List dataSource={new Array(20).fill(1)} renderItem={(item) => <div>{item}</div>}></List>
      </div>
    </>
  )
}
