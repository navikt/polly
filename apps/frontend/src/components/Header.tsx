import { faUser } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { CaretDownIcon } from '@navikt/aksel-icons'
import { Button, Dropdown, InternalHeader, Label, Link, Popover, Spacer } from '@navikt/ds-react'
import { useRef, useState } from 'react'
import { useLocation } from 'react-router'
import { user } from '../service/User'
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
        icon={<FontAwesomeIcon icon={faUser} />}
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
              <Link href={`/logout?redirect_uri=${useCurrentUrl()}`}>Logg ut</Link>
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
            <Dropdown.Menu.List.Item key={page.label} as={Link} href={page.href}>
              {page.label}
            </Dropdown.Menu.List.Item>
          ))}
        </Dropdown.Menu.List>
      </Dropdown.Menu>
    </Dropdown>
  )
}

const Header = () => (
  <InternalHeader className="polly-white-internalheader">
    <div className="ml-[28px]">
      <MainSearch />
    </div>
    <Spacer />
    {(user.isAdmin() || user.isSuper()) && <AdminOptions />}
    {!user.isLoggedIn() && <LoginButton />}
    {user.isLoggedIn() && <LoggedInHeader />}
  </InternalHeader>
)

export default Header
