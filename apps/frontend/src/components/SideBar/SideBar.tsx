import * as React from 'react'
import { theme } from '../../util'
import { Block, BlockProps } from 'baseui/block'
import { LabelLarge, ParagraphXSmall } from 'baseui/typography'
import NavLogo from '../../resources/navlogo.svg'
import BKLogo from '../../resources/Behandlingskatalog_logo.svg'
import SlackLogo from '../../resources/Slack_Monochrome_White.svg'
import { StyledLink } from 'baseui/link'
import NavItem from './NavItem'
import { canViewAlerts } from '../../pages/AlertEventPage'
import { datajegerSlackLink, helpLink } from '../../util/config'
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
          <NavItem to="/process" text='Behandlinger' tooltip='En aktivitet du gjør på personopplysninger for å oppnå et formål. Eks. på behandling: Saksbehandling av alderspensjon' />
          <NavItem to="/dpprocess" text='NAV som databehandler'/>
          <NavItem to="/informationtype" text='Opplysningstyper' tooltip='Personopplysninger som f.eks. kjønn, sivilstand, pensjonsopptjening.' />
          <NavItem to="/document" text='Dokumenter' tooltip='En samling av opplysningstyper. Sykmelding og inntektsmelding er eksempler på dokumenter som inneholder flere opplysningstyper.' />
          <NavItem to="/disclosure" text='Utleveringer' tooltip='En samling av utleveringer av persondata fra NAV til eksterne bedrifter eller etater' />
          <NavItem to="/thirdparty" text='Eksterne parter' tooltip='Parter utenfor NAV som vi samhandler med. Eksempler er Folkeregisteret, Lånekassen, brukere, arbeidsgivere' />
          <NavItem to="/system" text='Systemer' tooltip='En samling av beslektede applikasjoner som sammen løser et forretningsbehov. F.eks. Pesys, Modia, Aa-reg' />
          <NavItem to="/processor" text='Databehandlere'/>
          <NavItem to="/dashboard" text='Dashboard' tooltip='Oversikt og statistikk over behandlinger og andre samlinger i behandlingskatalogen' />
          {canViewAlerts() && <NavItem to="/alert/events" text='Varsler' />}
          <NavItem to="//navikt.github.io/naka/behandlingskatalog" text='Veileder'/>
        </Block>
        <Block maxWidth={'240px'} marginTop="25px">
          <Block display="flex" justifyContent="center">
            <Block paddingBottom={theme.sizing.scale600} width="40%">
              <img src={NavLogo} alt="NAV logo" width="100%" />
            </Block>
          </Block>

          <a href={helpLink} style={{ textDecoration: 'none' }} target="_blank">
            <Block display="flex" justifyContent="center" paddingBottom={theme.sizing.scale400} alignItems="center">
              <CustomizedStatefulTooltip content='På navets personvernsider finner du informasjon til hjelp for utfylling.' ignoreBoundary={false}>
                <ParagraphXSmall color={theme.colors.white}>Hjelp</ParagraphXSmall>
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
