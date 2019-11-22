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
import { Label2 } from "baseui/typography";
import { Radio, RadioGroup } from "baseui/radio";
import { Plus } from "baseui/icon";
import { Option, Select, StatefulSelect, TYPE, Value } from 'baseui/select';

import CardLegalBasis from './CardLegalBasis'
import { ListName, codelist } from "../../service/Codelist";
import { Button, SIZE as ButtonSize, KIND } from "baseui/button";
import { useDebouncedState } from "../../util/customHooks"
import { useEffect } from "react"
import axios from "axios"
import { PageResponse, InformationType } from "../../constants"
import { intl } from "../../util/intl"

const server_polly = process.env.REACT_APP_POLLY_ENDPOINT;

export interface PolicyFormValues {
    id?: string;
    process?: string;
    purposeCode?: string;
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

const renderLabel = (label: any | string) => (
    <Block width="30%" alignSelf="center">
        <Label2 marginBottom="8px" font="font300">{label.toString()}</Label2>
    </Block>
)

const FieldInformationTypeName = (props: {
    informationTypes: Option[],
    searchInformationType: (name: string) => void,
    value: Value | undefined,
    setValue: (v: Value) => void
}) => (
        <Field
            name="informationTypeName"
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
                        form.setFieldValue('informationTypeName', infoType.id)
                    }}
                />
            )}
        />
    )

const FieldSubjectCategory = (props: { value: string }) => {
    const [value, setValue] = React.useState<Value>(props.value ? [{ id: props.value, label: codelist.getShortname(ListName.SUBJECT_CATEGORY, props.value) }] : []);

    return (
        <Field
            name="subjectCategory"
            render={({ form }: FieldProps<PolicyFormValues>) => (
                <Select
                    options={codelist.getParsedOptions(ListName.SUBJECT_CATEGORY)}
                    onChange={({ value }) => {
                        setValue(value)
                        form.setFieldValue('subjectCategory', value.length > 0 ? value[0].id : null)
                    }}
                    value={value}
                />
            )}
        />

    )
}

const FieldLegalBasisInherited = (props: { current: any, setCurrent: Function }) => {
    return (
        <Field
            name="legalBasesInherited"
            render={({ form }: FieldProps<PolicyFormValues>) => (
                <Block width="100%">
                    <RadioGroup
                        value={props.current}
                        align="vertical"
                        onChange={e => {
                            (e.target as HTMLInputElement).value === "Ja" ? (
                                form.setFieldValue("legalBasesInherited", true)
                            ) : form.setFieldValue("legalBasesInherited", false)
                            props.setCurrent((e.target as HTMLInputElement).value)
                        }}
                    >
                        <Radio value="Ja">{intl.legalBasisProcess}</Radio>
                        <Radio value="Nei">{intl.legalBasisUndecided}</Radio>
                        <Radio value="Annet">{intl.legalBasisOwn}</Radio>
                    </RadioGroup>
                </Block>

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

const getInitialCheckedValue = (initialValues: PolicyFormValues) => {
    let { legalBasesInherited, legalBases } = initialValues
    if (legalBasesInherited) return 'Ja'
    else {
        if (!legalBases) return 'Nei'
        if (legalBases.length < 1) return 'Nei'
        return 'Annet'
    }
}
const setInitialShowLegalBasesValue = (initialValues: PolicyFormValues) => {
    const { legalBasesInherited, legalBases } = initialValues
    if (!legalBases) return false
    if (legalBasesInherited) return false

    return legalBases.length > 0 ? false : true
}

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
    const [currentChecked, setCurrentChecked] = React.useState(isEdit && getInitialCheckedValue(initialValues));
    const [showLegalbasesFields, setShowLegalbasesFields] = React.useState<boolean>(isEdit && setInitialShowLegalBasesValue(initialValues));

    const [infoTypeValue, setInfoTypeValue] = React.useState<Value>(isEdit ? ([{ id: initialValues.informationTypeName, label: initialValues.informationTypeName }]) : []);
    const [infoTypeSearch, setInfoTypeSearch] = useDebouncedState<string>('', 200);
    const [infoTypeSearchResult, setInfoTypeSearchResult] = React.useState<Option[]>([]);



    useEffect(() => {
        if (infoTypeSearch && infoTypeSearch.length > 2) {
            axios
                .get(`${server_polly}/informationtype/search/${infoTypeSearch}`)
                .then((res: { data: PageResponse<InformationType> }) => {
                    let options: Option[] = res.data.content.map((it: InformationType) => ({ id: it.name, label: it.name }))
                    return setInfoTypeSearchResult(options)
                })
        }

    }, [infoTypeSearch])

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
                    render={(formikBag: FormikProps<PolicyFormValues>) => (
                        <Form>
                            <ModalHeader>
                                <Block display="flex" justifyContent="center" marginBottom="2rem">
                                    {title}
                                </Block>
                            </ModalHeader>

                            <ModalBody>
                                <Block {...rowBlockProps}>
                                    {renderLabel(intl.informationType)}
                                    <FieldInformationTypeName
                                        informationTypes={infoTypeSearchResult}
                                        searchInformationType={setInfoTypeSearch}
                                        value={infoTypeValue}
                                        setValue={setInfoTypeValue}
                                    />
                                </Block>
                                <Block {...rowBlockProps}>
                                    {renderLabel(intl.subjectCategories)}
                                    <FieldSubjectCategory value={formikBag.values.subjectCategory} />
                                </Block>
                                <Block {...rowBlockProps}>
                                    {renderLabel(intl.legalBasisShort)}
                                    <FieldLegalBasisInherited
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
                                                        <CardLegalBasis submit={(values: any) => {
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
                                                                <ListLegalBases legalBases={formikBag.values.legalBases} />
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
                                    <Button type="button" kind={KIND.minimal} onClick={() => onClose()}>{intl.abort}</Button>
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