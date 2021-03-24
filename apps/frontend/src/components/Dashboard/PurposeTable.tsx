import React, {useEffect} from 'react'
import {getProcessByStateAndStatus, getProcessByStateAndStatusForDepartment, getProcessByStateAndStatusForProductArea} from '../../api'
import {ProcessField, ProcessShort, ProcessState, ProcessStatus} from '../../constants'
import {useParams} from 'react-router-dom'
import {HeadingLarge} from 'baseui/typography'
import {intl} from '../../util'
import {lowerFirst} from 'lodash'
import {SimpleProcessTable} from '../Process/SimpleProcessTable'
import {useQueryParam} from '../../util/hooks'
import {Spinner} from '../common/Spinner'

interface PathProps {
  filterName: ProcessField,
  filterValue: ProcessState,
  filterStatus: ProcessStatus,
}

const PurposeTable = () => {
  const [loading, setLoading] = React.useState<boolean>(false)
  const [filtered, setFiltered] = React.useState<ProcessShort[]>([])
  const [title, setTitle] = React.useState('')
  const {filterName, filterValue, filterStatus} = useParams<PathProps>()
  const department = useQueryParam('department')
  const productareaId = useQueryParam('productarea')

  useEffect(() => {
    (async () => {
      setLoading(true)
      changeTitle()
      if (department) {
        let res = await getProcessByStateAndStatusForDepartment(filterName, filterValue, filterStatus, department)
        setFiltered(res)
      } else if (productareaId) {
        let res = await getProcessByStateAndStatusForProductArea(filterName, filterValue, filterStatus, productareaId)
        setFiltered(res)
      } else {
        let res = await getProcessByStateAndStatus(filterName, filterValue, filterStatus)
        setFiltered(res)
      }
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
      setTitle(`${intl.processor}: ${intl.getString(filterValue.toLowerCase() || '')} `)
    } else if (filterName === ProcessField.DATA_PROCESSOR_AGREEMENT_EMPTY) {
      setTitle(`${intl.processorAgreement} ${lowerFirst(intl.emptyMessage)} `)
    } else if (filterName === ProcessField.COMMON_EXTERNAL_PROCESSOR) {
      setTitle(intl.navResponsible)
    } else if(filterName  === ProcessField.DPIA_REFERENCE_MISSING){
      setTitle(intl.missingPVK)
    }
  }

  return (
    <>
      <HeadingLarge>{title}</HeadingLarge>
      {loading && <Spinner size='80px'/>}
      {!loading && <SimpleProcessTable processes={filtered} showCommonExternalProcessResponsible={filterName === ProcessField.COMMON_EXTERNAL_PROCESSOR ? true : false}/>}
    </>
  )
}

export default PurposeTable
