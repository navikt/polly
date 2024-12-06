import { Textarea } from '@navikt/ds-react'
import { Field, FieldProps } from 'formik'
import { IProcessFormValues } from '../../../constants'

const FieldDescription = () => (
  <Field
    name="description"
    render={({ field, form }: FieldProps<string, IProcessFormValues>) => (
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
