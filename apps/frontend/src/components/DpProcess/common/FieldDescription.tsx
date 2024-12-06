import { Textarea } from '@navikt/ds-react'
import { Field, FieldProps } from 'formik'
import { IDpProcessFormValues } from '../../../constants'

const FieldDescription = () => (
  <Field
    name="description"
    render={({ field, form }: FieldProps<string, IDpProcessFormValues>) => (
      <Textarea
        label=""
        hideLabel
        {...field}
        error={!!form.errors.description && form.touched.description}
      />
    )}
  />
)

export default FieldDescription
