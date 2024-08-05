import { Textarea } from 'baseui/textarea'
import { Field, FieldProps } from 'formik'

interface IFieldTextareaProps {
  fieldName: string
  fieldValue?: string | number
  placeHolder?: string
  rows?: number
}

export const FieldTextarea = (props: IFieldTextareaProps) => {
  const { fieldName, rows, placeHolder } = props

  return (
    <Field name={fieldName} render={({ field, form }: FieldProps<string>) => <Textarea {...field} size="compact" rows={rows} placeholder={!!placeHolder ? placeHolder : ''} />} />
  )
}
