import * as React from 'react'
import { useEffect, useState } from 'react'
import { DpProcess, dpProcessSort, Team } from '../../constants'
import { useTable } from '../../util/hooks'
import { Cell, HeadCell, Row, Table } from './Table'
import RouteLink from './RouteLink'
import { getTeam } from '../../api'

type TableDpProcessType = {
  dpProcesses: Array<DpProcess>
}

const ThirdPartiesDpProcessTable = ({ dpProcesses }: TableDpProcessType) => {
  const [table, sortColumn] = useTable<DpProcess, keyof DpProcess>(dpProcesses, { sorting: dpProcessSort, initialSortColumn: 'name' })
  const [productTeams, setProductTeams] = useState<Map<string, Team>>()
  useEffect(() => {
    ;(async () => {
      let teamIds = dpProcesses.map((dp) => dp.affiliation.productTeams).flat()
      let teamsPromises: Promise<Team>[] = []
      teamIds.forEach((id) => teamsPromises.push((async () => await getTeam(id))()))
      let totalResponse = await Promise.all(teamsPromises)
      let tempDictionary: Map<string, Team> = new Map<string, Team>()
      totalResponse.forEach((r) => {
        if (tempDictionary.get(r.id) === undefined) {
          tempDictionary.set(r.id, r)
        }
      })
      setProductTeams(tempDictionary)
    })()
  }, [])

  return (
    <Table
      emptyText='Ingen databehandlinger'
      headers={
        <>
          <HeadCell title='Navn' column={'name'} tableState={[table, sortColumn]} />
          <HeadCell title='Beskrivelse' column={'description'} tableState={[table, sortColumn]} />
          <HeadCell title='Avdeling' column={'affiliation'} tableState={[table, sortColumn]} />
          <HeadCell title='Team' column={'affiliation'} tableState={[table, sortColumn]} />
        </>
      }
    >
      {table.data.map((row, index) => (
        <Row key={index}>
          <Cell>{<RouteLink href={`/dpprocess/${row.id}`}>{row.name}</RouteLink>}</Cell>
          <Cell>{row.description}</Cell>
          <Cell>
            <RouteLink href={`/process/department/${row.affiliation.department?.code}`}>{row.affiliation.department?.shortName}</RouteLink>
          </Cell>
          <Cell>
            {row.affiliation.productTeams.map((pt) => {
              return (
                <React.Fragment key={pt}>
                  <RouteLink href={`/team/${pt}`}>{productTeams?.get(pt)?.id === pt && productTeams?.get(pt)?.name}</RouteLink>
                  &nbsp;
                </React.Fragment>
              )
            })}
          </Cell>
        </Row>
      ))}
    </Table>
  )
}

export default ThirdPartiesDpProcessTable
