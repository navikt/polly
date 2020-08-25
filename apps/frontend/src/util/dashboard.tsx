import { ProcessField, ProcessState, ProcessStatus } from "../constants"
import * as H from 'history'

export const clickOnPieChartSlice =
    (processField: ProcessField, processState: ProcessState, processStatus: ProcessStatus, history: H.History, department?: string) => () => {
        department ? history.push(`/dashboard/${processField}/${processState}/${processStatus}/${department}`)
            : history.push(`/dashboard/${processField}/${processState}/${processStatus}`)
    }
