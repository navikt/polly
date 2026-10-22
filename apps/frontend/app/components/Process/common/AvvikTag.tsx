import { Badge } from '@navikt/ds-react'
import { FunctionComponent } from 'react'

type TProps = {
  marginLeft?: boolean
  marginRight?: boolean
  marginTop?: boolean
}

const AvvikTag: FunctionComponent<TProps> = ({ marginLeft, marginRight, marginTop }) => (
  <Badge
    data-color='meta-purple'
    aria-label='Endringer fra overordnet'
    className={`${marginLeft ? 'ml-2' : ''} ${marginRight ? 'mr-2' : ''} ${marginTop ? 'mt-1.5' : ''}`}
  />
)
export default AvvikTag
