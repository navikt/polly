import { DatePicker, useDatepicker } from '@navikt/ds-react'
import { Field, FieldProps } from 'formik'
import { IProcessFormValues } from '../../constants'
import { Error } from '../common/ModalSchema'

export const StartDate = () => {
  const { datepickerProps } = useDatepicker()

  return (
    <div className="w-1/2 mr-4">
      <div className="flex w-full mt-4">
        <Field name="start">
          {({ form }: FieldProps<string, IProcessFormValues>) => (
            <DatePicker
              {...datepickerProps}
              onSelect={(date: any) => {
                const dateSingle: Date = Array.isArray(date) ? date[0] : date
                if (dateSingle) {
                  const newDate = dateSingle.setDate(dateSingle.getDate() + 1)
                  const formatedDate = new Date(newDate)
                  form.setFieldValue('start', formatedDate.toISOString().split('T')[0])
                } else form.setFieldValue('start', undefined)
              }}
            >
              <DatePicker.Input
                className="mb-2"
                value={form.values['start']}
                label="Velg fra og med dato"
                error={!!form.errors.start && (form.touched.start || !!form.submitCount)}
              />
            </DatePicker>
          )}
        </Field>
      </div>
      <Error fieldName="start" />
    </div>
  )
}
