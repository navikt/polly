import {default as React, ReactElement, useEffect, useState} from 'react'
import {NavigableItem, ObjectType} from '../constants'
import {Block} from 'baseui/block'
import {codelist, ListName} from '../service/Codelist'
import {useDebouncedState} from '../util/hooks'
import {prefixBiasedSort} from '../util/sort'
import {intl, theme} from '../util'
import {searchInformationType, searchProcess, searchTeam} from '../api'
import {Select, TYPE, Value} from 'baseui/select'
import {urlForObject} from './common/RouteLink'
import {RouteComponentProps, withRouter} from 'react-router-dom'
import {Radio, RadioGroup} from 'baseui/radio'
import {paddingZero} from './common/Style'
import {faFilter} from '@fortawesome/free-solid-svg-icons'
import Button from "./common/Button";

type SearchItem = { id: string, sortKey: string, label: ReactElement, type: NavigableItem }
type SearchType = 'all' | 'purpose' | 'process' | 'team' | 'department' | 'subDepartment' | 'informationType' | 'thirdParty'

const SearchLabel = (props: { name: string, type: string }) =>
  <Block display="flex" justifyContent="space-between" width="100%">
    <span>{props.name}</span>
    <Block $style={{opacity: .5}}>{props.type}</Block>
  </Block>

const searchCodelist = (search: string, list: ListName & NavigableItem, typeName: string) =>
  codelist.getCodes(list).filter(c => c.shortName.toLowerCase().indexOf(search.toLowerCase()) >= 0)
    .map(c => ({
      id: c.code,
      sortKey: c.shortName,
      label: <SearchLabel name={c.shortName} type={typeName}/>,
      type: list
    }))

const getCodelistByListnameAndType = (list: ListName, typeName: string) =>
  codelist.getCodes(list).map(c => ({
    id: c.code,
    sortKey: c.shortName,
    label: <SearchLabel name={c.shortName} type={typeName}/>,
    type: list
  } as SearchItem))

const useMainSearch = () => {
  const [search, setSearch] = useDebouncedState<string>('', 500)
  const [searchResult, setSearchResult] = React.useState<SearchItem[]>([])
  const [loading, setLoading] = React.useState<boolean>(false)
  const [type, setType] = useState<SearchType>('all')

  useEffect(() => {
    setSearchResult([])
    if (type === 'purpose') {
      setSearchResult(getCodelistByListnameAndType(ListName.PURPOSE, intl.purpose))
    } else if (type === 'department') {
      setSearchResult(getCodelistByListnameAndType(ListName.DEPARTMENT, intl.department))
    } else if (type === 'subDepartment') {
      setSearchResult(getCodelistByListnameAndType(ListName.SUB_DEPARTMENT, intl.subDepartment))
    } else if (type === 'thirdParty') {
      setSearchResult(getCodelistByListnameAndType(ListName.THIRD_PARTY, intl.thirdParty))
    } else {
      (async () => {
        if (search && search.length > 2) {
          let results: SearchItem[] = []
          const compareFn = (a: SearchItem, b: SearchItem) => prefixBiasedSort(search, a.sortKey, b.sortKey)
          const add = (items: SearchItem[]) => {
            results = [...results, ...items].sort(compareFn)
            setSearchResult(results)
          }
          setLoading(true)

          if (type === 'all') {
            add(searchCodelist(search, ListName.PURPOSE, intl.purpose))
            add(searchCodelist(search, ListName.DEPARTMENT, intl.department))
            add(searchCodelist(search, ListName.SUB_DEPARTMENT, intl.subDepartment))
          }

          if (type === 'all' || type === 'informationType') {
            const infoTypesRes = await searchInformationType(search)
            add(infoTypesRes.content.map(it => ({
              id: it.id,
              sortKey: it.name,
              label: <SearchLabel name={it.name} type={intl.informationType}/>,
              type: ObjectType.INFORMATION_TYPE
            })))
          }

          if (type === 'all' || type === 'process') {
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
          }

          if (type === 'all' || type === 'team') {
            const resTeams = await searchTeam(search)
            add(resTeams.content.map(it => ({
              id: it.id,
              sortKey: it.name,
              label: <SearchLabel name={it.name} type={intl.productTeam}/>,
              type: 'team'
            })))
          }
          setLoading(false)
        }
      })()
    }


  }, [search, type])

  return [setSearch, searchResult, loading, type, setType] as [(text: string) => void, SearchItem[], boolean, SearchType, (type: SearchType) => void]
}

type RadioProps = {
  $isHovered: boolean
  $checked: boolean
}

const smallRadio = (value: SearchType, text: string) => {
  return (
    <Radio value={value}
           overrides={{
             Root: {
               style: {
                 marginBottom: 0
               }
             },
             Label: {
               style: (a: RadioProps) => ({
                 ...paddingZero,
                 ...(a.$isHovered ? {color: theme.colors.positive400} : {}),
               })
             },
             RadioMarkOuter: {
               style: (a: RadioProps) => ({
                 width: theme.sizing.scale500,
                 height: theme.sizing.scale500,
                 ...(a.$isHovered ? {backgroundColor: theme.colors.positive400} : {})
               })
             },
             RadioMarkInner: {
               style: (a: RadioProps) => ({
                 width: a.$checked ? theme.sizing.scale100 : theme.sizing.scale300,
                 height: a.$checked ? theme.sizing.scale100 : theme.sizing.scale300,
               })
             }
           }}
    >
      <Block font='ParagraphXSmall'>{text}</Block>
    </Radio>
  )
}

const SelectType = (props: { type: SearchType, setType: (type: SearchType) => void }) =>
  <Block
    font='ParagraphSmall'
    position='absolute'
    marginTop='-4px'
    backgroundColor={theme.colors.primary50}
    width='600px'
    $style={{
      borderBottomLeftRadius: '8px',
      borderBottomRightRadius: '8px'
    }}>
    <Block
      marginLeft='3px'
      marginRight='3px'
      marginBottom='3px'
    >
      <RadioGroup
        onChange={e => props.setType(e.target.value as SearchType)}
        align='horizontal'
        value={props.type}

      >
        {smallRadio('all', intl.all)}
        {smallRadio('informationType', intl.informationType)}
        {smallRadio('purpose', intl.purpose)}
        {smallRadio('process', intl.processes)}
        {smallRadio('team', intl.team)}
        {smallRadio('department', intl.department)}
        {smallRadio('subDepartment', intl.subDepartmentShort)}
        {smallRadio('thirdParty', intl.thirdParty)}
      </RadioGroup>
    </Block>
  </Block>

export const MainSearchImpl = (props: RouteComponentProps) => {
  const [setSearch, searchResult, loading, type, setType] = useMainSearch()
  const [filter, setFilter] = useState(true)
  const [value, setValue] = useState<Value>()

  return (
    <Block>
      <Block display='flex'
             position='relative'
             alignItems='center'>
        <Select
          noResultsMsg={intl.emptyTable}
          autoFocus={props.match.path === '/'}
          isLoading={loading}
          maxDropdownHeight="400px"
          searchable={true}
          type={TYPE.search}
          options={searchResult}
          placeholder={intl.search}
          value={value}
          onInputChange={event => {
            setSearch(event.currentTarget.value)
            setValue([{id: event.currentTarget.value, label: event.currentTarget.value}])
          }}
          onChange={(params) => {
            console.log(params)
            const item = params.value[0] as SearchItem;
            (async () => {
              if (item) {
                props.history.push(await urlForObject(item.type, item.id))
              } else setValue([])
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
            },
            ControlContainer: {
              style: {
                ...(filter ? {borderBottomLeftRadius: 0} : {}),
                ...(filter ? {borderBottomRightRadius: 0} : {})
              }
            },
            Root: {
              style: {
                width: '600px',
              }
            }
          }
          }
        />
        <Button onClick={() => setFilter(!filter)} icon={faFilter} size='compact' kind={filter ? 'primary' : 'tertiary'} marginLeft
                $style={{height: theme.sizing.scale1000, width: theme.sizing.scale1000}}/>
      </Block>
      {filter && <SelectType type={type} setType={setType}/>}
    </Block>
  )
}

export default withRouter(MainSearchImpl)
