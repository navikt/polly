import { IDocumentInfoTypeUse, documentSort } from '../../constants'
import { useTable } from '../../util/hooks'
import RouteLink from '../common/RouteLink'
import { Cell, HeadCell, Row, Table } from '../common/Table'

type TDocumentInfoTypeTableProps = {
  list: IDocumentInfoTypeUse[]
}

const DocumentInfoTypeTable = (props: TDocumentInfoTypeTableProps) => {
  const { list } = props
  const [table, sortColumn] = useTable<IDocumentInfoTypeUse, keyof IDocumentInfoTypeUse>(list, {
    sorting: documentSort,
    initialSortColumn: 'informationType',
  })

  return (
    <Table
      emptyText="Ingen opplysningstyper"
      headers={
        <>
          <HeadCell
            title="Opplysningstype"
            column="informationType"
            tableState={[table, sortColumn]}
          />
          <HeadCell
            title="Personkategori"
            column="subjectCategories"
            tableState={[table, sortColumn]}
          />
        </>
      }
    >
      {table.data.map((row: IDocumentInfoTypeUse, index: number) => (
        <Row key={index}>
          <Cell>
            <RouteLink href={`/informationtype/${row.informationType.id}`}>
              {row.informationType.name}
            </RouteLink>
          </Cell>
          <Cell>
            {row.subjectCategories &&
              row.subjectCategories.map((subjectCategory) => subjectCategory.shortName).join(', ')}
          </Cell>
        </Row>
      ))}
    </Table>
  )
}

export default DocumentInfoTypeTable
