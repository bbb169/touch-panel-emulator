import { getData, storeData } from '@renderer/utils/storage'
import { Modal, Result, Tooltip } from 'antd'
import { useEffect, useState } from 'react'
import { DeviceInfo } from 'src/types'
import { WifiIpAddress } from '../wifiIpAddress'

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
          <div>设备名：{deviceInfo?.deviceName}</div>
          <div>Ip地址为：{deviceInfo?.ipAddress}</div>
          <Result status="success" />
          <Tooltip
            title={
              <div
                style={{
                  textAlign: 'center',
                  fontSize: 12,
                  maxHeight: 100,
                  maxWidth: 200,
                  overflow: 'auto'
                }}
              >
                请在系统设置的辅助功能中允许touch-panel-emulator控制您的电脑，同时还需要您允许osascript控制您的电脑，打开辅助功能系统设置后，步骤如下：
                点击‘+’号，cmd+shift+G,输入/usr/bin/osascript,点击osascript即可添加
              </div>
            }
          >
            无法控制电脑？
          </Tooltip>
        </div>
      ) : (
        <div style={{ textAlign: 'center' }}>
          暂无设备连接
          <Result status="warning" />
          <WifiIpAddress />
        </div>
      )}
    </>
  )
}
