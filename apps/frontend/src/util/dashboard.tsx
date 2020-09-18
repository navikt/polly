import { ProcessField, ProcessState, ProcessStatus, NavigableItem } from "../constants"
import * as H from 'history'
import { Section } from "../pages/ProcessPage"

export const clickOnPieChartSlice =
    (processField: ProcessField, processState: ProcessState, processStatus: ProcessStatus, history: H.History, type?: Section, id?: string) => () => {
        if (!type)
            history.push(`/dashboard/${processField}/${processState}/${processStatus}`)
        else if (type === Section.department)
            history.push(`/dashboard/${processField}/${processState}/${processStatus}?department=${id}`)
        else 
            history.push(`/dashboard/${processField}/${processState}/${processStatus}?productarea=${id}`)
    }
