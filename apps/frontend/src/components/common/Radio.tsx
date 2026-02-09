import { Radio, RadioGroup } from '@navikt/ds-react'

const YES = 'YES',
  NO = 'NO',
  UNCLARIFIED = 'UNCLARIFIED'
const boolToRadio = (bool?: boolean) => (bool === undefined ? UNCLARIFIED : bool ? YES : NO)
const radioToBool = (radio: string) => (radio === UNCLARIFIED ? undefined : radio === YES)

export const boolToText = (b?: boolean) =>
  b === null || b === undefined ? 'Uavklart' : b ? 'Ja' : 'Nei'

type TRadioBoolProps = {
  value?: boolean
  setValue: (b?: boolean) => void
  omitUndefined?: boolean
  firstButtonLabel?: string
  secondButtonLabel?: string
  justifyContent?: string
  direction?: 'horizontal' | 'vertical'
  className?: string
}

export const RadioBoolButton = (props: TRadioBoolProps) => {
  const {
    value,
    justifyContent,
    setValue,
    firstButtonLabel,
    secondButtonLabel,
    omitUndefined,
    direction,
    className,
  } = props

  const horizontalClasses =
    direction === 'horizontal'
      ? '[&_.aksel-radio-buttons]:flex [&_.aksel-radio-buttons]:w-full [&_.aksel-radio-buttons]:flex-row [&_.aksel-radio-buttons]:items-center'
      : ''

  const horizontalAlignClass =
    direction === 'horizontal' && justifyContent
      ? justifyContent === 'flex-end'
        ? '[&_.aksel-radio-buttons]:justify-end'
        : justifyContent === 'center'
          ? '[&_.aksel-radio-buttons]:justify-center'
          : justifyContent === 'flex-start'
            ? '[&_.aksel-radio-buttons]:justify-start'
            : ''
      : ''

  return (
    <RadioGroup
      value={boolToRadio(value)}
      className={`w-full ${horizontalClasses} ${horizontalAlignClass} ${className ?? ''}`.trim()}
      legend=""
      hideLegend
      onChange={(newValue) => {
        setValue(radioToBool(newValue))
      }}
      style={{ justifyContent: justifyContent ? justifyContent : 'stretch' }}
    >
      <Radio className="mr-8 last:mr-0" value={YES}>
        Ja {firstButtonLabel}
      </Radio>
      <Radio className="mr-8 last:mr-0" value={NO}>
        Nei {secondButtonLabel}
      </Radio>
      {!omitUndefined && (
        <Radio className="mr-8 last:mr-0" value={UNCLARIFIED}>
          Uavklart
        </Radio>
      )}
    </RadioGroup>
  )
}
