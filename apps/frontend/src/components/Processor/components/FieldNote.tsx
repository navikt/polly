import { Textarea } from '@navikt/ds-react'
import { Field, FieldProps } from 'formik'
import { IProcessorFormValues } from '../../../constants'

const FieldNote = () => (
  <Field name="note">
    {({ field, form }: FieldProps<string, IProcessorFormValues>) => (
      <Textarea label="" hideLabel {...field} error={!!form.errors.note && form.touched.note} />
    )}
  </Field>
)

export default FieldNote
