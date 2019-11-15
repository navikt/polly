import * as React from 'react'
import { Modal, ModalBody, ModalButton, ModalFooter, ModalHeader, ROLE, SIZE } from "baseui/modal";
import { Field, FieldArray, FieldProps, Form, Formik, FormikProps, } from "formik";
import { Block, BlockProps } from "baseui/block";
import { Input, SIZE as InputSIZE } from "baseui/input";
import { Label2 } from "baseui/typography";
import { StatefulSelect } from 'baseui/select';
import { Button, KIND, SIZE as ButtonSize } from "baseui/button";
import { Plus } from "baseui/icon";

import { ProcessFormValues } from "../../constants";
import CardLegalBasis from './CardLegalBasis'
import { ListName, codelist } from "../../codelist"

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


const FieldDepartment = () => (
    <Field
        name="department"
        render={({ form }: FieldProps<ProcessFormValues>) => (
            <StatefulSelect
                options={getParsedOptions(codelist.getCodes(ListName.DEPARTMENT))}
                labelKey="id"
                valueKey="id"
                onChange={event => {
                    form.setFieldValue('department', event.option ? event.option.code : '')

                }}
            />
        )}
    />
)

const FieldSubDepartment = () => (
    <Field
        name="subDepartment"
        render={({ form }: FieldProps<ProcessFormValues>) => (
            <StatefulSelect
                options={getParsedOptions(codelist.getCodes(ListName.SUB_DEPARTMENT))}
                labelKey="id"
                valueKey="id"
                onChange={event => form.setFieldValue('subDepartment',
                    event.option ? event.option.code : '')}
            />
        )}
    />
)

const ListLegalBases = (props: any) => {
    const { legalBases } = props
    return (
        <ul>
            {legalBases.map((legalBase: any) => (
                <li>
                    <p>{legalBase.gdpr && (legalBase.gdpr + ":")} {legalBase.nationalLaw} {legalBase.description}</p>
                </li>
            ))}
        </ul>
    )
}

const ModalProcess = (props: any) => {
    const [showLegalBasisFields, setShowLegalbasesFields] = React.useState(false)
    const { submit, errorOnCreate } = props

    const showSubDepartment = (department: any) => {
        if (department === 'ØSA' || department === 'YTA' || department === 'ATA')
            return true
        else return false
    }

    return (
        <Modal
            {...props}
            closeable
            animate
            size={SIZE.auto}
            role={ROLE.dialog}
        >
            <Block {...modalBlockProps}>
                <Formik
                    initialValues={{ name: '', department: '', legalBases: [] }}
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
                                    <FieldDepartment />
                                </Block>

                                {showSubDepartment(formikBag.values.department) && (
                                    <Block {...rowBlockProps}>
                                        {renderLabel('Linja (Ytre etat)')}
                                        <FieldSubDepartment />
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
                                    <Button type="button" kind={KIND.minimal} onClick={() => props.onClose()}>Avbryt</Button>
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