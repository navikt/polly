import { InformationSquareIcon } from '@navikt/aksel-icons'
import { Button, Tooltip } from '@navikt/ds-react'
import { ReactElement } from 'react'

interface ICustomizedTooltipProps {
  content: string
  text?: string
  color?: string
  icon?: ReactElement
}

const CustomizedStatefulTooltip = (props: ICustomizedTooltipProps) => {
  const { content, text, color, icon } = props
  const IconComponent = icon ? (
    icon
  ) : (
    <InformationSquareIcon title="tooltip" color={color || undefined} />
  )

  return (
    <Tooltip content={content}>
      <Button
        type="button"
        variant="tertiary-neutral"
        size="small"
        icon={text ? undefined : IconComponent}
      >
        {text}
      </Button>
    </Tooltip>
  )
}

export default CustomizedStatefulTooltip
