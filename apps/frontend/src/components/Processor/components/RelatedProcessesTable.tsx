import { Fragment } from 'react/jsx-runtime'
import { IProcess, processSort } from '../../../constants'
import { theme } from '../../../util'
import { useTable } from '../../../util/hooks'
import RouteLink from '../../common/RouteLink'
import { Cell, HeadCell, Row, Table } from '../../common/Table'

type TRelatedProcessesTableProps = {
  relatedProcesses: IProcess[]
}

const RelatedProcessesTable = ({ relatedProcesses }: TRelatedProcessesTableProps) => {
  const [table, sortColumn] = useTable<IProcess, keyof IProcess>(relatedProcesses, {
    sorting: processSort,
    initialSortColumn: 'name',
  })

  return (
    <>
      <Table
        emptyText="Ingen"
        backgroundColor={theme.colors.primary100}
        headers={
          <>
            <HeadCell
              title="Overordnet behandlingsaktivitet"
              column={'purposes'}
              tableState={[table, sortColumn]}
              $style={{ maxWidth: '25%' }}
            />
            <HeadCell
              title="Behandling ja"
              column={'name'}
              tableState={[table, sortColumn]}
              $style={{ maxWidth: '25%' }}
            />
            <HeadCell
              title="Avdeling"
              column={'affiliation'}
              tableState={[table, sortColumn]}
              $style={{ maxWidth: '25%' }}
            />
            <HeadCell title="System" $style={{ maxWidth: '25%' }} />
          </>
        }
      >
        {table.data.map((row: IProcess, index: number) => (
          <Fragment key={index}>
            <Row>
              <div className="flex w-full justify-between">
                <Cell $style={{ maxWidth: '25%' }}>
                  <RouteLink href={`/process/purpose/${row.purposes[0].code}`}>
                    {row.purposes[0].shortName}
                  </RouteLink>
                </Cell>
                <Cell $style={{ maxWidth: '25%' }}>
                  <RouteLink href={`/process/${row.id}`} width="25%">
                    {row.name}
                  </RouteLink>
                </Cell>
                <Cell $style={{ maxWidth: '25%' }}>
                  <RouteLink href={`/process/department/${row.affiliation.department?.code}`}>
                    {row.affiliation.department?.shortName}
                  </RouteLink>
                </Cell>
                <Cell $style={{ maxWidth: '25%' }}>
                  <div>
                    {row.affiliation.products.map((product, index) => (
                      <div className="mr-[10%]" key={index}>
                        <RouteLink href={`/process/system/${product.code}`}>
                          {product.shortName}
                        </RouteLink>
                      </div>
                    ))}
                  </div>
                </Cell>
              </div>
            </Row>
          </Fragment>
        ))}
      </Table>
    </>
  )
}

export default RelatedProcessesTable
