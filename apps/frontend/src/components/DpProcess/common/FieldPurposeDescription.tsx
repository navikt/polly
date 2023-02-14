import { Field, FieldProps } from 'formik'
import { DpProcessFormValues } from '../../../constants'
import { Textarea } from 'baseui/textarea'
import { SIZE as InputSIZE } from 'baseui/input'
import * as React from 'react'

const FieldPurposeDescription = () => (
  <Field
    name="purposeDescription"
    render={({ field, form }: FieldProps<string, DpProcessFormValues>) => (
      <Textarea {...field} type="input" size={InputSIZE.default} error={!!form.errors.purposeDescription && form.touched.purposeDescription} />
    )}
  />
)

export default FieldPurposeDescription
