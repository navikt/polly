import { TextField } from '@navikt/ds-react'
import { Field, FieldProps } from 'formik'

interface IFieldInputProps {
  fieldName: string
  fieldValue?: string | number
  placeHolder?: string
}

const FieldInput = (props: IFieldInputProps) => {
  const { fieldName, placeHolder } = props

  return (
    <Field name={fieldName}>
      {({ field }: FieldProps<string>) => (
        <TextField
          className="w-full"
          label=""
          hideLabel
          {...field}
          placeholder={placeHolder ? placeHolder : ''}
        />
      )}
    </Field>
  )
}

export default FieldInput
