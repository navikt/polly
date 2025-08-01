import moment from 'moment'
import { FunctionComponent } from 'react'
import { IAiUsageDescription } from '../../../constants'

type TProps = {
  aiUsageDescription: IAiUsageDescription
}

export const StartEndDateView: FunctionComponent<TProps> = (props) => {
  const { aiUsageDescription } = props
  const startDate = aiUsageDescription.startDate
    ? moment(aiUsageDescription.startDate).locale('nb')
    : undefined
  const endDate = aiUsageDescription.endDate
    ? moment(aiUsageDescription.endDate).locale('nb')
    : undefined

  const startDateView: string = startDate?.locale('nb').format('ll') || 'Uavklart'
  const endDateView: string = endDate?.locale('nb').format('ll') || 'Uavklart'

  const dateView =
    startDate === undefined && endDate === undefined
      ? 'Ingen dato satt'
      : `${startDateView} - ${endDateView}`

  return <span>{dateView}</span>
}

export default StartEndDateView
