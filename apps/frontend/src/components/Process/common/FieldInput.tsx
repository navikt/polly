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
    <Field
      name={fieldName}
      render={({ field }: FieldProps<string>) => (
        <TextField label="" hideLabel {...field} placeholder={placeHolder ? placeHolder : ''} />
      )}
    />
  )
}

export default FieldInput
