import { useEffect, useState } from 'react'
import { PreloadAPITypes } from 'src/types'

export function WifiIpAddress(): JSX.Element {
  const [times, setTimes] = useState(0)

  useEffect(() => {
    if (times > 10) {
      return
    }
    if (!(window.api as PreloadAPITypes).getWiFiIPAddress()) {
      setTimeout(() => {
        setTimes(times + 1)
      }, 5000)
    }
  }, [times])

  return <div>ip地址： {(window.api as PreloadAPITypes).getWiFiIPAddress()}</div>
}
