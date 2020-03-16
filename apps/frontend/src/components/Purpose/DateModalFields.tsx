import {Block, BlockProps} from "baseui/block"
import {Button} from "baseui/button"
import {Field, FieldProps} from "formik"
import {Datepicker} from "baseui/datepicker"
import moment from "moment"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faCalendar, faTimesCircle} from "@fortawesome/free-solid-svg-icons"
import * as React from "react"

import {intl} from "../../util"
import {LegalBasisFormValues} from "../../constants"
import {Error, ModalLabel} from "../common/ModalSchema"
import {padding} from "../common/Style"

interface DateModalProps {
  showDates: boolean;
  rowBlockProps: BlockProps;
  showLabels?: boolean;
}

function dateToDateString(date: Date | Date[]) {
  if (!date) return undefined
  const moment1 = moment(date as Date);
  return moment1.format(moment.HTML5_FMT.DATE)
}

export const DateModalFields = (props: DateModalProps) => {
  const [showDates, setShowDates] = React.useState<boolean>(props.showDates);
  const {rowBlockProps, showLabels} = props;

  return (
    <>
      {!showDates ?
        <Block {...rowBlockProps}>
          <Button size="compact" shape='pill'
                  overrides={{BaseButton: {style: padding("6px", "8px")}}}
                  onClick={() => setShowDates(true)}>{intl.useDates}</Button>
        </Block>
        : <>
          <Block {...rowBlockProps}>
            {showLabels && <ModalLabel label={intl.startDate}/>}
            <Field name="start"
                   render={({field, form}: FieldProps<string, LegalBasisFormValues>) => (
                     <Datepicker placeholder={intl.datePickStart} value={field.value ? new Date(field.value) : undefined}
                                 onChange={({date}) => {
                                   form.setFieldValue('start', dateToDateString(date));
                                 }}
                                 formatString={'yyyy-MM-dd'}
                                 error={!!form.errors.start && (form.touched.start || !!form.submitCount)}
                                 overrides={{
                                   Input: {
                                     props: {
                                       startEnhancer: () => <FontAwesomeIcon icon={faCalendar}/>,
                                       endEnhancer: () =>
                                         <Button size="compact" kind="tertiary" type="button" onClick={() => form.setFieldValue('start', undefined)}>
                                           <FontAwesomeIcon icon={faTimesCircle}/>
                                         </Button>
                                     }
                                   }
                                 }}
                     />
                   )}/>
          </Block>
          <Error fieldName="start"/>

          <Block {...rowBlockProps}>
            {showLabels && <ModalLabel label={intl.endDate}/>}
            <Field name="end"
                   render={({field, form}: FieldProps<string, LegalBasisFormValues>) => (
                     <Datepicker placeholder={intl.datePickEnd} value={field.value ? new Date(field.value) : undefined}
                                 onChange={({date}) => {
                                   form.setFieldValue('end', dateToDateString(date));
                                 }}
                                 formatString={'yyyy-MM-dd'}
                                 error={!!form.errors.end && (form.touched.end || !!form.submitCount)}
                                 overrides={{
                                   Input: {
                                     props: {
                                       startEnhancer: () => <FontAwesomeIcon icon={faCalendar}/>,
                                       endEnhancer: () =>
                                         <Button size="compact" kind="tertiary" type="button" onClick={() => form.setFieldValue('end', undefined)}>
                                           <FontAwesomeIcon icon={faTimesCircle}/>
                                         </Button>
                                     }
                                   }
                                 }}
                     />
                   )}/>
          </Block>
          <Error fieldName="end"/>
        </>}
    </>
  )
}
