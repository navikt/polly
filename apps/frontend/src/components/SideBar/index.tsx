import * as React from 'react'
import {intl, theme} from '../../util'
import {Block, BlockProps} from 'baseui/block'
import {H6, Paragraph4} from 'baseui/typography'
import NavLogo from '../../resources/navlogo.svg'
import BKLogo from '../../resources/Behandlingskatalog_logo.svg'
import SlackLogo from '../../resources/Slack_Monochrome_White.svg'
import {StyledLink} from 'baseui/link'
import NavItem from './NavItem'
import {canViewAlerts} from '../../pages/AlertEventPage'
import {datajegerSlackLink, documentationLink, helpLink} from '../../util/config'
import CustomizedStatefulTooltip from "../common/CustomizedStatefulTooltip";

const sideBarProps: BlockProps = {
  height: '100%',
  width: '240px',
  backgroundColor: theme.colors.primaryA,
  display: "flex",
  flexDirection: "column"
}

const items: BlockProps = {
  marginLeft: '1rem',
  paddingLeft: '1rem'
}

const Brand = () => (

  <Block display="flex" flexDirection='column' padding="1rem" position={'fixed'}>
    <StyledLink style={{textDecoration: 'none', textAlign: 'center'}} href="/">
      <img alt='logo' src={BKLogo}/>
      <H6 color="white" marginTop="1rem" marginLeft="5px" marginBottom="2rem">Behandlingskatalog</H6>
    </StyledLink>
  </Block>
)

const SideBar = () => {
  return (
    <Block {...sideBarProps}>
      <Brand/>
      <Block {...items} position={'fixed'} top={'150px'}>
        <NavItem to="/process" text={intl.processes} tooltip={intl.processSideMenuHelpText}/>
        <NavItem to="/dpprocess" text={intl.dpProcess} />
        <NavItem to="/informationtype" text={intl.informationTypes} tooltip={intl.informationTypeSideMenuHelpText}/>
        <NavItem to="/document" text={intl.documents} tooltip={intl.documentSideMenuHelpText}/>

        <Block height={theme.sizing.scale600}/>
        <NavItem to="/thirdparty" text={intl.thirdParties} tooltip={intl.externalPartsSideMenuHelpText}/>
        <NavItem to="/system" text={intl.systems} tooltip={intl.systemSideMenuHelpText}/>
        <NavItem to="/disclosure" text={intl.disclosures} tooltip={intl.disclosuresSideMenuHelpText}/>

        <Block height={theme.sizing.scale800}/>
        <NavItem to="/dashboard" text={intl.dashboard} tooltip={intl.dashboardSideMenuHelpText}/>
        {canViewAlerts() && <NavItem to="/alert/events" text={intl.alerts}/>}
      </Block>

      <Block bottom={0} marginTop={"auto"} position={'fixed'}>
        <Block display="flex" justifyContent="center">
          <Block paddingBottom={theme.sizing.scale600} width="40%">
            <img src={NavLogo} alt='NAV logo' width="100%"/>
          </Block>
        </Block>

        <a href={helpLink} style={{textDecoration: 'none'}} target="_blank">
          <Block display="flex" justifyContent="center" paddingBottom={theme.sizing.scale400} alignItems="center">
            <CustomizedStatefulTooltip content={intl.helpTooltip} ignoreBoundary={false}>
              <Paragraph4 color={theme.colors.white}>{intl.help}</Paragraph4>
            </CustomizedStatefulTooltip>
          </Block>
        </a>
        <a href={datajegerSlackLink} style={{textDecoration: 'none'}}>
          <Block display="flex" justifyContent="center" alignItems="center">
            <img src={SlackLogo} width="60px" alt="slack logo"/>
            <Paragraph4 color={theme.colors.white}>#behandlingskatalogen</Paragraph4>
          </Block>
        </a>
        <a href={documentationLink} style={{textDecoration: 'none'}} target="_blank">
          <Block display="flex" justifyContent="center" paddingBottom={theme.sizing.scale400} alignItems="center">
            <Paragraph4 color={theme.colors.white}>{intl.aboutUs}</Paragraph4>
          </Block>
        </a>
      </Block>
    </Block>
  )
}

export default SideBar
