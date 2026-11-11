import { Textarea } from '@navikt/ds-react'
import { Field, FieldProps } from 'formik'
import { IDatabehandlerFormValues } from '../../../constants'

const FieldMerknad = () => (
  <Field name='merknad'>
    {({ field }: FieldProps<string, IDatabehandlerFormValues>) => (
      <Textarea
        className='w-full mt-4'
        label='Eventuelle vesentlige merknader/begrensninger som bruker av databehandleren må være ekstra oppmerksom på.'
        {...field}
      />
    )}
  </Field>
)

export default FieldMerknad
