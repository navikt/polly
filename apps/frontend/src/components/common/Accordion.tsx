import { faChevronDown, faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export const toggleOverride = {
  component: (iconProps: any) => {
    return iconProps.title !== 'Expand' ? (
      <FontAwesomeIcon icon={faChevronDown} />
    ) : (
      <FontAwesomeIcon icon={faChevronRight} />
    )
  },
}
