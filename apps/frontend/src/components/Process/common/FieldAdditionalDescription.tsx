import { SIZE as InputSIZE } from 'baseui/input'
import { Textarea } from 'baseui/textarea'
import { Field, FieldProps } from 'formik'
import { IProcessFormValues } from '../../../constants'

const FieldAdditionalDescription = () => (
  <Field
    name="additionalDescription"
    render={({ field, form }: FieldProps<string, IProcessFormValues>) => (
      <Textarea
        {...field}
        type="input"
        size={InputSIZE.default}
        error={!!form.errors.additionalDescription && form.touched.additionalDescription}
      />
    )}
  />
)

export default FieldAdditionalDescription
