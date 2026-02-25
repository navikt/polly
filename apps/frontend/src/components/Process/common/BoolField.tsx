import { Field, FieldProps, getIn } from 'formik'
import { RadioBoolButton } from '../../common/Radio'

interface IBoolFieldProps {
  value?: boolean
  fieldName: string
  id?: string
  omitUndefined?: boolean
  firstButtonLabel?: string
  secondButtonLabel?: string
  justifyContent?: string
  direction?: 'horizontal' | 'vertical'
  className?: string
}

const BoolField = (props: IBoolFieldProps) => {
  const {
    fieldName,
    value,
    id,
    omitUndefined,
    firstButtonLabel,
    justifyContent,
    direction,
    className,
  } = props

  return (
    <Field name={fieldName}>
      {({ form }: FieldProps<any>) => {
        const fieldError = getIn(form.errors, fieldName) as string | undefined
        const showError = !!fieldError && (!!getIn(form.touched, fieldName) || form.submitCount > 0)

        return (
          <RadioBoolButton
            id={id}
            value={value}
            setValue={(b) => {
              form.setFieldTouched(fieldName, true, false)
              form.setFieldValue(fieldName, b)
            }}
            omitUndefined={omitUndefined}
            firstButtonLabel={firstButtonLabel}
            justifyContent={justifyContent}
            direction={direction}
            className={className}
            error={showError ? fieldError : undefined}
          />
        )
      }}
    </Field>
  )
}

export default BoolField
