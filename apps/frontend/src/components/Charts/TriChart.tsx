import { EProcessField, EProcessState, EProcessStatusFilter, ICounter } from '../../constants'
import { chartColor } from '../../util/theme'
import { Chart } from './Chart'

const chartSize = 80

type TTriChartProps = {
  title: string
  header?: string
  counter: ICounter
  processField: EProcessField
  processStatus: EProcessStatusFilter
  onClickPieChartSlice: Function
}

const TriChart = (props: TTriChartProps) => {
  const { counter, title, header, processField, processStatus, onClickPieChartSlice } = props

  return (
    <Chart
      chartTitle={title}
      headerTitle={header}
      size={chartSize}
      data={[
        {
          label: 'Ja',
          size: counter.yes,
          color: chartColor.generalBlue,
          onClick: onClickPieChartSlice(processField, EProcessState.YES, processStatus),
        },
        {
          label: 'Nei',
          size: counter.no,
          color: chartColor.generalMustard,
          onClick: onClickPieChartSlice(processField, EProcessState.NO, processStatus),
        },
        {
          label: 'Uavklart',
          size: counter.unknown,
          color: chartColor.generalRed,
          onClick: onClickPieChartSlice(processField, EProcessState.UNKNOWN, processStatus),
        },
      ]}
    />
  )
}

export default TriChart
