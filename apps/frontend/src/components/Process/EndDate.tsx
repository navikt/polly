import { DatePicker, useDatepicker } from '@navikt/ds-react'
import { Field, FieldProps } from 'formik'
import { IProcessFormValues } from '../../constants'
import { Error } from '../common/ModalSchema'

export const EndDate = () => {
  const { datepickerProps } = useDatepicker()

  const formatYMD = (d: Date) => {
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${y}-${m}-${day}`
  }

  const parseLocalYMD = (s?: string) => {
    if (!s) return undefined
    const [y, m, d] = s.split('-').map(Number)
    if (!y || !m || !d) return undefined
    return new Date(y, m - 1, d)
  }

  return (
    <div className="w-1/2 mr-4">
      <div className="flex w-full mt-4">
        <Field name="end">
          {({ form }: FieldProps<string, IProcessFormValues>) => {
            const startVal = form.values['start']
            const startDate = parseLocalYMD(startVal)
            const endMin = startDate ? new Date(startDate) : undefined
            if (endMin) endMin.setDate(endMin.getDate() + 1)

            const today = new Date()
            const globalToDate = new Date(
              today.getFullYear() + 99,
              today.getMonth(),
              today.getDate()
            )
            let finalToDate = globalToDate
            if (endMin && finalToDate.getTime() < endMin.getTime()) {
              finalToDate = endMin
            }

            return (
              <DatePicker
                {...datepickerProps}
                dropdownCaption
                fromDate={endMin}
                toDate={finalToDate}
                onSelect={(date: any) => {
                  const dateSingle: Date = Array.isArray(date) ? date[0] : date
                  if (dateSingle) {
                    const endStr = formatYMD(dateSingle)
                    form.setFieldValue('end', endStr)

                    const startStr = form.values['start']
                    if (startStr && endStr <= startStr) {
                      form.setFieldError('end', 'Tom-dato må være etter fom-dato')
                    } else {
                      form.setFieldError('end', undefined)
                    }
                  } else {
                    form.setFieldValue('end', undefined)
                    form.setFieldError('end', undefined)
                  }
                }}
              >
                <DatePicker.Input
                  className="mb-2"
                  value={form.values['end']}
                  label="Velg til og med dato"
                  error={!!form.errors.end && (form.touched.end || !!form.submitCount)}
                />
              </DatePicker>
            )
          }}
        </Field>
      </div>
      <Error fieldName="end" />
    </div>
  )
}
