import { getData, storeData } from '@renderer/utils/storage'
import { Modal } from 'antd'
import { useEffect, useState } from 'react'
import { DeviceInfo } from 'src/types'

export function DeviceInfoComp(): JSX.Element {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>()

  useEffect(() => {
    function getDeviceInfo(): void {
      window.api.getDeviceInfo().then((res) => {
        console.log('getDeviceInfo', res)
        const currentIpAddress = getData('ipAddress') || []
        if (res && currentIpAddress?.includes(res.ipAddress)) {
          window.api.confirmConnectDevice(true)
          setDeviceInfo(res)
          return
        }

        if (res) {
          Modal.confirm({
            content: (
              <div>
                <div>设备名：{res.deviceName}</div>
                <div>Ip地址为：{res.ipAddress}</div>
                的设备想与您连接 是否同意？
              </div>
            ),
            okText: '好的你来吧',
            cancelText: '陌生人的设备我不连',
            onOk: () => {
              window.api.confirmConnectDevice(true)
              setDeviceInfo(res)
              storeData('ipAddress', [...currentIpAddress, res.ipAddress])
            },
            onCancel() {
              getDeviceInfo()
              window.api.confirmConnectDevice(false)
            }
          })
        } else {
          setTimeout(() => {
            getDeviceInfo()
          }, 5000)
        }
      })
    }

    getDeviceInfo()
  }, [])

  return (
    <>
      {deviceInfo ? (
        <div>
          设备信息为：
          <div>设备名：{deviceInfo.deviceName}</div>
          <div>Ip地址为：{deviceInfo.ipAddress}</div>
        </div>
      ) : (
        <div>暂无设备连接</div>
      )}
    </>
  )
}
