import { NavigateFunction } from '@/util/router'
import { EProcessField, EProcessState, EProcessStatusFilter } from '../constants'
import { ESection } from '../pages/ProcessPage'

type TPieChartSliceOptions = {
  processField: EProcessField
  processState: EProcessState
  processStatus: EProcessStatusFilter
  navigate: NavigateFunction
  type?: ESection
  id?: string
  departmentCode?: string
  noDepartment?: boolean
}

export const clickOnPieChartSlice = (options: TPieChartSliceOptions) => () => {
  const {
    processField,
    processState,
    processStatus,
    navigate,
    type,
    id,
    departmentCode,
    noDepartment,
  } = options
  if (noDepartment)
    navigate(`/dashboard/${processField}/${processState}/${processStatus}?noDepartment=true`)
  else if (!type) navigate(`/dashboard/${processField}/${processState}/${processStatus}`)
  else if (type === ESection.department)
    navigate(`/dashboard/${processField}/${processState}/${processStatus}?department=${id}`)
  else if (type === ESection.seksjon)
    navigate(
      `/dashboard/${processField}/${processState}/${processStatus}?seksjon=${id}${departmentCode ? `&department=${departmentCode}` : ''}`
    )
  else navigate(`/dashboard/${processField}/${processState}/${processStatus}?productarea=${id}`)
}
