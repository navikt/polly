import * as React from 'react'
import { DisclosureFormValues, PolicyInformationType } from '../../constants';
import { Modal, SIZE, ROLE, ModalHeader, ModalBody, ModalFooter, ModalButton } from 'baseui/modal';
import { Formik, FormikProps, Form, Field, FieldProps, FieldArrayRenderProps, FieldArray } from 'formik';
import { Block, BlockProps } from 'baseui/block';
import { ModalLabel } from '../common/ModalSchema';
import { intl } from '../../util';
import { Button } from 'baseui/button';
import { Value, Select, StatefulSelect } from 'baseui/select';
import { codelist, ListName } from '../../service/Codelist';
import { Textarea } from 'baseui/textarea';
import { VARIANT, Tag } from 'baseui/tag';
import { useInfoTypeSearch } from '../../api';
import { ListLegalBases } from '../common/LegalBasis';
import CardLegalBasis from '../Purpose/Accordion/CardLegalBasis';
import { Plus } from 'baseui/icon';

const modalBlockProps: BlockProps = {
    width: '750px',
    paddingRight: '2rem',
    paddingLeft: '2rem'
};

const modalHeaderProps: BlockProps = {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '2rem'
};

const rowBlockProps: BlockProps = {
    display: 'flex',
    width: '100%',
    marginTop: '1rem'
};

function renderTagList(list: string[], arrayHelpers: FieldArrayRenderProps) {
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

const FieldRecipient = (props: { value?: string, disabled: boolean | undefined }) => {
    const [recipientValue, setRecipientValue] = React.useState<Value>(props.value ? [{ id: props.value, label: codelist.getShortname(ListName.THIRD_PARTY, props.value) }] : []);

    return (
        <Field
            name="recipient"
            render={({ form }: FieldProps<DisclosureFormValues>) => (
                <Select
                    autoFocus
                    options={codelist.getParsedOptions(ListName.THIRD_PARTY)}
                    onChange={({ value }) => {
                        setRecipientValue(value)
                        form.setFieldValue('recipient', value.length > 0 ? value[0].id : undefined)
                    }}
                    value={recipientValue}
                    disabled={props.disabled}
                />
            )}
        />
    )
}

const FieldDescription = () => {
    return (
        <Field
            name="description"
            render={({ field, form }: FieldProps<DisclosureFormValues>) => (
                <Textarea
                    {...field}
                    placeholder={intl.descriptionWrite}
                    rows={4}
                    onKeyDown={e => {
                        if (e.key === 'Enter') form.setFieldValue('description', form.values.description + '\n')
                    }}
                />
            )}
        />
    )
}

const FieldInformationType = (props: {
    informationTypes: PolicyInformationType[],
    searchInformationType: (name: string) => void,
    tagValues: PolicyInformationType[]
}) => (
        <React.Fragment>
            <FieldArray
                name="informationTypes"
                render={arrayHelpers => (
                    <Block width="100%">
                        <StatefulSelect
                            maxDropdownHeight="400px"
                            searchable={true}
                            type="search"
                            options={props.informationTypes}
                            placeholder="Søk opplysningstyper"
                            onInputChange={event => props.searchInformationType(event.currentTarget.value)}
                            onChange={(params) => {
                                let infoType = params.value[0] as PolicyInformationType
                                arrayHelpers.push(infoType)
                            }}
                            filterOptions={options => options}
                            labelKey="name"
                        />
                        {props.tagValues.length > 0 && (
                            <React.Fragment>
                                {renderTagList(props.tagValues.map(infoType => infoType && infoType.name), arrayHelpers)}
                            </React.Fragment>
                        )}
                    </Block>
                )}
            />
        </React.Fragment>
    )

type ModalThirdPartyProps = {
    title?: string;
    isOpen: boolean;
    isEdit: boolean;
    disableRecipientField?: boolean | undefined;
    initialValues: DisclosureFormValues;
    errorOnCreate: any | undefined;
    submit: (values: DisclosureFormValues) => void;
    onClose: () => void;
};

const ModalThirdParty = (props: ModalThirdPartyProps) => {
    const [infoTypeSearchResult, setInfoTypeSearch] = useInfoTypeSearch()
    const [showLegalBasisFields, setShowLegalbasesFields] = React.useState(false)
    const [selectedLegalBasis, setSelectedLegalBasis] = React.useState();
    const [selectedLegalBasisIndex, setSelectedLegalBasisIndex] = React.useState();
    const { submit, errorOnCreate, onClose, isOpen, isEdit, disableRecipientField, initialValues, title } = props

    return (
        <Modal
            onClose={onClose}
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
                    render={(formikBag: FormikProps<DisclosureFormValues>) => (
                        <Form>
                            <ModalHeader>
                                <Block {...modalHeaderProps}>
                                    {title}
                                </Block>
                            </ModalHeader>

                            <ModalBody>
                                <Block {...rowBlockProps}>
                                    <ModalLabel label={intl.name} />
                                    <FieldRecipient value={formikBag.values.recipient} disabled={disableRecipientField}/>
                                </Block>

                                <Block {...rowBlockProps}>
                                    <ModalLabel label={intl.description} />
                                    <FieldDescription />
                                </Block>

                                <Block {...rowBlockProps}>
                                    <ModalLabel label={intl.informationTypes} />
                                    <FieldInformationType
                                        informationTypes={infoTypeSearchResult}
                                        searchInformationType={setInfoTypeSearch}
                                        tagValues={formikBag.values.informationTypes}
                                    />
                                </Block>

                                <Block {...rowBlockProps}>
                                    <ModalLabel />
                                    {!showLegalBasisFields && (
                                        <Block width="100%" marginBottom="1rem">
                                            <Button
                                                size="compact"
                                                kind="minimal"
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
                                                    {selectedLegalBasis ? (
                                                        <CardLegalBasis
                                                            titleSubmitButton={intl.update}
                                                            initValue={selectedLegalBasis}
                                                            hideCard={() => setShowLegalbasesFields(false)}
                                                            submit={(selectedPolicyBasisValues) => {
                                                                if (!selectedPolicyBasisValues) return;
                                                                arrayHelpers.replace(selectedLegalBasisIndex, selectedPolicyBasisValues);
                                                                setShowLegalbasesFields(false);
                                                                setSelectedLegalBasis(null)
                                                            }} />
                                                    ) : (
                                                            <CardLegalBasis
                                                                initValue={{}}
                                                                hideCard={() => setShowLegalbasesFields(false)}
                                                                titleSubmitButton={intl.legalBasisAdd}
                                                                submit={(values) => {
                                                                    if (!values) return
                                                                    else {
                                                                        arrayHelpers.push(values)
                                                                        setShowLegalbasesFields(false)
                                                                    }
                                                                }} />
                                                        )} 
                                                </Block>
                                            )}
                                            {!showLegalBasisFields && (
                                                <Block display="flex">
                                                    <ModalLabel />
                                                    <Block width="100%">
                                                        <ListLegalBases
                                                            legalBases={formikBag.values.legalBases}
                                                            onRemove={(index) => arrayHelpers.remove(index)}
                                                            onEdit={(index) => {
                                                                setSelectedLegalBasis(formikBag.values.legalBases[index]);
                                                                setSelectedLegalBasisIndex(index);
                                                                setShowLegalbasesFields(true)
                                                            }}
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
                                    <Button type="button" kind="minimal" onClick={() => onClose()}>{intl.abort}</Button>
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

export default ModalThirdParty