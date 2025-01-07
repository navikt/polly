import { NavigateFunction } from 'react-router'
import { EProcessField, EProcessState, EProcessStatusFilter } from '../constants'
import { ESection } from '../pages/ProcessPage'

export const clickOnPieChartSlice =
  (
    processField: EProcessField,
    processState: EProcessState,
    processStatus: EProcessStatusFilter,
    navigate: NavigateFunction,
    type?: ESection,
    id?: string
  ) =>
  () => {
    if (!type) navigate(`/dashboard/${processField}/${processState}/${processStatus}`)
    else if (type === ESection.department)
      navigate(`/dashboard/${processField}/${processState}/${processStatus}?department=${id}`)
    else navigate(`/dashboard/${processField}/${processState}/${processStatus}?productarea=${id}`)
  }
