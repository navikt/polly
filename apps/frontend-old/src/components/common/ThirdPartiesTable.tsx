import { IInformationType, informationTypeSort } from '../../constants'
import { useTable } from '../../util/hooks'
import RouteLink from './RouteLink'
import { Cell, HeadCell, Row, Table } from './Table'

type TTableInformationTypes = {
  informationTypes: Array<IInformationType>
  sortName: boolean
}

const ThirdPartiesTable = ({ informationTypes, sortName }: TTableInformationTypes) => {
  const [table, sortColumn] = useTable<IInformationType, keyof IInformationType>(informationTypes, {
    sorting: informationTypeSort,
    initialSortColumn: sortName ? 'name' : 'orgMaster',
  })

  return (
    <Table
      emptyText="Ingen innhentinger fra ekstern part"
      headers={
        <>
          <HeadCell title="Navn" column="name" tableState={[table, sortColumn]} />
          <HeadCell title="Master i Nav" column={'orgMaster'} tableState={[table, sortColumn]} />
        </>
      }
    >
      {table.data.map((row: IInformationType, index: number) => (
        <Row key={index}>
          <Cell>{<RouteLink href={`/informationtype/${row.id}`}>{row.name}</RouteLink>}</Cell>
          <Cell>
            {row.orgMaster?.shortName && (
              <RouteLink href={`/system/${row.orgMaster.code}`}>
                {row.orgMaster?.shortName}
              </RouteLink>
            )}
          </Cell>
        </Row>
      ))}
    </Table>
  )
}

export default ThirdPartiesTable
