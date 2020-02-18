import * as React from 'react'
import { intl } from '../../util';
import { Block, BlockProps } from 'baseui/block';
import { H6, Paragraph2 } from 'baseui/typography';
import RouteLink from '../common/RouteLink';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';

const sideBarProps: BlockProps = {
    position: 'fixed',
    height: "100%",
    width: '240px',
    backgroundColor: '#3e3832',
}

const items: BlockProps = {
    marginLeft: "1rem",
    paddingLeft: '1rem'
}

const NavItem = (props: { text: string, to: string }) => (
    <React.Fragment>
        <RouteLink href={props.to}>
            <Block display="flex" alignItems="center" >
                <Block marginRight="scale400"><FontAwesomeIcon icon={faChevronRight} color="white" size="lg" /></Block>
                <Paragraph2 color="white">{props.text}</Paragraph2>
            </Block>
        </RouteLink>
    </React.Fragment>
)

const Brand = (
    <RouteLink href="/">
        <Block display="flex" alignItems="center" padding="1rem" marginTop="1rem">
            <H6 color="white" marginTop="0" marginLeft="5px" marginBottom="2rem">Behandlingskatalog</H6>
        </Block>
    </RouteLink>

)

const SideBar = () => {
    return (
        <Block {...sideBarProps}>
            {Brand}

            <Block {...items}>
                <NavItem to="/purpose" text={intl.processingActivities} />
                <NavItem to="/informationtype" text={intl.informationTypes} />
                <NavItem to="/document" text={intl.documents} />
                <NavItem to="/thirdparty" text={intl.thirdParty} />
            </Block>
        </Block>
    )
}

export default SideBar
