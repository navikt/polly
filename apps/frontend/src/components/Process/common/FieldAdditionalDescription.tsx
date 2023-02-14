import { Field, FieldProps } from 'formik'
import { ProcessFormValues } from '../../../constants'
import { Textarea } from 'baseui/textarea'
import { SIZE as InputSIZE } from 'baseui/input'
import * as React from 'react'

const FieldAdditionalDescription = () => (
  <Field
    name="additionalDescription"
    render={({ field, form }: FieldProps<string, ProcessFormValues>) => (
      <Textarea {...field} type="input" size={InputSIZE.default} error={!!form.errors.additionalDescription && form.touched.additionalDescription} />
    )}
  />
)

export default FieldAdditionalDescription
