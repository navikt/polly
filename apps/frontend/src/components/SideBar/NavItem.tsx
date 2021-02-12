import * as React from 'react'
import RouteLink from '../common/RouteLink'
import {Block} from 'baseui/block'
import {Paragraph2} from 'baseui/typography'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faChevronDown, faChevronRight} from '@fortawesome/free-solid-svg-icons'
import {useLocation} from 'react-router-dom'
import CustomizedStatefulTooltip from "../common/CustomizedStatefulTooltip";

interface NavItemProps {
  text: string;
  to: string;
  tooltip?: string;
}

const NavItem = (props: NavItemProps) => (
  <RouteLink href={props.to} style={{textDecoration: 'none'}}>
    <Block display="flex" alignItems="center" height={"35px"}>
      <Block marginRight="scale400">
        <FontAwesomeIcon
          icon={useLocation().pathname.split("/")[1].includes(props.to.split("/")[1]) ? faChevronDown : faChevronRight}
          color="white"
          size="lg"/>
      </Block>
      {!!props.tooltip ? (<CustomizedStatefulTooltip content={props.tooltip} ignoreBoundary={false}>
          <Paragraph2 color="white">{props.text}</Paragraph2>
        </CustomizedStatefulTooltip>) :
        <Paragraph2 color="white">{props.text}</Paragraph2>
      }
    </Block>
  </RouteLink>
)

export default NavItem
