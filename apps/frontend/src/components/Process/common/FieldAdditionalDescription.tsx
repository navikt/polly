import { Textarea } from '@navikt/ds-react'
import { Field, FieldProps } from 'formik'
import { IProcessFormValues } from '../../../constants'

const FieldAdditionalDescription = () => (
  <Field
    name="additionalDescription"
    render={({ field, form }: FieldProps<string, IProcessFormValues>) => (
      <Textarea
        label=""
        hideLabel
        {...field}
        error={!!form.errors.additionalDescription && form.touched.additionalDescription}
      />
    )}
  />
)

export default FieldAdditionalDescription
