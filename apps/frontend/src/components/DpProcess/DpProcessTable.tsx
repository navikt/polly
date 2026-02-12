import { Link, Tag } from '@navikt/ds-react'
import { useEffect, useState } from 'react'
import { getResourceById } from '../../api/GetAllApi'
import { IDpProcess, IDpProcessWithEmail, dpProcessSort } from '../../constants'
import { useTable } from '../../util/hooks'
import RouteLink from '../common/RouteLink'
import { Cell, HeadCell, Row, Table } from '../common/Table'

type TDpProcessTableProps = {
  dpProcesses: IDpProcess[]
}

const DpProcessTable = (props: TDpProcessTableProps) => {
  const { dpProcesses } = props
  const [dpProcessesWithEmail, setDpProcessesWithEmail] =
    useState<IDpProcessWithEmail[]>(dpProcesses)
  const [table, sortColumn] = useTable<IDpProcessWithEmail, keyof IDpProcessWithEmail>(
    dpProcessesWithEmail,
    {
      sorting: dpProcessSort,
      initialSortColumn: 'name',
    }
  )

  const today = new Date().toISOString().split('T')[0]

  useEffect(() => {
    ;(async () => {
      if (dpProcesses) {
        const newDpProcessesList: IDpProcessWithEmail[] = []
        await Promise.all(
          dpProcesses.map(async (dpp: IDpProcess) => {
            const userIdent: string = dpp.changeStamp.lastModifiedBy.split(' ')[0]
            if (userIdent !== 'migration') {
              await getResourceById(userIdent).then((res) => {
                newDpProcessesList.push({
                  ...dpp,
                  lastModifiedEmail: res.email,
                })
              })
            } else {
              newDpProcessesList.push({ ...dpp })
            }
          })
        ).then(() => setDpProcessesWithEmail(newDpProcessesList))
      }
    })()
  }, [dpProcesses])

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
            <HeadCell
              title="Sist endret av"
              column="lastModifiedEmail"
              tableState={[table, sortColumn]}
            />
          </>
        }
      >
        {table.data.map((process: IDpProcessWithEmail, index: number) => {
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
                <Link href={'mailto: ' + process.lastModifiedEmail}>
                  {process.lastModifiedEmail}
                </Link>
              </Cell>
            </Row>
          )
        })}
      </Table>
    </>
  )
}

export default DpProcessTable
