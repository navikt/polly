import { CaretDownIcon, PersonIcon, ThemeIcon } from '@navikt/aksel-icons'
import { Button, Dropdown, InternalHeader, Label, Link, Popover, Spacer } from '@navikt/ds-react'
import { useRef, useState } from 'react'
import { useLocation } from 'react-router'
import { user } from '../service/User'
import { TThemeMode } from '../util/themeMode'
import MainSearch from './search/MainSearch'

function useCurrentUrl() {
  const location = useLocation()
  return window.location.protocol + '//' + window.location.host + location.pathname
}

const LoggedInHeader = () => {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [openState, setOpenState] = useState(false)

  return (
    <>
      <Button
        variant="tertiary"
        data-color="neutral"
        icon={
          <span className="flex items-center leading-none">
            <PersonIcon aria-hidden className="block" />
          </span>
        }
        ref={buttonRef}
        onClick={() => setOpenState(!openState)}
        aria-expanded={openState}
      >
        {user.getIdent()}
      </Button>

      <Popover open={openState} onClose={() => setOpenState(false)} anchorEl={buttonRef.current}>
        <Popover.Content>
          <div className="p-2">
            <Label>Navn: {user.getName()}</Label>
            <Label>Grupper: {user.getGroupsHumanReadable().join(', ')}</Label>
            <div className="flex w-full p-1">
              <Link variant="neutral" href={`/logout?redirect_uri=${useCurrentUrl()}`}>
                Logg ut
              </Link>
            </div>
          </div>
        </Popover.Content>
      </Popover>
    </>
  )
}

const LoginButton = () => (
  <InternalHeader.Button as="a" href={`/login?redirect_uri=${useCurrentUrl()}`}>
    Logg inn
  </InternalHeader.Button>
)

const AdminOptions = () => {
  const pages = [
    { label: 'Administrering av kodeverk', href: '/admin/codelist' },
    { label: 'Versjonering', href: '/admin/audit' },
    { label: 'Innstillinger', href: '/admin/settings' },
    { label: 'Mail log', href: '/admin/maillog' },
    { label: 'Trenger revidering', href: '/admin/request-revision', super: true },
  ]

  return (
    <Dropdown>
      <InternalHeader.Button as={Dropdown.Toggle}>
        Admin <CaretDownIcon title="a11y-title" fontSize="1.5rem" aria-hidden />
      </InternalHeader.Button>

      <Dropdown.Menu>
        <Dropdown.Menu.List>
          {pages.map((page) => (
            <Dropdown.Menu.List.Item key={page.label} as={Link} variant="neutral" href={page.href}>
              {page.label}
            </Dropdown.Menu.List.Item>
          ))}
        </Dropdown.Menu.List>
      </Dropdown.Menu>
    </Dropdown>
  )
}

interface IHeaderProps {
  themeMode: TThemeMode
  onThemeModeChange: (mode: TThemeMode) => void
}

const Header = ({ themeMode, onThemeModeChange }: IHeaderProps) => (
  <InternalHeader className="polly-white-internalheader">
    <InternalHeader.Title href="/">Behandlingskatalog</InternalHeader.Title>
    <Spacer />
    <div className="flex items-center py-2">
      <MainSearch />
    </div>
    <Spacer />
    <div className="flex items-center px-2">
      <Button
        variant="tertiary"
        data-color="neutral"
        icon={<ThemeIcon aria-hidden />}
        aria-label={themeMode === 'dark' ? 'Bytt til lyst tema' : 'Bytt til mørkt tema'}
        aria-pressed={themeMode === 'dark'}
        onClick={() => onThemeModeChange(themeMode === 'dark' ? 'light' : 'dark')}
      />
    </div>
    {(user.isAdmin() || user.isSuper()) && <AdminOptions />}
    {!user.isLoggedIn() && <LoginButton />}
    {user.isLoggedIn() && <LoggedInHeader />}
  </InternalHeader>
)

export default Header
