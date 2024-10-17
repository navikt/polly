import { Input, SIZE } from 'baseui/input'
import { Field, FieldProps } from 'formik'
import { IProcessorFormValues } from '../../../constants'

const FieldTransferGroundsOutsideEUOther = () => (
  <Field name="transferGroundsOutsideEUOther">
    {({ field, form }: FieldProps<string, IProcessorFormValues>) => (
      <Input
        {...field}
        type="input"
        size={SIZE.default}
        error={
          !!form.errors.transferGroundsOutsideEUOther && form.touched.transferGroundsOutsideEUOther
        }
      />
    )}
  </Field>
)

export default FieldTransferGroundsOutsideEUOther
