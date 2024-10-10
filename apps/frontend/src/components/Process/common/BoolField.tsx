import { Field, FieldProps } from 'formik'
import { IProcessFormValues } from '../../../constants'
import { RadioBoolButton } from '../../common/Radio'

interface IBoolFieldProps {
  value?: boolean
  fieldName: string
  omitUndefined?: boolean
  firstButtonLabel?: string
  secondButtonLabel?: string
  justifyContent?: string
}

const BoolField = (props: IBoolFieldProps) => {
  const { fieldName, value, omitUndefined, firstButtonLabel, justifyContent } = props

  return (
    <Field
      name={fieldName}
      render={({ form }: FieldProps<IProcessFormValues>) => (
        <RadioBoolButton
          value={value}
          setValue={(b) => form.setFieldValue(fieldName, b)}
          omitUndefined={omitUndefined}
          firstButtonLabel={firstButtonLabel}
          justifyContent={justifyContent}
        />
      )}
    />
  )
}

export default BoolField
