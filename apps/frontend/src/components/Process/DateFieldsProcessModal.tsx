import { Block, BlockProps } from 'baseui/block'
import { Button } from 'baseui/button'
import { Field, FieldProps } from 'formik'
import { Datepicker } from 'baseui/datepicker'
import moment from 'moment'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendar, faQuestionCircle } from '@fortawesome/free-solid-svg-icons'
import * as React from 'react'
import { theme } from '../../util'
import { ProcessFormValues } from '../../constants'
import { Error } from '../common/ModalSchema'
import { padding } from '../common/Style'
import CustomizedStatefulTooltip from '../common/CustomizedStatefulTooltip'
import nb from 'date-fns/locale/nb';

interface DateModalProps {
  showDates: boolean
  rowBlockProps: BlockProps
  showLabels?: boolean
}

function dateToDateString(date: Date | (Date | null | undefined)[] | Date[] | null | undefined) {
  if (!date) return undefined
  const moment1 = moment(date as Date)
  return moment1.format(moment.HTML5_FMT.DATE)
}

const LabelWithTooltip = (props: { text: string; tooltip: string }) => (
  <CustomizedStatefulTooltip content={props.tooltip}>
    <Block display="flex">
      {props.text}
      <FontAwesomeIcon style={{ marginLeft: '.5rem', alignSelf: 'center' }} icon={faQuestionCircle} color={theme.colors.primary300} size="sm" />
    </Block>
  </CustomizedStatefulTooltip>
)

export const DateFieldsProcessModal = (props: DateModalProps) => {
  const [showDates, setShowDates] = React.useState<boolean>(props.showDates)
  const { rowBlockProps, showLabels } = props

  return (
    <>
      {!showDates ? (
        <Block {...rowBlockProps}>
          <Button size="compact" shape="pill" overrides={{ BaseButton: { style: padding('6px', '8px') } }} onClick={() => setShowDates(true)}>
            Velg datoer
          </Button>
        </Block>
      ) : (
        <>
          <Block width={'100%'}>
            <Block display={'flex'} width={'100%'}>
              <Block width={'50%'} marginRight={'1rem'}>
                {showLabels && <LabelWithTooltip text='Fom dato' tooltip='Fra og med-dato er preutfylt med den datoen NAV ble opprettet. For behandlinger med senere fom-dato, må denne endres. Datoen kan også settes frem i tid.'/>}
              </Block>
              <Block width={'50%'}>{showLabels && <LabelWithTooltip text='Tom dato' tooltip='Til og med-dato skal kun oppgis dersom behandlingen er midlertidig og har en sluttdato.' />}</Block>
            </Block>
            <Block display={'flex'} width={'100%'}>
              <Block width={'50%'} marginRight={'1rem'}>
                <Block {...rowBlockProps}>
                  <Field name="start">
                    {({ field, form }: FieldProps<string, ProcessFormValues>) => (
                      <Datepicker
                        placeholder='Velg fra og med dato'
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
                </Block>
                <Error fieldName="start" />
              </Block>
              <Block width={'50%'}>
                <Block {...rowBlockProps}>
                  <Field name="end">
                    {({ field, form }: FieldProps<string, ProcessFormValues>) => (
                      <Datepicker
                        placeholder='Velg til og med dato'
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
                </Block>
                <Error fieldName="end" />
              </Block>
            </Block>
          </Block>
        </>
      )}
    </>
  )
}
