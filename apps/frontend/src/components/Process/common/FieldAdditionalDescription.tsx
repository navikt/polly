import { Field, FieldProps } from 'formik'
import { ProcessFormValues } from '../../../constants'
import { Textarea } from '@navikt/ds-react'
import { SIZE as InputSIZE } from 'baseui/input'
import * as React from 'react'
import { intl } from '../../../util'

const FieldAdditionalDescription = () => (
  <Field
    name="additionalDescription"
    render={({ field, form }: FieldProps<string, ProcessFormValues>) => (
      <Textarea {...field} label={intl.additionalDescription} description={intl.additionalDescriptionHelpText} error={!!form.errors.additionalDescription && form.touched.additionalDescription} />
    )}
  />
)

export default FieldAdditionalDescription
