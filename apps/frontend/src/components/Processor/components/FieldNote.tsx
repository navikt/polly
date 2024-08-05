import { SIZE as InputSIZE } from 'baseui/input'
import { Textarea } from 'baseui/textarea'
import { Field, FieldProps } from 'formik'
import { ProcessorFormValues } from '../../../constants'

const FieldNote = () => (
  <Field name="note">
    {({ field, form }: FieldProps<string, ProcessorFormValues>) => <Textarea {...field} type="input" size={InputSIZE.default} error={!!form.errors.note && form.touched.note} />}
  </Field>
)

export default FieldNote
