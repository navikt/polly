import * as React from 'react'
import { useEffect, useState } from 'react'
import { intl } from '../../util'
import { DpProcess, dpProcessSort, Team } from '../../constants'
import { useTable } from '../../util/hooks'
import { Cell, HeadCell, Row, Table } from './Table'
import RouteLink from './RouteLink'
import { getTeam } from '../../api'
import { lowerFirst } from 'lodash'

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
      emptyText={intl.emptyTable + ' ' + lowerFirst(intl.dpProcesses)}
      headers={
        <>
          <HeadCell title={intl.name} column={'name'} tableState={[table, sortColumn]} />
          <HeadCell title={intl.description} column={'description'} tableState={[table, sortColumn]} />
          <HeadCell title={intl.department} column={'affiliation'} tableState={[table, sortColumn]} />
          <HeadCell title={intl.productTeam} column={'affiliation'} tableState={[table, sortColumn]} />
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
