import { Loader } from '@navikt/ds-react'
import { theme } from '../../util'

interface IProps {
  size?: string
  margin?: string
}

export const Spinner = (props: IProps) => {
  const { margin } = props
  const size = props.size || theme.sizing.scale1200

  const presetSizes = new Set(['xsmall', 'small', 'medium', 'large', 'xlarge'])
  const presetSize = presetSizes.has(size) ? (size as any) : undefined
  const style = presetSize ? undefined : ({ width: size, height: size } as const)

  return (
    <div style={margin ? { margin } : undefined}>
      <Loader size={presetSize || 'medium'} style={style} />
    </div>
  )
}
