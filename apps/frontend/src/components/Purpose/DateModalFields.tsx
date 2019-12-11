import { Block } from "baseui/block"
import { Button } from "baseui/button"
import { Field, FieldProps } from "formik"
import { Datepicker } from "baseui/datepicker"
import moment from "moment"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCalendar, faTimesCircle } from "@fortawesome/free-solid-svg-icons"
import * as React from "react"

import { intl } from "../../util"
import { LegalBasisFormValues } from "../../constants"
import { Error, renderLabel } from "../common/ModalSchema"

interface DateModalProps {
    showDates: boolean;
    rowBlockBrops: any;
    showLabels?: boolean;
}

export const DateModalFields = (props: DateModalProps) => {
    const [showDates, setShowDates] = React.useState<boolean>(props.showDates);
    const {rowBlockBrops, showLabels} = props

    return (
        <>
            {!showDates ?
                <Block {...rowBlockBrops}><Button size="compact" onClick={() => setShowDates(true)}>{intl.useDates}</Button></Block>
                : <>
                    <Block {...rowBlockBrops}>
                        {showLabels && renderLabel(intl.startDate)}
                        <Field name="start"
                               render={({field, form}: FieldProps<LegalBasisFormValues>) => (
                                   <Datepicker placeholder={intl.datePickStart} value={field.value && new Date(field.value)}
                                               onChange={({date}) => {
                                                   const moment1 = moment(date as Date)
                                                   form.setFieldValue('start', moment1.format(moment.HTML5_FMT.DATE));
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

                    <Block {...rowBlockBrops}>
                        {showLabels && renderLabel(intl.endDate)}
                        <Field name="end"
                               render={({field, form}: FieldProps<LegalBasisFormValues>) => (
                                   <Datepicker placeholder={intl.datePickEnd} value={field.value && new Date(field.value)}
                                               onChange={({date}) => {
                                                   const moment1 = moment(date as Date)
                                                   form.setFieldValue('end', moment1.format(moment.HTML5_FMT.DATE));
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