import { SIZE as InputSIZE } from 'baseui/input'
import { Textarea } from 'baseui/textarea'
import { Field, FieldProps } from 'formik'
import { DpProcessFormValues } from '../../../constants'

const FieldDescription = () => (
  <Field
    name="description"
    render={({ field, form }: FieldProps<string, DpProcessFormValues>) => (
      <Textarea {...field} type="input" size={InputSIZE.default} error={!!form.errors.description && form.touched.description} />
    )}
  />
)

export default FieldDescription
