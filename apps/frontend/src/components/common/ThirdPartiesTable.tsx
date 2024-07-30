import { InformationType, informationTypeSort } from '../../constants'
import { useTable } from '../../util/hooks'
import RouteLink from './RouteLink'
import { Cell, HeadCell, Row, Table } from './Table'

type TableInformationTypes = {
  informationTypes: Array<InformationType>
  sortName: Boolean
}

const ThirdPartiesTable = ({ informationTypes, sortName }: TableInformationTypes) => {
  const [table, sortColumn] = useTable<InformationType, keyof InformationType>(informationTypes, {
    sorting: informationTypeSort,
    initialSortColumn: sortName ? 'name' : 'orgMaster',
  })

  return (
    <Table
      emptyText="Ingen innhentinger fra ekstern part"
      headers={
        <>
          <HeadCell title="Navn" column={'name'} tableState={[table, sortColumn]} />
          <HeadCell title="Master i NAV" column={'orgMaster'} tableState={[table, sortColumn]} />
        </>
      }
    >
      {table.data.map((row: InformationType, index: number) => (
        <Row key={index}>
          <Cell>{<RouteLink href={`/informationtype/${row.id}`}>{row.name}</RouteLink>}</Cell>
          <Cell>{row.orgMaster?.shortName && <RouteLink href={`/system/${row.orgMaster.code}`}>{row.orgMaster?.shortName}</RouteLink>}</Cell>
        </Row>
      ))}
    </Table>
  )
}

export default ThirdPartiesTable
