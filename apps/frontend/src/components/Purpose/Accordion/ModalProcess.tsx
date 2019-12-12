import * as React from 'react'
import {Modal, ModalBody, ModalButton, ModalFooter, ModalHeader, ROLE, SIZE} from "baseui/modal";
import {Field, FieldArray, FieldProps, Form, Formik, FormikProps,} from "formik";
import {Block, BlockProps} from "baseui/block";
import {Input, SIZE as InputSIZE} from "baseui/input";
import {Select, Value} from 'baseui/select';
import {Button, KIND, SIZE as ButtonSize} from "baseui/button";
import {Plus} from "baseui/icon";

import {ProcessFormValues} from "../../../constants";
import CardLegalBasis from './CardLegalBasis'
import {codelist, ListName} from "../../../service/Codelist"
import {intl} from "../../../util"
import { Error, ModalLabel } from "../../common/ModalSchema";
import { ListLegalBases} from "../../common/LegalBasis"
import { DateModalFields } from "../DateModalFields"
import { hasSpecifiedDate } from "../../common/Durations"
import { processSchema } from "../../common/schema"

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

const modalHeaderProps: BlockProps = {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '2rem'
}

const FieldName = () => (
    <Field
        name="name"
        render={({ field, form }: FieldProps<ProcessFormValues>) => (
            <Input {...field} type="input" size={InputSIZE.default} autoFocus error={!!form.errors.name && form.touched.name} />
        )}
    />
)

const FieldDepartment = (props: any) => {
    const { department } = props
    const [value, setValue] = React.useState<Value>(department ? [{ id: department, label: codelist.getShortname(ListName.DEPARTMENT, department) }] : []);

    return (
        <Field
            name="department"
            render={({ form }: FieldProps<ProcessFormValues>) => (
                <Select
                    options={codelist.getParsedOptions(ListName.DEPARTMENT)}
                    onChange={({ value }) => {
                        setValue(value)
                        form.setFieldValue('department', value.length > 0 ? value[0].id : undefined)
                    }}
                    value={value}
                />
            )}
        />
    )
}

const FieldSubDepartment = (props: any) => {
    const { subDepartment } = props
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
                        setValue(value)
                        form.setFieldValue('subDepartment', value.length > 0 ? value[0].id : undefined)
                    }}
                    value={value}
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

const ModalProcess = ({ submit, errorOnCreate, onClose, isOpen, isEdit, initialValues, title }: ModalProcessProps) => {
    const [showLegalBasisFields, setShowLegalbasesFields] = React.useState(false)

    const onCloseModal = () => {
        setShowLegalbasesFields(false)
        onClose()
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

                                <DateModalFields showDates={hasSpecifiedDate(initialValues)} showLabels={true} rowBlockBrops={rowBlockProps} />

                                <Block {...rowBlockProps}>
                                    <ModalLabel/>
                                    {!showLegalBasisFields && (
                                        <Block width="100%" marginBottom="1rem">
                                            <Button
                                                size={ButtonSize.compact}
                                                kind={KIND.minimal}
                                                onClick={() => setShowLegalbasesFields(true)}
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
                                            {showLegalBasisFields && (
                                                <Block width="100%">
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
                                            )}
                                            {!showLegalBasisFields && (
                                                <Block display="flex">
                                                    <ModalLabel />
                                                    <Block width="100%">
                                                        <ListLegalBases
                                                            legalBases={formikBag.values.legalBases}
                                                            onRemove={(index: any) => arrayHelpers.remove(index)}
                                                        />
                                                    </Block>
                                                </Block>
                                            )}
                                        </React.Fragment>
                                    )}
                                />

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
}

export default ModalProcess