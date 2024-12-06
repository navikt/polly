import { TextField } from '@navikt/ds-react'
import { Field, FieldProps } from 'formik'
import { IProcessorFormValues } from '../../../constants'

const FieldTransferGroundsOutsideEUOther = () => (
  <Field name="transferGroundsOutsideEUOther">
    {({ field, form }: FieldProps<string, IProcessorFormValues>) => (
      <TextField
        className="w-full"
        label=""
        hideLabel
        {...field}
        error={
          !!form.errors.transferGroundsOutsideEUOther && form.touched.transferGroundsOutsideEUOther
        }
      />
    )}
  </Field>
)

export default FieldTransferGroundsOutsideEUOther
