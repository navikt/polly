import { DatePicker, useDatepicker } from '@navikt/ds-react'
import { useField, useFormikContext } from 'formik'
import { useEffect, useState } from 'react'
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

  const [field, meta, helpers] = useField<string | undefined>('start')
  const formik = useFormikContext<IProcessFormValues>()
  const [textValue, setTextValue] = useState<string>(() => ymdToDmy(field.value))

  useEffect(() => {
    setTextValue(ymdToDmy(field.value))
  }, [field.value])

  const validateRelative = (startStr?: string) => {
    const endStr = formik.values['end']
    if (startStr && endStr && startStr >= endStr) {
      formik.setFieldError('start', 'Fom-dato må være før tom-dato')
    } else {
      formik.setFieldError('start', undefined)
    }
  }

  return (
    <div className="w-1/2 mr-4">
      <div className="flex w-full mt-4">
        {(() => {
          const endVal = formik.values['end']
          const endDate = parseLocalYMD(endVal)
          const startMax = endDate ? new Date(endDate) : undefined
          if (startMax) startMax.setDate(startMax.getDate() - 1)

          return (
            <DatePicker
              {...datepickerProps}
              dropdownCaption
              toDate={startMax}
              onSelect={(date: any) => {
                const dateSingle: Date | undefined = Array.isArray(date) ? date[0] : date
                if (dateSingle) {
                  const startStr = formatYMD(dateSingle)
                  helpers.setValue(startStr)
                  validateRelative(startStr)
                } else {
                  helpers.setValue(undefined)
                  formik.setFieldError('start', undefined)
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
                    formik.setFieldError('start', undefined)
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
                    formik.setFieldError('start', 'Ugyldig datoformat (dd-mm-åååå)')
                    return
                  }

                  setTextValue(ymdToDmy(ymd))
                  validateRelative(ymd)
                }}
                label={
                  <LabelWithToolTip
                    label="Velg fra og med dato"
                    tooltip="Fra og med-dato er preutfylt med den datoen Nav ble opprettet. For behandlinger med senere fom-dato, må denne endres. Datoen kan også settes frem i tid."
                    noMarginBottom
                  />
                }
                error={!!meta.error && (meta.touched || !!formik.submitCount)}
              />
            </DatePicker>
          )
        })()}
      </div>
      <Error fieldName="start" />
    </div>
  )
}
