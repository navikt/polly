import { DatePicker, useDatepicker } from '@navikt/ds-react'
import { Field, FieldProps } from 'formik'
import { IProcessFormValues } from '../../constants'
import { Error } from '../common/ModalSchema'

export const EndDate = () => {
  const { datepickerProps } = useDatepicker()

  return (
    <div className="w-1/2 mr-4">
      <div className="flex w-full mt-4">
        <Field name="end">
          {({ form }: FieldProps<string, IProcessFormValues>) => (
            <DatePicker
              {...datepickerProps}
              onSelect={(date: any) => {
                const dateSingle: Date = Array.isArray(date) ? date[0] : date
                if (dateSingle) {
                  const newDate = dateSingle.setDate(dateSingle.getDate() + 1)
                  const formatedDate = new Date(newDate)
                  form.setFieldValue('end', formatedDate.toISOString().split('T')[0])
                } else form.setFieldValue('end', undefined)
              }}
            >
              <DatePicker.Input
                className="mb-2"
                value={form.values['end']}
                label="Velg til og med dato"
                error={!!form.errors.end && (form.touched.end || !!form.submitCount)}
              />
            </DatePicker>
          )}
        </Field>
      </div>
      <Error fieldName="end" />
    </div>
  )
}
