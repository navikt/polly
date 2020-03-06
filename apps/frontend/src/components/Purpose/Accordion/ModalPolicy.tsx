import * as React from "react";
import { KeyboardEvent, useState } from "react";
import { Modal, ModalBody, ModalButton, ModalFooter, ModalHeader, ROLE, SIZE } from "baseui/modal";
import { Field, FieldArray, FieldArrayRenderProps, FieldProps, Form, Formik, FormikProps, } from "formik";
import { Block, BlockProps } from "baseui/block";
import { Radio, RadioGroup } from "baseui/radio";
import { Plus } from "baseui/icon";
import { Select, TYPE } from 'baseui/select';

import CardLegalBasis from "./CardLegalBasis"
import { codelist, ListName } from "../../../service/Codelist";
import { Button, KIND, SIZE as ButtonSize } from "baseui/button";
import { LegalBasesStatus, LegalBasisFormValues, PolicyFormValues, PolicyInformationType } from "../../../constants"
import { ListLegalBases } from "../../common/LegalBasis"
import { useInfoTypeSearch } from "../../../api"
import { Error, ModalLabel } from "../../common/ModalSchema";
import { intl } from "../../../util"
import { DateModalFields } from "../DateModalFields"
import { hasSpecifiedDate } from "../../common/Durations"
import { policySchema } from "../../common/schema"
import { Tag, VARIANT } from "baseui/tag";
import { Docs } from "./TablePolicy"


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

const renderTagList = (list: string[], arrayHelpers: FieldArrayRenderProps) => {
    return (
        <React.Fragment>
            {list && list.length > 0
                ? list.map((item, index) => (
                    <React.Fragment key={index}>
                        {item ? (
                            <Tag
                                key={item}
                                variant={VARIANT.outlined}
                                onActionClick={() =>
                                    arrayHelpers.remove(index)
                                }
                            >
                                {item}
                            </Tag>
                        ) : null}
                    </React.Fragment>
                ))
                : null}
        </React.Fragment>
    );
}

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
                    noResultsMsg={intl.emptyTable}
                    type={TYPE.search}
                    options={props.informationTypes}
                    placeholder={intl.informationTypeSearch}
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
    title?: string
    isOpen: boolean
    isEdit: boolean
    initialValues: PolicyFormValues
    docs?: Docs
    errorOnCreate: any | undefined
    submit: (values: PolicyFormValues) => void
    onClose: () => void
};

const ModalPolicy = ({ submit, errorOnCreate, onClose, isOpen, initialValues, docs, title }: ModalPolicyProps) => {
    const [selectedLegalBasis, setSelectedLegalBasis] = React.useState<LegalBasisFormValues>();
    const [selectedLegalBasisIndex, setSelectedLegalBasisIndex] = React.useState<number>();
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
            closeable={false}
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
                                    <ModalLabel label={intl.informationType} />
                                    <FieldInformationType
                                        informationTypes={infoTypeSearchResult}
                                        searchInformationType={setInfoTypeSearch}
                                        value={infoTypeValue}
                                        setValue={setInfoTypeValue}
                                    />
                                </Block>
                                <Error fieldName="informationType" />

                                <Block {...rowBlockProps}>
                                    <ModalLabel label={intl.subjectCategories} />
                                    <FieldArray
                                        name="subjectCategories"
                                        render={arrayHelpers => (
                                            <Block width="100%">
                                                <Select
                                                    options={codelist.getParsedOptionsFilterOutSelected(ListName.SUBJECT_CATEGORY, formikBag.values.subjectCategories)}
                                                    maxDropdownHeight="300px"
                                                    onChange={({ option }) => {
                                                        arrayHelpers.push(option ? option.id : null);
                                                    }}
                                                    error={!!arrayHelpers.form.errors.sources && !!arrayHelpers.form.submitCount}
                                                />
                                                {renderTagList(codelist.getShortnames(ListName.SUBJECT_CATEGORY, formikBag.values.subjectCategories), arrayHelpers)}
                                            </Block>
                                        )}
                                    />
                                </Block>
                                <Error fieldName="subjectCategories" />

                              {!!formikBag.values.documentIds?.length && docs &&
                              <Block {...rowBlockProps}>
                                <ModalLabel label={intl.documents}/>
                                <FieldArray name="documentIds"
                                            render={arrayHelpers => (
                                              <Block width='100%'>{renderTagList(formikBag.values.documentIds.map(id => docs[id].name), arrayHelpers)}</Block>
                                            )}/>
                              </Block>
                              }

                                <DateModalFields showDates={hasSpecifiedDate(initialValues)} showLabels={true} rowBlockProps={rowBlockProps} />

                                <Block {...rowBlockProps}>
                                    <ModalLabel label={intl.legalBasesShort} />
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
                                                            hideCard={() => {
                                                              formikBag.setFieldValue('legalBasesOpen', false)
                                                              setSelectedLegalBasis(undefined)
                                                            }}
                                                            submit={values => {
                                                                if (!values) return;
                                                                if (selectedLegalBasis) {
                                                                    arrayHelpers.replace(selectedLegalBasisIndex!, values);
                                                                    setSelectedLegalBasis(undefined)
                                                                } else {
                                                                    arrayHelpers.push(values);
                                                                }
                                                                formikBag.setFieldValue('legalBasesOpen', false);
                                                            }} />
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
                                                                        onEdit={(index) => {
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
