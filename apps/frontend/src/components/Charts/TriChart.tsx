import * as React from 'react'
import { Counter, ProcessField, ProcessStatus, ProcessState } from '../../constants'
import { useHistory } from 'react-router-dom'
import { Chart } from './Chart'
import { intl } from '../../util'
import { chartColor } from '../../util/theme'
import { clickOnPieChartSlice } from '../../util/dashboard'

const chartSize = 80

type TriChartProps = {
    title: string,
    header?: string
    counter: Counter,
    processField: ProcessField,
    processStatus: ProcessStatus,
    departmentCode?: string
}

const TriChart = (props: TriChartProps) => {
    const history = useHistory()
    const { counter, title, header, processField, processStatus, departmentCode } = props
    console.log(departmentCode)
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
                        onClick: clickOnPieChartSlice(processField, ProcessState.YES, processStatus, history, departmentCode)
                    },
                    {
                        label: intl.no,
                        size: counter.no,
                        color: chartColor.generalMustard,
                        onClick: clickOnPieChartSlice(processField, ProcessState.NO, processStatus, history, departmentCode)
                    },
                    {
                        label: intl.unclarified,
                        size: counter.unknown,
                        color: chartColor.generalRed,
                        onClick: clickOnPieChartSlice(processField, ProcessState.UNKNOWN, processStatus, history, departmentCode)
                    },
                ]
            } />
    )
}

export default TriChart