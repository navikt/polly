import * as React from 'react'
import {Counter, ProcessField, ProcessState, ProcessStatusFilter} from '../../constants'
import {Chart} from './Chart'
import {intl} from '../../util'
import {chartColor} from '../../util/theme'

const chartSize = 80

type TriChartProps = {
    title: string,
    header?: string
    counter: Counter,
    processField: ProcessField,
    processStatus: ProcessStatusFilter,
    onClickPieChartSlice: Function
}

const TriChart = (props: TriChartProps) => {
    const { counter, title, header, processField, processStatus, onClickPieChartSlice} = props

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
                        onClick:  onClickPieChartSlice(processField, ProcessState.YES, processStatus)
                    },
                    {
                        label: intl.no,
                        size: counter.no,
                        color: chartColor.generalMustard,
                        onClick: onClickPieChartSlice(processField, ProcessState.NO, processStatus)
                    },
                    {
                        label: intl.unclarified,
                        size: counter.unknown,
                        color: chartColor.generalRed,
                        onClick:  onClickPieChartSlice(processField, ProcessState.UNKNOWN, processStatus)
                    },
                ]
            } />
    )
}

export default TriChart
