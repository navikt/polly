import React, { useEffect } from 'react'
import { getProcessByState } from '../../api'
import { ProcessField, ProcessShort, ProcessState, ProcessStatus } from '../../constants'
import { RouteComponentProps } from 'react-router-dom'
import { HeadingLarge } from 'baseui/typography'
import { Spinner } from 'baseui/spinner'
import { Cell, HeadCell, Row, Table } from '../common/Table'
import { useTable } from '../../util/hooks'
import { StyleObject } from 'styletron-standard'
import { codelist, ListName } from '../../service/Codelist'
import RouteLink from '../common/RouteLink'
import { intl } from '../../util'

interface PathProps {
  filterName: ProcessField,
  filterValue: ProcessState
}

const cellStyle: StyleObject = {
  wordBreak: 'break-word'
}

const PurposeTable = (props: RouteComponentProps<PathProps>) => {
  const [loading, setLoading] = React.useState<boolean>(false)
  const [filtered, setFiltered] = React.useState<ProcessShort[]>([])
  const [title, setTitle] = React.useState('')

  useEffect(() => {
    (async () => {
      setLoading(true)
      changeTitle()
      setFiltered(await getProcessByState(props.match.params.filterName, props.match.params.filterValue))
      setLoading(false)
    })()
  }, [])

  const changeTitle = () => {
    if (props.match.params.filterName === ProcessField.DPIA) {
      setTitle(`${intl.dpiaNeeded}: ${intl.getString(props.match.params.filterValue.toLowerCase() || '')} `)
    } else if (props.match.params.filterName === ProcessField.MISSING_LEGAL_BASIS) {
      setTitle(intl.processesWithUnknownLegalBasis)
    } else if (props.match.params.filterName === ProcessField.MISSING_ARTICLE_6) {
      setTitle(intl.processesWithoutArticle6LegalBasis)
    } else if (props.match.params.filterName === ProcessField.MISSING_ARTICLE_9) {
      setTitle(intl.processesWithoutArticle9LegalBasis)
    } else if (props.match.params.filterName === ProcessField.PROFILING) {
      setTitle(`${intl.profiling}: ${intl.getString(props.match.params.filterValue.toLowerCase() || '')} `)
    } else if (props.match.params.filterName === ProcessField.AUTOMATION) {
      setTitle(`${intl.automaticProcessing}: ${intl.getString(props.match.params.filterValue.toLowerCase() || '')} `)
    }
  }

  const [table, sortColumn] = useTable<ProcessShort, keyof ProcessShort>(filtered, {
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
    <>
      <HeadingLarge>{title}</HeadingLarge>
      {loading && <Spinner size='80px'/>}
      {!loading &&
      <Table emptyText={'teams'} headers={
        <>
          <HeadCell title={intl.process} column='name' tableState={[table, sortColumn]} $style={cellStyle}/>
          <HeadCell title={intl.department} column='department' tableState={[table, sortColumn]} $style={cellStyle}/>
          <HeadCell title={intl.status} column='status' tableState={[table, sortColumn]} $style={cellStyle}/>
        </>
      }>
        {table.data.map(process =>
          <Row key={process.id}>
            <Cell $style={cellStyle}>
              <RouteLink href={`/process/purpose/${process.purpose.code}/ALL/${process.id}`}>
                {codelist.getShortname(ListName.PURPOSE, process.purpose.shortName) + ': ' + process.name}
              </RouteLink>
            </Cell>
            <Cell $style={cellStyle}>{(process.department) === null ? '' :
              <RouteLink href={`/process/department/${process.department.code}/ALL/`}>{process.department.shortName}</RouteLink>}</Cell>
            <Cell $style={cellStyle}>{(process.status) === ProcessStatus.IN_PROGRESS ? intl.inProgress : intl.completedProcesses}</Cell>
          </Row>)}
      </Table>}
    </>
  )
}

export default PurposeTable
