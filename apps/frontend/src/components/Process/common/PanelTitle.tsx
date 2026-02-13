import { ChevronDownIcon, ChevronRightIcon } from '@navikt/aksel-icons'
import { Label } from '@navikt/ds-react'
import { theme } from '../../../util'

interface IProps {
  title: string
  expanded: boolean
}

const PanelTitle = (props: IProps) => {
  const { title, expanded } = props

  return (
    <div>
      <Label style={{ color: theme.colors.primary }}>
        {expanded ? (
          <ChevronDownIcon aria-hidden className="block" />
        ) : (
          <ChevronRightIcon aria-hidden className="block" />
        )}
        <span> </span>
        <span>{title}</span>
      </Label>
    </div>
  )
}

export default PanelTitle
