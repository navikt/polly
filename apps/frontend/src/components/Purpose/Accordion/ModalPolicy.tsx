import * as React from "react";
import { KeyboardEvent, useState } from "react";
import { Modal, ModalBody, ModalButton, ModalFooter, ModalHeader, ROLE, SIZE } from "baseui/modal";
import { Field, FieldArray, FieldProps, Form, Formik, FormikProps, } from "formik";
import { Block, BlockProps } from "baseui/block";
import { Radio, RadioGroup } from "baseui/radio";
import { Plus } from "baseui/icon";
import { Select, TYPE, Value } from 'baseui/select';

import CardLegalBasis from "./CardLegalBasis"
import { codelist, ListName } from "../../../service/Codelist";
import { Button, KIND, SIZE as ButtonSize } from "baseui/button";
import { LegalBasesStatus, PolicyFormValues, PolicyInformationType } from "../../../constants"
import { ListLegalBases } from "../../common/LegalBasis"
import { useInfoTypeSearch } from "../../../api"
import { Error, ModalLabel } from "../../common/ModalSchema";
import { intl } from "../../../util"
import { DateModalFields } from "../DateModalFields"
import { hasSpecifiedDate } from "../../common/Durations"
import { policySchema } from "../../common/schema"


const modalBlockProps: BlockProps = {
    width: '750px',
    paddingRight: '2rem',
    paddingLeft: '2rem'
};

const rowBlockProps: BlockProps = {
    display: 'flex',
    width: '100%',
    marginTop: '1rem'
};

const FieldInformationType = (props: {
    informationTypes: PolicyInformationType[],
    searchInformationType: (name: string) => void,
    value?: PolicyInformationType,
    setValue: (v: PolicyInformationType) => void
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
                    value={props.value as any}
                    onInputChange={event => props.searchInformationType(event.currentTarget.value)}
                    onChange={(params) => {
                        let infoType = params.value[0] as PolicyInformationType;
                        props.setValue(infoType);
                        form.setFieldValue('informationType', infoType)
                    }}
                    error={!!form.errors.informationType && !!form.submitCount}
                    filterOptions={options => options}
                    labelKey="name"
                />
            )}
        />
    );

const FieldSubjectCategory = (props: { value?: string }) => {
    const [value, setValue] = React.useState<Value>(props.value ? [{ id: props.value, label: codelist.getShortname(ListName.SUBJECT_CATEGORY, props.value) }] : []);

    return (
        <Field
            name="subjectCategory"
            render={({ form }: FieldProps<PolicyFormValues>) => (
                <Select
                    options={codelist.getParsedOptions(ListName.SUBJECT_CATEGORY)}
                    onChange={({ value }) => {
                        setValue(value);
                        form.setFieldValue('subjectCategory', value.length > 0 ? value[0].id : undefined)
                    }}
                    value={value}
                    error={!!form.errors.subjectCategory && !!form.submitCount}
                />
            )}
        />

    )
};

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
                                const selected = (e.target as HTMLInputElement).value;
                                form.setFieldValue("legalBasesStatus", selected);
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
};

type ModalPolicyProps = {
    title?: string;
    isOpen: boolean;
    isEdit: boolean;
    initialValues: PolicyFormValues;
    errorOnCreate: any | undefined;
    submit: (values: PolicyFormValues) => void;
    onClose: () => void;
};

const ModalPolicy = ({ submit, errorOnCreate, onClose, isOpen, initialValues, title }: ModalPolicyProps) => {
    const [selectedLegalBasis, setSelectedLegalBasis] = React.useState();
    const [selectedLegalBasisIndex, setSelectedLegalBasisIndex] = React.useState();
    const [infoTypeValue, setInfoTypeValue] = React.useState<PolicyInformationType | undefined>(initialValues.informationType);
    const [infoTypeSearchResult, setInfoTypeSearch] = useInfoTypeSearch();

    const onCloseModal = () => {
        setInfoTypeValue(undefined);
        setInfoTypeSearch('');
        onClose()
    };

    const disableEnter = (e: KeyboardEvent) => {
        if (e.key === 'Enter') e.preventDefault()
    };

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
                        submit(values);
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
                                    <ModalLabel label={intl.informationType}/>
                                    <FieldInformationType
                                        informationTypes={infoTypeSearchResult}
                                        searchInformationType={setInfoTypeSearch}
                                        value={infoTypeValue}
                                        setValue={setInfoTypeValue}
                                    />
                                </Block>
                                <Error fieldName="informationType" />

                                <Block {...rowBlockProps}>
                                    <ModalLabel label={intl.subjectCategories}/>
                                    <FieldSubjectCategory value={formikBag.values.subjectCategory} />
                                </Block>
                                <Error fieldName="subjectCategory" />

                               <DateModalFields showDates={hasSpecifiedDate(initialValues)} showLabels={true} rowBlockProps={rowBlockProps}/>

                                <Block {...rowBlockProps}>
                                    <ModalLabel label={intl.legalBasesShort}/>
                                    <FieldLegalBasisStatus legalBasesStatus={formikBag.values.legalBasesStatus} />
                                </Block>
                                <Error fieldName="legalBasesStatus" />

                                {formikBag.values.legalBasesStatus === LegalBasesStatus.OWN && (
                                    <FieldArray
                                        name="legalBases"
                                        render={arrayHelpers => (
                                            <React.Fragment>
                                                {formikBag.values.legalBasesOpen ? (
                                                    <Block width="100%" marginTop="2rem">
                                                        <CardLegalBasis
                                                            titleSubmitButton={selectedLegalBasis ? intl.update : intl.add}
                                                            initValue={selectedLegalBasis || {}}
                                                            hideCard={() => formikBag.setFieldValue('legalBasesOpen', false)}
                                                            submit={values => {
                                                                if (!values) return;
                                                                if (selectedLegalBasis) {
                                                                    arrayHelpers.replace(selectedLegalBasisIndex, values);
                                                                    setSelectedLegalBasis(null)
                                                                } else {
                                                                    arrayHelpers.push(values);
                                                                }
                                                                formikBag.setFieldValue('legalBasesOpen', false);
                                                            }}/>
                                                    </Block>
                                                ) : (
                                                        <Block {...rowBlockProps}>
                                                            <ModalLabel />
                                                            <Block width="100%">
                                                                <Button
                                                                    size={ButtonSize.compact}
                                                                    kind={KIND.minimal}
                                                                    onClick={() => formikBag.setFieldValue('legalBasesOpen', true)}
                                                                    startEnhancer={() => <Block display="flex" justifyContent="center"><Plus size={22} /></Block>}
                                                                >
                                                                    {intl.legalBasisAdd}
                                                                </Button>
                                                                <Block marginTop="1rem">
                                                                    <ListLegalBases
                                                                        legalBases={formikBag.values.legalBases}
                                                                        onRemove={(index) => arrayHelpers.remove(index)}
                                                                        onEdit={(index)=> {
                                                                            setSelectedLegalBasis(formikBag.values.legalBases[index]);
                                                                            setSelectedLegalBasisIndex(index);
                                                                            formikBag.setFieldValue('legalBasesOpen', true)
                                                                        }}
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
                            <Error fieldName="legalBasesOpen" fullWidth={true} />

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
};

export default ModalPolicy