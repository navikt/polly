import * as React from 'react';
import { Select, TYPE, Value } from 'baseui/select';
import { Block, BlockProps } from 'baseui/block'
import { Card } from 'baseui/card'
import { StatefulInput } from 'baseui/input';
import { Label2 } from 'baseui/typography';
import { Button, KIND, SIZE as ButtonSize } from 'baseui/button';
import { codelist, ListName } from "../../../service/Codelist";
import { intl } from "../../../util"
import { ErrorMessage, Field, FieldProps, Formik, FormikProps } from "formik"
import { KIND as NKIND, Notification } from "baseui/notification"
import { LegalBasisFormValues } from "../../../constants"
import { legalBasisSchema } from "../../common/LegalBasis"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPen } from "@fortawesome/free-solid-svg-icons"
import { DateModalFields } from "../DateModalFields"

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

                        <DateModalFields rowBlockBrops={rowBlockBrops} showDates={useDates}/>

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