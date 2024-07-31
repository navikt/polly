import { Input } from 'baseui/input'
import { Field, FieldProps } from 'formik'

interface IFieldInputProps {
  fieldName: string
  fieldValue?: string | number
  placeHolder?: string
}

const FieldInput = (props: IFieldInputProps) => {
  const { fieldName, placeHolder } = props

  return <Field name={fieldName} render={({ field, form }: FieldProps<string>) => <Input {...field} size="compact" placeholder={!!placeHolder ? placeHolder : ''} />} />
}

export default FieldInput
