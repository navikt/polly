import { Document } from '../../../constants'
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
      emptyText="Ingen dokumenter"
      headers={
        <>
          <HeadCell title="Navn" tableState={[table, sortColumn]} />
          <HeadCell title="Beskrivelse" tableState={[table, sortColumn]} />
          <HeadCell title="Opplysningstyper" tableState={[table, sortColumn]} />
        </>
      }
    >
      {table.data.map((row: Document, index: number) => (
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
