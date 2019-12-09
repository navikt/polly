import * as React from "react";
import {KeyboardEvent, useEffect, useState} from "react";
import {Modal, ModalBody, ModalButton, ModalFooter, ModalHeader, ROLE, SIZE} from "baseui/modal";
import {Field, FieldArray, FieldProps, Form, Formik, FormikProps,} from "formik";
import {Block, BlockProps} from "baseui/block";
import {Radio, RadioGroup} from "baseui/radio";
import {Plus} from "baseui/icon";
import {Select, TYPE, Value} from 'baseui/select';
import * as yup from "yup"

import CardLegalBasis from './CardLegalBasis'
import {Button, KIND, SIZE as ButtonSize} from "baseui/button";
import {codelist, ListName} from "../../../service/Codelist";
import {useDebouncedState} from "../../../util/customHooks"
import axios from "axios"
import {Error, renderLabel} from "../../common/ModalSchema";
import {
    InformationType,
    LegalBasesStatus,
    PageResponse,
    PolicyFormValues,
    PolicyInformationType
} from "../../../constants"
import {intl} from "../../../util/intl/intl"
import {legalBasisSchema, ListLegalBases} from "../../common/LegalBasis"

const server_polly = process.env.REACT_APP_POLLY_ENDPOINT;

const modalBlockProps: BlockProps = {
    width: '750px',
    paddingRight: '2rem',
    paddingLeft: '2rem'
}

const rowBlockProps: BlockProps = {
    display: 'flex',
    width: '100%',
    marginTop: '1rem'
}

const FieldInformationType = (props: {
    informationTypes: PolicyInformationType[],
    searchInformationType: (name: string) => void,
    value: Value | undefined,
    setValue: (v: Value) => void
}) => (
        <Field
            name="informationType"
            render={({ form }: FieldProps<PolicyFormValues>) => (
                <Select
                    autoFocus
                    maxDropdownHeight="400px"
                    searchable={true}
                    type={TYPE.search}
                    options={props.informationTypes}
                    placeholder="Søk opplysningstyper"
                    value={props.value}
                    onInputChange={event => props.searchInformationType(event.currentTarget.value)}
                    onChange={(params: any) => {
                        let infoType = params.value[0]
                        props.setValue(infoType)
                        form.setFieldValue('informationType', infoType)
                    }}
                    error={!!form.errors.informationType && !!form.submitCount}
                    filterOptions={options => options}
                    labelKey="name"
                />
            )}
        />
    )

const FieldSubjectCategory = (props: { value?: string }) => {
    const [value, setValue] = React.useState<Value>(props.value ? [{ id: props.value, label: codelist.getShortname(ListName.SUBJECT_CATEGORY, props.value) }] : []);

    return (
        <Field
            name="subjectCategory"
            render={({ form }: FieldProps<PolicyFormValues>) => (
                <Select
                    options={codelist.getParsedOptions(ListName.SUBJECT_CATEGORY)}
                    onChange={({ value }) => {
                        setValue(value)
                        form.setFieldValue('subjectCategory', value.length > 0 ? value[0].id : undefined)
                    }}
                    value={value}
                    error={!!form.errors.subjectCategory && !!form.submitCount}
                />
            )}
        />

    )
}

const FieldLegalBasisStatus = (props: { legalBasesStatus?: LegalBasesStatus }) => {
    const [value, setValue] = useState(props.legalBasesStatus);
    return (
        <Field
            name="legalBasesInherited"
            render={({ field, form }: FieldProps<PolicyFormValues>) => {
                return (
                    <Block width="100%">
                        <RadioGroup
                            value={value}
                            align="vertical" isError={!!form.errors.legalBasesStatus && !!form.submitCount}
                            onChange={e => {
                                const selected = (e.target as HTMLInputElement).value
                                form.setFieldValue("legalBasesStatus", selected)
                                setValue(selected as LegalBasesStatus)
                            }}
                        >
                            <Radio value={LegalBasesStatus.INHERITED}>{intl.legalBasesProcess}</Radio>
                            <Radio value={LegalBasesStatus.UNKNOWN}>{intl.legalBasesUndecided}</Radio>
                            <Radio value={LegalBasesStatus.OWN}>{intl.legalBasesOwn}</Radio>
                        </RadioGroup>
                    </Block>
                )
            }}
        />
    )
}

const missingArt9LegalBasisForSensitiveInfoType = (informationType: PolicyInformationType, policy: PolicyFormValues) => {
    const ownLegalBasis = policy.legalBasesStatus === LegalBasesStatus.OWN
    const reqArt9 = informationType && codelist.requiresArt9(informationType.sensitivity && informationType.sensitivity.code)
    const missingArt9 = !policy.legalBases.filter((lb) => codelist.isArt9(lb.gdpr)).length
    const processMissingArt9 = !policy.process.legalBases.filter(lb => codelist.isArt9(lb.gdpr.code)).length
    return ownLegalBasis && reqArt9 && missingArt9 && processMissingArt9
}

const missingArt6LegalBasisForInfoType = (policy: PolicyFormValues) => {
    const ownLegalBasis = policy.legalBasesStatus === LegalBasesStatus.OWN
    const missingArt6 = !policy.legalBases.filter((lb) => codelist.isArt6(lb.gdpr)).length
    return ownLegalBasis && missingArt6
}

const policySchema = () => yup.object<PolicyFormValues>({
    informationType: yup.object<PolicyInformationType>().required(intl.required)
    .test({
        name: 'policyHasArt9',
        message: intl.requiredGdprArt9,
        test: function (informationType) {
            const {parent} = this
            return !missingArt9LegalBasisForSensitiveInfoType(informationType, parent)
        }
    }).test({
        name: 'policyHasArt6',
        message: intl.requiredGdprArt6,
        test: function (informationType) {
            const {parent} = this
            return !missingArt6LegalBasisForInfoType(parent)
        }
    }),
    subjectCategory: yup.string().required(intl.required),
    legalBasesStatus: yup.mixed().oneOf(Object.values(LegalBasesStatus)).required(intl.required),
    legalBases: yup.array(legalBasisSchema()),
    process: yup.object(),
    purposeCode: yup.string(),
    id: yup.string()
})

type ModalPolicyProps = {
    title?: string;
    isOpen: boolean;
    isEdit: boolean;
    initialValues: PolicyFormValues;
    errorOnCreate: any | undefined;
    submit: Function;
    onClose: Function;
};

const ModalPolicy = ({ submit, errorOnCreate, onClose, isOpen, isEdit, initialValues, title }: ModalPolicyProps) => {
    const [showLegalbasesFields, setShowLegalbasesFields] = React.useState<boolean>(false);

    const [infoTypeValue, setInfoTypeValue] = React.useState<Array<PolicyInformationType>>(isEdit && initialValues.informationType ? [initialValues.informationType] : []);
    const [infoTypeSearch, setInfoTypeSearch] = useDebouncedState<string>('', 200);
    const [infoTypeSearchResult, setInfoTypeSearchResult] = React.useState<PolicyInformationType[]>([]);

    useEffect(() => {
        if (infoTypeSearch && infoTypeSearch.length > 2) {
            axios
                .get(`${server_polly}/informationtype/search/${infoTypeSearch}`)
                .then((res: { data: PageResponse<InformationType> }) => {
                    return setInfoTypeSearchResult(res.data.content)
                })
        }

    }, [infoTypeSearch])

    const onCloseModal = () => {
        setInfoTypeValue([])
        setInfoTypeSearch('')
        setInfoTypeSearchResult([])
        setShowLegalbasesFields(false)
        onClose()
    }

    const disableEnter = (e: KeyboardEvent) => {
        if (e.key === 'Enter') e.preventDefault()
    }

    return (
        <Modal
            onClose={onCloseModal}
            isOpen={isOpen}
            closeable
            animate
            size={SIZE.auto}
            role={ROLE.dialog}
        >
            <Block {...modalBlockProps}>
                <Formik
                    initialValues={initialValues} validationSchema={policySchema()}
                    onSubmit={(values) => {
                        submit(values)
                        onCloseModal()
                    }}
                    render={(formikBag: FormikProps<PolicyFormValues>) => (
                        <Form onKeyDown={disableEnter}>
                            <ModalHeader>
                                <Block display="flex" justifyContent="center" marginBottom="2rem">
                                    {title}
                                </Block>
                            </ModalHeader>

                            <ModalBody>
                                <Block {...rowBlockProps}>
                                    {renderLabel(intl.informationType)}
                                    <FieldInformationType
                                        informationTypes={infoTypeSearchResult}
                                        searchInformationType={setInfoTypeSearch}
                                        value={infoTypeValue}
                                        setValue={setInfoTypeValue as any}
                                    />
                                </Block>
                                <Error fieldName="informationType" />

                                <Block {...rowBlockProps}>
                                    {renderLabel(intl.subjectCategories)}
                                    <FieldSubjectCategory value={formikBag.values.subjectCategory} />
                                </Block>
                                <Error fieldName="subjectCategory" />

                                <Block {...rowBlockProps}>
                                    {renderLabel(intl.legalBasesShort)}
                                    <FieldLegalBasisStatus legalBasesStatus={formikBag.values.legalBasesStatus} />
                                </Block>
                                <Error fieldName="legalBasesStatus" />

                                {formikBag.values.legalBasesStatus === LegalBasesStatus.OWN && (
                                    <FieldArray
                                        name="legalBases"
                                        render={arrayHelpers => (
                                            <React.Fragment>
                                                {showLegalbasesFields ? (
                                                    <Block width="100%" marginTop="2rem">
                                                        <CardLegalBasis
                                                            hideCard={() => setShowLegalbasesFields(false)}
                                                            submit={(values: any) => {
                                                                if (!values) return
                                                                else {
                                                                    arrayHelpers.push(values)
                                                                    setShowLegalbasesFields(false)
                                                                }
                                                            }} />
                                                    </Block>
                                                ) : (
                                                        <Block {...rowBlockProps}>
                                                            {renderLabel('')}
                                                            <Block width="100%">
                                                                <Button
                                                                    size={ButtonSize.compact}
                                                                    kind={KIND.minimal}
                                                                    onClick={() => setShowLegalbasesFields(true)}
                                                                    startEnhancer={() => <Block display="flex" justifyContent="center"><Plus size={22} /></Block>}
                                                                >
                                                                    {intl.legalBasisAdd}
                                                                </Button>
                                                                <Block marginTop="1rem">
                                                                    <ListLegalBases
                                                                        legalBases={formikBag.values.legalBases}
                                                                        onRemove={(index: any) => arrayHelpers.remove(index)}
                                                                    />
                                                                </Block>
                                                            </Block>
                                                        </Block>
                                                    )}
                                            </React.Fragment>
                                        )}
                                    />
                                )}
                            </ModalBody>

                            <ModalFooter>
                                <Block display="flex" justifyContent="flex-end">
                                    <Block alignSelf="flex-end">{errorOnCreate && <p>{errorOnCreate}</p>}</Block>
                                    <Button type="button" kind={KIND.minimal} onClick={onCloseModal}>{intl.abort}</Button>
                                    <ModalButton type="submit">{intl.save}</ModalButton>
                                </Block>
                            </ModalFooter>
                        </Form>
                    )}
                />

            </Block>
        </Modal>

    );
}

export default ModalPolicy