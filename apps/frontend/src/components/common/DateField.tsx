import { DatePicker, useDatepicker } from '@navikt/ds-react'
import { Field, FieldProps } from 'formik'
import { useState } from 'react'

interface IName {
  name: string
  label: string
}

type TPropsDateField = IName

export const DateField = (props: TPropsDateField) => {
  const { name, label } = props
  const [hasError, setHasError] = useState(false)
  const { datepickerProps, inputProps } = useDatepicker({
    fromDate: new Date('Jul 01 2006'),
    locale: 'nb',
    inputFormat: 'ddmmyyyy',
    onValidate: (val) => {
      setHasError(!val.isValidDate)
    },
  })

  return (
    <Field name={name}>
      {(fieldProps: FieldProps) => (
        <DatePicker
          {...datepickerProps}
          onSelect={(date: any) => {
            const dateSingle: Date = Array.isArray(date) ? date[0] : date
            if (dateSingle) {
              const newDate = dateSingle.setDate(dateSingle.getDate() + 1)
              const formatedDate = new Date(newDate)
              fieldProps.form.setFieldValue(name, formatedDate.toISOString().split('T')[0])
            } else fieldProps.form.setFieldValue(name, undefined)
          }}
        >
          <DatePicker.Input
            className="mb-2"
            {...inputProps}
            error={hasError && 'Dette ser ikke ut som en dato'}
            value={fieldProps.form.values[name]}
            label={label}
          />
        </DatePicker>
      )}
    </Field>
  )
}
