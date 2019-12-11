import * as React from "react"
import moment from "moment"
import { StatefulTooltip } from "baseui/tooltip"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons"

import { IDurationed } from "../../constants"
import { intl, theme } from "../../util"

const defaultStart = moment("0001-01-01")
const defaultEnd = moment("9999-12-31")
const dateFormat = 'LL'

export const hasSpecifiedDate = (obj: { start?: string, end?: string }) => {
    const startDate = obj.start ? moment(obj.start) : undefined
    const endDate = obj.end ? moment(obj.end) : undefined
    return checkDate(startDate, endDate).hasDates
}

const checkDate = (startDate?: moment.Moment, endDate?: moment.Moment) => {
    const hasStart = !!startDate && !defaultStart.isSame(startDate)
    const hasEnd = !!endDate && !defaultEnd.isSame(endDate)
    const hasDates = hasStart || hasEnd
    return {hasStart, hasEnd, hasDates}
}

export const ActiveIndicator = (props: IDurationed) => {
    const {active, start, end} = props
    const startDate = moment(start)
    const endDate = moment(end)
    const {hasStart, hasEnd, hasDates} = checkDate(startDate, endDate)

    return (hasDates ?
            <StatefulTooltip content={(<>
                {hasStart && <>{intl.startDate}: {startDate.format(dateFormat)}</>}
                {hasStart && hasEnd && '-'}
                {hasEnd && <>{intl.endDate}: {endDate.format(dateFormat)}</>}
            </>)}>
                <span><FontAwesomeIcon icon={faExclamationCircle} color={active ? theme.colors.positive300 : theme.colors.warning300}/></span>
            </StatefulTooltip>
            : null
    )
}