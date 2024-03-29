import { getData, storeData } from '@renderer/utils/storage'
import { Button, Modal, Result, Tooltip } from 'antd'
import { useEffect, useState } from 'react'
import { DeviceInfo } from 'src/types'
import { WifiIpAddress } from '../wifiIpAddress'
import { ApiOutlined } from '@ant-design/icons'

export function DeviceInfoComp(): JSX.Element {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo | null>()
  const [confimModal, setConfimModal] = useState<JSX.Element>(<></>)

  useEffect(() => {
    function getDeviceInfo(): void {
      window.api.getDeviceInfo().then((res) => {
        const currentIpAddress = getData('ipAddress') || []
        const noAutoConnectAddress = sessionStorage.getItem('noAutoConnect')

        if (deviceInfo?.ipAddress === res?.ipAddress) {
          return
        }

        if (deviceInfo?.ipAddress && !res) {
          setDeviceInfo(null)
          return
        }

        if (
          res &&
          currentIpAddress?.includes(res.ipAddress) &&
          noAutoConnectAddress !== res.ipAddress
        ) {
          if (!deviceInfo) {
            window.api.confirmConnectDevice(true)
            setDeviceInfo(res)
          }
          return
        }

        if (res) {
          setConfimModal(
            <Modal
              open={true}
              okText="好的你来吧"
              cancelText="陌生人的设备我不连"
              onOk={() => {
                window.api.confirmConnectDevice(true)
                setDeviceInfo(res)
                storeData('ipAddress', [...currentIpAddress, res.ipAddress])
                setConfimModal(<></>)
              }}
              onCancel={() => {
                getDeviceInfo()
                window.api.confirmConnectDevice(false)
                setConfimModal(<></>)
              }}
            >
              <div>
                <div>设备名：{res.deviceName}</div>
                <div>Ip地址为：{res.ipAddress}</div>
                的设备想与您连接 是否同意？
              </div>
            </Modal>
          )
        }
      })
    }

    const interval = setInterval(() => getDeviceInfo(), 5000)

    return () => {
      clearInterval(interval)
    }
  }, [deviceInfo])

  return (
    <>
      {confimModal}
      {deviceInfo ? (
        <div style={{ fontSize: 20, textAlign: 'center' }}>
          已连接！
          <div>设备名：{deviceInfo?.deviceName || '未知'}</div>
          <div>Ip地址为：{deviceInfo?.ipAddress || '未知'}</div>
          <Result status="success" />
          <Tooltip title="断开连接">
            <Button
              type="primary"
              danger
              style={{ width: 80, height: 80, lineHeight: '80px' }}
              shape="circle"
              icon={<ApiOutlined style={{ fontSize: 38 }} rotate={45} />}
              size="large"
              onClick={() => {
                window.api.disConnectDevice()
                sessionStorage.setItem('noAutoConnect', deviceInfo?.ipAddress || '')
                setDeviceInfo(null);
              }}
            />
          </Tooltip>
          <Tooltip
            title={
              <div
                style={{
                  textAlign: 'center',
                  fontSize: 20,
                  maxWidth: 200,
                  overflow: 'auto'
                }}
              >
                请在系统设置的辅助功能中允许touch-panel-emulator控制您的电脑，同时还需要您允许osascript控制您的电脑，打开辅助功能系统设置后，步骤如下：
                点击‘+’号，cmd+shift+G,输入/usr/bin/osascript,点击osascript即可添加
              </div>
            }
          >
            <div
              style={{
                position: 'absolute',
                bottom: 20,
                left: '50%',
                transform: 'translateX(-50%)'
              }}
            >
              无法控制电脑？
            </div>
          </Tooltip>
        </div>
      ) : (
        <div style={{ textAlign: 'center', fontSize: 20 }}>
          暂无设备连接
          <Result status="warning" />
          <div style={{ fontSize: 16 }}>请保持手机和电脑在同一WiFi连接下</div>
          <WifiIpAddress />
        </div>
      )}
    </>
  )
}
