import { DatePicker, useDatepicker } from '@navikt/ds-react'
import { useField, useFormikContext } from 'formik'
import { useEffect, useState } from 'react'
import { IProcessFormValues } from '../../../constants'
import { Error } from '../../common/ModalSchema'

export const StartDate = () => {
  const { datepickerProps } = useDatepicker()

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

  const [field, meta, helpers] = useField<string | undefined>('aiUsageDescription.startDate')
  const formik = useFormikContext<IProcessFormValues>()
  const [textValue, setTextValue] = useState<string>(() => ymdToDmy(field.value))

  useEffect(() => {
    setTextValue(ymdToDmy(field.value))
  }, [field.value])

  return (
    <div className="w-1/2 mr-4">
      <div className="flex w-full mt-4">
        <DatePicker
          {...datepickerProps}
          onSelect={(date: any) => {
            const dateSingle: Date | undefined = Array.isArray(date) ? date[0] : date
            if (dateSingle) {
              const newDate = dateSingle.setDate(dateSingle.getDate() + 1)
              const formatedDate = new Date(newDate)
              helpers.setValue(formatedDate.toISOString().split('T')[0])
            } else {
              helpers.setValue(undefined)
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
                return
              }

              const ymd = dmyToYmd(next)
              if (ymd) {
                helpers.setValue(ymd)
              }
            }}
            onBlur={() => {
              helpers.setTouched(true)

              if (textValue === '') return
              const ymd = dmyToYmd(textValue)
              if (!ymd) {
                helpers.setError('Ugyldig datoformat (dd-mm-åååå)')
              }
            }}
            label="Fra og med dato"
            error={!!meta.error && (meta.touched || !!formik.submitCount)}
          />
        </DatePicker>
      </div>
      <Error fieldName="aiUsageDescription.startDate" />
    </div>
  )
}
