
import * as React from "react";
import {
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    ModalButton,
    SIZE,
    ROLE
} from "baseui/modal";
import {
    Formik,
    FormikProps,
    Form,
    Field,
    FieldProps,
    FieldArray,
} from "formik";
import { BlockProps, Block } from "baseui/block";
import { Input, SIZE as InputSIZE } from "baseui/input";
import { Label2 } from "baseui/typography";
import { Radio, RadioGroup } from "baseui/radio";
import { Plus } from "baseui/icon";
import { StatefulSelect } from 'baseui/select';

import CardLegalBasis from './CardLegalBasis'
import { Button, SIZE as ButtonSize, KIND } from "baseui/button";

export interface PolicyFormValues {
    informationTypeName: string;
    subjectCategory: string;
    legalBasesInherited: boolean;
    legalBases: Array<any>;
}

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

const FieldInformationTypeName = () => (
    <Field
        name="informationTypeName"
        render={({ field }: FieldProps<PolicyFormValues>) => (
            <Input {...field} size={InputSIZE.default} autoFocus />
        )}
    />
)
const FieldSubjectCategory = (props: any) => (
    <Field
        name="subjectCategory"
        render={({ form }: FieldProps<PolicyFormValues>) => (
            <StatefulSelect
                options={getParsedOptions(props.codelist["SUBJECT_CATEGORY"])}
                labelKey="id"
                valueKey="id"
                onChange={event => form.setFieldValue('subjectCategory',
                    event.option ? event.option.code : '')}
            />
        )}
    />
)

const FieldLegalBasisInherited = (props: any) => {
    let { current, setCurrent } = props
    return (
        <Field
            name="legalBasesInherited"
            render={({ form }: FieldProps<PolicyFormValues>) => (
                <Block width="100%">
                    <RadioGroup
                        value={current}
                        align="vertical"
                        onChange={e => {
                            (e.target as HTMLInputElement).value === "Ja" ? (
                                form.setFieldValue("legalBasesInherited", true)
                            ) : form.setFieldValue("legalBasesInherited", false)
                            setCurrent((e.target as HTMLInputElement).value)
                        }}
                    >
                        <Radio value="Ja">Bruker behandlingens rettslig grunnlag</Radio>
                        <Radio value="Nei">Uavklart</Radio>
                        <Radio value="Annet">Har eget rettslig grunnlag</Radio>
                    </RadioGroup>
                </Block>

            )}
        />
    )
}

const ModalPolicy = (props: any) => {
    const [currentChecked, setCurrentChecked] = React.useState();
    const [showLegalbasesFields, setShowLegalbasesFields] = React.useState<boolean>(true);
    const { codelist, errorOnCreate, onClose } = props

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
                    initialValues={{ informationTypeName: '', subjectCategory: '', legalBasesInherited: false, legalBases: [] }}
                    onSubmit={(values) => props.createPolicySubmit(values)}
                    render={(formikBag: FormikProps<PolicyFormValues>) => (
                        <Form>
                            <ModalHeader>
                                <Block display="flex" justifyContent="center" marginBottom="2rem">
                                    Opprett behandlingsgrunnlag for opplysningstype
                                </Block>
                            </ModalHeader>

                            <ModalBody>
                                <Block {...rowBlockProps}>
                                    {renderLabel('Opplysningstype')}
                                    <FieldInformationTypeName />
                                </Block>
                                <Block {...rowBlockProps}>
                                    {renderLabel('Personkategorier')}
                                    <FieldSubjectCategory codelist={codelist} />
                                </Block>
                                <Block {...rowBlockProps}>
                                    {renderLabel('Rettslig grunnlag')}
                                    <FieldLegalBasisInherited
                                        formikBag={formikBag}
                                        current={currentChecked}
                                        setCurrent={setCurrentChecked} />
                                </Block>

                                {currentChecked === "Annet" && (
                                    <FieldArray
                                        name="legalBases"
                                        render={arrayHelpers => (
                                            <React.Fragment>
                                                {showLegalbasesFields ? (
                                                    <Block width="100%" marginTop="2rem">
                                                        <CardLegalBasis codelist={codelist} submit={(values: any) => {
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
                                                                    Legg til nytt rettslig grunnlag
                                                                </Button>

                                                                <ul>
                                                                    {formikBag.values.legalBases.map((legalBase: any) => (
                                                                        <li>
                                                                            <p>{legalBase.gdpr && (legalBase.gdpr + ":")} {legalBase.nationalLaw} {legalBase.description}</p>
                                                                        </li>
                                                                    ))}
                                                                </ul>
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
                                    <Button type="button" kind={KIND.minimal} onClick={() => props.onClose()}>Avbryt</Button>
                                    <ModalButton type="submit">Lagre</ModalButton>
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