import Versions from './components/Versions'
import { DeviceInfoComp } from './components/deviceInfo/deviceInfo'

function App(): JSX.Element {
  return (
    <div className="container">
      <Versions />
      <DeviceInfoComp />
    </div>
  )
}

export default App
