import { Document } from '../../../constants'
import React from 'react'
import { intl } from '../../../util'
import { useTable } from '../../../util/hooks'
import RouteLink from '../../common/RouteLink'
import { Cell, HeadCell, Row, Table } from '../../common/Table'

interface DocumentTableProps {
  documents: Document[]
}

export const DocumentTable = (props: DocumentTableProps) => {
  const [table, sortColumn] = useTable<Document, keyof Document>(props.documents, {
    sorting: {
      /*todo*/
    },
    initialSortColumn: 'name',
  })

  return (
    <Table
      emptyText={intl.noDocumentsAvailableInTable}
      headers={
        <>
          <HeadCell title={intl.name} tableState={[table, sortColumn]} />
          <HeadCell title={intl.description} tableState={[table, sortColumn]} />
          <HeadCell title={intl.informationTypes} tableState={[table, sortColumn]} />
        </>
      }
    >
      {table.data.map((row, index) => (
        <Row key={index}>
          <Cell>
            <RouteLink href={`/document/${row.id}`}>{row.name}</RouteLink>
          </Cell>
          <Cell>{row.description}</Cell>
          <Cell>{row.informationTypes.map((it) => it.informationType.name).join(', ')}</Cell>
        </Row>
      ))}
    </Table>
  )
}
