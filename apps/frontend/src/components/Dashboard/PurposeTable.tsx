import React, {useEffect} from "react";
import {getAllProcesses} from "../../api";
import {Dpia, Process} from "../../constants";
import {RouteComponentProps} from "react-router-dom";
import {HeadingLarge} from "baseui/typography";
import {Spinner} from "baseui/spinner";
import {Cell, HeadCell, Row, Table} from "../common/Table";
import {useTable} from "../../util/hooks";
import {StyleObject} from "styletron-standard";
import {codelist, ListName} from "../../service/Codelist";
import RouteLink from "../common/RouteLink";
import {intl} from "../../util";

interface PathProps {
  filterName?: 'PVK',
  filterValue?: string
}

const cellStyle: StyleObject = {
  maxWidth: '25%',
  wordBreak: "break-word"
}

const PurposeTable = (props: RouteComponentProps<PathProps>) => {
  const [loading, setLoading] = React.useState<boolean>(false)
  const [filtered, setFiltered] = React.useState<Process[]>([])
  const [title, setTitle] = React.useState('')

  useEffect(() => {
    (async () => {
      setLoading(true)
      changeTitle()
      setFiltered(filter(await getAllProcesses()))
      setLoading(false)
    })()
  }, [])

  const changeTitle = () => {
    if(props.match.params.filterName === "PVK"){
      setTitle(`${intl.dpiaNeeded}: ${intl.getString(props.match.params.filterValue || '')} `)
    }
  }

  const filter = (processes: Process[]) => {
    if (props.match.params.filterName === 'PVK') {
      return processes.filter(p => (p.dpia as Dpia).needForDpia === (props.match.params.filterValue === 'no' ? false : props.match.params.filterValue === 'unclarified' ? null : true))
    }
    return processes
  }

  const [table, sortColumn] = useTable<Process, keyof Process>(filtered, {
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
      <HeadingLarge>{title}</HeadingLarge>
      {loading && <Spinner size='80px'/>}
      {!loading &&
      <Table emptyText={'teams'} headers={
        <>
          <HeadCell title={intl.name} column='name' tableState={[table, sortColumn]} $style={{maxWidth: '25%'}}/>
          <HeadCell title={intl.purpose} column='purposeCode' tableState={[table, sortColumn]} $style={{maxWidth: '25%'}}/>
          <HeadCell title={intl.department} column='department' tableState={[table, sortColumn]} $style={{maxWidth: '25%'}}/>
          <HeadCell title={intl.status} column='status' tableState={[table, sortColumn]} $style={{maxWidth: '25%'}}/>
        </>
      }>
        {table.data.map(process =>
          <Row key={process.id}>
            <Cell $style={cellStyle}><RouteLink href={`/process/purpose/${process.purposeCode}/ALL/${process.id}`}>{process.name}</RouteLink></Cell>
            <Cell $style={cellStyle}><RouteLink
              href={`/process/purpose/${process.purposeCode}/ALL/`}>{codelist.getShortname(ListName.PURPOSE, process.purposeCode)}</RouteLink></Cell>
            <Cell $style={cellStyle}>{(process.department) === null ? '' :
              <RouteLink href={`/process/department/${process.department.code}/ALL/`}>{process.department.shortName}</RouteLink>}</Cell>
            <Cell $style={cellStyle}>{process.status}</Cell>
          </Row>)}
      </Table>}
    </>
  )
}

export default PurposeTable
