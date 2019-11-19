import * as React from 'react'
import { Modal, ModalBody, ModalButton, ModalFooter, ModalHeader, ROLE, SIZE } from "baseui/modal";
import { Field, FieldArray, FieldProps, Form, Formik, FormikProps, } from "formik";
import { Block, BlockProps } from "baseui/block";
import { Input, SIZE as InputSIZE } from "baseui/input";
import { Label2 } from "baseui/typography";
import { StatefulSelect, Select, Value } from 'baseui/select';
import { Button, KIND, SIZE as ButtonSize } from "baseui/button";
import { Plus } from "baseui/icon";

import { ProcessFormValues } from "../../constants";
import CardLegalBasis from './CardLegalBasis'
import { ListName, codelist } from "../../codelist"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

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

const getParsedOptions = (codelist: any) => {
    if (!codelist) return []
    return Object.keys(codelist).reduce((acc: any, curr: any) => {
        return [...acc, { id: codelist[curr], code: curr }];
    }, []);
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
    const [value, setValue] = React.useState<Value>(department ? [{ id: department.description, code: department.code }] : []);

    return (
        <Field
            name="department"
            render={({ form }: FieldProps<ProcessFormValues>) => (
                <Select
                    options={getParsedOptions(codelist.getCodes(ListName.DEPARTMENT))}
                    labelKey="id"
                    valueKey="id"
                    onChange={({ value }) => {
                        setValue(value)
                        form.setFieldValue('department', value ? value[0].code : '')
                    }}
                    value={value}
                />
            )}
        />
    )

}

const FieldSubDepartment = (props: any) => {
    const { subDepartment } = props
    const [value, setValue] = React.useState<Value>(subDepartment ? [{ id: subDepartment.description, code: subDepartment.code }] : []);

    return (
        <Field
            name="subDepartment"
            render={({ form }: FieldProps<ProcessFormValues>) => (
                <Select
                    options={getParsedOptions(codelist.getCodes(ListName.SUB_DEPARTMENT))}
                    labelKey="id"
                    valueKey="id"
                    onChange={({ value }) => {
                        setValue(value)
                        form.setFieldValue('subDepartment', value ? value[0].code : '')
                    }}
                    value={value}
                />
            )}
        />
    )

}

const ListLegalBases = (props: any) => {
    console.log(props)
    const { legalBases } = props
    return (
        <ul>
            {legalBases.map((legalBase: any) => (
                <li>
                    <p>{legalBase.gdpr && (legalBase.gdpr.code + ":")} {legalBase.nationalLaw && legalBase.nationalLaw.code + ' '} {legalBase.description}</p>
                </li>
            ))}
        </ul>
    )
}

type ModalProcessProps = {
    onClose: Function;
    isOpen: boolean;
    isEdit?: boolean;
    initialValues: ProcessFormValues;
    submit: Function;
    errorOnCreate: any | undefined;
};

const ModalProcess = ({ submit, errorOnCreate, onClose, isOpen, isEdit, initialValues }: ModalProcessProps) => {
    const [showLegalBasisFields, setShowLegalbasesFields] = React.useState(false)

    const showSubDepartment = (department: any) => {
        if (!department) return false

        if (department.code === 'ØSA' || department.code === 'YTA' || department.code === 'ATA')
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
                                    Opprett nytt behandlingsrunnlag
                                </Block>
                            </ModalHeader>

                            <ModalBody>
                                <Block {...rowBlockProps}>
                                    {renderLabel('Navn')}
                                    <FieldName />
                                </Block>

                                <Block {...rowBlockProps}>
                                    {renderLabel('Avdeling')}
                                    <FieldDepartment department={formikBag.values.department} />
                                </Block>

                                {showSubDepartment(formikBag.values.department) && (
                                    <Block {...rowBlockProps}>
                                        {renderLabel('Linja (Ytre etat)')}
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
                                                Legg til nytt rettslig grunnlag
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
                                    <Button type="button" kind={KIND.minimal} onClick={() => onClose}>Avbryt</Button>
                                    <ModalButton type="submit">Lagre</ModalButton>
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