import { SIZE as InputSIZE } from 'baseui/input'
import { Textarea } from 'baseui/textarea'
import { Field, FieldProps } from 'formik'
import { IDpProcessFormValues } from '../../../constants'

const FieldPurposeDescription = () => (
  <Field
    name="purposeDescription"
    render={({ field, form }: FieldProps<string, IDpProcessFormValues>) => (
      <Textarea
        {...field}
        type="input"
        size={InputSIZE.default}
        error={!!form.errors.purposeDescription && form.touched.purposeDescription}
      />
    )}
  />
)

export default FieldPurposeDescription
