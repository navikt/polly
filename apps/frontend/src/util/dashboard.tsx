import { ProcessField, ProcessState, ProcessStatus, NavigableItem } from "../constants"
import * as H from 'history'
import { ListName } from "../service/Codelist"

export const clickOnPieChartSlice =
    (processField: ProcessField, processState: ProcessState, processStatus: ProcessStatus, history: H.History, type?: NavigableItem, id?: string) => () => {
        if (!type)
            history.push(`/dashboard/${processField}/${processState}/${processStatus}`)
        else if (type === ListName.DEPARTMENT)
            history.push(`/dashboard/${processField}/${processState}/${processStatus}?department=${id}`)
        else 
            history.push(`/dashboard/${processField}/${processState}/${processStatus}?productarea=${id}`)
    }
