import { faClock } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import moment, { Moment } from 'moment/min/moment-with-locales'
import { theme } from '../../util'
import { env } from '../../util/env'
import CustomizedStatefulTooltip from './CustomizedStatefulTooltip'

const defaultStart: Moment = moment(env.defaultStartDate).locale('nb')
const defaultEnd: Moment = moment('9999-12-31').locale('nb')
const dateFormat = 'll'

export const hasSpecifiedDate = (obj: { start?: string; end?: string }): boolean => {
  const startDate: Moment | undefined = obj.start ? moment(obj.start).locale('nb') : undefined
  const endDate: Moment | undefined = obj.end ? moment(obj.end).locale('nb') : undefined
  return checkDate(startDate, endDate).hasDates
}

interface ICheckDateReturn {
  hasStart: boolean
  hasEnd: boolean
  hasDates: boolean
}

const checkDate = (
  startDate?: Moment,
  endDate?: Moment,
  alwaysShow?: boolean
): ICheckDateReturn => {
  if (alwaysShow) {
    return { hasStart: true, hasEnd: true, hasDates: true }
  }
  const hasStart: boolean = !!startDate && !defaultStart.isSame(startDate)
  const hasEnd: boolean = !!endDate && !defaultEnd.isSame(endDate)
  const hasDates: boolean = hasStart || hasEnd
  return { hasStart, hasEnd, hasDates }
}

interface IActiveIndicatorProps {
  start?: string
  end?: string
  alwaysShow?: boolean
  preText?: string
  showDates?: boolean
}

export const ActiveIndicator = (props: IActiveIndicatorProps) => {
  const { start, end, alwaysShow, preText, showDates } = props

  const startDate: Moment = start ? moment(start).locale('nb') : defaultStart
  const endDate: Moment = end ? moment(end).locale('nb') : defaultEnd
  const { hasStart, hasEnd, hasDates } = checkDate(startDate, endDate, alwaysShow)
  const active: boolean = startDate.isSameOrBefore(moment()) && endDate.isSameOrAfter(moment())

  const startView: string = startDate.locale('nb').format(dateFormat)
  const endView: string = endDate.locale('nb').format(dateFormat)

  return (
    <>
      {hasDates && (
        <CustomizedStatefulTooltip
          content={
            <>
              {hasStart && 'Fra og med ' + startView} {hasStart && hasEnd && ' - '}{' '}
              {hasEnd && ' til og med ' + endView}
            </>
          }
        >
          <span>
            {preText && preText + ': '}
            <FontAwesomeIcon
              icon={faClock}
              color={active ? theme.colors.positive300 : theme.colors.mono600}
            />
            {showDates && (
              <>
                {' '}
                {startView} - {endView}
              </>
            )}
          </span>
        </CustomizedStatefulTooltip>
      )}
    </>
  )
}
