import { StyledLink } from 'baseui/link'
import { LabelLarge, ParagraphXSmall } from 'baseui/typography'
import { canViewAlerts } from '../../pages/AlertEventPage'
import BKLogo from '../../resources/Behandlingskatalog_logo.svg'
import SlackLogo from '../../resources/Slack_Monochrome_White.svg'
import NavLogo from '../../resources/navlogo.svg'
import { theme } from '../../util'
import { datajegerSlackLink, helpLink } from '../../util/config'
import CustomizedStatefulTooltip from '../common/CustomizedStatefulTooltip'
import NavItem from './NavItem'

const Brand = () => (
  <div className="p-4">
    <StyledLink className="no-underline flex flex-col items-center" href="/">
      <img alt="logo" src={BKLogo} />
      <LabelLarge $style={{ fontSize: '115%' }} color="white" marginTop="1rem" marginLeft="5px" marginBottom="2rem">
        Behandlingskatalog
      </LabelLarge>
    </StyledLink>
  </div>
)

const SideBar = () => (
  <div className="h-full w-60 bg-[#3e3832] flex flex-col" role="navigation">
    <div className="h-full fixed flex flex-col">
      <Brand />
      <div className="top-[150px] flex-1 ml-4 pl-4">
        <NavItem
          to="/process"
          text="Behandlinger"
          tooltip="En aktivitet du gjør på personopplysninger for å oppnå et formål. Eks. på behandling: Saksbehandling av alderspensjon"
        />
        <NavItem to="/dpprocess" text="NAV som databehandler" />
        <NavItem to="/informationtype" text="Opplysningstyper" tooltip="Personopplysninger som f.eks. kjønn, sivilstand, pensjonsopptjening." />
        <NavItem
          to="/document"
          text="Dokumenter"
          tooltip="En samling av opplysningstyper. Sykmelding og inntektsmelding er eksempler på dokumenter som inneholder flere opplysningstyper."
        />
        <NavItem to="/disclosure" text="Utleveringer" tooltip="En samling av utleveringer av persondata fra NAV til eksterne bedrifter eller etater" />
        <NavItem to="/thirdparty" text="Eksterne parter" tooltip="Parter utenfor NAV som vi samhandler med. Eksempler er Folkeregisteret, Lånekassen, brukere, arbeidsgivere" />
        <NavItem to="/system" text="Systemer" tooltip="En samling av beslektede applikasjoner som sammen løser et forretningsbehov. F.eks. Pesys, Modia, Aa-reg" />
        <NavItem to="/processor" text="Databehandlere" />
        <NavItem to="/dashboard" text="Dashboard" tooltip="Oversikt og statistikk over behandlinger og andre samlinger i behandlingskatalogen" />
        {canViewAlerts() && <NavItem to="/alert/events" text="Varsler" />}
        <NavItem to="//navikt.github.io/naka/behandlingskatalog" text="Veileder" />
      </div>
      <div className="max-w-60 mt-[25px]">
        <div className="flex justify-center">
          <div className="pb-4 w-[40%]">
            <img src={NavLogo} alt="NAV logo" width="100%" />
          </div>
        </div>

        <a href={helpLink} style={{ textDecoration: 'none' }} target="_blank">
          <div className="flex justify-center pb-2.5 items-center">
            <CustomizedStatefulTooltip content="På navets personvernsider finner du informasjon til hjelp for utfylling." ignoreBoundary={false}>
              <ParagraphXSmall color={theme.colors.white}>Hjelp</ParagraphXSmall>
            </CustomizedStatefulTooltip>
          </div>
        </a>
        <a href={datajegerSlackLink} style={{ textDecoration: 'none' }}>
          <div className="flex justify-center items-center">
            <img src={SlackLogo} width="60px" alt="slack logo" />
            <ParagraphXSmall color={theme.colors.white}>#behandlingskatalogen</ParagraphXSmall>
          </div>
        </a>
      </div>
    </div>
  </div>
)

export default SideBar
