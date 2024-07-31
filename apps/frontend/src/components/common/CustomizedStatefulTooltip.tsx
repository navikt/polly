import { PLACEMENT, StatefulTooltip, StatefulTooltipProps } from 'baseui/tooltip'

const CustomizedStatefulTooltip = (props: Partial<StatefulTooltipProps>) => {
  const { ignoreBoundary, children } = props

  return (
    <StatefulTooltip
      {...props}
      placement={PLACEMENT.top}
      focusLock={false}
      ignoreBoundary={ignoreBoundary === false ? ignoreBoundary : true}
      overrides={{
        Body: {
          style: {
            maxWidth: '25%',
            wordBreak: 'break-word',
          },
        },
      }}
    >
      {children}
    </StatefulTooltip>
  )
}

export default CustomizedStatefulTooltip
