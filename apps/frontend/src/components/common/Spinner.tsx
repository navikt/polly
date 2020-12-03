import {withStyle} from 'baseui'
import {StyledSpinnerNext} from 'baseui/spinner'
import React from 'react'
import {Block} from 'baseui/block'
import {theme} from '../../util'

export const Spinner = (props: {size?: string, margin?: string}) => {
   const size = props.size || theme.sizing.scale1200
  const SpinnerStyled = withStyle(StyledSpinnerNext, {width: size, height: size})
  return <Block  margin={props.margin}>
    <SpinnerStyled/>
  </Block>
}
