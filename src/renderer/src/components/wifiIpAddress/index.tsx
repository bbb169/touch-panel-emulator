import { useEffect, useState } from 'react'

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

  return <div style={{ fontSize: 10 }}>手机输入ip连接： {ip}</div>
}
