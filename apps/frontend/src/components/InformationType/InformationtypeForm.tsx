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
import { Radio, RadioGroup } from "baseui/radio";
import axios from "axios"

import { codelist, ListName, ICodelist } from "../../codelist";
import { InformationtypeFormValues, PageResponse, Term } from "../../constants";
import { useDebouncedState } from "../../util/debounce"

const server_polly = process.env.REACT_APP_POLLY_ENDPOINT;

const labelProps: BlockProps = {
    marginBottom: "8px",
    alignSelf: "center"
};

function renderTagList(
    list: any[] | null,
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
    formInitialValues: InformationtypeFormValues | any;
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
            id: codelist.getDescription(ListName.SENSITIVITY, formInitialValues.sensitivity),
            code: formInitialValues.sensitivity
        }]
    }
    const initialValueMaster = () => {
        if (!formInitialValues.navMaster || !codelist) return []
        return [{
            id: codelist.getDescription(ListName.SYSTEM, formInitialValues.navMaster),
            code: formInitialValues.navMaster
        }]
    }
    const initialValueTerm = () => {
        if (!formInitialValues.term || !codelist) return []
        return [{
            id: formInitialValues.term,
            label: formInitialValues.term
        }]
    }

    const [termSearch, setTermSearch] = useDebouncedState<string>('', 200);
    const [termSearchResult, setTermSearchResult] = React.useState<Option[]>([]);

    const [value, setValue] = React.useState<Value>([]);
    const [sensitivityValue, setSensitivityValue] = React.useState<Value>(initialValueSensitivity());
    const [termValue, setTermValue] = React.useState<Value>(initialValueTerm());
    const [masterValue, setMasterValue] = React.useState<Value>(initialValueMaster());
    const [currentKeywordValue, setCurrentKeywordValue] = React.useState("");

    const getParsedOptions = (codelist: ICodelist | undefined | null, values: any | undefined) => {
        if (!codelist) return [];

        let parsedOptions = Object.keys(codelist).reduce(
            (acc: any, curr: any) => {
                return [...acc, { id: curr }];
            }, []);

        if (!values) {
            return parsedOptions
        } else {
            return parsedOptions.filter(option =>
                values.includes(option.id) ? null : option.id
            );
        }
    };

    const getParsedOptionsSensitivity = (codelist: ICodelist | null) => {
        if (!codelist) return []
        return Object.keys(codelist).reduce((acc: any, curr: any) => {
            return [...acc, { id: codelist[curr], code: curr }];
        }, []);
    }

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
                    <Form>
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
                                                <Label2>Navn</Label2>
                                            </Block>
                                            <Input
                                                {...field}
                                                placeholder="Skriv inn navn"
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
                                                <Label2>Begrep</Label2>
                                            </Block>
                                            <Select
                                                maxDropdownHeight="350px"
                                                searchable={true}
                                                type={TYPE.search}
                                                options={termSearchResult}
                                                placeholder="Skriv inn et begrep"
                                                value={termValue}
                                                onInputChange={event => setTermSearch(event.currentTarget.value)}
                                                onChange={(params: any) => {
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
                                                <Label2>Type personopplysning</Label2>
                                            </Block>

                                            <Select
                                                options={getParsedOptionsSensitivity(codelist.getCodes(ListName.SENSITIVITY))}
                                                labelKey="id"
                                                valueKey="id"
                                                value={sensitivityValue}
                                                placeholder="Velg sensitivitet"
                                                onChange={(params: any) => {
                                                    setSensitivityValue(params.value[0])
                                                    form.setFieldValue('sensitivity', params.value[0].code)
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
                                                <Label2>Kategorier</Label2>
                                            </Block>
                                            <Select
                                                options={getParsedOptions(codelist.getCodes(ListName.CATEGORY), formikBag.values.categories)}
                                                placeholder="Skriv inn og legg til kategorier"
                                                type={TYPE.search}
                                                labelKey="id"
                                                valueKey="id"
                                                openOnClick={false}
                                                maxDropdownHeight="300px"
                                                onChange={({ option }) => {
                                                    arrayHelpers.push(
                                                        option
                                                            ? option.id
                                                            : null
                                                    );
                                                }}
                                                value={value}
                                            />
                                            {renderTagList(
                                                formikBag.values.categories,
                                                arrayHelpers
                                            )}
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
                                                options={getParsedOptions(codelist.getCodes(ListName.SOURCE), formikBag.values.sources)}
                                                placeholder="Skriv inn og legg til kilder"
                                                type={TYPE.search}
                                                labelKey="id"
                                                valueKey="id"
                                                openOnClick={false}
                                                maxDropdownHeight="300px"
                                                onChange={({ option }) => {
                                                    arrayHelpers.push(option ? option.id : null);
                                                }}
                                                value={value}
                                            />
                                            {renderTagList(formikBag.values.sources, arrayHelpers)}
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
                                                <Label2>Nøkkelord</Label2>
                                            </Block>
                                            <Input
                                                type="text"
                                                placeholder="Legg til nøkkelord"
                                                value={currentKeywordValue}
                                                onChange={event =>
                                                    setCurrentKeywordValue(
                                                        event.currentTarget
                                                            .value
                                                    )
                                                }
                                                overrides={{
                                                    After: () => (
                                                        <Button
                                                            type="button"
                                                            shape={SHAPE.square}
                                                            onClick={() =>
                                                                arrayHelpers.push(
                                                                    currentKeywordValue
                                                                )
                                                            }
                                                        >
                                                            <Plus />
                                                        </Button>
                                                    )
                                                }}
                                            />
                                            {renderTagList(
                                                formikBag.values.keywords,
                                                arrayHelpers
                                            )}
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
                                                    <Label2>Beskrivelse</Label2>
                                                </Block>
                                                <Textarea
                                                    {...field}
                                                    placeholder="Skriv inn beskrivelse av opplysningtypen"
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
                                                <Label2>Master</Label2>
                                            </Block>

                                            <Select
                                                options={getParsedOptionsSensitivity(codelist.getCodes(ListName.SYSTEM))}
                                                labelKey="id"
                                                valueKey="id"
                                                value={masterValue}
                                                placeholder="Velg master"
                                                onChange={(params: any) => {
                                                    setMasterValue(params.value[0])
                                                    form.setFieldValue('navMaster', params.value[0].code)
                                                }}
                                            />
                                        </Block>
                                    )}
                                />

                                <Field
                                    name="pii"
                                    render={({
                                        field,
                                        form
                                    }: FieldProps<
                                        InformationtypeFormValues
                                    >) => (
                                            <Block>
                                                <Block {...labelProps}>
                                                    <Label2>
                                                        Personopplysning
                                                </Label2>
                                                </Block>

                                                <RadioGroup
                                                    value={formikBag.values.pii ? "Ja" : "Nei"}
                                                    align="horizontal"
                                                    onChange={e =>
                                                        (e.target as HTMLInputElement).value === "Ja"
                                                            ? form.setFieldValue("pii", true)
                                                            : form.setFieldValue("pii", false)
                                                    }
                                                >
                                                    <Radio value="Ja">Ja</Radio>
                                                    <Block marginLeft="1rem"></Block>
                                                    <Radio value="Nei">Nei</Radio>
                                                </RadioGroup>
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
                                Lagre
                            </Button>
                        </Block>
                    </Form>
                )}
            />
        </React.Fragment>
    );
};

export default InformationtypeForm;
