import { Radio, RadioGroup } from 'baseui/radio'
import { ChangeEvent } from 'react'

const YES = 'YES',
  NO = 'NO',
  UNCLARIFIED = 'UNCLARIFIED'
const boolToRadio = (bool?: boolean) => (bool === undefined ? UNCLARIFIED : bool ? YES : NO)
const radioToBool = (radio: string) => (radio === UNCLARIFIED ? undefined : radio === YES)

export const boolToText = (b?: boolean) => (b === null || b === undefined ? 'Uavklart' : b ? 'Ja' : 'Nei')

type radioBoolProps = {
  value?: boolean
  setValue: (b?: boolean) => void
  omitUndefined?: boolean
  firstButtonLabel?: string
  secondButtonLabel?: string
  justifyContent?: string
}

export const RadioBoolButton = (props: radioBoolProps) => {
  const { value, justifyContent, setValue, firstButtonLabel, secondButtonLabel, omitUndefined } = props

  return (
    <RadioGroup
      value={boolToRadio(value)}
      align="horizontal"
      overrides={{ RadioGroupRoot: { style: { width: '100%', justifyContent: justifyContent ? justifyContent : 'stretch' } } }}
      onChange={(event: ChangeEvent<HTMLInputElement>) => {
        setValue(radioToBool((event.target as HTMLInputElement).value))
      }}
    >
      <Radio overrides={{ Label: { style: { marginRight: '2rem' } } }} value={YES}>
        Ja {firstButtonLabel}
      </Radio>
      <Radio overrides={{ Label: { style: { marginRight: '2rem' } } }} value={NO}>
        Nei {secondButtonLabel}
      </Radio>
      {!omitUndefined && (
        <Radio overrides={{ Label: { style: { marginRight: '2rem' } } }} value={UNCLARIFIED}>
          Uavklart
        </Radio>
      )}
    </RadioGroup>
  )
}
