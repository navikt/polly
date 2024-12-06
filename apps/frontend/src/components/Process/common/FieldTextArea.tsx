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
    <Field
      name={fieldName}
      render={({ field }: FieldProps<string>) => (
        <Textarea
          label=""
          hideLabel
          {...field}
          rows={rows}
          placeholder={placeHolder ? placeHolder : ''}
        />
      )}
    />
  )
}
