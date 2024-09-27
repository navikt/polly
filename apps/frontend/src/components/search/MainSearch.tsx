import { faFilter } from '@fortawesome/free-solid-svg-icons'
import { OnChangeParams, Select, TYPE, Value } from 'baseui/select'
import { ChangeEvent, ReactElement, useEffect, useState } from 'react'
import { Location, NavigateFunction, useLocation, useNavigate } from 'react-router-dom'
import {
  searchDocuments,
  searchInformationType,
  searchProcess,
  searchProductArea,
  searchTeam,
} from '../../api'
import { searchDpProcess } from '../../api/DpProcessApi'
import {
  EObjectType,
  IDocument,
  IDpProcess,
  IPageResponse,
  IProcess,
  IProductArea,
  TNavigableItem,
  TSearchType,
} from '../../constants'
import { EListName, ICode, codelist } from '../../service/Codelist'
import { theme } from '../../util'
import { useDebouncedState } from '../../util/hooks'
import { prefixBiasedSort } from '../../util/sort'
import { searchResultColor } from '../../util/theme'
import Button from '../common/Button'
import { urlForObject } from '../common/RouteLink'
import { SearchLabel } from './components/SearchLabel'
import { SelectType } from './components/SelectType'

type TSearchItem = {
  id: string
  sortKey: string
  label: ReactElement
  type: TNavigableItem
  number?: number
}

const searchCodelist = (
  search: string,
  list: EListName & TNavigableItem,
  typeName: string,
  backgroundColor: string
) =>
  codelist
    .getCodes(list)
    .filter((code: ICode) => code.shortName.toLowerCase().indexOf(search.toLowerCase()) >= 0)
    .map((code: ICode) => ({
      id: code.code,
      sortKey: code.shortName,
      label: (
        <SearchLabel name={code.shortName} type={typeName} backgroundColor={backgroundColor} />
      ),
      type: list,
    }))

const getCodelistByListnameAndType = (search: string, list: EListName, typeName: string) => {
  return codelist
    .getCodes(list)
    .filter((code: ICode) => code.shortName.toLowerCase().indexOf(search.toLowerCase()) >= 0)
    .map(
      (code: ICode) =>
        ({
          id: code.code,
          sortKey: code.shortName,
          label: <SearchLabel name={code.shortName} type={typeName} />,
          type: list,
        }) as TSearchItem
    )
}

const useMainSearch = () => {
  const [search, setSearch] = useDebouncedState<string>('', 500)
  const [searchResult, setSearchResult] = useState<TSearchItem[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [type, setType] = useState<TSearchType>('all')

  useEffect(() => {
    setSearchResult([])
    if (type === 'purpose') {
      setSearchResult(getCodelistByListnameAndType(search, EListName.PURPOSE, 'Formål'))
    } else if (type === 'department') {
      setSearchResult(getCodelistByListnameAndType(search, EListName.DEPARTMENT, 'Avdeling'))
    } else if (type === 'subDepartment') {
      setSearchResult(getCodelistByListnameAndType(search, EListName.SUB_DEPARTMENT, 'Linja'))
    } else if (type === 'thirdParty') {
      setSearchResult(getCodelistByListnameAndType(search, EListName.THIRD_PARTY, 'Ekstern part'))
    } else if (type === 'system') {
      setSearchResult(getCodelistByListnameAndType(search, EListName.SYSTEM, 'System'))
    } else if (type === 'nationalLaw') {
      setSearchResult(getCodelistByListnameAndType(search, EListName.NATIONAL_LAW, 'Nasjonal lov'))
    } else if (type === 'gdprArticle') {
      setSearchResult(getCodelistByListnameAndType(search, EListName.GDPR_ARTICLE, 'GDPR artikkel'))
    } else {
      ;(async () => {
        if (search && search.replace(/ /g, '').length > 2) {
          let results: TSearchItem[] = []
          const searches: Promise<any>[] = []

          const compareFn: (a: TSearchItem, b: TSearchItem) => number = (
            a: TSearchItem,
            b: TSearchItem
          ) => {
            if (a.type === EObjectType.PROCESS && a.number === parseInt(search)) return -1
            else if (b.type === EObjectType.PROCESS && b.number === parseInt(search)) return 1
            return prefixBiasedSort(search, a.sortKey, b.sortKey)
          }

          const add: (items: TSearchItem[]) => void = (items: TSearchItem[]) => {
            results = [...results, ...items].sort(compareFn)
            setSearchResult(results)
          }
          setLoading(true)

          if (type === 'all') {
            add(
              searchCodelist(
                search,
                EListName.PURPOSE,
                'Behandlingsaktivitet',
                searchResultColor.purposeBackground
              )
            )
            add(
              searchCodelist(
                search,
                EListName.DEPARTMENT,
                'Avdeling',
                searchResultColor.departmentBackground
              )
            )
            add(
              searchCodelist(
                search,
                EListName.SUB_DEPARTMENT,
                'Linja',
                searchResultColor.subDepartmentBackground
              )
            )
            add(
              searchCodelist(
                search,
                EListName.THIRD_PARTY,
                'Ekstern part',
                searchResultColor.thirdPartyBackground
              )
            )
            add(
              searchCodelist(search, EListName.SYSTEM, 'System', searchResultColor.systemBackground)
            )
            add(
              searchCodelist(
                search,
                EListName.NATIONAL_LAW,
                'Nasjonal lov',
                searchResultColor.nationalLawBackground
              )
            )
            add(
              searchCodelist(
                search,
                EListName.GDPR_ARTICLE,
                'GDPR artikkel',
                searchResultColor.gdprBackground
              )
            )
          }

          if (type === 'all' || type === 'informationType') {
            searches.push(
              (async () => {
                const infoTypesRes = await searchInformationType(search)
                add(
                  infoTypesRes.content.map((it) => ({
                    id: it.id,
                    sortKey: it.name,
                    label: (
                      <SearchLabel
                        name={it.name}
                        type="Opplysningstype"
                        backgroundColor={searchResultColor.informationTypeBackground}
                      />
                    ),
                    type: EObjectType.INFORMATION_TYPE,
                  }))
                )
              })()
            )
          }

          if (type === 'all' || type === 'process') {
            searches.push(
              (async () => {
                const resProcess: IPageResponse<IProcess> = await searchProcess(search)

                add(
                  resProcess.content.map((content) => {
                    const purposes: string = content.purposes
                      .map((purpose) => codelist.getShortnameForCode(purpose))
                      .join(', ')

                    return {
                      id: content.id,
                      sortKey: `${content.name} ${purposes}`,
                      label: (
                        <SearchLabel
                          name={`${purposes}: ${content.name}`}
                          type="Behandling"
                          backgroundColor={searchResultColor.processBackground}
                        />
                      ),
                      type: EObjectType.PROCESS,
                      number: content.number,
                    }
                  })
                )
              })()
            )
          }

          if (type === 'all' || type === 'dpprocess') {
            searches.push(
              (async () => {
                const resProcess: IPageResponse<IDpProcess> = await searchDpProcess(search)

                add(
                  resProcess.content.map((content) => {
                    return {
                      id: content.id,
                      sortKey: content.name,
                      label: (
                        <SearchLabel
                          name={content.name}
                          type="NAV som databehandler"
                          backgroundColor={searchResultColor.dpProcessBackground}
                        />
                      ),
                      type: EObjectType.DP_PROCESS,
                    }
                  })
                )
              })()
            )
          }

          if (type === 'all' || type === 'team') {
            searches.push(
              (async () => {
                const resTeams = await searchTeam(search)
                add(
                  resTeams.content.map((content) => ({
                    id: content.id,
                    sortKey: content.name,
                    label: (
                      <SearchLabel
                        name={content.name}
                        type="Team"
                        backgroundColor={searchResultColor.teamBackground}
                      />
                    ),
                    type: 'team',
                  }))
                )
              })()
            )
          }

          if (type === 'all' || type === 'productarea') {
            searches.push(
              (async () => {
                const result: IPageResponse<IProductArea> = await searchProductArea(search)
                add(
                  result.content.map((content) => ({
                    id: content.id,
                    sortKey: content.name,
                    label: (
                      <SearchLabel
                        name={content.name}
                        type="Område"
                        backgroundColor={searchResultColor.productAreaBackground}
                      />
                    ),
                    type: 'productarea',
                  }))
                )
              })()
            )
          }

          if (type === 'all' || type === 'document') {
            searches.push(
              (async () => {
                const resDocs: IPageResponse<IDocument> = await searchDocuments(search)
                add(
                  resDocs.content.map((content) => ({
                    id: content.id,
                    sortKey: content.name,
                    label: (
                      <SearchLabel
                        name={content.name}
                        type="Dokument"
                        backgroundColor={searchResultColor.documentBackground}
                      />
                    ),
                    type: EObjectType.DOCUMENT,
                  }))
                )
              })()
            )
          }
          await Promise.all(searches)
          setLoading(false)
        }
      })()
    }
  }, [search, type])

  return [setSearch, searchResult, loading, type, setType] as [
    (text: string) => void,
    TSearchItem[],
    boolean,
    TSearchType,
    (type: TSearchType) => void,
  ]
}

export const MainSearch = () => {
  const [setSearch, searchResult, loading, type, setType] = useMainSearch()
  const [filter, setFilter] = useState(false)
  const [value, setValue] = useState<Value>()
  const navigate: NavigateFunction = useNavigate()
  const location: Location<any> = useLocation()

  return (
    <div>
      <div className="flex items-center">
        <Select
          noResultsMsg="Ingen"
          autoFocus={location.pathname === '/'}
          isLoading={loading}
          maxDropdownHeight="400px"
          searchable={true}
          type={TYPE.search}
          options={searchResult}
          aria-label="Søk"
          placeholder="Søk"
          value={value}
          onInputChange={(event: ChangeEvent<HTMLInputElement>) => {
            setSearch(event.currentTarget.value)
            setValue([{ id: event.currentTarget.value, label: event.currentTarget.value }])
          }}
          onChange={(params: OnChangeParams) => {
            const item = params.value[0] as TSearchItem
            ;(async () => {
              if (item) {
                navigate(urlForObject(item.type, item.id))
              } else {
                setValue([])
              }
            })()
          }}
          filterOptions={(options: Value) => options}
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
          <img aria-label="Filter" />
        </Button>
      </div>
      {filter && <SelectType type={type} setType={setType} />}
    </div>
  )
}

export default MainSearch
