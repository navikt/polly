import { Link, SortState, Table } from '@navikt/ds-react'
import { useState } from 'react'
import { IProcess } from '../../../constants'
import { handleSort } from '../../../util/handleTableSort'

type TRelatedProcessesTableProps = {
  relatedProcesses: IProcess[]
}

const RelatedProcessesTable = ({ relatedProcesses }: TRelatedProcessesTableProps) => {
  const [sort, setSort] = useState<SortState>()

  let sortedData: IProcess[] = relatedProcesses

  const comparator = (a: IProcess, b: IProcess, orderBy: string): number => {
    switch (orderBy) {
      case 'purposes':
        return a.purposes[0].shortName.localeCompare(b.purposes[0].shortName)
      case 'name':
        return (a.name || '').localeCompare(b.name || '')
      case 'affiliation':
        return (a.affiliation.department?.shortName || '').localeCompare(
          b.affiliation.department?.shortName || ''
        )
      default:
        return 0
    }
  }

  sortedData = sortedData.sort((a: IProcess, b: IProcess) => {
    if (sort) {
      return sort.direction === 'ascending'
        ? comparator(b, a, sort.orderBy)
        : comparator(a, b, sort.orderBy)
    }
    return 1
  })

  return (
    <Table
      size="large"
      zebraStripes
      sort={sort}
      onSortChange={(sortKey) => handleSort(sort, setSort, sortKey)}
    >
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeader sortKey="purposes" className="w-1/5" sortable>
            Overordnet behandlingsaktivitet
          </Table.ColumnHeader>
          <Table.ColumnHeader sortKey="name" className="w-2/5" sortable>
            {' '}
            Behandling
          </Table.ColumnHeader>
          <Table.ColumnHeader sortKey="affiliation" className="w-1/5" sortable>
            Avdeling
          </Table.ColumnHeader>
          <Table.ColumnHeader>System</Table.ColumnHeader>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {sortedData.map((row: IProcess, index: number) => (
          <Table.Row key={index}>
            <Table.DataCell>
              <Link href={`/process/purpose/${row.purposes[0].code}`}>
                {row.purposes[0].shortName}
              </Link>
            </Table.DataCell>
            <Table.DataCell>
              <Link href={`/process/${row.id}`}>{row.name}</Link>
            </Table.DataCell>
            <Table.DataCell>
              <Link href={`/process/department/${row.affiliation.department?.code}`}>
                {row.affiliation.department?.shortName}
              </Link>
            </Table.DataCell>
            <Table.DataCell>
              {' '}
              {row.affiliation.products.map((product, index) => (
                <div className="" key={index}>
                  <Link href={`/process/system/${product.code}`}>{product.shortName}</Link>
                </div>
              ))}
            </Table.DataCell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  )
}

export default RelatedProcessesTable
