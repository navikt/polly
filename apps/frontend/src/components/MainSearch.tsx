import { default as React, ReactElement, useEffect } from 'react'
import { NavigableItem, ObjectType } from '../constants'
import { Block } from 'baseui/block'
import { codelist, ListName } from '../service/Codelist'
import { useDebouncedState } from '../util/hooks'
import { prefixBiasedSort } from '../util/sort'
import { intl, theme } from '../util'
import { searchInformationType, searchProcess, searchTeam } from '../api'
import { Select, TYPE } from 'baseui/select'
import { urlForObject } from './common/RouteLink'
import { RouteComponentProps, withRouter } from 'react-router-dom'

type SearchItem = { id: string, sortKey: string, label: ReactElement, type: NavigableItem }

const SearchLabel = (props: { name: string, type: string }) =>
  <Block display="flex" justifyContent="space-between" width="100%">
    <span>{props.name}</span>
    <Block $style={{opacity: .5}}>{props.type}</Block>
  </Block>

function searchCodelist(search: string, list: ListName & NavigableItem, typeName: string) {
  return codelist.getCodes(list).filter(c => c.shortName.toLowerCase().indexOf(search.toLowerCase()) >= 0)
  .map(c => ({
    id: c.code,
    sortKey: c.shortName,
    label: <SearchLabel name={c.shortName} type={typeName}/>,
    type: list
  }))
}

const useMainSearch = () => {
  const [search, setSearch] = useDebouncedState<string>('', 500)
  const [searchResult, setSearchResult] = React.useState<SearchItem[]>([])
  const [loading, setLoading] = React.useState<boolean>(false)

  useEffect(() => {
    (async () => {
      if (search && search.length > 2) {
        let results: SearchItem[] = []
        const compareFn = (a: SearchItem, b: SearchItem) => prefixBiasedSort(search, a.sortKey, b.sortKey)
        const add = (items: SearchItem[]) => {
          results = [...results, ...items].sort(compareFn)
          setSearchResult(results)
        }
        setLoading(true)

        add(searchCodelist(search, ListName.PURPOSE, intl.purpose))
        add(searchCodelist(search, ListName.DEPARTMENT, intl.department))
        add(searchCodelist(search, ListName.SUB_DEPARTMENT, intl.subDepartment))

        const infoTypesRes = await searchInformationType(search)
        add(infoTypesRes.content.map(it => ({
          id: it.id,
          sortKey: it.name,
          label: <SearchLabel name={it.name} type={intl.informationType}/>,
          type: ObjectType.INFORMATION_TYPE
        })))

        const resProcess = await searchProcess(search)
        add(resProcess.content.map(it => {
          const purpose = codelist.getShortname(ListName.PURPOSE, it.purposeCode)
          return ({
            id: it.id,
            sortKey: `${it.name} ${purpose}`,
            label: <SearchLabel name={`${purpose}: ${it.name}`} type={intl.process}/>,
            type: ObjectType.PROCESS
          })
        }))

        const resTeams = await searchTeam(search)
        add(resTeams.content.map(it => ({
          id: it.id,
          sortKey: it.name,
          label: <SearchLabel name={it.name} type={intl.productTeam}/>,
          type: 'team'
        })))
        setLoading(false)
      }
    })()
  }, [search])

  return [setSearch, searchResult, loading] as [(text: string) => void, SearchItem[], boolean]
}

export const MainSearchImpl = (props: RouteComponentProps) => {
  const [setSearch, searchResult, loading] = useMainSearch()

  return <Select
    autoFocus
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
    overrides={{
      SearchIcon: {
        style: {
          width: theme.sizing.scale900,
          height: theme.sizing.scale900,
          left: theme.sizing.scale400,
          top: theme.sizing.scale400
        }
      }
    }
    }
  />
}

export default withRouter(MainSearchImpl)
