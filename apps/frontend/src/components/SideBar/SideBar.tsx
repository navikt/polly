import { BodyShort } from '@navikt/ds-react'
import { canViewAlerts } from '../../pages/AlertEventPage'
import SlackLogo from '../../resources/Slack_Monochrome_White.svg'
import NavLogo from '../../resources/navlogo.svg'
import { datajegerSlackLink } from '../../util/config'
import NavItem from './NavItem'

const SideBar = () => (
  <div
    className="h-full w-60 bg-black! flex flex-col"
    style={{ backgroundColor: '#1B232F' }}
    role="navigation"
  >
    <div className="sticky top-0 h-screen flex flex-col">
      <div className="flex-1 min-h-0 pl-3 pr-3 pt-6 overflow-y-auto">
        <NavItem
          to="/process"
          text="Behandlinger"
          tooltip="En aktivitet du gjør på personopplysninger for å oppnå et formål. Eks. på behandling: Saksbehandling av alderspensjon"
        />
        <NavItem to="/dpprocess" text="Nav som databehandler" noWrap />
        <NavItem
          to="/informationtype"
          text="Opplysningstyper"
          tooltip="Personopplysninger som f.eks. kjønn, sivilstand, pensjonsopptjening."
        />
        <NavItem
          to="/document"
          text="Dokumenter"
          tooltip="En samling av opplysningstyper. Sykmelding og inntektsmelding er eksempler på dokumenter som inneholder flere opplysningstyper."
        />
        <NavItem
          to="/disclosure"
          text="Utleveringer"
          tooltip="En samling av utleveringer av persondata fra Nav til eksterne bedrifter eller etater"
        />
        <NavItem
          to="/thirdparty"
          text="Eksterne parter"
          tooltip="Parter utenfor Nav som vi samhandler med. Eksempler er Folkeregisteret, Lånekassen, brukere, arbeidsgivere"
        />
        <NavItem
          to="/system"
          text="Systemer"
          tooltip="En samling av beslektede applikasjoner som sammen løser et forretningsbehov. F.eks. Pesys, Modia, Aa-reg"
        />
        <NavItem to="/processor" text="Databehandlere" />
        <NavItem
          to="/dashboard"
          text="Dashboard"
          tooltip="Oversikt og statistikk over behandlinger og andre samlinger i behandlingskatalogen"
        />
        {canViewAlerts() && (
          <div>
            <NavItem to="/alert/events" text="Varsler" />
          </div>
        )}
        <NavItem to="//navikt.github.io/naka/behandlingskatalog" text="Veileder" />
      </div>

      <div className="max-w-62 mt-auto pt-6 pb-22">
        <div className="flex justify-center">
          <div className="pb-4 w-[40%]">
            <img src={NavLogo} alt="Nav logo" width="100%" />
          </div>
        </div>

        <a href={datajegerSlackLink} style={{ textDecoration: 'none' }}>
          <div className="flex justify-center items-center">
            <img src={SlackLogo} width="60px" alt="slack logo" />
            <BodyShort size="small" style={{ color: '#E0E1E5' }}>
              #behandlingskatalogen
            </BodyShort>
          </div>
        </a>
      </div>
    </div>
  </div>
)

export default SideBar
