import * as React from 'react';
import {
    HeaderNavigation,
    ALIGN,
    StyledNavigationItem as NavigationItem,
    StyledNavigationList as NavigationList,
} from 'baseui/header-navigation';
import { Button } from 'baseui/button';
import { Block, BlockProps } from 'baseui/block';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { env } from '../util/env';
import { useAwait, theme, intl } from '../util';
import { user } from '../service/User';
import { StyledLink } from 'baseui/link';
import { StatefulPopover } from 'baseui/popover';
import { Label2 } from 'baseui/typography';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { StatefulMenu, OptionProfile } from 'baseui/menu';
import { langsArray, Lang, langs } from '../util/intl/intl';
import { TriangleDown } from 'baseui/icon';
import { FlagIcon } from "./common/Flag"


const LoggedInHeader = () => {
    const blockStyle: BlockProps = {
      display: 'flex',
      width: '100%',
      padding: theme.sizing.scale100
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
        <Button kind="tertiary" startEnhancer={() => <FontAwesomeIcon icon={faUser}/>}>{user.getNavIdent()}</Button>
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
    );
}

interface TempHeaderProps {
    setLang: (lang: string) => void
}

const TempHeader = (props: TempHeaderProps & RouteComponentProps) => {
    useAwait(user.wait())

    return (
        <HeaderNavigation
            overrides={{
                Root: {
                    style: ({ $theme }) => {
                        return {
                            padding: '1rem'
                        };
                    }
                }
            }}
        >
            <Block margin="0 auto" width="80%">
                <NavigationList $align={ALIGN.right}>

                    <NavigationItem>
                        <LangDropdown setLang={props.setLang}/>
                    </NavigationItem>

                    {!user.isLoggedIn() && (
                        <NavigationItem>
                            <StyledLink href={`${env.pollyBaseUrl}/login?redirect_uri=${window.location.href}`}>
                                <Button>
                                    {intl.login}
                                </Button>
                            </StyledLink>

                        </NavigationItem>
                    )}
                    {user.isLoggedIn() && (
                        <NavigationItem>
                            <LoggedInHeader />
                        </NavigationItem>
                    )}
                </NavigationList>
            </Block>

        </HeaderNavigation>
    );
}




export default withRouter(TempHeader)