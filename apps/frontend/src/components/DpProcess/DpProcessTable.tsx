import { Tag } from '@navikt/ds-react'
import { IDpProcess, dpProcessSort } from '../../constants'
import { useTable } from '../../util/hooks'
import RouteLink from '../common/RouteLink'
import { Cell, HeadCell, Row, Table } from '../common/Table'

type TDpProcessTableProps = {
  dpProcesses: IDpProcess[]
}

const DpProcessTable = (props: TDpProcessTableProps) => {
  const { dpProcesses } = props
  const [table, sortColumn] = useTable<IDpProcess, keyof IDpProcess>(dpProcesses, {
    sorting: dpProcessSort,
    initialSortColumn: 'name',
  })

  const today = new Date().toISOString().split('T')[0]

  return (
    <>
      <Table
        emptyText="Ingen behandlinger"
        headers={
          <>
            <HeadCell title="Behandling" column="name" tableState={[table, sortColumn]} />
            <HeadCell title="Status" />
            <HeadCell
              title="Behandlingsansvarlig"
              column="externalProcessResponsible"
              tableState={[table, sortColumn]}
            />
            <HeadCell title="Avdeling" column="affiliation" tableState={[table, sortColumn]} />
          </>
        }
      >
        {table.data.map((process: IDpProcess, index: number) => {
          const isActive: boolean = today < process.end

          return (
            <Row key={index}>
              <Cell>
                <RouteLink href={`/dpprocess/${process.id}`} style={{ textDecoration: 'none' }}>
                  {process.name}
                </RouteLink>
              </Cell>
              <Cell>
                <Tag
                  variant={isActive ? 'success' : 'warning'}
                  style={{ minWidth: '5.5rem', display: 'inline-flex', justifyContent: 'center' }}
                >
                  {isActive ? 'Aktiv' : 'Utgått'}
                </Tag>
              </Cell>
              <Cell>
                <RouteLink
                  href={`/thirdparty/${process.externalProcessResponsible?.code}`}
                  style={{ textDecoration: 'none' }}
                >
                  {process.externalProcessResponsible?.shortName}
                </RouteLink>
              </Cell>
              <Cell>
                {process.affiliation.nomDepartmentName ||
                  process.affiliation.nomDepartmentId ||
                  'Ikke utfylt'}
              </Cell>
            </Row>
          )
        })}
      </Table>
    </>
  )
}

export default DpProcessTable
