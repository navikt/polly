import { ProcessField, ProcessState, ProcessStatusFilter } from '../constants'
import { Section } from '../pages/ProcessPage'
import { NavigateFunction } from 'react-router-dom'

export const clickOnPieChartSlice =
  (processField: ProcessField, processState: ProcessState, processStatus: ProcessStatusFilter, navigate: NavigateFunction, type?: Section, id?: string) => () => {
    if (!type) navigate(`/dashboard/${processField}/${processState}/${processStatus}`)
    else if (type === Section.department) navigate(`/dashboard/${processField}/${processState}/${processStatus}?department=${id}`)
    else navigate(`/dashboard/${processField}/${processState}/${processStatus}?productarea=${id}`)
  }
