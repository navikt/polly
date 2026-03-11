import { Heading, Loader, SortState, Table } from '@navikt/ds-react'
import { useEffect, useState } from 'react'
import { IInformationType } from '../../constants'
import { CodelistService, EListName } from '../../service/Codelist'
import { handleSort } from '../../util/handleTableSort'
import { DotTags } from '../common/DotTag'
import RouteLink from '../common/RouteLink'
import { Sensitivity } from './Sensitivity'

type TTableProps = {
  title: string
  informationTypes?: IInformationType[]
  getInfoTypes?: () => Promise<IInformationType[]>
}

export const InfoTypeTable = ({ informationTypes, getInfoTypes, title }: TTableProps) => {
  const [codelistUtils] = CodelistService()
  const [informationTypeList, setInformationTypeList] = useState<IInformationType[]>(
    informationTypes || []
  )
  const [sort, setSort] = useState<SortState>()

  let sortedData: IInformationType[] = informationTypeList

  const comparator = (a: IInformationType, b: IInformationType, orderBy: string): number => {
    switch (orderBy) {
      case 'name':
        return a.name.localeCompare(b.name)
      case 'description':
        return (a.description || '').localeCompare(b.description || '')
      case 'sources':
        return (a.sources[0]?.shortName || '').localeCompare(b.sources[0]?.shortName || '')
      default:
        return 0
    }
  }

  sortedData = sortedData.sort((a: IInformationType, b: IInformationType) => {
    if (sort) {
      return sort.direction === 'ascending'
        ? comparator(b, a, sort.orderBy)
        : comparator(a, b, sort.orderBy)
    }
    return 1
  })

  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    if (!getInfoTypes) return
    ;(async () => {
      setIsLoading(true)
      setInformationTypeList(await getInfoTypes())
      setIsLoading(false)
    })()
  }, [getInfoTypes])

  return (
    <>
      {isLoading && (
        <div className="flex w-full justify-center">
          <Loader size="3xlarge" />
        </div>
      )}
      {!isLoading && (
        <div className="mb-12">
          <Heading className="mt-3" size="xlarge" level="2">
            {title} ({informationTypeList.length})
          </Heading>

          <Table
            size="medium"
            sort={sort}
            onSortChange={(sortKey) => handleSort(sort, setSort, sortKey)}
          >
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader sortKey="name" sortable>
                  Navn
                </Table.ColumnHeader>
                <Table.ColumnHeader sortKey="description" sortable>
                  Beskrivelse
                </Table.ColumnHeader>
                <Table.ColumnHeader sortKey="sources" sortable>
                  Kilder
                </Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {sortedData.map((row: IInformationType, index: number) => (
                <Table.Row key={index}>
                  <Table.DataCell textSize="small">
                    <RouteLink href={`/informationtype/${row.id}`}>
                      <Sensitivity sensitivity={row.sensitivity} codelistUtils={codelistUtils} />{' '}
                      {row.name}
                    </RouteLink>
                  </Table.DataCell>
                  <Table.DataCell textSize="small">{row.description}</Table.DataCell>
                  <Table.DataCell textSize="small">
                    <DotTags
                      list={EListName.THIRD_PARTY}
                      codes={row.sources}
                      linkCodelist
                      commaSeparator
                      codelistUtils={codelistUtils}
                    />
                  </Table.DataCell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
      )}
    </>
  )
}
