import * as React from "react";
import { useEffect } from "react";
import { Field, FieldArray, FieldArrayRenderProps, FieldProps, Form, Formik, FormikActions, FormikProps } from "formik";
import { Label2 } from "baseui/typography";
import { Input } from "baseui/input";
import { Block, BlockProps } from "baseui/block";
import { FlexGrid, FlexGridItem } from "baseui/flex-grid";
import { Textarea } from "baseui/textarea";
import { Button, SHAPE } from "baseui/button";
import { Plus } from "baseui/icon";
import { Tag, VARIANT } from "baseui/tag";
import { Option, Select, TYPE, Value } from "baseui/select";
import axios from "axios"

import { codelist, ListName } from "../../service/Codelist";
import { InformationtypeFormValues, PageResponse, Term } from "../../constants";
import { useDebouncedState } from "../../util/customHooks"
import { KeyboardEvent } from "react"
import { intl } from "../../util/intl"

const server_polly = process.env.REACT_APP_POLLY_ENDPOINT;

const labelProps: BlockProps = {
    marginBottom: "8px",
    alignSelf: "center"
};

function renderTagList(
    list: string[],
    arrayHelpers: FieldArrayRenderProps
) {
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

type FormProps = {
    formInitialValues: InformationtypeFormValues;
    submit: Function;
    isEdit: Boolean;
};

const InformationtypeForm = ({
    formInitialValues,
    submit,
    isEdit
}: FormProps) => {
    const initialValueSensitivity = () => {
        if (!formInitialValues.sensitivity || !codelist.isLoaded()) return []
        return [{
            id: formInitialValues.sensitivity,
            label: codelist.getShortname(ListName.SENSITIVITY, formInitialValues.sensitivity)
        }]
    }
    const initialValueMaster = () => {
        if (!formInitialValues.navMaster || !codelist) return []
        return [{
            id: formInitialValues.navMaster,
            label: codelist.getShortname(ListName.SYSTEM, formInitialValues.navMaster)
        }]
    }
    const initialValueTerm = () => {
        if (!formInitialValues.term || !codelist) return []
        return [{
            id: formInitialValues.term,
            label: formInitialValues.term
        }]
    }
    const keywordsRef = React.useRef<HTMLInputElement>(null);

    const [termSearch, setTermSearch] = useDebouncedState<string>('', 200);
    const [termSearchResult, setTermSearchResult] = React.useState<Option[]>([]);

    const [sensitivityValue, setSensitivityValue] = React.useState<Option>(initialValueSensitivity());
    const [termValue, setTermValue] = React.useState<Option>(initialValueTerm());
    const [masterValue, setMasterValue] = React.useState<Option>(initialValueMaster());
    const [currentKeywordValue, setCurrentKeywordValue] = React.useState("");

    const getParsedOptions = (listName: ListName, values: string[]) => {
        if (!codelist) return [];

        let parsedOptions = codelist.getParsedOptions(listName)

        if (!values) {
            return parsedOptions
        } else {
            return parsedOptions.filter(option =>
                values.includes(option.id) ? null : option.id
            );
        }
    };

    useEffect(() => {
        if (termSearch && termSearch.length > 2) {
            axios
                .get(`${server_polly}/term/search/${termSearch}`)
                .then((res: { data: PageResponse<Term> }) => {
                    let options: Option[] = res.data.content.map((term: Term) => ({ id: term.name, label: term.name + ' - ' + term.description }))
                    return setTermSearchResult(options)
                })
        }
    }, [termSearch])

    const disableEnter = (e: KeyboardEvent) => {
        if (e.key === 'Enter') e.preventDefault()
    }
    const onAddKeyword = (arrayHelpers: FieldArrayRenderProps) => {
        arrayHelpers.push(currentKeywordValue);
        setCurrentKeywordValue("");
        if (keywordsRef && keywordsRef.current) {
            keywordsRef.current.focus();
        }
    }
    return (
        <React.Fragment>
            <Formik
                initialValues={formInitialValues}
                enableReinitialize
                onSubmit={(
                    values: InformationtypeFormValues,
                    actions: FormikActions<InformationtypeFormValues>
                ) => {
                    submit(values);
                    actions.setSubmitting(false);
                }}
                render={(formikBag: FormikProps<InformationtypeFormValues>) => (
                    <Form onKeyDown={disableEnter}>
                        <FlexGrid
                            flexGridColumnCount={2}
                            flexGridColumnGap="scale1000"
                            flexGridRowGap="scale1000"
                        >
                            <FlexGridItem>
                                <Field
                                    name="name"
                                    render={({ field }: FieldProps<InformationtypeFormValues>) => (
                                        <Block>
                                            <Block {...labelProps}>
                                                <Label2>{intl.name}</Label2>
                                            </Block>
                                            <Input
                                                {...field}
                                                placeholder={intl.nameWrite}
                                            />
                                        </Block>
                                    )}
                                />
                            </FlexGridItem>

                            <FlexGridItem>
                                <Field
                                    name="term"
                                    render={({ form }: FieldProps<InformationtypeFormValues>) => (
                                        <Block>
                                            <Block {...labelProps}>
                                                <Label2>{intl.term}</Label2>
                                            </Block>
                                            <Select
                                                maxDropdownHeight="350px"
                                                searchable={true}
                                                type={TYPE.search}
                                                options={termSearchResult}
                                                placeholder={intl.definitionWrite}
                                                value={termValue as Value}
                                                onInputChange={event => setTermSearch(event.currentTarget.value)}
                                                onChange={(params) => {
                                                    let term = params.value[0]
                                                    setTermValue(term)
                                                    form.setFieldValue('term', term.id)
                                                }}
                                            />
                                        </Block>
                                    )}
                                />
                            </FlexGridItem>

                            <FlexGridItem>
                                <Field
                                    name="sensitivity"
                                    render={({ form }: FieldProps<InformationtypeFormValues>) => (
                                        <Block>
                                            <Block {...labelProps}>
                                                <Label2>{intl.sensitivity}</Label2>
                                            </Block>

                                            <Select
                                                options={codelist.getParsedOptions(ListName.SENSITIVITY)}
                                                value={sensitivityValue as Value}
                                                placeholder={intl.sensitivitySelect}
                                                onChange={(params) => {
                                                    setSensitivityValue(params.value[0])
                                                    form.setFieldValue('sensitivity', params.value[0].id)
                                                }}
                                            />
                                        </Block>
                                    )}
                                />
                            </FlexGridItem>

                            <FlexGridItem>
                                <FieldArray
                                    name="categories"
                                    render={arrayHelpers => (
                                        <Block>
                                            <Block {...labelProps}>
                                                <Label2>{intl.categories}</Label2>
                                            </Block>
                                            <Select
                                                options={getParsedOptions(ListName.CATEGORY, formikBag.values.categories)}
                                                placeholder={intl.categoriesWrite}
                                                type={TYPE.search}
                                                openOnClick={false}
                                                maxDropdownHeight="300px"
                                                onChange={({ option }) => {
                                                    arrayHelpers.push(
                                                        option
                                                            ? option.id
                                                            : null
                                                    );
                                                }}
                                            />
                                            {renderTagList(codelist.getShortnames(ListName.CATEGORY, formikBag.values.categories), arrayHelpers)}
                                        </Block>
                                    )}
                                />
                            </FlexGridItem>

                            <FlexGridItem>
                                <FieldArray
                                    name="sources"
                                    render={arrayHelpers => (
                                        <Block>
                                            <Block {...labelProps}>
                                                <Label2>Kilder</Label2>
                                            </Block>
                                            <Select
                                                options={getParsedOptions(ListName.SOURCE, formikBag.values.sources)}
                                                placeholder={intl.sourcesWrite}
                                                type={TYPE.search}
                                                openOnClick={false}
                                                maxDropdownHeight="300px"
                                                onChange={({ option }) => {
                                                    arrayHelpers.push(option ? option.id : null);
                                                }}
                                            />
                                            {renderTagList(codelist.getShortnames(ListName.SOURCE, formikBag.values.sources), arrayHelpers)}
                                        </Block>
                                    )}
                                />
                            </FlexGridItem>

                            <FlexGridItem>
                                <FieldArray
                                    name="keywords"
                                    render={arrayHelpers => (
                                        <Block>
                                            <Block {...labelProps}>
                                                <Label2>{intl.keywords}</Label2>
                                            </Block>
                                            <Input
                                                type="text"
                                                placeholder={intl.keywordsWrite}
                                                value={currentKeywordValue}
                                                onChange={event =>
                                                    setCurrentKeywordValue(
                                                        event.currentTarget
                                                            .value
                                                    )
                                                }
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') onAddKeyword(arrayHelpers)
                                                }}
                                                inputRef={keywordsRef}
                                                overrides={{
                                                    After: () => (
                                                        <Button
                                                            type="button"
                                                            shape={SHAPE.square}
                                                            onClick={() => onAddKeyword(arrayHelpers)}
                                                        >
                                                            <Plus />
                                                        </Button>
                                                    )
                                                }}
                                            />
                                            {renderTagList(formikBag.values.keywords, arrayHelpers)}
                                        </Block>
                                    )}
                                />
                            </FlexGridItem>

                            <FlexGridItem>
                                <Field
                                    name="description"
                                    render={({
                                        field
                                    }: FieldProps<
                                        InformationtypeFormValues
                                    >) => (
                                            <Block>
                                                <Block {...labelProps}>
                                                    <Label2>{intl.description}</Label2>
                                                </Block>
                                                <Textarea
                                                    {...field}
                                                    placeholder={intl.descriptionWrite}
                                                    rows={5}
                                                />
                                            </Block>
                                        )}
                                />
                            </FlexGridItem>

                            <FlexGridItem>
                                <Field
                                    name="navMaster"
                                    render={({ form }: FieldProps<InformationtypeFormValues>) => (
                                        <Block marginBottom="1em">
                                            <Block {...labelProps}>
                                                <Label2>{intl.navMaster}</Label2>
                                            </Block>

                                            <Select
                                                options={codelist.getParsedOptions(ListName.SYSTEM)}
                                                value={masterValue as Value}
                                                placeholder={intl.navMasterSelect}
                                                onChange={(params: any) => {
                                                    setMasterValue(params.value[0])
                                                    form.setFieldValue('navMaster', params.value[0].id)
                                                }}
                                            />
                                        </Block>
                                    )}
                                />
                            </FlexGridItem>

                        </FlexGrid>

                        <Block display="flex" marginTop="2rem">
                            <Button
                                type="submit"
                                overrides={{
                                    BaseButton: {
                                        style: ({ $theme }) => {
                                            return {
                                                alignContent: "center",
                                                paddingRight: "4rem",
                                                paddingLeft: "4rem"
                                            };
                                        }
                                    }
                                }}

                            >
                                {intl.save}
                            </Button>
                            {isEdit && (
                                <Button
                                    type="button"
                                    kind="secondary"
                                    overrides={{
                                        BaseButton: {
                                            style: ({ $theme }) => {
                                                return {
                                                    alignContent: "center",
                                                    marginLeft: "1rem",
                                                    paddingRight: "4rem",
                                                    paddingLeft: "4rem"
                                                };
                                            }
                                        }
                                    }}
                                    onClick={() => window.history.back()}
                                >
                                    {intl.abort}
                                </Button>
                            )}
                        </Block>
                    </Form>
                )}
            />
        </React.Fragment>
    );
};

export default InformationtypeForm;
