import { Radio } from 'baseui/radio'
import { TSearchType } from '../../../constants'
import { theme } from '../../../util'
import { paddingZero } from '../../common/Style'

type TRadioProps = {
  $isHovered: boolean
  $checked: boolean
}

export const SmallRadio = (value: TSearchType, text: string) => (
  <Radio
    value={value}
    overrides={{
      Root: {
        style: {
          marginBottom: 0,
        },
      },
      Label: {
        style: (a: TRadioProps) => ({
          ...paddingZero,
          ...(a.$isHovered ? { color: theme.colors.positive400 } : {}),
        }),
      },
      RadioMarkOuter: {
        style: (a: TRadioProps) => ({
          width: theme.sizing.scale500,
          height: theme.sizing.scale500,
          ...(a.$isHovered ? { backgroundColor: theme.colors.positive400 } : {}),
        }),
      },
      RadioMarkInner: {
        style: (a: TRadioProps) => ({
          width: a.$checked ? theme.sizing.scale100 : theme.sizing.scale300,
          height: a.$checked ? theme.sizing.scale100 : theme.sizing.scale300,
        }),
      },
    }}
  >
    <div className="text-xs">{text}</div>
  </Radio>
)
