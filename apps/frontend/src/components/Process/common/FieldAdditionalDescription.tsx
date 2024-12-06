import { Textarea } from '@navikt/ds-react'
import { Field, FieldProps } from 'formik'
import { IProcessFormValues } from '../../../constants'

const FieldAdditionalDescription = () => (
  <Field name="additionalDescription">
    {({ field, form }: FieldProps<string, IProcessFormValues>) => (
      <Textarea
        className="w-full"
        label=""
        hideLabel
        {...field}
        error={!!form.errors.additionalDescription && form.touched.additionalDescription}
      />
    )}
  </Field>
)

export default FieldAdditionalDescription
