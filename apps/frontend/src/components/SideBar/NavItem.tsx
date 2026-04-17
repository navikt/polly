import { useLocation } from '@/util/router'
import { ChevronDownIcon, ChevronRightIcon } from '@navikt/aksel-icons'
import { BodyShort, Tooltip } from '@navikt/ds-react'
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

const NavItem = (props: INavItemProps) => {
  const isActive = checkCurrentLocationIsTheSameAsSideBarItem(useLocation().pathname, props.to)
  const textColor = isActive ? '#ffffff' : '#E0E1E5'

  return (
    <RouteLink href={props.to} style={{ textDecoration: 'none' }} className="block w-full">
      <div className="flex items-center h-8.75">
        <div className="mr-2.5">
          {isActive ? (
            <ChevronDownIcon
              aria-hidden
              className="block"
              style={{ fontSize: '1.5rem', color: textColor }}
            />
          ) : (
            <ChevronRightIcon
              aria-hidden
              className="block"
              style={{ fontSize: '1.5rem', color: textColor }}
            />
          )}
        </div>
        {props.tooltip ? (
          <Tooltip content={props.tooltip} maxChar={200}>
            <BodyShort
              size="small"
              style={{
                color: textColor,
                fontWeight: isActive ? 600 : undefined,
                whiteSpace: props.noWrap ? 'nowrap' : undefined,
              }}
            >
              {props.text}
            </BodyShort>
          </Tooltip>
        ) : (
          <BodyShort
            size="small"
            style={{
              color: textColor,
              fontWeight: isActive ? 600 : undefined,
              whiteSpace: props.noWrap ? 'nowrap' : undefined,
            }}
          >
            {props.text}
          </BodyShort>
        )}
      </div>
    </RouteLink>
  )
}

export default NavItem
