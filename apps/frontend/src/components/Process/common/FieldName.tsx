import { Input, SIZE as InputSIZE } from 'baseui/input'
import { Field, FieldProps } from 'formik'
import { ProcessFormValues } from '../../../constants'

const FieldName = () => (
  <Field
    name="name"
    render={({ field, form }: FieldProps<string, ProcessFormValues>) => (
      <Input {...field} type="input" size={InputSIZE.default} autoFocus error={!!form.errors.name && form.touched.name} />
    )}
  />
)

export default FieldName
