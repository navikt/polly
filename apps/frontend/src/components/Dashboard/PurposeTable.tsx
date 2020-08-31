import React, {useEffect} from 'react'
import {getProcessByStateAndStatus} from '../../api'
import {ProcessField, ProcessShort, ProcessState, ProcessStatus} from '../../constants'
import {useParams} from 'react-router-dom'
import {HeadingLarge} from 'baseui/typography'
import {Spinner} from 'baseui/spinner'
import {intl} from '../../util'
import {lowerFirst} from 'lodash'
import {SimpleProcessTable} from '../Process/SimpleProcessTable'

interface PathProps {
  filterName: ProcessField,
  filterValue: ProcessState,
  filterStatus: ProcessStatus,
  department?: string
}

const PurposeTable = () => {
  const [loading, setLoading] = React.useState<boolean>(false)
  const [filtered, setFiltered] = React.useState<ProcessShort[]>([])
  const [title, setTitle] = React.useState('')
  const {filterName, filterValue, filterStatus, department} = useParams<PathProps>()

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
    } else if (filterName === ProcessField.RETENTION_DATA) {
      setTitle(`${intl.retention}: ${intl.unknown}`)
    } else if (filterName === ProcessField.RETENTION) {
      switch (filterValue) {
        case ProcessState.YES:
          return setTitle(intl.retentionPlanYes)
        case ProcessState.NO:
          return setTitle(intl.retentionPlanNo)
        case ProcessState.UNKNOWN:
          return setTitle(intl.retentionPlanUnclarified)
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
  }

  return (
    <>
      <HeadingLarge>{title}</HeadingLarge>
      {loading && <Spinner size='80px'/>}
      {!loading && <SimpleProcessTable processes={filtered}/>}
    </>
  )
}

export default PurposeTable
