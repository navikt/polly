import { faClock } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import moment from 'moment/min/moment-with-locales'
import { theme } from '../../util'
import { env } from '../../util/env'
import CustomizedStatefulTooltip from './CustomizedStatefulTooltip'

const defaultStart = moment(env.defaultStartDate).locale('nb')
const defaultEnd = moment('9999-12-31').locale('nb')
const dateFormat = 'll'

export const hasSpecifiedDate = (obj: { start?: string; end?: string }) => {
  const startDate = obj.start ? moment(obj.start).locale('nb') : undefined
  const endDate = obj.end ? moment(obj.end).locale('nb') : undefined
  return checkDate(startDate, endDate).hasDates
}

const checkDate = (startDate?: moment.Moment, endDate?: moment.Moment, alwaysShow?: boolean) => {
  if (alwaysShow) {
    return { hasStart: true, hasEnd: true, hasDates: true }
  }
  const hasStart = !!startDate && !defaultStart.isSame(startDate)
  const hasEnd = !!endDate && !defaultEnd.isSame(endDate)
  const hasDates = hasStart || hasEnd
  return { hasStart, hasEnd, hasDates }
}

export const ActiveIndicator = (props: { start?: string; end?: string; alwaysShow?: boolean; preText?: string; showDates?: boolean }) => {
  const { start, end, alwaysShow, preText, showDates } = props
  const startDate = start ? moment(start).locale('nb') : defaultStart
  const endDate = end ? moment(end).locale('nb') : defaultEnd
  const { hasStart, hasEnd, hasDates } = checkDate(startDate, endDate, alwaysShow)
  const active = startDate.isSameOrBefore(moment()) && endDate.isSameOrAfter(moment())

  const startView = startDate.locale('nb').format(dateFormat)
  const endView = endDate.locale('nb').format(dateFormat)
  return hasDates ? (
    <CustomizedStatefulTooltip
      content={
        <>
          {hasStart && 'Fra og med ' + startView} {hasStart && hasEnd && ' - '} {hasEnd && ' til og med ' + endView}
        </>
      }
    >
      <span>
        {preText && preText + ': '}
        <FontAwesomeIcon icon={faClock} color={active ? theme.colors.positive300 : theme.colors.mono600} />
        {showDates && (
          <>
            {' '}
            {startView} - {endView}
          </>
        )}
      </span>
    </CustomizedStatefulTooltip>
  ) : null
}
