import { Fragment, useEffect, useState } from 'react'
import { getTeam } from '../../api/GetAllApi'
import { IDpProcess, ITeam, dpProcessSort } from '../../constants'
import { useTable } from '../../util/hooks'
import RouteLink from './RouteLink'
import { Cell, HeadCell, Row, Table } from './Table'

type TTableDpProcessType = {
  dpProcesses: Array<IDpProcess>
}

const ThirdPartiesDpProcessTable = ({ dpProcesses }: TTableDpProcessType) => {
  const [table, sortColumn] = useTable<IDpProcess, keyof IDpProcess>(dpProcesses, {
    sorting: dpProcessSort,
    initialSortColumn: 'name',
  })
  const [productTeams, setProductTeams] = useState<Map<string, ITeam>>()

  useEffect(() => {
    ;(async () => {
      const teamIds: string[] = dpProcesses
        .map((dp: IDpProcess) => dp.affiliation.productTeams)
        .flat()
      const teamsPromises: Promise<ITeam>[] = []
      teamIds.forEach((id) => teamsPromises.push((async () => await getTeam(id))()))
      const totalResponse: ITeam[] = await Promise.all(teamsPromises)
      const tempDictionary: Map<string, ITeam> = new Map<string, ITeam>()
      totalResponse.forEach((response: ITeam) => {
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
      {table.data.map((row: IDpProcess, index: number) => (
        <Row key={index}>
          <Cell>{<RouteLink href={`/dpprocess/${row.id}`}>{row.name}</RouteLink>}</Cell>
          <Cell>{row.description}</Cell>
          <Cell>
            <RouteLink href={`/process/department/${row.affiliation.nomDepartmentId}`}>
              {row.affiliation.nomDepartmentName}
            </RouteLink>
          </Cell>
          <Cell>
            {row.affiliation.productTeams.map((productTeam: string) => (
              <Fragment key={productTeam}>
                <RouteLink href={`/team/${productTeam}`}>
                  {productTeams?.get(productTeam)?.id === productTeam &&
                    productTeams?.get(productTeam)?.name}
                </RouteLink>
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
