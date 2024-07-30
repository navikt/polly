import { Tag } from '@navikt/ds-react'
import { StyledLink } from 'baseui/link'
import { useEffect, useState } from 'react'
import { getResourceById } from '../../api'
import { DpProcess, DpProcessWithEmail, dpProcessSort } from '../../constants'
import { useTable } from '../../util/hooks'
import RouteLink from '../common/RouteLink'
import { Cell, HeadCell, Row, Table } from '../common/Table'

type DpProcessTableProps = {
  dpProcesses: DpProcess[]
}

const DpProcessTable = (props: DpProcessTableProps) => {
  const { dpProcesses } = props
  const [dpProcessesWithEmail, setDpProcessesWithEmail] = useState<DpProcessWithEmail[]>(dpProcesses)
  const [table, sortColumn] = useTable<DpProcessWithEmail, keyof DpProcessWithEmail>(dpProcessesWithEmail, {
    sorting: dpProcessSort,
    initialSortColumn: 'name',
  })

  const today = new Date().toISOString().split('T')[0]

  useEffect(() => {
    ;(async () => {
      if (dpProcesses) {
        const newDpProcessesList: DpProcessWithEmail[] = []
        await Promise.all(
          dpProcesses.map(async (dpp: DpProcess) => {
            const userIdent = dpp.changeStamp.lastModifiedBy.split(' ')[0]
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
          }),
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
            <HeadCell title="Behandlingsansvarlig" column="externalProcessResponsible" tableState={[table, sortColumn]} />
            <HeadCell title="Sist endret av" column="lastModifiedEmail" tableState={[table, sortColumn]} />
          </>
        }
      >
        {table.data.map((process: DpProcessWithEmail, index: number) => {
          const isActive = today < process.end

          return (
            <Row key={index}>
              <Cell>
                <RouteLink href={`/dpprocess/${process.id}`} style={{ textDecoration: 'none' }}>
                  {process.name}
                </RouteLink>
              </Cell>
              <Cell>
                <Tag variant={isActive ? 'success' : 'warning'}>{isActive ? 'Aktiv' : 'Utgått'}</Tag>
              </Cell>
              <Cell>
                <RouteLink href={`/thirdparty/${process.externalProcessResponsible?.code}`} style={{ textDecoration: 'none' }}>
                  {process.externalProcessResponsible?.shortName}
                </RouteLink>
              </Cell>
              <Cell>
                <StyledLink href={'mailto: ' + process.lastModifiedEmail}>{process.lastModifiedEmail}</StyledLink>
              </Cell>
            </Row>
          )
        })}
      </Table>
    </>
  )
}

export default DpProcessTable
