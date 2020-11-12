import * as React from 'react'
import {ALIGN, HeaderNavigation, StyledNavigationItem as NavigationItem, StyledNavigationList as NavigationList,} from 'baseui/header-navigation'
import {Button} from 'baseui/button'
import {Block, BlockProps} from 'baseui/block'
import {useHistory, useLocation} from 'react-router-dom'
import {intl, theme} from '../util'
import {user} from '../service/User'
import {StyledLink} from 'baseui/link'
import {StatefulPopover} from 'baseui/popover'
import {Label2} from 'baseui/typography'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faUser} from '@fortawesome/free-solid-svg-icons'
import {OptionProfile, StatefulMenu} from 'baseui/menu'
import {Lang, langs, langsArray} from '../util/intl/intl'
import {TriangleDown} from 'baseui/icon'
import {FlagIcon} from './common/Flag'
import {paddingAll} from './common/Style'
import MainSearch from './search/MainSearch'


function useCurrentUrl() {
  const location = useLocation()
  return window.location.protocol + "//" + window.location.host + location.pathname
}

const LoggedInHeader = () => {
  const blockStyle: BlockProps = {
    display: 'flex',
    width: '100%',
    ...paddingAll(theme.sizing.scale100)
  }
  return (
    <StatefulPopover
      content={
        <Block padding={theme.sizing.scale400}>
          <Label2 {...blockStyle}>{intl.name}: {user.getName()}</Label2>
          <Label2 {...blockStyle}>{intl.groups}: {user.getGroupsHumanReadable().join(', ')}</Label2>
          <Block {...blockStyle}>
            <StyledLink href={`/logout?redirect_uri=${useCurrentUrl()}`}>
              {intl.logout}
            </StyledLink>
          </Block>
        </Block>
      }
    >
      <Button kind="tertiary" startEnhancer={() => <FontAwesomeIcon icon={faUser}/>}>{user.getIdent()}</Button>
    </StatefulPopover>
  )
}

const LoginButton = () => {
  return (
    <StyledLink href={`/login?redirect_uri=${useCurrentUrl()}`}>
      <Button $style={{borderTopLeftRadius: 0, borderTopRightRadius: 0, borderBottomLeftRadius: 0, borderBottomRightRadius: 0}}>
        {intl.login}
      </Button>
    </StyledLink>
  )
}

const Flag = (props: {langCode: string}) => (
  <span role="img" aria-label={langs[props.langCode].name}><FlagIcon country={langs[props.langCode].flag}/></span>
)

const FlagWithName = (props: {langCode: string}) => (
  <span><Flag langCode={props.langCode}/> {langs[props.langCode].name}</span>
)

const LangDropdown = (props: {setLang: (lang: string) => void}) => {
  return (
    <StatefulPopover
      content={({close}) =>
        <StatefulMenu
          items={langsArray.filter(l => l.langCode !== intl.getLanguage())}
          onItemSelect={({item}) => {
            close()
            props.setLang(item.langCode)
          }}
          overrides={{
            Option: {
              component: OptionProfile,
              props: {
                getProfileItemLabels: (lang: Lang) => ({
                  title: lang.name,
                  subtitle: lang.langCode
                }),
                getProfileItemImg: (lang: Lang) => () => <Flag langCode={lang.langCode}/>,
                overrides: {
                  ListItemProfile: {
                    props: {
                      style: {
                        paddingTop: theme.sizing.scale100,
                        paddingBottom: theme.sizing.scale100,
                        paddingLeft: theme.sizing.scale600,
                        paddingRight: theme.sizing.scale800
                      }
                    }
                  },
                  ProfileImgContainer: {
                    props: {
                      style: {
                        height: theme.sizing.scale900,
                        width: theme.sizing.scale900
                      }
                    }
                  }
                }
              }
            }
          }}
        />
      }
    >
      <Button endEnhancer={() => <TriangleDown size={24}/>} kind="minimal">
        <FlagWithName langCode={intl.getLanguage()}/>
      </Button>
    </StatefulPopover>
  )
}

const AdminOptions = () => {
  const history = useHistory()
  const pages = [
    {label: intl.manageCodeListTitle, href: '/admin/codelist'},
    {label: intl.audit, href: '/admin/audit'},
    {label: intl.settings, href: '/admin/settings'},
    {label: intl.needsRevision, href: '/admin/request-revision'}
  ]
  return (
    <StatefulPopover
      content={({close}) =>
        <StatefulMenu
          items={pages}
          onItemSelect={select => {
            select.event?.preventDefault()
            close()
            history.push(select.item.href)
          }}
        />
      }>
      <Button endEnhancer={() => <TriangleDown size={24}/>} kind="tertiary">
        {intl.administrate}
      </Button>
    </StatefulPopover>
  )
}

interface HeaderProps {
  setLang: (lang: string) => void
}

const Header = (props: HeaderProps) => {
  return (
    <Block paddingRight={"30px"} paddingLeft={"30px"}>
      <HeaderNavigation overrides={{Root: {style: {paddingBottom: 0, borderBottomStyle: 'none'}}}}>
        <NavigationList $align={ALIGN.left}>
          <NavigationItem $style={{paddingLeft: 0}}>
            <MainSearch/>
          </NavigationItem>
        </NavigationList>

        <Block
          marginLeft={'auto'}
        >
          <NavigationList $align={ALIGN.right}>
            {user.isAdmin() && (
              <NavigationItem $style={{paddingLeft: 0}}>
                <AdminOptions/>
              </NavigationItem>
            )}

            <NavigationItem $style={{paddingLeft: 0}}>
              <LangDropdown setLang={props.setLang}/>
            </NavigationItem>

            {!user.isLoggedIn() && (
              <NavigationItem $style={{paddingLeft: 0}}>
                <LoginButton/>
              </NavigationItem>
            )}
            {user.isLoggedIn() && (
              <NavigationItem $style={{paddingLeft: 0}}>
                <LoggedInHeader/>
              </NavigationItem>
            )}
          </NavigationList>
        </Block>
      </HeaderNavigation>
    </Block>
  )
}

export default Header
