import { useEffect, useState } from 'react'
import { PreloadAPITypes } from 'src/types'

export function WifiIpAddress(): JSX.Element {
  const [times, setTimes] = useState(0)
  const [ip, setIp] = useState<string>();

  useEffect(() => {
    if (times > 10) {
      return
    }
    if (!ip) {
      window.api.getWiFiIPAddress().then((res) => {
        setIp(res)
      })
      setTimeout(() => {
        setTimes(times + 1)
      }, 5000)
    }
  }, [times])

  return <div>ip地址： {ip}</div>
}
