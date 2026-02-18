import { DatePicker, useDatepicker } from '@navikt/ds-react'
import { Field, FieldProps } from 'formik'
import { IProcessFormValues } from '../../constants'
import LabelWithToolTip from '../common/LabelWithTooltip'
import { Error } from '../common/ModalSchema'

export const StartDate = () => {
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
        <Field name="start">
          {({ form }: FieldProps<string, IProcessFormValues>) => {
            const endVal = form.values['end']
            const endDate = parseLocalYMD(endVal)
            const startMax = endDate ? new Date(endDate) : undefined
            if (startMax) startMax.setDate(startMax.getDate() - 1)

            return (
              <DatePicker
                {...datepickerProps}
                dropdownCaption
                toDate={startMax}
                onSelect={(date: any) => {
                  const dateSingle: Date = Array.isArray(date) ? date[0] : date
                  if (dateSingle) {
                    const startStr = formatYMD(dateSingle)
                    form.setFieldValue('start', startStr)

                    const endStr = form.values['end']
                    if (endStr && startStr >= endStr) {
                      form.setFieldError('start', 'Fom-dato må være før tom-dato')
                    } else {
                      form.setFieldError('start', undefined)
                    }
                  } else {
                    form.setFieldValue('start', undefined)
                    form.setFieldError('start', undefined)
                  }
                }}
              >
                <DatePicker.Input
                  className="mb-2"
                  value={form.values['start']}
                  label={
                    <LabelWithToolTip
                      label="Velg fra og med dato"
                      tooltip="Fra og med-dato er preutfylt med den datoen Nav ble opprettet. For behandlinger med senere fom-dato, må denne endres. Datoen kan også settes frem i tid."
                      noMarginBottom
                    />
                  }
                  error={!!form.errors.start && (form.touched.start || !!form.submitCount)}
                />
              </DatePicker>
            )
          }}
        </Field>
      </div>
      <Error fieldName="start" />
    </div>
  )
}
