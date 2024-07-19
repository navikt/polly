import { Radio } from 'baseui/radio'
import { paddingZero } from '../../common/Style'
import { theme } from '../../../util'
import { Block } from 'baseui/block'
import { default as React } from 'react'
import { SearchType } from '../../../constants'

type RadioProps = {
  $isHovered: boolean
  $checked: boolean
}

export const SmallRadio = (value: SearchType, text: string) => {
  return (
    <Radio
      value={value}
      overrides={{
        Root: {
          style: {
            marginBottom: 0,
          },
        },
        Label: {
          style: (a: RadioProps) => ({
            ...paddingZero,
            ...(a.$isHovered ? { color: theme.colors.positive400 } : {}),
          }),
        },
        RadioMarkOuter: {
          style: (a: RadioProps) => ({
            width: theme.sizing.scale500,
            height: theme.sizing.scale500,
            ...(a.$isHovered ? { backgroundColor: theme.colors.positive400 } : {}),
          }),
        },
        RadioMarkInner: {
          style: (a: RadioProps) => ({
            width: a.$checked ? theme.sizing.scale100 : theme.sizing.scale300,
            height: a.$checked ? theme.sizing.scale100 : theme.sizing.scale300,
          }),
        },
      }}
    >
      <div className="text-xs">{text}</div>
    </Radio>
  )
}
