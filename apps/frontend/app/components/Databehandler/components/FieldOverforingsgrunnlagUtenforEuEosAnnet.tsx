import { TextField } from '@navikt/ds-react'
import { Field, FieldProps } from 'formik'
import { IDatabehandlerFormValues } from '../../../constants'

const FieldOverforingsgrunnlagUtenforEuEosAnnet = () => (
  <Field name='overforingsgrunnlagUtenforEuEosAnnet'>
    {({ field }: FieldProps<string, IDatabehandlerFormValues>) => (
      <TextField
        type='text'
        id='overforingsgrunnlagUtenforEuEosAnnet'
        className='w-full mt-4'
        label='Spesifiser overføringsgrunnlaget'
        {...field}
      />
    )}
  </Field>
)

export default FieldOverforingsgrunnlagUtenforEuEosAnnet
