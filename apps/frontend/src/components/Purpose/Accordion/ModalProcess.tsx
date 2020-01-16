import * as React from 'react'
import { useEffect } from 'react'
import { Modal, ModalBody, ModalButton, ModalFooter, ModalHeader, ROLE, SIZE } from "baseui/modal";
import { Field, FieldArray, FieldProps, Form, Formik, FormikProps, } from "formik";
import { Block, BlockProps } from "baseui/block";
import { Input, SIZE as InputSIZE } from "baseui/input";
import { Select, Value } from 'baseui/select';
import { Button, KIND, SIZE as ButtonSize } from "baseui/button";
import { Plus } from "baseui/icon";

import { ProcessFormValues } from "../../../constants";
import CardLegalBasis from './CardLegalBasis'
import { codelist, ListName } from "../../../service/Codelist"
import { intl } from "../../../util"
import { Error, ModalLabel } from "../../common/ModalSchema";
import { ListLegalBases } from "../../common/LegalBasis"
import { DateModalFields } from "../DateModalFields"
import { hasSpecifiedDate } from "../../common/Durations"
import { processSchema } from "../../common/schema"
import { getTeam, mapTeamToOption, useTeamSearch } from "../../../api/TeamApi"

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

const modalHeaderProps: BlockProps = {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '2rem'
};

const FieldName = () => (
    <Field
        name="name"
        render={({ field, form }: FieldProps<ProcessFormValues>) => (
            <Input {...field} type="input" size={InputSIZE.default} autoFocus error={!!form.errors.name && form.touched.name} />
        )}
    />
);

const FieldDepartment = (props: {department?: string}) => {
    const { department } = props;
    const [value, setValue] = React.useState<Value>(department ? [{ id: department, label: codelist.getShortname(ListName.DEPARTMENT, department) }] : []);

    return (
        <Field
            name="department"
            render={({ form }: FieldProps<ProcessFormValues>) => (
                <Select
                    options={codelist.getParsedOptions(ListName.DEPARTMENT)}
                    onChange={({ value }) => {
                        setValue(value);
                        form.setFieldValue('department', value.length > 0 ? value[0].id : undefined)
                    }}
                    value={value}
                />
            )}
        />
    )
};

const FieldSubDepartment = (props: {subDepartment?: string}) => {
    const { subDepartment } = props;
    const [value, setValue] = React.useState<Value>(subDepartment
        ? [{ id: subDepartment, label: codelist.getShortname(ListName.SUB_DEPARTMENT, subDepartment) }]
        : []);

    return (
        <Field
            name="subDepartment"
            render={({ form }: FieldProps<ProcessFormValues>) => (
                <Select
                    options={codelist.getParsedOptions(ListName.SUB_DEPARTMENT)}
                    onChange={({ value }) => {
                        setValue(value);
                        form.setFieldValue('subDepartment', value.length > 0 ? value[0].id : undefined)
                    }}
                    value={value}
                />
            )}
        />
    )

};

const FieldProductTeam = (props: {productTeam?: string}) => {
    const { productTeam } = props;
    const [value, setValue] = React.useState<Value>(productTeam ? [{ id: productTeam, label: productTeam }] : []);
    const [teamSearchResult, setTeamSearch, teamSearchLoading] = useTeamSearch();

    const initialValueTeam = async () => {
        if (!productTeam) return [];
        return [mapTeamToOption(await getTeam(productTeam))]
    };
    useEffect(() => {
        (async () => setValue(await initialValueTeam()))()
    }, [productTeam]);

    return (
        <Field
            name="department"
            render={({ form }: FieldProps<ProcessFormValues>) => (
                <Select
                    options={teamSearchResult}
                    onChange={({ value }) => {
                        setValue(value)
                        form.setFieldValue('productTeam', value.length > 0 ? value[0].id : undefined)
                    }}
                    onInputChange={event => setTeamSearch(event.currentTarget.value)}
                    value={value}
                    isLoading={teamSearchLoading}
                />
            )}
        />
    )
}

type ModalProcessProps = {
    title: string;
    isOpen: boolean;
    isEdit?: boolean;
    initialValues: ProcessFormValues;
    errorOnCreate: any | undefined;
    submit: (process: ProcessFormValues) => void;
    onClose: Function;
};

const ModalProcess = ({ submit, errorOnCreate, onClose, isOpen, initialValues, title }: ModalProcessProps) => {

    const [selectedLegalBasis, setSelectedLegalBasis] = React.useState();
    const [selectedLegalBasisIndex, setSelectedLegalBasisIndex] = React.useState();

    const onCloseModal = () => {
        onClose()
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
                    initialValues={initialValues}
                    onSubmit={(values) => submit(values)} validationSchema={processSchema()}
                    render={(formikBag: FormikProps<ProcessFormValues>) => (
                        <Form>
                            <ModalHeader>
                                <Block {...modalHeaderProps}>
                                    {title}
                                </Block>
                            </ModalHeader>

                            <ModalBody>
                                <Block {...rowBlockProps}>
                                    <ModalLabel label={intl.name}/>
                                    <FieldName />
                                </Block>
                                <Error fieldName="name" />

                                <Block {...rowBlockProps}>
                                    <ModalLabel label={intl.department}/>
                                    <FieldDepartment department={formikBag.values.department} />
                                </Block>

                                {codelist.showSubDepartment(formikBag.values.department) && (
                                    <Block {...rowBlockProps}>
                                        <ModalLabel label={intl.subDepartment}/>
                                        <FieldSubDepartment subDepartment={formikBag.values.subDepartment} />
                                    </Block>
                                )}

                                <Block {...rowBlockProps}>
                                    <ModalLabel label={intl.productTeam}/>
                                    <FieldProductTeam productTeam={formikBag.values.productTeam} />
                                </Block>

                                <DateModalFields showDates={hasSpecifiedDate(initialValues)} showLabels={true} rowBlockProps={rowBlockProps} />

                                <Block {...rowBlockProps}>
                                    <ModalLabel/>
                                    {!formikBag.values.legalBasesOpen && (
                                        <Block width="100%" marginBottom="1rem">
                                            <Button
                                                size={ButtonSize.compact}
                                                kind={KIND.minimal}
                                                onClick={() => formikBag.setFieldValue('legalBasesOpen', true)}
                                                startEnhancer={() => <Block display="flex" justifyContent="center"><Plus size={22} /></Block>}
                                            >
                                                {intl.legalBasisAdd}
                                            </Button>
                                        </Block>
                                    )}
                                </Block>

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
                                                                arrayHelpers.replace(selectedLegalBasisIndex, values)
                                                                setSelectedLegalBasis(null)
                                                            } else {
                                                                arrayHelpers.push(values)
                                                            }
                                                            formikBag.setFieldValue('legalBasesOpen', false)
                                                        }}/>
                                                </Block>
                                            ) : (
                                                <Block display="flex">
                                                    <ModalLabel/>
                                                    <Block width="100%">
                                                        <ListLegalBases
                                                            legalBases={formikBag.values.legalBases}
                                                            onRemove={(index) => arrayHelpers.remove(index)}
                                                            onEdit={
                                                                (index)=> {
                                                                    setSelectedLegalBasis(formikBag.values.legalBases[index]);
                                                                    setSelectedLegalBasisIndex(index);
                                                                    formikBag.setFieldValue('legalBasesOpen', true)}
                                                            }
                                                        />
                                                    </Block>
                                                </Block>
                                            )}
                                        </React.Fragment>
                                    )}
                                />
                                <Error fieldName="legalBasesOpen" fullWidth={true} />

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
    )
};

export default ModalProcess