import { Link, SortState, Table } from '@navikt/ds-react'
import { useState } from 'react'
import { IDocument } from '../../../constants'
import { handleSort, sortTableData } from '../../../util/handleTableSort'

interface IDocumentTableProps {
  documents: IDocument[]
}

export const DocumentTable = (props: IDocumentTableProps) => {
  const { documents } = props
  const [sort, setSort] = useState<SortState>()

  const comparator = (a: IDocument, b: IDocument, orderBy: string): number => {
    switch (orderBy) {
      case 'name':
        return (a.name || '').localeCompare(b.name || '')
      case 'description':
        return (a.description || '').localeCompare(b.description || '')
      case 'informationTypes':
        return (a.informationTypes[0].informationType.name || '').localeCompare(
          b.informationTypes[0].informationType.name || ''
        )
      default:
        return 0
    }
  }

  const sortedData: IDocument[] = sortTableData(documents, comparator, 'name', sort)

  return (
    <Table size='small' sort={sort} onSortChange={(sortKey) => handleSort(sort, setSort, sortKey)}>
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeader sortKey='name' className='w-1/3' sortable>
            Navn
          </Table.ColumnHeader>
          <Table.ColumnHeader sortKey='description' className='w-1/3' sortable>
            Beskrivelse
          </Table.ColumnHeader>
          <Table.ColumnHeader sortKey='informationTypes' className='w-1/3' sortable>
            Opplysningstyper
          </Table.ColumnHeader>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {sortedData.map((row: IDocument, index: number) => (
          <Table.Row key={index}>
            <Table.DataCell textSize='small'>
              <Link href={`/document/${row.id}`}>{row.name}</Link>
            </Table.DataCell>
            <Table.DataCell textSize='small'>{row.description}</Table.DataCell>
            <Table.DataCell textSize='small'>
              {row.informationTypes
                .map((informationType) => informationType.informationType.name)
                .join(', ')}
            </Table.DataCell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  )
}
