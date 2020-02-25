import * as React from 'react'
import RouteLink from '../common/RouteLink'
import { Block } from 'baseui/block'
import { Paragraph2 } from 'baseui/typography'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight } from '@fortawesome/free-solid-svg-icons'

interface NavItemProps {
    text: string;
    to: string;
}

const NavItem = (props: NavItemProps) => (
    <React.Fragment>
        <RouteLink href={props.to}>
            <Block display="flex" alignItems="center">
                <Block marginRight="scale400"><FontAwesomeIcon icon={faChevronRight} color="white" size="lg" /></Block>
                <Paragraph2 color="white">{props.text}</Paragraph2>
            </Block>
        </RouteLink>
    </React.Fragment>
)

export default NavItem