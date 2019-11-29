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

export const ActiveIndicator = (props: IDurationed) => {
    const {active, start, end} = props
    const startDate = moment(start)
    const endDate = moment(end)
    const hasStart = !defaultStart.isSame(startDate)
    const hasEnd = !defaultEnd.isSame(endDate)

    return ((hasStart || hasEnd) ?
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