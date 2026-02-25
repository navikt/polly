import { DatePicker, useDatepicker } from '@navikt/ds-react'
import { Field, FieldProps } from 'formik'
import { IProcessFormValues } from '../../../constants'
import { Error } from '../../common/ModalSchema'

export const StartDate = () => {
  const { datepickerProps } = useDatepicker()

  return (
    <div className="w-1/2 mr-4">
      <div className="flex w-full mt-4">
        <Field name="aiUsageDescription.startDate">
          {({ field, form }: FieldProps<string, IProcessFormValues>) => (
            <DatePicker
              {...datepickerProps}
              onSelect={(date: any) => {
                const dateSingle: Date = Array.isArray(date) ? date[0] : date
                if (dateSingle) {
                  const newDate = dateSingle.setDate(dateSingle.getDate() + 1)
                  const formatedDate = new Date(newDate)
                  form.setFieldValue(
                    'aiUsageDescription.startDate',
                    formatedDate.toISOString().split('T')[0]
                  )
                } else form.setFieldValue('aiUsageDescription.startDate', undefined)
              }}
            >
              <DatePicker.Input
                className="mb-2"
                name={field.name}
                value={field.value ?? ''}
                onChange={(e) => {
                  const next = e.target.value
                  form.setFieldValue(field.name, next === '' ? undefined : next)
                }}
                onBlur={field.onBlur}
                label="Fra og med dato"
                error={
                  !!form.errors.aiUsageDescription?.startDate &&
                  (form.touched.aiUsageDescription?.startDate || !!form.submitCount)
                }
              />
            </DatePicker>
          )}
        </Field>
      </div>
      <Error fieldName="aiUsageDescription.startDate" />
    </div>
  )
}
