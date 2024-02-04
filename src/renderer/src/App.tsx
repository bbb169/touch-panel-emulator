import Versions from './components/Versions'
import { DeviceInfoComp } from './components/deviceInfo/deviceInfo'
import { WifiIpAddress } from './components/wifiIpAddress'

function App(): JSX.Element {
  return (
    <div className="container">
      <Versions />
      <DeviceInfoComp />
      <div style={{ textAlign: 'center' }}>
        请在系统设置的辅助功能中允许touch-panel-emulator控制您的电脑
        同时还需要您允许osascript控制您的电脑，打开辅助功能系统设置后，步骤如下：
        点击‘+’号，cmd+shift+G,输入/usr/bin/osascript,点击osascript即可添加
      </div>
      <WifiIpAddress />
    </div>
  )
}

export default App
