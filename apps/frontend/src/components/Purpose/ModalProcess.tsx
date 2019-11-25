import * as React from 'react'
import { Modal, ModalBody, ModalButton, ModalFooter, ModalHeader, ROLE, SIZE } from "baseui/modal";
import { Field, FieldArray, FieldProps, Form, Formik, FormikProps, } from "formik";
import { Block, BlockProps } from "baseui/block";
import { Input, SIZE as InputSIZE } from "baseui/input";
import { Label2 } from "baseui/typography";
import { Select, Value } from 'baseui/select';
import { Button, KIND, SIZE as ButtonSize } from "baseui/button";
import { Plus } from "baseui/icon";

import { ProcessFormValues } from "../../constants";
import CardLegalBasis from './CardLegalBasis'
import { ListName, codelist } from "../../service/Codelist"
import { intl } from "../../util/intl/intl"

const modalBlockProps: BlockProps = {
    width: '700px',
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

const renderLabel = (label: any | string) => (
    <Block width="30%" alignSelf="center">
        <Label2 marginBottom="8px" font="font300">{label.toString()}</Label2>
    </Block>
)

const FieldName = () => (
    <Field
        name="name"
        render={({ field }: FieldProps<ProcessFormValues>) => (
            <Input {...field} type="input" size={InputSIZE.default} autoFocus />
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
                        form.setFieldValue('department', value.length > 0 ? value[0].id : '')
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
                        form.setFieldValue('subDepartment', value.length > 0 ? value[0].id : '')
                    }}
                    value={value}
                />
            )}
        />
    )

}

const ListLegalBases = (props: any) => {
    const { legalBases } = props
    if (!legalBases) return null

    return (
        <ul>
            {legalBases.map((legalBase: any) => (
                <li>
                    <p> {legalBase.gdpr && codelist.getShortname(ListName.GDPR_ARTICLE, legalBase.gdpr) + ": "}
                        {legalBase.nationalLaw && codelist.getShortname(ListName.NATIONAL_LAW, legalBase.nationalLaw) + ' '}
                        {legalBase.description}
                    </p>
                </li>
            ))}
        </ul>
    )
}

type ModalProcessProps = {
    title: string;
    isOpen: boolean;
    isEdit?: boolean;
    initialValues: ProcessFormValues;
    errorOnCreate: any | undefined;
    submit: Function;
    onClose: Function;
};

const ModalProcess = ({ submit, errorOnCreate, onClose, isOpen, isEdit, initialValues, title }: ModalProcessProps) => {
    const [showLegalBasisFields, setShowLegalbasesFields] = React.useState(false)

    const showSubDepartment = (department: any) => {
        if (!department) return false

      // todo make enum in constants etc
        if (department === 'ØSA' || department === 'YTA' || department === 'ATA')
            return true
        else return false
    }

    return (
        <Modal
            onClose={() => onClose()}
            isOpen={isOpen}
            closeable
            animate
            size={SIZE.auto}
            role={ROLE.dialog}
        >
            <Block {...modalBlockProps}>
                <Formik
                    initialValues={initialValues}
                    onSubmit={(values) => submit(values)}
                    render={(formikBag: FormikProps<ProcessFormValues>) => (
                        <Form>
                            <ModalHeader>
                                <Block {...modalHeaderProps}>
                                    {title}
                                </Block>
                            </ModalHeader>

                            <ModalBody>
                                <Block {...rowBlockProps}>
                                    {renderLabel(intl.name)}
                                    <FieldName />
                                </Block>

                                <Block {...rowBlockProps}>
                                    {renderLabel(intl.department)}
                                    <FieldDepartment department={formikBag.values.department} />
                                </Block>

                                {showSubDepartment(formikBag.values.department) && (
                                    <Block {...rowBlockProps}>
                                        {renderLabel(intl.subDepartment)}
                                        <FieldSubDepartment subDepartment={formikBag.values.subDepartment} />
                                    </Block>
                                )}


                                <Block {...rowBlockProps}>
                                    {renderLabel('')}
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

                                {showLegalBasisFields && (
                                    <FieldArray
                                        name="legalBases"
                                        render={arrayHelpers => (
                                            <Block width="100%">
                                                <CardLegalBasis submit={(values: any) => {
                                                    if (!values) return
                                                    else {
                                                        arrayHelpers.push(values)
                                                        setShowLegalbasesFields(false)
                                                    }
                                                }} />
                                            </Block>
                                        )}
                                    />
                                )}

                                {!showLegalBasisFields && (
                                    <Block display="flex">
                                        {renderLabel('')}
                                        <Block width="100%">
                                            <ListLegalBases legalBases={formikBag.values.legalBases} />
                                        </Block>
                                    </Block>
                                )}
                            </ModalBody>

                            <ModalFooter>
                                <Block display="flex" justifyContent="flex-end">
                                    <Block alignSelf="flex-end">{errorOnCreate && <p>{errorOnCreate}</p>}</Block>
                                    <Button type="button" kind={KIND.minimal} onClick={() => onClose()}>{intl.abort}</Button>
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