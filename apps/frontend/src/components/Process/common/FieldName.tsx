import { TextField } from '@navikt/ds-react'
import { Field, FieldProps } from 'formik'
import { IProcessFormValues } from '../../../constants'

const FieldName = () => (
  <Field name="name">
    {({ field, form }: FieldProps<string, IProcessFormValues>) => (
      <TextField
        className="w-full"
        {...field}
        label=""
        hideLabel
        error={!!form.errors.name && form.touched.name}
      />
    )}
  </Field>
)

export default FieldName
