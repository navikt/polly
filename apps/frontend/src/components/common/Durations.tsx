import { faClock } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Tooltip } from '@navikt/ds-react'
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
          <Button
            type="button"
            size="small"
            variant="tertiary-neutral"
            style={{
              width: 'fit-content',
              justifyContent: 'flex-start',
              textAlign: 'left',
              paddingInline: 0,
              paddingBlock: 0,
            }}
          >
            {preText && preText + ': '}
            {showDates && (
              <>
                {startView} - {endView}
                <span style={{ marginLeft: theme.sizing.scale200 }} aria-hidden>
                  <FontAwesomeIcon
                    icon={faClock}
                    color={active ? 'var(--ax-text-success)' : 'var(--ax-text-neutral-subtle)'}
                  />
                </span>
              </>
            )}
            {!showDates && (
              <FontAwesomeIcon
                icon={faClock}
                color={active ? 'var(--ax-text-success)' : 'var(--ax-text-neutral-subtle)'}
              />
            )}
          </Button>
        </Tooltip>
      )}
    </>
  )
}
