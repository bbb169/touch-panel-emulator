import { Button } from 'antd'
// import { moveMouse } from 'robotjs'
const { moveMouse } = require('robotjs');


export default function MouseController(): JSX.Element {
  return (
    <>
      <Button
        type="primary"
        onClick={() => {
          moveMouse(0, 500)
        }}
      >
        lft
      </Button>
      <Button
        type="primary"
        onClick={() => {
          moveMouse(500, 500)
        }}
      >
        right
      </Button>
    </>
  )
}
