import { Radio } from '@navikt/ds-react'
import { TSearchType } from '../../../constants'

export const SmallRadio = (value: TSearchType, text: string) => (
  <Radio value={value} className="m-0 ml-2">
    <span className="text-xs text-[#1a1a1a]">{text}</span>
  </Radio>
)
