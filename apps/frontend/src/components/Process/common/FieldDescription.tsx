import { Field, FieldProps } from 'formik'
import { ProcessFormValues } from '../../../constants'
import { Textarea } from '@navikt/ds-react'
import { intl } from '../../../util'

const FieldDescription = () => (
  <Field
    name="description"
    render={({ field, form }: FieldProps<string, ProcessFormValues>) => (
      <Textarea {...field} label={intl.purposeOfTheProcess} description={intl.processPurposeHelpText} error={!!form.errors.description && form.touched.description} />
    )}
  />
)

export default FieldDescription
