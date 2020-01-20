import * as React from "react"
import moment from "moment"
import { StatefulTooltip } from "baseui/tooltip"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faClock } from "@fortawesome/free-solid-svg-icons"
import { intl, theme } from "../../util"

const defaultStart = moment("0001-01-01")
const defaultEnd = moment("9999-12-31")
const dateFormat = 'll'

export const hasSpecifiedDate = (obj: { start?: string, end?: string }) => {
    const startDate = obj.start ? moment(obj.start) : undefined
    const endDate = obj.end ? moment(obj.end) : undefined
    return checkDate(startDate, endDate).hasDates
}

const checkDate = (startDate?: moment.Moment, endDate?: moment.Moment, alwaysShow?: boolean) => {
    if (alwaysShow) {
        return {hasStart: true, hasEnd: true, hasDates: true}
    }
    const hasStart = !!startDate && !defaultStart.isSame(startDate)
    const hasEnd = !!endDate && !defaultEnd.isSame(endDate)
    const hasDates = hasStart || hasEnd
    return {hasStart, hasEnd, hasDates}
}

export const ActiveIndicator = (props: { start?: string, end?: string, alwaysShow?: boolean, preText?: string, showDates?: boolean }) => {
    const {start, end, alwaysShow, preText, showDates} = props
    const startDate = start ? moment(start) : defaultStart
    const endDate = end ? moment(end) : defaultEnd
    const {hasStart, hasEnd, hasDates} = checkDate(startDate, endDate, alwaysShow)
    const active = startDate.isSameOrBefore(moment()) && endDate.isSameOrAfter(moment())

    const startView = startDate.format(dateFormat)
    const endView = endDate.format(dateFormat)
    return (hasDates ?
            <StatefulTooltip content={<>{hasStart && (intl.startDate + ' ' + startView)} {hasStart && hasEnd && ' - '} {hasEnd && (intl.endDate + ' ' + endView)}</>}>
                <span>
                    {preText && preText + ': '}
                    <FontAwesomeIcon icon={faClock} color={active ? theme.colors.positive300 : theme.colors.mono600}/>
                    {showDates && <> {startView} - {endView}</>}
                </span>
            </StatefulTooltip>
            : null
    )
}