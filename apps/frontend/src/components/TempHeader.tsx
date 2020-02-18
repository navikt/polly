import * as React from 'react';
import { useEffect } from 'react';
import { ALIGN, HeaderNavigation, StyledNavigationItem as NavigationItem, StyledNavigationList as NavigationList, } from 'baseui/header-navigation';
import { Button } from 'baseui/button';
import { Block, BlockProps } from 'baseui/block';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { env } from '../util/env';
import { intl, theme, useAwait, useDebouncedState } from '../util';
import { user } from '../service/User';
import { StyledLink } from 'baseui/link';
import { StatefulPopover } from 'baseui/popover';
import { Label2 } from 'baseui/typography';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { OptionProfile, StatefulMenu } from 'baseui/menu';
import { Lang, langs, langsArray } from '../util/intl/intl';
import { TriangleDown } from 'baseui/icon';
import { FlagIcon } from "./common/Flag"
import { paddingAll } from "./common/Style"
import { Select, TYPE } from "baseui/select"
import { searchInformationType, searchProcess } from "../api"
import { ObjectType } from "../constants"
import { urlForObject } from "./common/RouteLink"


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

const AdminOptionsImpl = (props: RouteComponentProps<any>) => {
  const pages = [
    {label: intl.manageCodeListTitle, href: "/admin/codelist"},
    {label: intl.audit, href: "/admin/audit"},
    {label: intl.settings, href: "/admin/settings"}
  ]
  return (
    <StatefulPopover
      content={({close}) =>
        <StatefulMenu
          items={pages}
          onItemSelect={({item}) => {
            close()
            props.history.push(item.href)
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

type SearchItem = { id: string, label: string, type: ObjectType }

const TempHeader = (props: TempHeaderProps & RouteComponentProps) => {
  useAwait(user.wait())
  const [search, setSearch] = useDebouncedState<string>('', 200);
  const [searchResult, setSearchResult] = React.useState<SearchItem[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);

  useEffect(() => {
    (async () => {
      if (search && search.length > 2) {
        setLoading(true)
        const res = await searchInformationType(search)
        const infoTypes = res.content.map(it => ({id: it.id, label: `${intl.informationType}: ${it.name}`, type: ObjectType.INFORMATION_TYPE}))
        setSearchResult(infoTypes)

        const resProcess = await searchProcess(search)
        const processes = resProcess.content.map(it => ({id: it.id, label: `${intl.process}: ${it.name}`, type: ObjectType.PROCESS}))
        setSearchResult([...processes, ...infoTypes])
        setLoading(false)
      }
    })()
  }, [search])

  return (
    <Block marginLeft="240px">
      <HeaderNavigation>
        <NavigationList $align={ALIGN.left}>
          <NavigationItem>
            <Block width="450px">
              <Select
                isLoading={loading}
                maxDropdownHeight="400px"
                searchable={true}
                type={TYPE.search}
                options={searchResult}
                placeholder={intl.search}
                onInputChange={event => setSearch(event.currentTarget.value)}
                onChange={(params) => {
                  const item = params.value[0] as SearchItem;
                  (async () => {
                    props.history.push(await urlForObject(item.type, item.id))
                  })()
                }}
                filterOptions={options => options}
              />
            </Block>
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
                <Button>
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
  );
}


export default withRouter(TempHeader)
