import * as React from 'react'
import { intl, theme } from '../../util'
import { Block, BlockProps } from 'baseui/block'
import { LabelLarge, ParagraphXSmall } from 'baseui/typography'
import NavLogo from '../../resources/navlogo.svg'
import BKLogo from '../../resources/Behandlingskatalog_logo.svg'
import SlackLogo from '../../resources/Slack_Monochrome_White.svg'
import { StyledLink } from 'baseui/link'
import NavItem from './NavItem'
import { canViewAlerts } from '../../pages/AlertEventPage'
import { datajegerSlackLink, documentationLink, helpLink } from '../../util/config'
import CustomizedStatefulTooltip from '../common/CustomizedStatefulTooltip'

const sideBarProps: BlockProps = {
  height: '100%',
  width: '240px',
  backgroundColor: theme.colors.primaryA,
  display: 'flex',
  flexDirection: 'column',
}

const items: BlockProps = {
  marginLeft: '1rem',
  paddingLeft: '1rem',
}

const Brand = () => (
  <Block className="p-4">
    <StyledLink className="no-underline flex flex-col items-center" href="/">
      <img alt="logo" src={BKLogo} />
      <LabelLarge $style={{ fontSize: '115%' }} color="white" marginTop="1rem" marginLeft="5px" marginBottom="2rem">
        Behandlingskatalog
      </LabelLarge>
    </StyledLink>
  </Block>
)

const SideBar = () => {
  return (
    <Block {...sideBarProps} overrides={{ Block: { props: { role: 'navigation' } } }} height="100%">
      <Block height="100%" position="fixed" display="flex" style={{ flexDirection: 'column' }}>
        <Brand />
        <Block {...items} top={'150px'} flex="1">
          <NavItem to="/process" text={intl.processes} tooltip={intl.processSideMenuHelpText} />
          <NavItem to="/dpprocess" text={intl.dpProcess} />
          <NavItem to="/informationtype" text={intl.informationTypes} tooltip={intl.informationTypeSideMenuHelpText} />
          <NavItem to="/document" text={intl.documents} tooltip={intl.documentSideMenuHelpText} />
          <NavItem to="/disclosure" text={intl.disclosures} tooltip={intl.disclosuresSideMenuHelpText} />
          <NavItem to="/thirdparty" text={intl.thirdParties} tooltip={intl.externalPartsSideMenuHelpText} />
          <NavItem to="/system" text={intl.systems} tooltip={intl.systemSideMenuHelpText} />
          <NavItem to="/processor" text={intl.processors} tooltip={intl.processorSideMenuHelpText} />
          <NavItem to="/dashboard" text={intl.dashboard} tooltip={intl.dashboardSideMenuHelpText} />
          {canViewAlerts() && <NavItem to="/alert/events" text={intl.alerts} />}
          <NavItem to="//navikt.github.io/naka/behandlingskatalog" text={intl.supervisor} tooltip={intl.omBehandlingskatalog} />
        </Block>
        <Block maxWidth={'240px'} marginTop="25px">
          <Block display="flex" justifyContent="center">
            <Block paddingBottom={theme.sizing.scale600} width="40%">
              <img src={NavLogo} alt="NAV logo" width="100%" />
            </Block>
          </Block>

          <a href={helpLink} style={{ textDecoration: 'none' }} target="_blank">
            <Block display="flex" justifyContent="center" paddingBottom={theme.sizing.scale400} alignItems="center">
              <CustomizedStatefulTooltip content={intl.helpTooltip} ignoreBoundary={false}>
                <ParagraphXSmall color={theme.colors.white}>{intl.help}</ParagraphXSmall>
              </CustomizedStatefulTooltip>
            </Block>
          </a>
          <a href={datajegerSlackLink} style={{ textDecoration: 'none' }}>
            <Block display="flex" justifyContent="center" alignItems="center">
              <img src={SlackLogo} width="60px" alt="slack logo" />
              <ParagraphXSmall color={theme.colors.white}>#behandlingskatalogen</ParagraphXSmall>
            </Block>
          </a>
        </Block>
      </Block>
    </Block>
  )
}

export default SideBar
