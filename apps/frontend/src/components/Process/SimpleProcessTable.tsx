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

export const SimpleProcessTable = (props: { processes: ProcessShort[], showCommonExternalProcessResponsible?: boolean }) => {
  const {processes} = props

  const [table, sortColumn] = useTable<ProcessShort, keyof ProcessShort>(processes, {
      useDefaultStringCompare: true,
      initialSortColumn: 'name',
      sorting: {
        name: (a, b) => ((a.purpose.shortName || '') + ':' + (a.name || '')).localeCompare((b.purpose.shortName || '') + ': ' + b.name || ''),
        affiliation: (a, b) => (a.affiliation.department?.shortName || ' ').localeCompare(b.affiliation.department?.shortName || ' '),
        status: (a, b) => (a.status || '').localeCompare(b.status || ''),
        commonExternalProcessResponsible: (a, b) => (a.commonExternalProcessResponsible?.shortName || ' ').localeCompare(b.commonExternalProcessResponsible?.shortName || ' '),
      }
    }
  )

  return (
    <Table emptyText={intl.processes} headers={
      <>
        <HeadCell title={intl.process} column='name' tableState={[table, sortColumn]} $style={cellStyle}/>
        <HeadCell title={intl.department} column='affiliation' tableState={[table, sortColumn]} $style={cellStyle}/>
        {props.showCommonExternalProcessResponsible && (
          <HeadCell title={intl.commonExternalProcessResponsible} column='commonExternalProcessResponsible' tableState={[table, sortColumn]} $style={cellStyle}/>
        )}
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
          <Cell $style={cellStyle}>{(process.affiliation.department) === null ? '' :
            <RouteLink href={`/process/department/${process.affiliation.department?.code}`}>{process.affiliation.department?.shortName}</RouteLink>}</Cell>
          {props.showCommonExternalProcessResponsible && (
            <Cell $style={cellStyle}>{(process.commonExternalProcessResponsible) === null ? '' :
              <RouteLink href={`/thirdparty/${process.commonExternalProcessResponsible?.code}`}>{process.commonExternalProcessResponsible?.shortName}</RouteLink>}</Cell>
          )}
          <Cell $style={cellStyle}>{(process.status) === ProcessStatus.IN_PROGRESS ? intl.inProgress : intl.completedProcesses}</Cell>
        </Row>)}
    </Table>
  )
}
