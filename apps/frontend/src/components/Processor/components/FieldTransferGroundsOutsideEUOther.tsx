import { TextField } from '@navikt/ds-react'
import { Field, FieldProps } from 'formik'
import { IProcessorFormValues } from '../../../constants'

const FieldTransferGroundsOutsideEUOther = () => (
  <Field name="transferGroundsOutsideEUOther">
    {({ field }: FieldProps<string, IProcessorFormValues>) => (
      <TextField
        id="transferGroundsOutsideEUOther"
        className="w-full mt-4"
        label="Spesifiser overføringsgrunnlaget"
        {...field}
      />
    )}
  </Field>
)

export default FieldTransferGroundsOutsideEUOther
