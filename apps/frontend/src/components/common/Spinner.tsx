import {withStyle} from 'baseui'
import {StyledSpinnerNext} from 'baseui/spinner'
import React from 'react'
import {Block} from 'baseui/block'

export const Spinner = (props: {size?: string, margin?: string}) => {
  const SpinnerStyled = withStyle(StyledSpinnerNext, {width: props.size, height: props.size})
  return <Block  margin={props.margin}>
    <SpinnerStyled/>
  </Block>
}
