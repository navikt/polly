import { default as React, ReactElement, useEffect, useState } from 'react'
import { NavigableItem, ObjectType, SearchType } from '../../constants'
import { Block } from 'baseui/block'
import { codelist, ListName } from '../../service/Codelist'
import { useDebouncedState } from '../../util/hooks'
import { prefixBiasedSort } from '../../util/sort'
import { theme } from '../../util'
import { searchDocuments, searchInformationType, searchProcess, searchProductArea, searchTeam } from '../../api'
import { Select, TYPE, Value } from 'baseui/select'
import { urlForObject } from '../common/RouteLink'
import { useNavigate, useLocation } from 'react-router-dom'
import { faFilter } from '@fortawesome/free-solid-svg-icons'
import Button from '../common/Button'
import { searchResultColor } from '../../util/theme'
import { SearchLabel } from './components/SearchLabel'
import { SelectType } from './components/SelectType'
import { searchDpProcess } from '../../api/DpProcessApi'

type SearchItem = { id: string; sortKey: string; label: ReactElement; type: NavigableItem; number?: number }

const searchCodelist = (search: string, list: ListName & NavigableItem, typeName: string, backgroundColor: string) =>
  codelist
    .getCodes(list)
    .filter((c) => c.shortName.toLowerCase().indexOf(search.toLowerCase()) >= 0)
    .map((c) => ({
      id: c.code,
      sortKey: c.shortName,
      label: <SearchLabel name={c.shortName} type={typeName} backgroundColor={backgroundColor} />,
      type: list,
    }))

const getCodelistByListnameAndType = (search: string, list: ListName, typeName: string) => {
  return codelist
    .getCodes(list)
    .filter((c) => c.shortName.toLowerCase().indexOf(search.toLowerCase()) >= 0)
    .map(
      (c) =>
        ({
          id: c.code,
          sortKey: c.shortName,
          label: <SearchLabel name={c.shortName} type={typeName} />,
          type: list,
        }) as SearchItem,
    )
}

const useMainSearch = () => {
  const [search, setSearch] = useDebouncedState<string>('', 500)
  const [searchResult, setSearchResult] = React.useState<SearchItem[]>([])
  const [loading, setLoading] = React.useState<boolean>(false)
  const [type, setType] = useState<SearchType>('all')

  useEffect(() => {
    setSearchResult([])
    if (type === 'purpose') {
      setSearchResult(getCodelistByListnameAndType(search, ListName.PURPOSE, 'Formål'))
    } else if (type === 'department') {
      setSearchResult(getCodelistByListnameAndType(search, ListName.DEPARTMENT, 'Avdeling'))
    } else if (type === 'subDepartment') {
      setSearchResult(getCodelistByListnameAndType(search, ListName.SUB_DEPARTMENT, 'Linja'))
    } else if (type === 'thirdParty') {
      setSearchResult(getCodelistByListnameAndType(search, ListName.THIRD_PARTY, 'Ekstern part'))
    } else if (type === 'system') {
      setSearchResult(getCodelistByListnameAndType(search, ListName.SYSTEM, 'System'))
    } else if (type === 'nationalLaw') {
      setSearchResult(getCodelistByListnameAndType(search, ListName.NATIONAL_LAW, 'Nasjonal lov'))
    } else if (type === 'gdprArticle') {
      setSearchResult(getCodelistByListnameAndType(search, ListName.GDPR_ARTICLE, 'GDPR artikkel'))
    } else {
      ;(async () => {
        if (search && search.replace(/ /g, '').length > 2) {
          let results: SearchItem[] = []
          let searches: Promise<any>[] = []
          const compareFn = (a: SearchItem, b: SearchItem) => {
            if (a.type === ObjectType.PROCESS && a.number === parseInt(search)) return -1
            else if (b.type === ObjectType.PROCESS && b.number === parseInt(search)) return 1
            return prefixBiasedSort(search, a.sortKey, b.sortKey)
          }
          const add = (items: SearchItem[]) => {
            results = [...results, ...items].sort(compareFn)
            setSearchResult(results)
          }
          setLoading(true)

          if (type === 'all') {
            add(searchCodelist(search, ListName.PURPOSE, 'Behandlingsaktivitet', searchResultColor.purposeBackground))
            add(searchCodelist(search, ListName.DEPARTMENT, 'Avdeling', searchResultColor.departmentBackground))
            add(searchCodelist(search, ListName.SUB_DEPARTMENT, 'Linja', searchResultColor.subDepartmentBackground))
            add(searchCodelist(search, ListName.THIRD_PARTY, 'Ekstern part', searchResultColor.thirdPartyBackground))
            add(searchCodelist(search, ListName.SYSTEM, 'System', searchResultColor.systemBackground))
            add(searchCodelist(search, ListName.NATIONAL_LAW, 'Nasjonal lov', searchResultColor.nationalLawBackground))
            add(searchCodelist(search, ListName.GDPR_ARTICLE, 'GDPR artikkel', searchResultColor.gdprBackground))
          }

          if (type === 'all' || type === 'informationType') {
            searches.push(
              (async () => {
                const infoTypesRes = await searchInformationType(search)
                add(
                  infoTypesRes.content.map((it) => ({
                    id: it.id,
                    sortKey: it.name,
                    label: <SearchLabel name={it.name} type='Opplysningstype' backgroundColor={searchResultColor.informationTypeBackground} />,
                    type: ObjectType.INFORMATION_TYPE,
                  })),
                )
              })(),
            )
          }

          if (type === 'all' || type === 'process') {
            searches.push(
              (async () => {
                const resProcess = await searchProcess(search)
                add(
                  resProcess.content.map((it) => {
                    const purposes = it.purposes.map((p) => codelist.getShortnameForCode(p)).join(', ')
                    return {
                      id: it.id,
                      sortKey: `${it.name} ${purposes}`,
                      label: <SearchLabel name={`${purposes}: ${it.name}`} type='Behandling' backgroundColor={searchResultColor.processBackground} />,
                      type: ObjectType.PROCESS,
                      number: it.number,
                    }
                  }),
                )
              })(),
            )
          }

          if (type === 'all' || type === 'dpprocess') {
            searches.push(
              (async () => {
                const resProcess = await searchDpProcess(search)
                add(
                  resProcess.content.map((it) => {
                    return {
                      id: it.id,
                      sortKey: it.name,
                      label: <SearchLabel name={it.name} type='NAV som databehandler' backgroundColor={searchResultColor.dpProcessBackground} />,
                      type: ObjectType.DP_PROCESS,
                    }
                  }),
                )
              })(),
            )
          }

          if (type === 'all' || type === 'team') {
            searches.push(
              (async () => {
                const resTeams = await searchTeam(search)
                add(
                  resTeams.content.map((it) => ({
                    id: it.id,
                    sortKey: it.name,
                    label: <SearchLabel name={it.name} type='Team' backgroundColor={searchResultColor.teamBackground} />,
                    type: 'team',
                  })),
                )
              })(),
            )
          }

          if (type === 'all' || type === 'productarea') {
            searches.push(
              (async () => {
                const res = await searchProductArea(search)
                add(
                  res.content.map((it) => ({
                    id: it.id,
                    sortKey: it.name,
                    label: <SearchLabel name={it.name} type='Område' backgroundColor={searchResultColor.productAreaBackground} />,
                    type: 'productarea',
                  })),
                )
              })(),
            )
          }

          if (type === 'all' || type === 'document') {
            searches.push(
              (async () => {
                const resDocs = await searchDocuments(search)
                add(
                  resDocs.content.map((it) => ({
                    id: it.id,
                    sortKey: it.name,
                    label: <SearchLabel name={it.name} type='Dokument' backgroundColor={searchResultColor.documentBackground} />,
                    type: ObjectType.DOCUMENT,
                  })),
                )
              })(),
            )
          }
          await Promise.all(searches)
          setLoading(false)
        }
      })()
    }
  }, [search, type])

  return [setSearch, searchResult, loading, type, setType] as [(text: string) => void, SearchItem[], boolean, SearchType, (type: SearchType) => void]
}

export const MainSearch = () => {
  const [setSearch, searchResult, loading, type, setType] = useMainSearch()
  const [filter, setFilter] = useState(false)
  const [value, setValue] = useState<Value>()
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <Block>
      <Block display="flex" alignItems="center">
        <Select
          noResultsMsg='Ingen'
          autoFocus={location.pathname === '/'}
          isLoading={loading}
          maxDropdownHeight="400px"
          searchable={true}
          type={TYPE.search}
          options={searchResult}
          aria-label='Søk'
          placeholder='Søk'
          value={value}
          onInputChange={(event) => {
            setSearch(event.currentTarget.value)
            setValue([{ id: event.currentTarget.value, label: event.currentTarget.value }])
          }}
          onChange={(params) => {
            const item = params.value[0] as SearchItem
            ;(async () => {
              if (item) {
                navigate(urlForObject(item.type, item.id))
              } else {
                setValue([])
              }
            })()
          }}
          filterOptions={(options) => options}
          overrides={{
            SearchIcon: {
              style: {
                width: theme.sizing.scale900,
                height: theme.sizing.scale900,
                left: theme.sizing.scale400,
                top: theme.sizing.scale400,
              },
            },
            ControlContainer: {
              style: {
                backgroundColor: 'white',
                ...(filter ? { borderBottomLeftRadius: 0 } : {}),
                ...(filter ? { borderBottomRightRadius: 0 } : {}),
              },
            },
            Root: {
              style: {
                width: '40vw',
              },
            },
            DropdownListItem: {
              style: {
                paddingTop: '0',
                paddingRight: '5px',
                paddingBottom: '0',
                paddingLeft: '5px',
              },
            },
          }}
        />
        <Button
          onClick={() => setFilter(!filter)}
          icon={faFilter}
          size="compact"
          kind={filter ? 'primary' : 'tertiary'}
          marginLeft
          $style={{ height: theme.sizing.scale1000, width: theme.sizing.scale1000 }}
        >
          <img aria-label='Filter'/>
        </Button>
      </Block>
      {filter && <SelectType type={type} setType={setType} />}
    </Block>
  )
}

export default MainSearch
