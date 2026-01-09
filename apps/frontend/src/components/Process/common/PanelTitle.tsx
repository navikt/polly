import { faChevronDown, faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
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
          <FontAwesomeIcon icon={faChevronDown} />
        ) : (
          <FontAwesomeIcon icon={faChevronRight} />
        )}
        <span> </span>
        <span>{title}</span>
      </Label>
    </div>
  )
}

export default PanelTitle
