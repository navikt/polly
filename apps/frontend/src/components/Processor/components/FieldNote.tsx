import { Textarea } from '@navikt/ds-react'
import { Field, FieldProps } from 'formik'
import { IProcessorFormValues } from '../../../constants'

const FieldNote = () => (
  <Field name="note">
    {({ field }: FieldProps<string, IProcessorFormValues>) => (
      <Textarea
        className="w-full mt-4"
        label="Merknad"
        description="Eventuelle vesentlige merknader/begrensninger som bruker av databehandleren må være ekstra oppmerksom på."
        {...field}
      />
    )}
  </Field>
)

export default FieldNote
