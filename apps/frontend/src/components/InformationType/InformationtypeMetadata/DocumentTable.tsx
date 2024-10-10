import { IDocument } from '../../../constants'
import { useTable } from '../../../util/hooks'
import RouteLink from '../../common/RouteLink'
import { Cell, HeadCell, Row, Table } from '../../common/Table'

interface IDocumentTableProps {
  documents: IDocument[]
}

export const DocumentTable = (props: IDocumentTableProps) => {
  const { documents } = props
  const [table, sortColumn] = useTable<IDocument, keyof IDocument>(documents, {
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
      {table.data.map((row: IDocument, index: number) => (
        <Row key={index}>
          <Cell>
            <RouteLink href={`/document/${row.id}`}>{row.name}</RouteLink>
          </Cell>
          <Cell>{row.description}</Cell>
          <Cell>
            {row.informationTypes
              .map((informationType) => informationType.informationType.name)
              .join(', ')}
          </Cell>
        </Row>
      ))}
    </Table>
  )
}
