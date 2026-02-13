import { ChevronDownIcon, ChevronRightIcon } from '@navikt/aksel-icons'
import { BodyShort, Tooltip } from '@navikt/ds-react'
import { useLocation } from 'react-router'
import RouteLink from '../common/RouteLink'

interface INavItemProps {
  text: string
  to: string
  tooltip?: string
  noWrap?: boolean
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
  <RouteLink href={props.to} style={{ textDecoration: 'none' }} className="block w-full">
    <div className="flex items-center h-8.75">
      <div className="mr-2.5">
        {checkCurrentLocationIsTheSameAsSideBarItem(useLocation().pathname, props.to) ? (
          <ChevronDownIcon
            aria-hidden
            className="block !text-[#dcdde2]"
            style={{ fontSize: '1.5rem' }}
          />
        ) : (
          <ChevronRightIcon
            aria-hidden
            className="block !text-[#dcdde2]"
            style={{ fontSize: '1.5rem' }}
          />
        )}
      </div>
      {props.tooltip ? (
        <Tooltip content={props.tooltip}>
          <BodyShort
            size="small"
            style={{ color: '#E0E1E5', whiteSpace: props.noWrap ? 'nowrap' : undefined }}
          >
            {props.text}
          </BodyShort>
        </Tooltip>
      ) : (
        <BodyShort
          size="small"
          style={{ color: '#E0E1E5', whiteSpace: props.noWrap ? 'nowrap' : undefined }}
        >
          {props.text}
        </BodyShort>
      )}
    </div>
  </RouteLink>
)

export default NavItem
