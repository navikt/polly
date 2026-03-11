import { Textarea } from '@navikt/ds-react'
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
    <Field name={fieldName}>
      {({ field }: FieldProps<string>) => (
        <Textarea
          className="w-full"
          label=""
          hideLabel
          {...field}
          rows={rows}
          placeholder={placeHolder ? placeHolder : ''}
        />
      )}
    </Field>
  )
}
