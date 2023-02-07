import { Field, FieldProps } from 'formik'
import * as React from 'react'
import { Textarea } from 'baseui/textarea'

export const FieldTextarea = (props: { fieldName: string; fieldValue?: string | number; placeHolder?: string; rows?: number }) => {
  return (
    <Field
      name={props.fieldName}
      render={({ field, form }: FieldProps<string>) => <Textarea {...field} size="compact" rows={props.rows} placeholder={!!props.placeHolder ? props.placeHolder : ''} />}
    />
  )
}
