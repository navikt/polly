import { DatePicker, useDatepicker } from '@navikt/ds-react'
import { useField, useFormikContext } from 'formik'
import { useEffect, useState } from 'react'
import { IProcessFormValues } from '../../constants'
import LabelWithToolTip from '../common/LabelWithTooltip'
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

  const ymdToDmy = (ymd?: string) => {
    if (!ymd) return ''
    const [y, m, d] = ymd.split('-')
    if (!y || !m || !d) return ''
    if (y.length !== 4 || m.length !== 2 || d.length !== 2) return ''
    return `${d}-${m}-${y}`
  }

  const dmyToYmd = (dmy: string) => {
    const match = /^(\d{2})-(\d{2})-(\d{4})$/.exec(dmy)
    if (!match) return undefined

    const [, dd, mm, yyyy] = match
    const y = Number(yyyy)
    const m = Number(mm)
    const d = Number(dd)
    if (!y || m < 1 || m > 12 || d < 1 || d > 31) return undefined

    const candidate = new Date(y, m - 1, d)
    if (
      candidate.getFullYear() !== y ||
      candidate.getMonth() !== m - 1 ||
      candidate.getDate() !== d
    ) {
      return undefined
    }

    return `${yyyy}-${mm}-${dd}`
  }

  const [field, meta, helpers] = useField<string | undefined>('end')
  const formik = useFormikContext<IProcessFormValues>()
  const [textValue, setTextValue] = useState<string>(() => ymdToDmy(field.value))

  useEffect(() => {
    setTextValue(ymdToDmy(field.value))
  }, [field.value])

  const validateRelative = (endStr?: string) => {
    const startStr = formik.values['start']
    if (startStr && endStr && endStr <= startStr) {
      formik.setFieldError('end', 'Tom-dato må være etter fom-dato')
    } else {
      formik.setFieldError('end', undefined)
    }
  }

  return (
    <div className="w-1/2 mr-4">
      <div className="flex w-full mt-4">
        {(() => {
          const startVal = formik.values['start']
          const startDate = parseLocalYMD(startVal)
          const endMin = startDate ? new Date(startDate) : undefined
          if (endMin) endMin.setDate(endMin.getDate() + 1)

          const today = new Date()
          const globalToDate = new Date(today.getFullYear() + 99, today.getMonth(), today.getDate())
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
                const dateSingle: Date | undefined = Array.isArray(date) ? date[0] : date
                if (dateSingle) {
                  const endStr = formatYMD(dateSingle)
                  helpers.setValue(endStr)
                  validateRelative(endStr)
                } else {
                  helpers.setValue(undefined)
                  formik.setFieldError('end', undefined)
                }
              }}
            >
              <DatePicker.Input
                className="mb-2"
                name={field.name}
                value={textValue}
                onChange={(e) => {
                  const next = e.currentTarget.value
                  setTextValue(next)

                  if (next === '') {
                    helpers.setValue(undefined)
                    formik.setFieldError('end', undefined)
                    return
                  }

                  const ymd = dmyToYmd(next)
                  if (ymd) {
                    helpers.setValue(ymd)
                    validateRelative(ymd)
                  }
                }}
                onBlur={() => {
                  helpers.setTouched(true)
                  if (textValue === '') return

                  const ymd = dmyToYmd(textValue)
                  if (!ymd) {
                    formik.setFieldError('end', 'Ugyldig datoformat (dd-mm-åååå)')
                    return
                  }

                  setTextValue(ymdToDmy(ymd))
                  validateRelative(ymd)
                }}
                label={
                  <LabelWithToolTip
                    label="Velg til og med dato"
                    tooltip="Til og med-dato skal kun oppgis dersom behandlingen er midlertidig og har en sluttdato."
                    noMarginBottom
                  />
                }
                error={!!meta.error && (meta.touched || !!formik.submitCount)}
              />
            </DatePicker>
          )
        })()}
      </div>
      <Error fieldName="end" />
    </div>
  )
}
