import * as React from 'react'
import { Counter, ProcessField, ProcessStatus, ProcessState } from '../../constants'
import { useHistory } from 'react-router-dom'
import { Chart } from '../Dashboard/Chart'
import { intl } from '../../util'
import { chartColor } from '../../util/theme'
//import * as H from 'history'

const chartSize = 80
//const clickOnPieChartSlice = (processField: ProcessField, processState: ProcessState, processStatus: ProcessStatus, history: H.History) => () => history.push(`/dashboard/${processField}/${processState}/${processStatus}`)

type TriChartProps = {
    title: string,
    header?: string
    counter: Counter,
    field: ProcessField,
    processStatus: ProcessStatus
}

const TriChart = (props: TriChartProps) => {
    const history = useHistory()
    const { counter, title, header, field, processStatus } = props
    return (
        <Chart
            chartTitle={title}
            headerTitle={header}
            size={chartSize}
            data={
                [
                    {
                        label: intl.yes,
                        size: counter.yes,
                        color: chartColor.generalBlue,
                    },
                    {
                        label: intl.no,
                        size: counter.no,
                        color: chartColor.generalMustard,
                    },
                    {
                        label: intl.unclarified,
                        size: counter.unknown,
                        color: chartColor.generalRed,
                    },
                ]
            } />
    )
}

export default TriChart