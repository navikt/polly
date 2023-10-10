import { Field, FieldProps } from 'formik'
import { ProcessFormValues } from '../../../constants'
import { Input, SIZE as InputSIZE } from 'baseui/input'
import { TextField } from '@navikt/ds-react'; 
import { intl } from '../../../util';

const FieldName = () => (
  <Field
    name="name"
    render={({ field, form }: FieldProps<string, ProcessFormValues>) => (
      <TextField className="flex flex-col" {...field} label={intl.name} description={intl.processNameHelpText} error={!!form.errors.name && form.touched.name} />
    )}
  />
)

export default FieldName
