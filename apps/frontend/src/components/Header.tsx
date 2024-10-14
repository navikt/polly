import { faUser } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Dropdown, Link, Popover } from '@navikt/ds-react'
import { BlockProps } from 'baseui/block'
import {
  ALIGN,
  HeaderNavigation,
  StyledNavigationItem as NavigationItem,
  StyledNavigationList as NavigationList,
} from 'baseui/header-navigation'
import { TriangleDown } from 'baseui/icon'
import { StyledLink } from 'baseui/link'
import { LabelMedium } from 'baseui/typography'
import { useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { user } from '../service/User'
import { theme } from '../util'
import { paddingAll } from './common/Style'
import MainSearch from './search/MainSearch'

function useCurrentUrl() {
  const location = useLocation()
  return window.location.protocol + '//' + window.location.host + location.pathname
}

const LoggedInHeader = () => {
  const blockStyle: BlockProps = {
    display: 'flex',
    width: '100%',
    ...paddingAll(theme.sizing.scale100),
  }

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
            <LabelMedium {...blockStyle}>Navn: {user.getName()}</LabelMedium>
            <LabelMedium {...blockStyle}>
              Grupper: {user.getGroupsHumanReadable().join(', ')}
            </LabelMedium>
            <div className="flex w-full p-1">
              <StyledLink href={`/logout?redirect_uri=${useCurrentUrl()}`}>Logg ut</StyledLink>
            </div>
          </div>
        </Popover.Content>
      </Popover>
    </>
  )
}

const LoginButton = () => (
  <StyledLink href={`/login?redirect_uri=${useCurrentUrl()}`}>
    <Button
      style={{
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
      }}
    >
      Logg inn
    </Button>
  </StyledLink>
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
      <Button as={Dropdown.Toggle} variant="tertiary">
        Admin <TriangleDown size={24} />
      </Button>
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
  <div className="px-7">
    <HeaderNavigation
      overrides={{ Root: { style: { paddingBottom: 0, borderBottomStyle: 'none' } } }}
    >
      <NavigationList $align={ALIGN.left}>
        <NavigationItem $style={{ paddingLeft: 0 }}>
          <MainSearch />
        </NavigationItem>
      </NavigationList>

      <div className="ml-auto">
        <NavigationList $align={ALIGN.right}>
          {(user.isAdmin() || user.isSuper()) && (
            <NavigationItem $style={{ paddingLeft: 0 }}>
              <AdminOptions />
            </NavigationItem>
          )}

          {!user.isLoggedIn() && (
            <NavigationItem $style={{ paddingLeft: 0 }}>
              <LoginButton />
            </NavigationItem>
          )}
          {user.isLoggedIn() && (
            <NavigationItem $style={{ paddingLeft: 0 }}>
              <LoggedInHeader />
            </NavigationItem>
          )}
        </NavigationList>
      </div>
    </HeaderNavigation>
  </div>
)

export default Header
