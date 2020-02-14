import * as React from 'react'
import { intl } from '../../util';
import { Block, BlockProps } from 'baseui/block';
import { H6, Paragraph2 } from 'baseui/typography';
import RouteLink from '../common/RouteLink';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';

const sideBarProps: BlockProps = {
    position: "relative",
    width: '230px',
    backgroundColor: '#3e3832',
    padding: '2rem'
}

const items: BlockProps = {
    marginLeft: "1rem",
    marginTop: '1rem'
}

const NavItem = (props: {text: string, to: string}) => (
    <React.Fragment>
        <RouteLink href={props.to}>
            <Block display="flex" alignItems="center">
                <Block marginRight="scale400"><FontAwesomeIcon icon={faChevronRight} color="white" size="lg"/></Block>
                <Paragraph2 color="white">{props.text}</Paragraph2>
            </Block>
        </RouteLink>
    </React.Fragment>
)

const Brand = (
    <Block display="flex" alignItems="center">
        <H6 color="white" marginTop="0" marginLeft="5px" marginBottom="2rem">Behandlingskatalog</H6>
    </Block>
)

const SideBar = () => {
    return (
        <Block {...sideBarProps}>
            {Brand}

            <Block {...items}>
                <NavItem to="/" text={intl.processingActivities} />
                <NavItem to="/" text={intl.informationTypes} />
                <NavItem to="/" text={intl.documents} />
                <NavItem to="/" text={intl.thirdParty} />
            </Block>
        </Block>
    )
}

export default SideBar
