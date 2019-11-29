import * as React from 'react';
import { Select, TYPE, Value } from 'baseui/select';
import { Block, BlockProps } from 'baseui/block'
import { Card } from 'baseui/card'
import { StatefulInput } from 'baseui/input';
import { Label2 } from 'baseui/typography';
import { Button, KIND, SIZE as ButtonSize } from 'baseui/button';
import { codelist, ListName } from "../../service/Codelist";
import { intl, theme } from "../../util"
import { ErrorMessage, Field, FieldProps, Formik, FormikProps } from "formik"
import { KIND as NKIND, Notification } from "baseui/notification"
import { LegalBasisFormValues } from "../../constants"
import { legalBasisSchema } from "../common/LegalBasis"
import { Datepicker } from "baseui/datepicker"
import moment from 'moment';

const rowBlockBrops: BlockProps = {
    display: 'flex',
    marginTop: '1rem',
    width: '100%'
}

const Error = (props: { fieldName: string }) => (
    <ErrorMessage name={props.fieldName}>
        {msg => (
            <Block {...rowBlockBrops} marginTop=".2rem">
                <Notification overrides={{ Body: { style: { width: 'auto', padding: 0, marginTop: 0 } } }} kind={NKIND.negative}>{msg}</Notification>
            </Block>
        )}
    </ErrorMessage>
)

interface CardLegalBasisProps {
    hideCard: Function;
    submit: (val: LegalBasisFormValues) => void
}

const CardLegalBasis = ({ submit, hideCard }: CardLegalBasisProps) => {
    const [gdpr, setGdpr] = React.useState<Value>([]);
    const [nationalLaw, setNationalLaw] = React.useState<Value>([]);
    const [useDates, setUseDates] = React.useState(false);
    return (
        <Formik onSubmit={(values, form) => {
            form.setFieldTouched('gdpr')
            form.setFieldTouched('nationalLaw')
            submit(values)
        }} validationSchema={legalBasisSchema()} initialValues={{}}
            render={(form: FormikProps<LegalBasisFormValues>) => (
                <Card>
                    <Label2 marginBottom="1rem">{intl.legalBasisNew}</Label2>

                    <Block {...rowBlockBrops}>
                        <Field name="gdpr"
                            render={() => (
                                <Select
                                    autoFocus={true}
                                    options={codelist.getParsedOptions(ListName.GDPR_ARTICLE)}
                                    placeholder={intl.gdprSelect}
                                    maxDropdownHeight="300px"
                                    type={TYPE.search}
                                    onChange={({ value }) => {
                                        setGdpr(value)
                                        form.setFieldValue('gdpr', value.length > 0 ? value[0].id : undefined)
                                    }}
                                    value={gdpr}
                                    error={!!form.errors.gdpr && !!form.submitCount}
                                />
                            )} />
                    </Block>
                    <Error fieldName="gdpr" />

                    <Block {...rowBlockBrops}>
                        <Field name="nationalLaw"
                            render={() => (
                                <Select
                                    options={codelist.getParsedOptions(ListName.NATIONAL_LAW)}
                                    placeholder={intl.nationalLawSelect}
                                    maxDropdownHeight="300px"
                                    type={TYPE.search}
                                    onChange={({ value }) => {
                                        setNationalLaw(value)
                                        form.setFieldValue('nationalLaw', value.length > 0 ? value[0].id : undefined)
                                    }}
                                    value={nationalLaw}
                                    error={!!form.errors.nationalLaw && !!form.submitCount}
                                />
                            )} />
                    </Block>
                    <Error fieldName="nationalLaw" />

                    <Block {...rowBlockBrops}>
                        <Field name="description"
                            render={({ field }: FieldProps<LegalBasisFormValues>) => (
                                <StatefulInput {...field} placeholder={intl.descriptionWrite}
                                    error={!!form.errors.description && !!form.submitCount}
                                />
                            )} />
                    </Block>
                    <Error fieldName="description" />

                    {!useDates ?
                        <Block marginTop={theme.sizing.scale200}><Button size="compact" onClick={() => setUseDates(true)}>{intl.useDates}</Button></Block>
                        : <>
                            <Block {...rowBlockBrops}>
                                <Field name="start"
                                       render={({field, form}: FieldProps<LegalBasisFormValues>) => (
                                           <Datepicker placeholder={intl.datePickStart} value={field.value && new Date(field.value)}
                                                       onChange={({date}) => {
                                                           const moment1 = moment(date as Date)
                                                           form.setFieldValue('start', moment1.format(moment.HTML5_FMT.DATE));
                                                       }}
                                                       formatString={'yyyy-MM-dd'}
                                                       error={!!form.errors.start && (form.touched.start || !!form.submitCount)}
                                           />
                                       )}/>
                            </Block>
                            <Error fieldName="start"/>

                            <Block {...rowBlockBrops}>
                                <Field name="end"
                                       render={({field, form}: FieldProps<LegalBasisFormValues>) => (
                                           <Datepicker placeholder={intl.datePickEnd} value={field.value && new Date(field.value)}
                                                       onChange={({date}) => {
                                                           const moment1 = moment(date as Date)
                                                           form.setFieldValue('end', moment1.format(moment.HTML5_FMT.DATE));
                                                       }}
                                                       formatString={'yyyy-MM-dd'}
                                                       error={!!form.errors.end && (form.touched.end || !!form.submitCount)}
                                           />
                                       )}/>
                            </Block>
                            <Error fieldName="end"/>
                        </>}

                    <Block {...rowBlockBrops} justifyContent="space-between">
                        <Button type='button' kind={KIND.secondary} size={ButtonSize.compact} onClick={form.submitForm}>
                            {intl.legalBasisAdd}
                        </Button>
                        <Button type='button' kind={KIND.minimal} size={ButtonSize.compact} onClick={() => hideCard()}>
                            {intl.abort}
                        </Button>
                    </Block>
                </Card>
            )} />
    )
}

export default CardLegalBasis