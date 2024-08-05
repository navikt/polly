import { Fragment, useEffect, useState } from 'react'
import { getTeam } from '../../api'
import { DpProcess, Team, dpProcessSort } from '../../constants'
import { useTable } from '../../util/hooks'
import RouteLink from './RouteLink'
import { Cell, HeadCell, Row, Table } from './Table'

type TableDpProcessType = {
  dpProcesses: Array<DpProcess>
}

const ThirdPartiesDpProcessTable = ({ dpProcesses }: TableDpProcessType) => {
  const [table, sortColumn] = useTable<DpProcess, keyof DpProcess>(dpProcesses, { sorting: dpProcessSort, initialSortColumn: 'name' })
  const [productTeams, setProductTeams] = useState<Map<string, Team>>()

  useEffect(() => {
    ;(async () => {
      let teamIds: string[] = dpProcesses.map((dp: DpProcess) => dp.affiliation.productTeams).flat()
      let teamsPromises: Promise<Team>[] = []
      teamIds.forEach((id) => teamsPromises.push((async () => await getTeam(id))()))
      let totalResponse: Team[] = await Promise.all(teamsPromises)
      let tempDictionary: Map<string, Team> = new Map<string, Team>()
      totalResponse.forEach((response: Team) => {
        if (tempDictionary.get(response.id) === undefined) {
          tempDictionary.set(response.id, response)
        }
      })
      setProductTeams(tempDictionary)
    })()
  }, [])

  return (
    <Table
      emptyText="Ingen databehandlinger"
      headers={
        <>
          <HeadCell title="Navn" column={'name'} tableState={[table, sortColumn]} />
          <HeadCell title="Beskrivelse" column={'description'} tableState={[table, sortColumn]} />
          <HeadCell title="Avdeling" column={'affiliation'} tableState={[table, sortColumn]} />
          <HeadCell title="Team" column={'affiliation'} tableState={[table, sortColumn]} />
        </>
      }
    >
      {table.data.map((row: DpProcess, index: number) => (
        <Row key={index}>
          <Cell>{<RouteLink href={`/dpprocess/${row.id}`}>{row.name}</RouteLink>}</Cell>
          <Cell>{row.description}</Cell>
          <Cell>
            <RouteLink href={`/process/department/${row.affiliation.department?.code}`}>{row.affiliation.department?.shortName}</RouteLink>
          </Cell>
          <Cell>
            {row.affiliation.productTeams.map((productTeam: string) => (
              <Fragment key={productTeam}>
                <RouteLink href={`/team/${productTeam}`}>{productTeams?.get(productTeam)?.id === productTeam && productTeams?.get(productTeam)?.name}</RouteLink>
                &nbsp;
              </Fragment>
            ))}
          </Cell>
        </Row>
      ))}
    </Table>
  )
}

export default ThirdPartiesDpProcessTable
