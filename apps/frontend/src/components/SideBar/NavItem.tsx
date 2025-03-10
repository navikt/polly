import { faChevronDown, faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Tooltip } from '@navikt/ds-react'
import { ParagraphMedium } from 'baseui/typography'
import { useLocation } from 'react-router'
import RouteLink from '../common/RouteLink'

interface INavItemProps {
  text: string
  to: string
  tooltip?: string
}

const checkCurrentLocationIsTheSameAsSideBarItem = (
  currentLocationUrl: string,
  sidebarItemUrl: string
): boolean => {
  if (sidebarItemUrl.slice(0, 2) === '//') {
    return false
  }
  return currentLocationUrl.split('/')[1] === sidebarItemUrl.split('/')[1]
}

const NavItem = (props: INavItemProps) => (
  <RouteLink href={props.to} style={{ textDecoration: 'none' }}>
    <div className="flex items-center h-[35px]">
      <div className="mr-2.5">
        <FontAwesomeIcon
          icon={
            checkCurrentLocationIsTheSameAsSideBarItem(useLocation().pathname, props.to)
              ? faChevronDown
              : faChevronRight
          }
          color="white"
          size="lg"
        />
      </div>
      {props.tooltip ? (
        <Tooltip content={props.tooltip}>
          <ParagraphMedium color="white">{props.text}</ParagraphMedium>
        </Tooltip>
      ) : (
        <ParagraphMedium color="white">{props.text}</ParagraphMedium>
      )}
    </div>
  </RouteLink>
)

export default NavItem
