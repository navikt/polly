import { Retention } from '../../constants'
import _ from 'lodash'
import * as React from 'react'

export const RetentionView = (props: { retention?: Retention }) => {
  const { retention } = props
  const retentionYears = Math.floor((retention?.retentionMonths || 0) / 12)
  const retentionMonths = (retention?.retentionMonths || 0) - retentionYears * 12
  const retainedYearsOrMonths = !!retentionYears || !!retentionMonths
  const retainedYearsAndMonths = !!retentionYears && !!retentionMonths

  if (!retainedYearsOrMonths) {
    return null
  }

  return (
    <span>
      <span>{retainedYearsOrMonths && 'Lagres i '} </span>
      <span>{!!retentionYears && `${retentionYears} år`} </span>
      <span>{retainedYearsAndMonths && '  og '} </span>
      <span>{!!retentionMonths && `${retentionMonths} måneder`} </span>
      <span> fra </span>
      <span>{_.lowerFirst(retention?.retentionStart)}</span>
    </span>
  )
}
