import { ClockIcon } from '@navikt/aksel-icons'
import { Tooltip } from '@navikt/ds-react'
import moment, { Moment } from 'moment'
import { theme } from '../../util'
import { env } from '../../util/env'

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

  const clockIconClassName = active
    ? 'text-[var(--a-text-success)] dark:text-[var(--a-text-default)]'
    : 'text-[var(--ax-text-neutral-subtle)]'

  const startView: string = startDate.locale('nb').format(dateFormat)
  const endView: string = endDate.locale('nb').format(dateFormat)

  const getTooltipText = () => {
    let content = ''

    if (hasStart) {
      content += `Fra og med ${startView}`
    }
    if (hasStart && hasEnd) {
      content += ' - '
    }

    content += ' '

    if (hasEnd) {
      content += ` til og med ${endView}`
    }
    return content
  }

  return (
    <>
      {hasDates && (
        <Tooltip content={getTooltipText()}>
          <button
            type="button"
            className="inline-flex items-center align-baseline"
            style={{
              background: 'transparent',
              border: 0,
              padding: 0,
              margin: 0,
              font: 'inherit',
              color: 'inherit',
              cursor: 'help',
            }}
          >
            {preText && preText + ': '}
            {showDates && (
              <>
                {startView} - {endView}
                <span style={{ marginLeft: theme.sizing.scale200 }} aria-hidden>
                  <ClockIcon aria-hidden className={clockIconClassName} />
                </span>
              </>
            )}
            {!showDates && <ClockIcon aria-hidden className={clockIconClassName} />}
          </button>
        </Tooltip>
      )}
    </>
  )
}
