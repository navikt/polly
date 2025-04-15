import { TextField } from '@navikt/ds-react'
import { Field, FieldProps } from 'formik'
import { IProcessorFormValues } from '../../../constants'

const FieldTransferGroundsOutsideEUOther = () => (
  <Field name="transferGroundsOutsideEUOther">
    {({ field }: FieldProps<string, IProcessorFormValues>) => (
      <TextField
        id="transferGroundsOutsideEUOther"
        className="w-full"
        label="Andre overføringsgrunnlag"
        description='Du har valgt at overføringsgrunnlaget er "annet", spesifiser grunnlaget her.'
        {...field}
      />
    )}
  </Field>
)

export default FieldTransferGroundsOutsideEUOther
