'use client'

import { useLocation, useNavigate } from '@/util/router'
import { CaretDownIcon, PersonIcon } from '@navikt/aksel-icons'
import {
  Button,
  Dropdown,
  InternalHeader,
  Label,
  Link,
  Popover,
  ToggleGroup,
} from '@navikt/ds-react'
import { useContext, useEffect, useState } from 'react'
import { EGroup, IUserContext, UserContext } from '../service/User'
import { TThemeMode } from '../util/themeMode'
import MainSearch from './search/MainSearch'

function useAbsoluteCurrentUrl() {
  const location = useLocation()

  if (typeof window === 'undefined') {
    return undefined
  }

  return `${window.location.origin}${location.pathname}${location.search ?? ''}${location.hash ?? ''}`
}

const LoggedInHeader = () => {
  const user: IUserContext = useContext(UserContext)
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
  const [openState, setOpenState] = useState(false)
  const redirectUri = useAbsoluteCurrentUrl()

  return (
    <>
      <Button
        variant='tertiary'
        data-color='neutral'
        icon={
          <span className='flex items-center leading-none'>
            <PersonIcon aria-hidden className='block' />
          </span>
        }
        ref={setAnchorEl}
        onClick={() => setOpenState(!openState)}
        aria-expanded={openState}
      >
        {user.getIdent()}
      </Button>

      <Popover open={openState} onClose={() => setOpenState(false)} anchorEl={anchorEl}>
        <Popover.Content>
          <div className='p-2'>
            <div>
              <Label>Navn: {user.getName()}</Label>
            </div>
            <div>
              <Label>Grupper: {user.getGroupsHumanReadable().join(', ')}</Label>
            </div>
            <div className='flex w-full p-1'>
              <Link
                variant='neutral'
                href={
                  redirectUri
                    ? `/logout?redirect_uri=${encodeURIComponent(redirectUri)}`
                    : '/logout'
                }
              >
                Logg ut
              </Link>
            </div>
          </div>
        </Popover.Content>
      </Popover>
    </>
  )
}

const LoginButton = () => {
  const redirectUri = useAbsoluteCurrentUrl()
  const href = redirectUri ? `/login?redirect_uri=${encodeURIComponent(redirectUri)}` : '/login'

  return (
    <InternalHeader.Button as='a' href={href}>
      Logg inn
    </InternalHeader.Button>
  )
}

interface IAdminOptionsProps {
  showPermissionOverrides: boolean
}

const AdminOptions = ({ showPermissionOverrides }: IAdminOptionsProps) => {
  const user = useContext(UserContext)

  const [activeToggle, setActiveToggle] = useState<string>(EGroup.ADMIN.toString())

  const location = useLocation()
  const navigate = useNavigate()

  const pages = [
    { label: 'Administrering av kodeverk', href: '/admin/codelist' },
    { label: 'Endringer i behandlinger', href: '/admin/process-changes' },
    { label: 'Innstillinger', href: '/admin/settings' },
    { label: 'Mail log', href: '/admin/maillog' },
    { label: 'Trenger revidering', href: '/admin/request-revision', super: true },
    { label: 'Varsler', href: '/alert/events' },
    { label: 'Versjonering', href: '/admin/audit' },
  ]

  useEffect(() => {
    ;(async () => {
      const roles = sessionStorage.getItem('activeRoles')
      if (roles) {
        try {
          const parsedRoles = JSON.parse(roles)
          if (parsedRoles.length !== 0) {
            setActiveToggle(parsedRoles)
            user.updateCurrentMode(parsedRoles)
          }
        } catch {
          sessionStorage.removeItem('activeRoles')
        }
      }
    })()
  }, [])

  const onRoleChange = (group: EGroup): void => {
    setActiveToggle(group)
    user.updateCurrentMode(group)
    sessionStorage.setItem('activeRoles', JSON.stringify(group))
    if (group !== EGroup.ADMIN && location.pathname.startsWith('/admin')) {
      navigate('/')
    }
  }

  return (
    <Dropdown>
      <InternalHeader.Button as={Dropdown.Toggle}>
        Admin <CaretDownIcon title='a11y-title' fontSize='1.5rem' aria-hidden />
      </InternalHeader.Button>

      <Dropdown.Menu>
        <Dropdown.Menu.List>
          {pages.map((page) => (
            <Dropdown.Menu.List.Item key={page.label} as={Link} variant='neutral' href={page.href}>
              {page.label}
            </Dropdown.Menu.List.Item>
          ))}
        </Dropdown.Menu.List>

        {showPermissionOverrides && (
          <div className='p-2 pt-3'>
            <ToggleGroup
              size='small'
              aria-label='Tilgangsmodus'
              value={activeToggle}
              onChange={(value) => {
                onRoleChange(value as EGroup)
              }}
            >
              <ToggleGroup.Item value={EGroup.ADMIN.toString()}>Admin</ToggleGroup.Item>
              <ToggleGroup.Item value={EGroup.WRITE.toString()}>Skriv</ToggleGroup.Item>
              <ToggleGroup.Item value={EGroup.READ.toString()}>Les</ToggleGroup.Item>
            </ToggleGroup>
          </div>
        )}
      </Dropdown.Menu>
    </Dropdown>
  )
}

interface IHeaderProps {
  themeMode: TThemeMode
  onThemeModeChange: (mode: TThemeMode) => void
}

const Header = ({ themeMode, onThemeModeChange }: IHeaderProps) => {
  const user: IUserContext = useContext(UserContext)

  const canUsePermissionOverrides = user.hasGroup(EGroup.ADMIN) || user.hasGroup(EGroup.SUPER)

  return (
    <InternalHeader className='polly-white-internalheader'>
      <InternalHeader.Title href='/'>Behandlingskatalog</InternalHeader.Title>
      <div className='polly-header-search flex items-center justify-center py-2 min-w-35 basis-0 grow-6 shrink'>
        <MainSearch />
      </div>
      <div className='polly-header-right flex items-center gap-2'>
        <div className='flex items-center px-2'>
          <ToggleGroup
            size='small'
            aria-label='Tema'
            value={themeMode}
            onChange={(value) => {
              if (value === 'dark' || value === 'light') {
                onThemeModeChange(value)
              }
            }}
          >
            <ToggleGroup.Item value='light'>Lyst tema</ToggleGroup.Item>
            <ToggleGroup.Item value='dark'>Mørkt tema</ToggleGroup.Item>
          </ToggleGroup>
        </div>

        {canUsePermissionOverrides && (
          <AdminOptions showPermissionOverrides={canUsePermissionOverrides} />
        )}
        {!user.isLoggedIn() && <LoginButton />}
        {user.isLoggedIn() && <LoggedInHeader />}
      </div>
    </InternalHeader>
  )
}

export default Header
