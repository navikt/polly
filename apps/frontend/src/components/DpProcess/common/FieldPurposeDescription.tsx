import { Textarea } from '@navikt/ds-react'
import { Field, FieldProps } from 'formik'
import { IDpProcessFormValues } from '../../../constants'

const FieldPurposeDescription = () => (
  <Field name="purposeDescription">
    {({ field, form }: FieldProps<string, IDpProcessFormValues>) => (
      <Textarea
        label=""
        hideLabel
        {...field}
        error={!!form.errors.purposeDescription && form.touched.purposeDescription}
      />
    )}
  </Field>
)

export default FieldPurposeDescription
