import React, {useEffect} from "react";
import {getAllProcesses} from "../../api";
import {Process} from "../../constants";
import {RouteComponentProps} from "react-router-dom";
import {HeadingLarge} from "baseui/typography";
import {Spinner} from "baseui/spinner";
import {Cell, HeadCell, Row, Table} from "../common/Table";
import {useTable} from "../../util/hooks";
import {StyleObject} from "styletron-standard";

interface PathProps {
  filter?: 'PVK',
  filterValue?: string
}

const cellStyle:StyleObject = {
  maxWidth: '25%',
  wordBreak:"break-word"
}

const PurposeTable = (props: RouteComponentProps<PathProps>) => {
  const [processes, setProcesses] = React.useState<Process[]>([])
  const [loading, setLoading] = React.useState<boolean>(false)
  const [filtered, setFiltered] = React.useState<Process[]>([])

  useEffect(() => {
    (async () => {
      setLoading(true)
      let response = await getAllProcesses()
      setProcesses(response)
      setFiltered(filter(response))
      setLoading(false)
      console.log(response)
    })()
  }, [])

  const filter = (processes: Process[]) => {
    if (props.match.params.filter === "PVK") {
      processes = processes.filter(p => p.dpia === props.match.params.filterValue)
    }
    // if (teamType) {
    //   processes = processes.filter(t => t.teamType === teamType)
    // }
    // if (teamSize) {
    //   const from = parseInt(teamSize.substr(0, teamSize.indexOf('_')))
    //   const to = parseInt(teamSize.substr(teamSize.indexOf('_') + 1))
    //   processes = processes.filter(t => t.members.length >= from && t.members.length < to)
    // }
    // if (teamExt) {
    //   const from = parseInt(teamExt.substr(0, teamExt.indexOf('_')))
    //   const to = parseInt(teamExt.substr(teamExt.indexOf('_') + 1))
    //   processes = processes.filter(t => {
    //     const ext = t.members.filter(m => m.resource.resourceType === ResourceType.EXTERNAL).length
    //     const extP = t.members.length === 0 ? 0 : ext * 100 / t.members.length
    //     return extP >= from && extP < to
    //   })
    // }
    return processes
  }

  const [table, sortColumn] = useTable<Process, keyof Process>(processes, {
      useDefaultStringCompare: true,
      initialSortColumn: 'name',
      sorting: {
        name: (a, b) => (a.name || '').localeCompare(b.name || ''),
        purposeCode: (a, b) => (a.purposeCode || '').localeCompare(b.purposeCode || ''),
        department: (a, b) => (a.department === null ? ' ' : a.department.shortName).localeCompare(b.department === null ? ' ' : b.department.shortName),
        status: (a, b) => (a.status || '').localeCompare(b.status || '')
      }
    }
  )

  return (
    <>
      <HeadingLarge>Teams ({table.data.length})</HeadingLarge>
      {loading && <Spinner size='80px'/>}
      {!loading &&
      <Table emptyText={'teams'} headers={
        <>
          <HeadCell title='Navn' column='name' tableState={[table, sortColumn]} $style={{maxWidth: '25%'}}/>
          <HeadCell title='Formål' column='purposeCode' tableState={[table, sortColumn]} $style={{maxWidth: '25%'}}/>
          <HeadCell title='Avdeling' column='department' tableState={[table, sortColumn]} $style={{maxWidth: '25%'}}/>
          <HeadCell title='Status' column='status' tableState={[table, sortColumn]} $style={{maxWidth: '25%'}}/>
        </>
      }>
        {table.data.map(process =>
          <Row key={process.id}>
            <Cell $style={cellStyle}>{process.name}</Cell>
            <Cell $style={cellStyle} >{process.purposeCode}</Cell>
            <Cell $style={cellStyle}>{(process.department) === null ? '' : process.department.shortName}</Cell>
            <Cell $style={cellStyle}>{process.status}</Cell>
          </Row>)}
      </Table>}
    </>
  )
}

export default PurposeTable
