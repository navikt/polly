import { faFilter } from '@fortawesome/free-solid-svg-icons'
import { MagnifyingGlassIcon } from '@navikt/aksel-icons'
import { Tag } from '@navikt/ds-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DropdownIndicatorProps, OptionProps, components } from 'react-select'
import AsyncSelect from 'react-select/async'
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
import { prefixBiasedSort } from '../../util/sort'
import { searchResultColor } from '../../util/theme'
import { noOptionMessage, selectOverrides } from '../common/AsyncSelectComponents'
import Button from '../common/Button'
import { urlForObject } from '../common/RouteLink'
import { SelectType } from './components/SelectType'

type TSearchItem = {
  id: string
  sortKey: string
  typeName: string
  tagColor?: string
  label: string
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
      label: code.shortName,
      typeName: typeName,
      type: list,
      tagColor: backgroundColor,
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
          label: code.shortName,
          type: list,
          typeName: typeName,
        }) as TSearchItem
    )
}

const Option = (props: OptionProps<TSearchItem>) => (
  <components.Option {...props}>
    <div className="flex justify-between">
      <span>{props.data.label}</span>
      <Tag
        size="small"
        variant="info"
        className={`${props.data.tagColor ? `bg-[${props.data.tagColor}]` : ''}`}
      >
        {props.data.typeName}
      </Tag>
    </div>
  </components.Option>
)

export const DropdownIndicator = (props: DropdownIndicatorProps<TSearchItem>) => (
  <components.DropdownIndicator {...props}>
    <MagnifyingGlassIcon title="Søk" aria-label="Søk" />
  </components.DropdownIndicator>
)

export const MainSearch = () => {
  const [filter, setFilter] = useState(false)
  const [type, setType] = useState<TSearchType>('all')
  const navigate = useNavigate()

  const useMainSearchOption = async (searchParam: string) => {
    if (searchParam && searchParam.length > 2) {
      if (type === 'purpose') {
        return getCodelistByListnameAndType(searchParam, EListName.PURPOSE, 'Formål')
      } else if (type === 'department') {
        return getCodelistByListnameAndType(searchParam, EListName.DEPARTMENT, 'Avdeling')
      } else if (type === 'subDepartment') {
        return getCodelistByListnameAndType(searchParam, EListName.SUB_DEPARTMENT, 'Linja')
      } else if (type === 'thirdParty') {
        return getCodelistByListnameAndType(searchParam, EListName.THIRD_PARTY, 'Ekstern part')
      } else if (type === 'system') {
        return getCodelistByListnameAndType(searchParam, EListName.SYSTEM, 'System')
      } else if (type === 'nationalLaw') {
        return getCodelistByListnameAndType(searchParam, EListName.NATIONAL_LAW, 'Nasjonal lov')
      } else if (type === 'gdprArticle') {
        return getCodelistByListnameAndType(searchParam, EListName.GDPR_ARTICLE, 'GDPR artikkel')
      } else {
        let searchResult: TSearchItem[] = []

        let results: TSearchItem[] = []
        const searches: Promise<any>[] = []

        const compareFn: (a: TSearchItem, b: TSearchItem) => number = (
          a: TSearchItem,
          b: TSearchItem
        ) => {
          if (a.type === EObjectType.PROCESS && a.number === parseInt(searchParam)) return -1
          else if (b.type === EObjectType.PROCESS && b.number === parseInt(searchParam)) return 1
          return prefixBiasedSort(searchParam, a.sortKey, b.sortKey)
        }

        const add: (items: TSearchItem[]) => void = (items: TSearchItem[]) => {
          results = [...results, ...items].sort(compareFn)
          searchResult = results
        }

        if (type === 'all') {
          add(
            searchCodelist(
              searchParam,
              EListName.PURPOSE,
              'Behandlingsaktivitet',
              searchResultColor.purposeBackground
            )
          )
          add(
            searchCodelist(
              searchParam,
              EListName.DEPARTMENT,
              'Avdeling',
              searchResultColor.departmentBackground
            )
          )
          add(
            searchCodelist(
              searchParam,
              EListName.SUB_DEPARTMENT,
              'Linja',
              searchResultColor.subDepartmentBackground
            )
          )
          add(
            searchCodelist(
              searchParam,
              EListName.THIRD_PARTY,
              'Ekstern part',
              searchResultColor.thirdPartyBackground
            )
          )
          add(
            searchCodelist(
              searchParam,
              EListName.SYSTEM,
              'System',
              searchResultColor.systemBackground
            )
          )
          add(
            searchCodelist(
              searchParam,
              EListName.NATIONAL_LAW,
              'Nasjonal lov',
              searchResultColor.nationalLawBackground
            )
          )
          add(
            searchCodelist(
              searchParam,
              EListName.GDPR_ARTICLE,
              'GDPR artikkel',
              searchResultColor.gdprBackground
            )
          )
        }

        if (type === 'all' || type === 'informationType') {
          searches.push(
            (async () => {
              const infoTypesRes = await searchInformationType(searchParam)
              add(
                infoTypesRes.content.map((it) => ({
                  id: it.id,
                  sortKey: it.name,
                  typeName: 'Opplysningstype',
                  tagColor: searchResultColor.informationTypeBackground,
                  label: it.name,
                  type: EObjectType.INFORMATION_TYPE,
                }))
              )
            })()
          )
        }

        if (type === 'all' || type === 'process') {
          searches.push(
            (async () => {
              const resProcess: IPageResponse<IProcess> = await searchProcess(searchParam)

              add(
                resProcess.content.map((content) => {
                  const purposes: string = content.purposes
                    .map((purpose) => codelist.getShortnameForCode(purpose))
                    .join(', ')

                  return {
                    id: content.id,
                    sortKey: `${content.name} ${purposes}`,
                    typeName: 'Behandling',
                    tagColor: searchResultColor.processBackground,
                    label: `${purposes}: ${content.name}`,
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
              const resProcess: IPageResponse<IDpProcess> = await searchDpProcess(searchParam)

              add(
                resProcess.content.map((content) => {
                  return {
                    id: content.id,
                    sortKey: content.name,
                    typeName: 'NAV som databehandler',
                    tagColor: searchResultColor.dpProcessBackground,
                    label: content.name,
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
              const resTeams = await searchTeam(searchParam)
              add(
                resTeams.content.map((content) => ({
                  id: content.id,
                  sortKey: content.name,
                  typeName: 'Team',
                  tagColor: searchResultColor.teamBackground,
                  label: content.name,
                  type: 'team',
                }))
              )
            })()
          )
        }

        if (type === 'all' || type === 'productarea') {
          searches.push(
            (async () => {
              const result: IPageResponse<IProductArea> = await searchProductArea(searchParam)
              add(
                result.content.map((content) => ({
                  id: content.id,
                  sortKey: content.name,
                  typeName: 'Område',
                  tagColor: searchResultColor.productAreaBackground,
                  label: content.name,
                  type: 'productarea',
                }))
              )
            })()
          )
        }

        if (type === 'all' || type === 'document') {
          searches.push(
            (async () => {
              const resDocs: IPageResponse<IDocument> = await searchDocuments(searchParam)
              add(
                resDocs.content.map((content) => ({
                  id: content.id,
                  sortKey: content.name,
                  typeName: 'Dokument',
                  tagColor: searchResultColor.documentBackground,
                  label: content.name,
                  type: EObjectType.DOCUMENT,
                }))
              )
            })()
          )
        }
        await Promise.all(searches)

        return searchResult
      }
    }
    return []
  }

  return (
    <div>
      <div className="flex items-center w-[730px]">
        <AsyncSelect
          className="w-full"
          aria-label="Søk"
          placeholder="Søk"
          loadOptions={useMainSearchOption}
          components={{ Option, DropdownIndicator }}
          noOptionsMessage={({ inputValue }) => noOptionMessage(inputValue)}
          controlShouldRenderValue={false}
          loadingMessage={() => 'Søker...'}
          isClearable={false}
          styles={selectOverrides}
          onChange={(value: any) => {
            const item = value as TSearchItem
            ;(async () => {
              if (item) {
                navigate(urlForObject(item.type, item.id))
              }
            })()
          }}
        />
        <Button
          onClick={() => setFilter(!filter)}
          icon={faFilter}
          size="xsmall"
          kind={filter ? 'primary' : 'tertiary'}
          marginLeft
        >
          <img aria-label="Filter" />
        </Button>
      </div>
      {filter && <SelectType type={type} setType={setType} />}
    </div>
  )
}

export default MainSearch
