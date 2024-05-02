import * as React from 'react'
import { useTable } from '../../util/hooks'
import { DocumentInfoTypeUse, documentSort } from '../../constants'
import RouteLink from '../common/RouteLink'
import { Cell, HeadCell, Row, Table } from '../common/Table'

type DocumentInfoTypeTableProps = {
  list: DocumentInfoTypeUse[]
}

const DocumentInfoTypeTable = (props: DocumentInfoTypeTableProps) => {
  const { list } = props
  const [table, sortColumn] = useTable<DocumentInfoTypeUse, keyof DocumentInfoTypeUse>(list, { sorting: documentSort, initialSortColumn: 'informationType' })

  return (
    <Table
      emptyText='Ingen opplysningstyper'
      headers={
        <>
          <HeadCell title='Opplysningstype' column="informationType" tableState={[table, sortColumn]} />
          <HeadCell title='Personkategori' column="subjectCategories" tableState={[table, sortColumn]} />
        </>
      }
    >
      {table.data.map((row, index) => (
        <Row key={index}>
          <Cell>
            <RouteLink href={`/informationtype/${row.informationType.id}`}>{row.informationType.name}</RouteLink>
          </Cell>
          <Cell>{row.subjectCategories && row.subjectCategories.map((sc) => sc.shortName).join(', ')}</Cell>
        </Row>
      ))}
    </Table>
  )
}

export default DocumentInfoTypeTable
