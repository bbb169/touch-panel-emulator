import { Collapse } from 'antd'
import React, { useState } from 'react'

const { Panel } = Collapse

const ExpandableIntroduction: React.FC<{ children: React.ReactNode; title?: string }> = ({
  children,
  title
}) => {
  const [openPanels, setOpenPanels] = useState<string[]>([])

  return (
    <Collapse
      style={{ backgroundColor: '#fd5c52' }}
      onChange={(value) => {
        setOpenPanels(value as string[])
      }}
      activeKey={openPanels}
    >
      <Panel header={title ? title : openPanels.includes('1') ? '收起' : '展开'} key="1">
        {children}
      </Panel>
    </Collapse>
  )
}

export default ExpandableIntroduction
