import React, {useEffect} from 'react'
import {getProcessByStateAndStatus} from '../../api'
import {ProcessField, ProcessShort, ProcessState, ProcessStatus} from '../../constants'
import {useParams} from 'react-router-dom'
import {HeadingLarge} from 'baseui/typography'
import {Spinner} from 'baseui/spinner'
import {Cell, HeadCell, Row, Table} from '../common/Table'
import {useTable} from '../../util/hooks'
import {StyleObject} from 'styletron-standard'
import {codelist, ListName} from '../../service/Codelist'
import RouteLink from '../common/RouteLink'
import {intl} from '../../util'
import {lowerFirst} from 'lodash'

interface PathProps {
  filterName: ProcessField,
  filterValue: ProcessState,
  filterStatus: ProcessStatus,
  department?: string
}

const cellStyle: StyleObject = {
  wordBreak: 'break-word'
}

const PurposeTable = () => {
  const [loading, setLoading] = React.useState<boolean>(false)
  const [filtered, setFiltered] = React.useState<ProcessShort[]>([])
  const [title, setTitle] = React.useState('')
  const { filterName, filterValue, filterStatus, department } = useParams<PathProps>()

  useEffect(() => {
    (async () => {
      setLoading(true)
      changeTitle()
      let res = await getProcessByStateAndStatus(filterName, filterValue, filterStatus)
      if (res && department) setFiltered(res.filter((r: ProcessShort) => r.department && r.department.code === department))
      else setFiltered(res)
      setLoading(false)
    })()
  }, [filterName, filterValue, filterStatus, department])

  const changeTitle = () => {
    if (filterName === ProcessField.DPIA) {
      setTitle(`${intl.dpiaNeeded}: ${intl.getString(filterValue.toLowerCase() || '')} `)
    } else if (filterName === ProcessField.MISSING_LEGAL_BASIS) {
      setTitle(intl.processesWithUnknownLegalBasis)
    } else if (filterName === ProcessField.MISSING_ARTICLE_6) {
      setTitle(intl.processesWithoutArticle6LegalBasis)
    } else if (filterName === ProcessField.MISSING_ARTICLE_9) {
      setTitle(intl.processesWithoutArticle9LegalBasis)
    } else if (filterName === ProcessField.RETENTION) {
      switch (filterValue){
        case ProcessState.YES: setTitle(intl.retentionPlanYes)
        case ProcessState.NO: setTitle(intl.retentionPlanNo)
        case ProcessState.UNKNOWN: setTitle(intl.retentionPlanUnclarified)
      }
    } else if (filterName === ProcessField.PROFILING) {
      setTitle(`${intl.profiling}: ${intl.getString(filterValue.toLowerCase() || '')} `)
    } else if (filterName === ProcessField.AUTOMATION) {
      setTitle(`${intl.automaticProcessing}: ${intl.getString(filterValue.toLowerCase() || '')} `)
    } else if (filterName === ProcessField.DATA_PROCESSOR) {
      setTitle(`${intl.dataProcessor}: ${intl.getString(filterValue.toLowerCase() || '')} `)
    } else if (filterName === ProcessField.DATA_PROCESSOR_AGREEMENT_EMPTY) {
      setTitle(`${intl.dataProcessorAgreement} ${lowerFirst(intl.emptyMessage)} `)
    } else if (filterName === ProcessField.DATA_PROCESSOR_OUTSIDE_EU) {
      setTitle(`${intl.dataProcessor} ${lowerFirst(intl.dataProcessorOutsideEU)}: ${intl.getString(filterValue.toLowerCase() || '')} `)
    }
    console.log(filterName)
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
      {loading && <Spinner size='80px' />}
      {!loading &&
        <Table emptyText={'teams'} headers={
          <>
            <HeadCell title={intl.process} column='name' tableState={[table, sortColumn]} $style={cellStyle} />
            <HeadCell title={intl.department} column='department' tableState={[table, sortColumn]} $style={cellStyle} />
            <HeadCell title={intl.status} column='status' tableState={[table, sortColumn]} $style={cellStyle} />
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
        </Table>}
    </>
  )
}

export default PurposeTable
