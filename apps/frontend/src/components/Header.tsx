import { faUser } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { BlockProps } from 'baseui/block'
import { Button } from 'baseui/button'
import {
  ALIGN,
  HeaderNavigation,
  StyledNavigationItem as NavigationItem,
  StyledNavigationList as NavigationList,
} from 'baseui/header-navigation'
import { TriangleDown } from 'baseui/icon'
import { StyledLink } from 'baseui/link'
import { StatefulMenu } from 'baseui/menu'
import { StatefulPopover } from 'baseui/popover'
import { LabelMedium } from 'baseui/typography'
import { useLocation, useNavigate } from 'react-router-dom'
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

  return (
    <StatefulPopover
      content={
        <div className="p-2">
          <LabelMedium {...blockStyle}>Navn: {user.getName()}</LabelMedium>
          <LabelMedium {...blockStyle}>
            Grupper: {user.getGroupsHumanReadable().join(', ')}
          </LabelMedium>
          <div className="flex w-full p-1">
            <StyledLink href={`/logout?redirect_uri=${useCurrentUrl()}`}>Logg ut</StyledLink>
          </div>
        </div>
      }
    >
      <Button kind="tertiary" startEnhancer={() => <FontAwesomeIcon icon={faUser} />}>
        {user.getIdent()}
      </Button>
    </StatefulPopover>
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
  const navigate = useNavigate()
  const pages = [
    { label: 'Administrering av kodeverk', href: '/admin/codelist' },
    { label: 'Versjonering', href: '/admin/audit' },
    { label: 'Innstillinger', href: '/admin/settings' },
    { label: 'Mail log', href: '/admin/maillog' },
    { label: 'Trenger revidering', href: '/admin/request-revision', super: true },
  ]

  return (
    <StatefulPopover
      content={({ close }) => (
        <StatefulMenu
          items={pages.filter((page) => page.super || user.isAdmin())}
          onItemSelect={(select) => {
            select.event?.preventDefault()
            close()
            navigate(select.item.href)
          }}
        />
      )}
    >
      <Button endEnhancer={() => <TriangleDown size={24} />} kind="tertiary">
        Admin
      </Button>
    </StatefulPopover>
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
