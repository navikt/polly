import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, DatePicker, Tooltip, useDatepicker } from '@navikt/ds-react'
import { Field, FieldProps } from 'formik'
import { useState } from 'react'
import { IDpProcessFormValues } from '../../../constants'
import { theme } from '../../../util'
import { Error } from '../../common/ModalSchema'

interface IDateModalProps {
  showDates: boolean
  showLabels?: boolean
}

interface ILabelWithTooltipProps {
  text: string
  tooltip: string
}

const LabelWithTooltip = (props: ILabelWithTooltipProps) => {
  const { text, tooltip } = props

  return (
    <Tooltip content={tooltip}>
      <Button type="button" variant="tertiary-neutral">
        {text}
        <FontAwesomeIcon
          style={{ marginLeft: '.5rem', alignSelf: 'center' }}
          icon={faExclamationCircle}
          color={theme.colors.primary300}
          size="sm"
        />
      </Button>
    </Tooltip>
  )
}

export const FieldDpProcessDates = (props: IDateModalProps) => {
  const { showLabels } = props
  const [showDates, setShowDates] = useState<boolean>(props.showDates)
  const { datepickerProps: startDatepickerProps, inputProps: startInputProps } = useDatepicker({})

  const { datepickerProps: endDatepickerProps, inputProps: endInputProps } = useDatepicker({})

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
              <div className="w-[50%] mr-4">
                {showLabels && (
                  <LabelWithTooltip
                    text="Fom dato"
                    tooltip="Fra og med-dato er preutfylt med den datoen NAV ble opprettet. For behandlinger med senere fom-dato, må denne endres. Datoen kan også settes frem i tid."
                  />
                )}
              </div>
              <div className="w-[50%]">
                {showLabels && (
                  <LabelWithTooltip
                    text="Tom dato"
                    tooltip="Fra og med-dato er preutfylt med den datoen NAV ble opprettet. For behandlinger med senere fom-dato, må denne endres. Datoen kan også settes frem i tid."
                  />
                )}
              </div>
            </div>
            <div className="flex w-full">
              <div className="w-[50%] mr-4">
                <div className="flex w-full mt-4">
                  <Field name="start">
                    {({ form }: FieldProps<string, IDpProcessFormValues>) => {
                      const endVal = form.values['end']
                      const endDate = parseLocalYMD(endVal)
                      const startMax = endDate ? new Date(endDate) : undefined
                      if (startMax) startMax.setDate(startMax.getDate() - 1)

                      return (
                        <DatePicker
                          {...startDatepickerProps}
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
                            {...startInputProps}
                            value={form.values['start']}
                            label="Velg fra og med dato"
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
              <div className="w-[50%]">
                <div className="flex w-full mt-4">
                  <Field name="end">
                    {({ form }: FieldProps<string, IDpProcessFormValues>) => {
                      const startVal = form.values['start']
                      const startDate = parseLocalYMD(startVal)
                      const endMin = startDate ? new Date(startDate) : undefined
                      if (endMin) endMin.setDate(endMin.getDate() + 1)

                      return (
                        <DatePicker
                          {...endDatepickerProps}
                          fromDate={endMin}
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
                            {...endInputProps}
                            value={form.values['end']}
                            label="Velg til og med dato"
                            error={!!form.errors.end && (form.touched.end || !!form.submitCount)}
                          />
                        </DatePicker>
                      )
                    }}
                  </Field>
                </div>
                <Error fieldName={'end'} />
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}
