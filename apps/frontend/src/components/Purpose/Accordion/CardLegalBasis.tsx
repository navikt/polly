import * as React from 'react';
import { Select, TYPE, Value } from 'baseui/select';
import { Block, BlockProps } from 'baseui/block'
import { Card } from 'baseui/card'
import { StatefulInput } from 'baseui/input';
import { Label2 } from 'baseui/typography';
import { Button, KIND, SIZE as ButtonSize } from 'baseui/button';
import { codelist, ListName } from "../../../service/Codelist";
import { intl, theme } from "../../../util"
import { ErrorMessage, Field, FieldProps, Form, Formik, FormikProps } from "formik"
import { KIND as NKIND, Notification } from "baseui/notification"
import { LegalBasisFormValues } from "../../../constants"
import { legalBasisSchema } from "../../common/LegalBasis"
import { Datepicker } from "baseui/datepicker"
import moment from 'moment';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCalendar, faPen, faTimesCircle } from "@fortawesome/free-solid-svg-icons"

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

    // Must be complete to acheive touched on submit
    const initialValues = { gdpr: undefined, nationalLaw: undefined, description: undefined, start: undefined, end: undefined }
    return (
        <Formik
            onSubmit={(values, form) => submit(values)} validationSchema={legalBasisSchema()} initialValues={initialValues}
            render={(form: FormikProps<LegalBasisFormValues>) => {
                return (
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

                        <Block {...rowBlockBrops} display={codelist.requiresNationalLaw(form.values.gdpr) ? rowBlockBrops.display : 'none'}>
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

                        <Block {...rowBlockBrops} display={codelist.requiresDescription(form.values.gdpr) ? rowBlockBrops.display : 'none'}>
                            <Field name="description"
                                render={({ field }: FieldProps<LegalBasisFormValues>) => (
                                    <StatefulInput {...field} placeholder={intl.descriptionWrite}
                                        error={!!form.errors.description && !!form.submitCount}
                                        startEnhancer={() => <FontAwesomeIcon icon={faPen} />}

                                    />
                                )} />
                        </Block>
                        <Error fieldName="description" />

                        {!useDates ?
                            <Block {...rowBlockBrops}><Button size="compact" onClick={() => setUseDates(true)}>{intl.useDates}</Button></Block>
                            : <>
                                <Block {...rowBlockBrops}>
                                    <Field name="start"
                                        render={({ field, form }: FieldProps<LegalBasisFormValues>) => (
                                            <Datepicker placeholder={intl.datePickStart} value={field.value && new Date(field.value)}
                                                onChange={({ date }) => {
                                                    const moment1 = moment(date as Date)
                                                    form.setFieldValue('start', moment1.format(moment.HTML5_FMT.DATE));
                                                }}
                                                formatString={'yyyy-MM-dd'}
                                                error={!!form.errors.start && (form.touched.start || !!form.submitCount)}
                                                overrides={{
                                                    Input: {
                                                        props: {
                                                            startEnhancer: () => <FontAwesomeIcon icon={faCalendar} />,
                                                            endEnhancer: () =>
                                                                <Button size="compact" kind="tertiary" type="button" onClick={() => form.setFieldValue('start', undefined)}>
                                                                    <FontAwesomeIcon icon={faTimesCircle} />
                                                                </Button>
                                                        }
                                                    }
                                                }}
                                            />
                                        )} />
                                </Block>
                                <Error fieldName="start" />

                                <Block {...rowBlockBrops}>
                                    <Field name="end"
                                        render={({ field, form }: FieldProps<LegalBasisFormValues>) => (
                                            <Datepicker placeholder={intl.datePickEnd} value={field.value && new Date(field.value)}
                                                onChange={({ date }) => {
                                                    const moment1 = moment(date as Date)
                                                    form.setFieldValue('end', moment1.format(moment.HTML5_FMT.DATE));
                                                }}
                                                formatString={'yyyy-MM-dd'}
                                                error={!!form.errors.end && (form.touched.end || !!form.submitCount)}
                                                overrides={{
                                                    Input: {
                                                        props: {
                                                            startEnhancer: () => <FontAwesomeIcon icon={faCalendar} />,
                                                            endEnhancer: () =>
                                                                <Button size="compact" kind="tertiary" type="button" onClick={() => form.setFieldValue('end', undefined)}>
                                                                    <FontAwesomeIcon icon={faTimesCircle} />
                                                                </Button>
                                                        }
                                                    }
                                                }}
                                            />
                                        )} />
                                </Block>
                                <Error fieldName="end" />
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
                )
            }} />
    )
}

export default CardLegalBasis