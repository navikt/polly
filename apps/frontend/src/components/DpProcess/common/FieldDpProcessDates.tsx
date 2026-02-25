import { Button, DatePicker, useDatepicker } from '@navikt/ds-react'
import { Field, FieldProps } from 'formik'
import { useState } from 'react'
import { IDpProcessFormValues } from '../../../constants'
import LabelWithToolTip from '../../common/LabelWithTooltip'
import { Error } from '../../common/ModalSchema'

interface IDateModalProps {
  showDates: boolean
  showLabels?: boolean
}

export const FieldDpProcessDates = (props: IDateModalProps) => {
  const [showDates, setShowDates] = useState<boolean>(props.showDates)
  const { datepickerProps: startDatepickerProps } = useDatepicker({})
  const { datepickerProps: endDatepickerProps } = useDatepicker({})

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
                  <Field name="start">
                    {({ field, form }: FieldProps<string, IDpProcessFormValues>) => {
                      const endVal = form.values['end']
                      const endDate = parseLocalYMD(endVal)
                      const startMax = endDate ? new Date(endDate) : undefined
                      if (startMax) startMax.setDate(startMax.getDate() - 1)

                      return (
                        <DatePicker
                          {...startDatepickerProps}
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
                            name={field.name}
                            value={field.value ?? ''}
                            onChange={(e) => {
                              const next = e.currentTarget.value
                              form.setFieldValue(field.name, next === '' ? undefined : next)
                            }}
                            onBlur={field.onBlur}
                            label={
                              <LabelWithToolTip
                                label="Velg fra og med dato"
                                tooltip="Fra og med-dato er preutfylt med den datoen Nav ble opprettet. For behandlinger med senere fom-dato, må denne endres. Datoen kan også settes frem i tid."
                                noMarginBottom
                              />
                            }
                            error={
                              !!form.errors.start && (form.touched.start || !!form.submitCount)
                            }
                          />
                        </DatePicker>
                      )
                    }}
                  </Field>
                </div>
                <Error fieldName="start" />
              </div>

              <div className="w-1/2 mr-4">
                <div className="flex w-full mt-4">
                  <Field name="end">
                    {({ field, form }: FieldProps<string, IDpProcessFormValues>) => {
                      const startVal = form.values['start']
                      const startDate = parseLocalYMD(startVal)
                      const endMin = startDate ? new Date(startDate) : undefined
                      if (endMin) endMin.setDate(endMin.getDate() + 1)

                      let finalToDate = globalToDate
                      if (endMin && finalToDate.getTime() < endMin.getTime()) {
                        finalToDate = endMin
                      }

                      return (
                        <DatePicker
                          {...endDatepickerProps}
                          dropdownCaption
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
                            name={field.name}
                            value={field.value ?? ''}
                            onChange={(e) => {
                              const next = e.currentTarget.value
                              form.setFieldValue(field.name, next === '' ? undefined : next)
                            }}
                            onBlur={field.onBlur}
                            label={
                              <LabelWithToolTip
                                label="Velg til og med dato"
                                tooltip="Til og med-dato skal kun oppgis dersom behandlingen er midlertidig og har en sluttdato."
                                noMarginBottom
                              />
                            }
                            error={!!form.errors.end && (form.touched.end || !!form.submitCount)}
                          />
                        </DatePicker>
                      )
                    }}
                  </Field>
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
