import { Tabs, TabsProps } from 'baseui/tabs'
import { theme } from '../../util'
import { paddingAll, paddingZero } from './Style'

export const CustomizedTabs = (props: TabsProps) => {
  const { onChange, activeKey, children } = props

  return (
    <Tabs
      onChange={onChange}
      activeKey={activeKey}
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
      {children}
    </Tabs>
  )
}
