import { Button, List } from 'antd'
import { useState } from 'react'
// import { ipcRenderer } from 'electron'
import { MouseClickParams, PreloadAPITypes } from 'src/types'

const moveMouse = (window.api as PreloadAPITypes).moveMouseSmooth
const scrollMouse = (window.api as PreloadAPITypes).scrollMouse
const mouseClick = (window.api as PreloadAPITypes).mouseClick
const keyTap = (window.api as PreloadAPITypes).keyTap

export default function MouseController(): JSX.Element {
  const [clickMsg, setClickMsg] = useState('null')
  const buttonMap: { [key: number]: MouseClickParams['button'] } = {
    0: 'left',
    1: 'left',
    4: 'middle',
    2: 'right'
  }

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
        <Button
          type="primary"
          onMouseDown={(evt) => {
            console.log(evt.buttons)
            setTimeout(() => {
              mouseClick({ button: buttonMap[evt.button] })
            }, 1000);
            setClickMsg(buttonMap[evt.button] || 'null')
          }}
        >
          click:{clickMsg}
        </Button>
        <Button
          type="primary"
          onClick={() => {
            keyTap({ key: 'control' })
            scrollMouse({ top: 50 })
          }}
        >
          Zoom in
        </Button>
      </div>

      <div
        style={{ height: 100, overflow: 'scroll', backgroundColor: 'white' }}
        onClick={() => {
          scrollMouse({ top: -50 })
        }}
      >
        <List dataSource={new Array(20).fill(1)} renderItem={(item) => <div>{item}</div>}></List>
      </div>
    </>
  )
}
