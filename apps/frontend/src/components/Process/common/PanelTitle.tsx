import { faChevronDown, faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { LabelLarge } from 'baseui/typography'
import { theme } from '../../../util'

interface IProps {
  title: string
  expanded: boolean
}

const PanelTitle = (props: IProps) => {
  const { title, expanded } = props

  return (
    <div>
      <LabelLarge color={theme.colors.primary}>
        {expanded ? (
          <FontAwesomeIcon icon={faChevronDown} />
        ) : (
          <FontAwesomeIcon icon={faChevronRight} />
        )}
        <span> </span>
        <span>{title}</span>
      </LabelLarge>
    </div>
  )
}

export default PanelTitle
