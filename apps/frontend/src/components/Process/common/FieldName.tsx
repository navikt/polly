import { Input, SIZE as InputSIZE } from 'baseui/input'
import { Field, FieldProps } from 'formik'
import { IProcessFormValues } from '../../../constants'

const FieldName = () => (
  <Field
    name="name"
    render={({ field, form }: FieldProps<string, IProcessFormValues>) => (
      <Input
        {...field}
        type="input"
        size={InputSIZE.default}
        error={!!form.errors.name && form.touched.name}
      />
    )}
  />
)

export default FieldName
