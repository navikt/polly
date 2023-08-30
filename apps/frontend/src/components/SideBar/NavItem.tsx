import * as React from 'react'
import RouteLink from '../common/RouteLink'
import { Block } from 'baseui/block'
import { ParagraphMedium } from 'baseui/typography'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown, faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { useLocation } from 'react-router-dom'
import CustomizedStatefulTooltip from '../common/CustomizedStatefulTooltip'

interface NavItemProps {
  text: string
  to: string
  tooltip?: string
}

const checkCurrentLocationIsTheSameAsSideBarItem = (currentLocationUrl: string, sidebarItemUrl: string): boolean => {
  if (sidebarItemUrl.slice(0, 2) === '//') {
    return false
  }
  return currentLocationUrl.split('/')[1] === sidebarItemUrl.split('/')[1]
}

const NavItem = (props: NavItemProps) => (
  <RouteLink href={props.to} style={{ textDecoration: 'none' }}>
    <Block display="flex" alignItems="center" height={'35px'}>
      <Block marginRight="scale400">
        <FontAwesomeIcon icon={checkCurrentLocationIsTheSameAsSideBarItem(useLocation().pathname, props.to) ? faChevronDown : faChevronRight} color="white" size="lg" />
      </Block>
      {!!props.tooltip ? (
        <CustomizedStatefulTooltip content={props.tooltip} ignoreBoundary={false}>
          <ParagraphMedium color="white">{props.text}</ParagraphMedium>
        </CustomizedStatefulTooltip>
      ) : (
        <ParagraphMedium color="white">{props.text}</ParagraphMedium>
      )}
    </Block>
  </RouteLink>
)

export default NavItem
