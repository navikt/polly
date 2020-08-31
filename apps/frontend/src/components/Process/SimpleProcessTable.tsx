import {Cell, HeadCell, Row, Table} from '../common/Table'
import {intl} from '../../util'
import RouteLink from '../common/RouteLink'
import {codelist, ListName} from '../../service/Codelist'
import {ProcessShort, ProcessStatus} from '../../constants'
import React from 'react'
import {useTable} from '../../util/hooks'
import {StyleObject} from 'styletron-standard'

const cellStyle: StyleObject = {
  wordBreak: 'break-word'
}

export const SimpleProcessTable = (props: {processes: ProcessShort[]}) => {
  const {processes} = props


  const [table, sortColumn] = useTable<ProcessShort, keyof ProcessShort>(processes, {
      useDefaultStringCompare: true,
      initialSortColumn: 'name',
      sorting: {
        name: (a, b) => ((a.purpose.shortName || '') + ':' + (a.name || '')).localeCompare((b.purpose.shortName || '') + ': ' + b.name || ''),
        department: (a, b) => (a.department === null ? ' ' : a.department.shortName).localeCompare(b.department === null ? ' ' : b.department.shortName),
        status: (a, b) => (a.status || '').localeCompare(b.status || '')
      }
    }
  )

  return (
    <Table emptyText={intl.processes} headers={
      <>
        <HeadCell title={intl.process} column='name' tableState={[table, sortColumn]} $style={cellStyle}/>
        <HeadCell title={intl.department} column='department' tableState={[table, sortColumn]} $style={cellStyle}/>
        <HeadCell title={intl.status} column='status' tableState={[table, sortColumn]} $style={cellStyle}/>
      </>
    }>
      {table.data.map(process =>
        <Row key={process.id}>
          <Cell $style={cellStyle}>
            <RouteLink href={`/process/purpose/${process.purpose.code}/${process.id}`}>
              {codelist.getShortname(ListName.PURPOSE, process.purpose.shortName) + ': ' + process.name}
            </RouteLink>
          </Cell>
          <Cell $style={cellStyle}>{(process.department) === null ? '' :
            <RouteLink href={`/process/department/${process.department.code}`}>{process.department.shortName}</RouteLink>}</Cell>
          <Cell $style={cellStyle}>{(process.status) === ProcessStatus.IN_PROGRESS ? intl.inProgress : intl.completedProcesses}</Cell>
        </Row>)}
    </Table>
  )
}
