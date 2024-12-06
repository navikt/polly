import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, DatePicker, Tooltip, useDatepicker } from '@navikt/ds-react'
import { Field, FieldProps } from 'formik'
import { useState } from 'react'
import { IProcessFormValues } from '../../constants'
import { theme } from '../../util'
import { Error } from '../common/ModalSchema'

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
      <Button type="button" variant="tertiary-neutral" size="small">
        {text}
        <FontAwesomeIcon
          style={{ marginLeft: '.5rem', alignSelf: 'center' }}
          icon={faQuestionCircle}
          color={theme.colors.primary300}
          size="sm"
        />
      </Button>
    </Tooltip>
  )
}

export const DateFieldsProcessModal = (props: IDateModalProps) => {
  const { showLabels } = props
  const [showDates, setShowDates] = useState<boolean>(props.showDates)
  const { datepickerProps, inputProps } = useDatepicker({})

  return (
    <>
      {!showDates && (
        <div className="flex w-full mt-4">
          <Button size="xsmall" type="button" onClick={() => setShowDates(true)}>
            Velg datoer
          </Button>
        </div>
      )}{' '}
      {showDates && (
        <>
          <div className="w-full">
            <div className="flex w-full">
              <div className="w-1/2 mr-4">
                {showLabels && (
                  <LabelWithTooltip
                    text="Fom dato"
                    tooltip="Fra og med-dato er preutfylt med den datoen NAV ble opprettet. For behandlinger med senere fom-dato, må denne endres. Datoen kan også settes frem i tid."
                  />
                )}
              </div>
              <div className="w-1/2">
                {showLabels && (
                  <LabelWithTooltip
                    text="Tom dato"
                    tooltip="Til og med-dato skal kun oppgis dersom behandlingen er midlertidig og har en sluttdato."
                  />
                )}
              </div>
            </div>
            <div className="flex w-full">
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
                          {...inputProps}
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
              <div className="w-1/2">
                <div className="flex w-full mt-4">
                  <Field name="end">
                    {({ form }: FieldProps<string, IProcessFormValues>) => (
                      <DatePicker
                        {...datepickerProps}
                        onSelect={(date: any) => {
                          const dateSingle: Date = Array.isArray(date) ? date[0] : date
                          if (dateSingle) {
                            const newDate = dateSingle.setDate(dateSingle.getDate() + 1)
                            const formatedDate = new Date(newDate)
                            form.setFieldValue('end', formatedDate.toISOString().split('T')[0])
                          } else form.setFieldValue('end', undefined)
                        }}
                      >
                        <DatePicker.Input
                          className="mb-2"
                          {...inputProps}
                          value={form.values['end']}
                          label="Velg til og med dato"
                          error={!!form.errors.end && (form.touched.end || !!form.submitCount)}
                        />
                      </DatePicker>
                    )}
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
