import { TextField } from '@navikt/ds-react'
import { Field, FieldProps } from 'formik'
import { IProcessFormValues } from '../../../constants'

const FieldName = () => (
  <Field
    name="name"
    render={({ field, form }: FieldProps<string, IProcessFormValues>) => (
      <TextField {...field} label="" hideLabel error={!!form.errors.name && form.touched.name} />
    )}
  />
)

export default FieldName
