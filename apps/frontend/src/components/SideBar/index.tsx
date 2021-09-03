import * as React from 'react'
import {intl, theme} from '../../util'
import {Block, BlockProps} from 'baseui/block'
import {Label1, Paragraph4} from 'baseui/typography'
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
      <Label1 $style={{fontSize: '130%'}} color="white" marginTop="1rem" marginLeft="5px" marginBottom="2rem">Behandlingskatalog</Label1>
    </StyledLink>
  </Block>
)

const SideBar = () => {
  return (
    <Block {...sideBarProps} overrides={{Block: {props: {role: 'navigation'}}}}>
      <Brand/>
      <Block {...items} position={'fixed'} top={'150px'}>
        <NavItem to="/process" text={intl.processes} tooltip={intl.processSideMenuHelpText}/>
        <NavItem to="/dpProcess" text={intl.dpProcess}/>
        <NavItem to="/informationtype" text={intl.informationTypes} tooltip={intl.informationTypeSideMenuHelpText}/>
        <NavItem to="/document" text={intl.documents} tooltip={intl.documentSideMenuHelpText}/>
        <NavItem to="/disclosure" text={intl.disclosures} tooltip={intl.disclosuresSideMenuHelpText}/>
        <NavItem to="/thirdparty" text={intl.thirdParties} tooltip={intl.externalPartsSideMenuHelpText}/>
        <NavItem to="/system" text={intl.systems} tooltip={intl.systemSideMenuHelpText}/>
        <NavItem to="/processor" text={intl.processors} tooltip={intl.processorSideMenuHelpText}/>
        <NavItem to="/dashboard" text={intl.dashboard} tooltip={intl.dashboardSideMenuHelpText}/>
        {canViewAlerts() && <NavItem to="/alert/events" text={intl.alerts}/>}
      </Block>

      <Block bottom={0} marginTop={"auto"} position={'fixed'} maxWidth={"240px"}>
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
