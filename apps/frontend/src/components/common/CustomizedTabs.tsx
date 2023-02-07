import React from 'react'
import { Tabs, TabsProps } from 'baseui/tabs'
import { theme } from '../../util'
import { paddingAll, paddingZero } from './Style'

export const CustomizedTabs = (props: TabsProps) => {
  return (
    <Tabs
      onChange={props.onChange}
      activeKey={props.activeKey}
      overrides={{
        Root: {
          style: {
            outline: `4px ${theme.colors.primary200} solid`,
          },
        },
        TabContent: {
          style: paddingZero,
        },
        TabBar: {
          style: {
            ...paddingAll(theme.sizing.scale600),
          },
        },
      }}
    >
      {props.children}
    </Tabs>
  )
}
