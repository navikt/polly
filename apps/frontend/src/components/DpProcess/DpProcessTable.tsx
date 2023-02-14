import { useTable } from '../../util/hooks'
import { Cell, HeadCell, Row, Table } from '../common/Table'
import { intl } from '../../util'
import { DpProcess, dpProcessSort, DpProcessWithEmail } from '../../constants'
import RouteLink from '../common/RouteLink'
import { useEffect, useState } from 'react'
import { getResourceById } from '../../api'
import { StyledLink } from 'baseui/link'

type DpProcessTableProps = {
  dpProcesses: DpProcess[]
}

const DpProcessTable = (props: DpProcessTableProps) => {
  const [dpProcessesWithEmail, setDpProcessesWithEmail] = useState<DpProcessWithEmail[]>(props.dpProcesses)
  const [table, sortColumn] = useTable<DpProcessWithEmail, keyof DpProcessWithEmail>(dpProcessesWithEmail, {
    sorting: dpProcessSort,
    initialSortColumn: 'name',
  })

  useEffect(() => {
    ;(async () => {
      if (props.dpProcesses) {
        const newDpProcessesList: DpProcessWithEmail[] = []
        await Promise.all(
          props.dpProcesses.map(async (dpp) => {
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
  }, [props.dpProcesses])

  return (
    <>
      <Table
        emptyText={intl.noProcessesAvailableInTable}
        headers={
          <>
            <HeadCell title={intl.process} column="name" tableState={[table, sortColumn]} />
            <HeadCell title={intl.externalProcessResponsible} column="externalProcessResponsible" tableState={[table, sortColumn]} />
            <HeadCell title={intl.formatString(intl.lastModified, '', '').toString().slice(0, -2)} column="lastModifiedEmail" tableState={[table, sortColumn]} />
          </>
        }
      >
        {table.data.map((process, index) => (
          <Row key={index}>
            <Cell>
              <RouteLink href={`/dpprocess/${process.id}`} style={{ textDecoration: 'none' }}>
                {process.name}
              </RouteLink>
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
        ))}
      </Table>
    </>
  )
}

export default DpProcessTable
