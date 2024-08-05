import { faCalendar, faQuestionCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button } from 'baseui/button'
import { Datepicker } from 'baseui/datepicker'
import nb from 'date-fns/locale/nb'
import { Field, FieldProps } from 'formik'
import moment, { Moment } from 'moment'
import { useState } from 'react'
import { ProcessFormValues } from '../../constants'
import { theme } from '../../util'
import CustomizedStatefulTooltip from '../common/CustomizedStatefulTooltip'
import { Error } from '../common/ModalSchema'
import { padding } from '../common/Style'

interface DateModalProps {
  showDates: boolean
  showLabels?: boolean
}

function dateToDateString(date: Date | (Date | null | undefined)[] | Date[] | null | undefined) {
  if (!date) return undefined

  const moment1: Moment = moment(date as Date)
  return moment1.format(moment.HTML5_FMT.DATE)
}

interface ILabelWithTooltipProps {
  text: string
  tooltip: string
}

const LabelWithTooltip = (props: ILabelWithTooltipProps) => {
  const { text, tooltip } = props

  return (
    <CustomizedStatefulTooltip content={tooltip}>
      <div className="flex">
        {text}
        <FontAwesomeIcon style={{ marginLeft: '.5rem', alignSelf: 'center' }} icon={faQuestionCircle} color={theme.colors.primary300} size="sm" />
      </div>
    </CustomizedStatefulTooltip>
  )
}

export const DateFieldsProcessModal = (props: DateModalProps) => {
  const { showLabels } = props
  const [showDates, setShowDates] = useState<boolean>(props.showDates)

  return (
    <>
      {!showDates && (
        <div className="flex w-full mt-4">
          <Button size="compact" shape="pill" overrides={{ BaseButton: { style: padding('6px', '8px') } }} onClick={() => setShowDates(true)}>
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
                {showLabels && <LabelWithTooltip text="Tom dato" tooltip="Til og med-dato skal kun oppgis dersom behandlingen er midlertidig og har en sluttdato." />}
              </div>
            </div>
            <div className="flex w-full">
              <div className="w-1/2 mr-4">
                <div className="flex w-full mt-4">
                  <Field name="start">
                    {({ field, form }: FieldProps<string, ProcessFormValues>) => (
                      <Datepicker
                        placeholder="Velg fra og med dato"
                        value={field.value ? new Date(field.value) : undefined}
                        onChange={({ date }) => {
                          form.setFieldValue('start', dateToDateString(date))
                        }}
                        locale={nb}
                        formatString={'dd-MM-yyyy'}
                        error={!!form.errors.start && (form.touched.start || !!form.submitCount)}
                        clearable
                        overrides={{
                          Input: {
                            props: {
                              startEnhancer: () => <FontAwesomeIcon icon={faCalendar} />,
                            },
                          },
                        }}
                      />
                    )}
                  </Field>
                </div>
                <Error fieldName="start" />
              </div>
              <div className="w-1/2">
                <div className="flex w-full mt-4">
                  <Field name="end">
                    {({ field, form }: FieldProps<string, ProcessFormValues>) => (
                      <Datepicker
                        placeholder="Velg til og med dato"
                        value={field.value ? new Date(field.value) : undefined}
                        onChange={({ date }) => {
                          form.setFieldValue('end', dateToDateString(date))
                        }}
                        formatString={'dd-MM-yyyy'}
                        error={!!form.errors.end && (form.touched.end || !!form.submitCount)}
                        locale={nb}
                        clearable
                        overrides={{
                          Input: {
                            props: {
                              startEnhancer: () => <FontAwesomeIcon icon={faCalendar} />,
                            },
                          },
                        }}
                      />
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
