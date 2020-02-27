import * as React from 'react'
import { ALIGN, HeaderNavigation, StyledNavigationItem as NavigationItem, StyledNavigationList as NavigationList, } from 'baseui/header-navigation'
import { Button } from 'baseui/button'
import { Block, BlockProps } from 'baseui/block'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import { env } from '../util/env'
import { intl, theme, useAwait } from '../util'
import { user } from '../service/User'
import { StyledLink } from 'baseui/link'
import { StatefulPopover } from 'baseui/popover'
import { Label2 } from 'baseui/typography'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import { OptionProfile, StatefulMenu } from 'baseui/menu'
import { Lang, langs, langsArray } from '../util/intl/intl'
import { TriangleDown } from 'baseui/icon'
import { FlagIcon } from './common/Flag'
import { paddingAll } from './common/Style'
import MainSearch from './MainSearch'


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
            <StyledLink href={`${env.pollyBaseUrl}/logout?redirect_uri=${window.location.href}`}>
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

const Flag = (props: { langCode: string }) => (
  <span role="img" aria-label={langs[props.langCode].name}><FlagIcon country={langs[props.langCode].flag}/></span>
)

const FlagWithName = (props: { langCode: string }) => (
  <span><Flag langCode={props.langCode}/> {langs[props.langCode].name}</span>
)

const LangDropdown = (props: { setLang: (lang: string) => void }) => {
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

const AdminOptionsImpl = (props: RouteComponentProps<any>) => {
  const pages = [
    {label: intl.manageCodeListTitle, href: '/admin/codelist'},
    {label: intl.audit, href: '/admin/audit'},
    {label: intl.settings, href: '/admin/settings'}
  ]
  return (
    <StatefulPopover
      content={({close}) =>
        <StatefulMenu
          items={pages}
          onItemSelect={select => {
            select.event?.preventDefault()
            close()
            props.history.push(select.item.href)
          }}
        />
      }>
      <Button endEnhancer={() => <TriangleDown size={24}/>} kind="tertiary">
        {intl.administrate}
      </Button>
    </StatefulPopover>
  )
}
const AdminOptions = withRouter(AdminOptionsImpl)

interface TempHeaderProps {
  setLang: (lang: string) => void
}


export default (props: TempHeaderProps) => {
  useAwait(user.wait())

  return (
    <Block marginLeft="240px">
      <HeaderNavigation overrides={{Root: {style: {paddingBottom: 0}}}}>
        <NavigationList $align={ALIGN.left}>
          <NavigationItem>
            <MainSearch/>
          </NavigationItem>
        </NavigationList>

        <NavigationList $align={ALIGN.center}/>

        <NavigationList $align={ALIGN.right}>
          {user.isAdmin() && (
            <NavigationItem>
              <AdminOptions/>
            </NavigationItem>
          )}

          <NavigationItem>
            <LangDropdown setLang={props.setLang}/>
          </NavigationItem>

          {!user.isLoggedIn() && (
            <NavigationItem>
              <StyledLink href={`${env.pollyBaseUrl}/login?redirect_uri=${window.location.href}`}>
                <Button $style={{borderTopLeftRadius: 0, borderTopRightRadius: 0, borderBottomLeftRadius: 0, borderBottomRightRadius: 0}}>
                  {intl.login}
                </Button>
              </StyledLink>

            </NavigationItem>
          )}
          {user.isLoggedIn() && (
            <NavigationItem>
              <LoggedInHeader/>
            </NavigationItem>
          )}
        </NavigationList>

      </HeaderNavigation>
    </Block>
  )
}
