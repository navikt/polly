import { withStyle } from 'baseui'
import { Spinner as BaseUISpinner } from 'baseui/spinner'
import React from 'react'
import { Block } from 'baseui/block'
import { theme } from '../../util'

export const Spinner = (props: { size?: string; margin?: string }) => {
  const size = props.size || theme.sizing.scale1200
  const SpinnerStyled = withStyle(BaseUISpinner, { width: size, height: size })
  return (
    <Block margin={props.margin}>
      <SpinnerStyled />
    </Block>
  )
}
