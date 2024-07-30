import { withStyle } from 'baseui'
import { Spinner as BaseUISpinner } from 'baseui/spinner'
import { theme } from '../../util'

export const Spinner = (props: { size?: string; margin?: string }) => {
  const { margin } = props
  const size = props.size || theme.sizing.scale1200
  const SpinnerStyled = withStyle(BaseUISpinner, { width: size, height: size })

  return (
    <div className={`${margin ? `m-[${margin}]` : ''}`}>
      <SpinnerStyled />
    </div>
  )
}
