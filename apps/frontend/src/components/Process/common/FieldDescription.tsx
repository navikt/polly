import { Textarea } from '@navikt/ds-react'
import { Field, FieldProps } from 'formik'
import { IProcessFormValues } from '../../../constants'

const FieldDescription = () => (
  <Field name="description">
    {({ field, form }: FieldProps<string, IProcessFormValues>) => (
      <Textarea
        label=""
        hideLabel
        {...field}
        error={!!form.errors.description && form.touched.description}
      />
    )}
  </Field>
)

export default FieldDescription
