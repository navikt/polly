import { Retention } from "../../constants"
import { intl } from "../../util"
import _ from "lodash"
import * as React from "react"


export const RetentionView = (props: { retention?: Retention }) => {
  const {retention} = props;
  const retentionYears = Math.floor((retention?.retentionMonths || 0) / 12)
  const retentionMonths = (retention?.retentionMonths || 0) - retentionYears * 12
  const retainedYearsOrMonths = !!retentionYears || !!retentionMonths
  const retainedYearsAndMonths = !!retentionYears && !!retentionMonths

  if (!retainedYearsOrMonths) {
    return null
  }

  return (
    <span style={{whiteSpace: "nowrap"}}>
      <span>{retainedYearsOrMonths && intl.retained} </span>
      <span>{!!retentionYears && `${retentionYears} ${intl.years}`} </span>
      <span>{retainedYearsAndMonths && intl.and} </span>
      <span>{!!retentionMonths && `${retentionMonths} ${intl.months}`} </span>
      <span>{intl.from} </span>
      <span>{_.lowerFirst(retention?.retentionStart)}</span>
    </span>
  )
}
