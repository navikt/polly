import { TextField } from '@navikt/ds-react'
import { Field, FieldProps } from 'formik'
import { IProcessFormValues } from '../../../constants'

const FieldName = () => (
  <Field name='name'>
    {({ field, form }: FieldProps<string, IProcessFormValues>) =>
      (() => {
        const nameError = form.errors.name
        const showError = !!nameError && (!!form.touched.name || form.submitCount > 0)

        return (
          <TextField
            id='name'
            type='text'
            className='w-full'
            {...field}
            label='Navn'
            description='Velg et kort navn, for eksempel Saksbehandling, Håndtering av brukerhenvendelser, eller Rekruttering.'
            error={showError ? nameError : undefined}
          />
        )
      })()
    }
  </Field>
)

export default FieldName
