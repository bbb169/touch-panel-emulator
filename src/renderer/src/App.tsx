import Versions from './components/Versions'
import MouseController from './components/mouseController'

function App(): JSX.Element {
  return (
    <div className="container">
      <Versions />
      <div style={{ textAlign: 'center' }}>
        请在系统设置的辅助功能中允许touch-panel-emulator控制您的电脑
      </div>
      <MouseController />
    </div>
  )
}

export default App
