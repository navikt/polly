import { Button, DatePicker, useDatepicker } from '@navikt/ds-react'
import { useField, useFormikContext } from 'formik'
import { useEffect, useState } from 'react'
import { IDpProcessFormValues } from '../../../constants'
import LabelWithToolTip from '../../common/LabelWithTooltip'
import { Error } from '../../common/ModalSchema'

interface IDateModalProps {
  showDates: boolean
  showLabels?: boolean
}

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

const DpProcessDateInput = (props: {
  name: 'start' | 'end'
  datepickerProps: any
  fromDate?: Date
  toDate?: Date
  label: React.ReactNode
  onSelectDate: (date?: Date) => void
}) => {
  const [field, meta, helpers] = useField<string | undefined>(props.name)
  const { submitCount } = useFormikContext<IDpProcessFormValues>()
  const [textValue, setTextValue] = useState<string>(() => ymdToDmy(field.value))

  useEffect(() => {
    setTextValue(ymdToDmy(field.value))
  }, [field.value])

  return (
    <DatePicker
      {...props.datepickerProps}
      dropdownCaption
      fromDate={props.fromDate}
      toDate={props.toDate}
      onSelect={(date: any) => {
        const dateSingle: Date | undefined = Array.isArray(date) ? date[0] : date
        props.onSelectDate(dateSingle)
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
        label={props.label}
        error={!!meta.error && (meta.touched || !!submitCount)}
      />
    </DatePicker>
  )
}

export const FieldDpProcessDates = (props: IDateModalProps) => {
  const [showDates, setShowDates] = useState<boolean>(props.showDates)
  const { datepickerProps: startDatepickerProps } = useDatepicker({})
  const { datepickerProps: endDatepickerProps } = useDatepicker({})
  const formik = useFormikContext<IDpProcessFormValues>()

  const today = new Date()
  const globalToDate = new Date(today.getFullYear() + 99, today.getMonth(), today.getDate())

  return (
    <>
      {!showDates && (
        <div className="flex w-full mt-4">
          <Button type="button" size="xsmall" onClick={() => setShowDates(true)}>
            Velg datoer
          </Button>
        </div>
      )}
      {showDates && (
        <>
          <div className="w-full">
            <div className="flex w-full">
              <div className="w-1/2 mr-4">
                <div className="flex w-full mt-4">
                  {(() => {
                    const endVal = formik.values['end']
                    const endDate = parseLocalYMD(endVal)
                    const startMax = endDate ? new Date(endDate) : undefined
                    if (startMax) startMax.setDate(startMax.getDate() - 1)

                    return (
                      <DpProcessDateInput
                        name="start"
                        datepickerProps={startDatepickerProps}
                        toDate={startMax}
                        label={
                          <LabelWithToolTip
                            label="Velg fra og med dato"
                            tooltip="Fra og med-dato er preutfylt med den datoen Nav ble opprettet. For behandlinger med senere fom-dato, må denne endres. Datoen kan også settes frem i tid."
                            noMarginBottom
                          />
                        }
                        onSelectDate={(dateSingle) => {
                          if (dateSingle) {
                            const startStr = formatYMD(dateSingle)
                            formik.setFieldValue('start', startStr)

                            const endStr = formik.values['end']
                            if (endStr && startStr >= endStr) {
                              formik.setFieldError('start', 'Fom-dato må være før tom-dato')
                            } else {
                              formik.setFieldError('start', undefined)
                            }
                          } else {
                            formik.setFieldValue('start', undefined)
                            formik.setFieldError('start', undefined)
                          }
                        }}
                      />
                    )
                  })()}
                </div>
                <Error fieldName="start" />
              </div>

              <div className="w-1/2 mr-4">
                <div className="flex w-full mt-4">
                  {(() => {
                    const startVal = formik.values['start']
                    const startDate = parseLocalYMD(startVal)
                    const endMin = startDate ? new Date(startDate) : undefined
                    if (endMin) endMin.setDate(endMin.getDate() + 1)

                    let finalToDate = globalToDate
                    if (endMin && finalToDate.getTime() < endMin.getTime()) {
                      finalToDate = endMin
                    }

                    return (
                      <DpProcessDateInput
                        name="end"
                        datepickerProps={endDatepickerProps}
                        fromDate={endMin}
                        toDate={finalToDate}
                        label={
                          <LabelWithToolTip
                            label="Velg til og med dato"
                            tooltip="Til og med-dato skal kun oppgis dersom behandlingen er midlertidig og har en sluttdato."
                            noMarginBottom
                          />
                        }
                        onSelectDate={(dateSingle) => {
                          if (dateSingle) {
                            const endStr = formatYMD(dateSingle)
                            formik.setFieldValue('end', endStr)

                            const startStr = formik.values['start']
                            if (startStr && endStr <= startStr) {
                              formik.setFieldError('end', 'Tom-dato må være etter fom-dato')
                            } else {
                              formik.setFieldError('end', undefined)
                            }
                          } else {
                            formik.setFieldValue('end', undefined)
                            formik.setFieldError('end', undefined)
                          }
                        }}
                      />
                    )
                  })()}
                </div>
                <Error fieldName="end" />
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}
