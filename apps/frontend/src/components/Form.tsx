import * as React from "react";
import {
    Formik,
    FormikActions,
    FormikProps,
    Form,
    Field,
    FieldProps,
    FieldArray,
    FieldArrayRenderProps
} from "formik";
import { FormControl } from "baseui/form-control";
import { Input, SIZE } from "baseui/input";
import { BlockProps, Block } from "baseui/block";
import { FlexGrid, FlexGridItem } from "baseui/flex-grid";
import { Textarea } from "baseui/textarea";
import { Button, SHAPE, KIND as ButtonKind } from "baseui/button";
import { Plus } from "baseui/icon";
import { Tag, KIND, VARIANT } from "baseui/tag";
import { Select, TYPE, Value } from "baseui/select";
import { Label1 } from "baseui/typography";

import { DatasetFormValues, Codelist } from "../constants";

type FormProps = {
    formInitialValues: DatasetFormValues | any;
    submit: Function;
    isEdit?: boolean;
    codelist: {
        CATEGORY: any;
        PURPOSE: any;
        PROVENANCE: any;
    };
};

const rowBlockProps: BlockProps = {
    display: "flex"
};
const itemProps: BlockProps = {
    overrides: {
        Block: {
            style: ({ $theme }) => ({
                width: `calc((100% - ${$theme.sizing.scale800}) / 3)`,
                marginBottom: "2rem"
            })
        }
    }
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
                                  kind={KIND.primary}
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

const DatasetForm = ({
    formInitialValues,
    submit,
    isEdit,
    codelist
}: FormProps) => {
    const [value, setValue] = React.useState<Value>([]);
    const [currentProvenanceValue, setCurrentProvenanceValue] = React.useState(
        []
    );
    const [currentKeywordValue, setCurrentKeywordValue] = React.useState("");

    const getParsedOptions = (
        codelist: object | undefined | null,
        provenances: any | undefined
    ) => {
        if (!codelist) return [];

        let parsedOptions = Object.keys(codelist).reduce(
            (acc: any, curr: any) => {
                return [...acc, { id: curr }];
            },
            []
        );

        return parsedOptions.filter(option =>
            provenances.includes(option.id) ? null : option.id
        );
    };

    return (
        <React.Fragment>
            <Formik
                initialValues={formInitialValues}
                enableReinitialize
                onSubmit={(
                    values: DatasetFormValues,
                    actions: FormikActions<DatasetFormValues>
                ) => {
                    submit(values);
                    alert(JSON.stringify(values, null, 2));
                    actions.setSubmitting(false);
                }}
                render={(formikBag: FormikProps<DatasetFormValues>) => (
                    <Form>
                        <Block
                            display="flex"
                            justifyContent="space-between"
                            alignContent="center"
                        >
                            {!isEdit ? <h1>Opprett</h1> : <h1>Rediger</h1>}
                        </Block>
                        <FlexGrid
                            flexGridColumnCount={3}
                            flexGridColumnGap="scale1200"
                            flexGridRowGap="scale1600"
                        >
                            <FlexGridItem>
                                <Field
                                    name="title"
                                    render={({
                                        field,
                                        form
                                    }: FieldProps<DatasetFormValues>) => (
                                        <FormControl label="Title">
                                            <Input {...field} />
                                        </FormControl>
                                    )}
                                />
                            </FlexGridItem>
                            <FlexGridItem>
                                <Field
                                    name="contentType"
                                    render={({
                                        field,
                                        form
                                    }: FieldProps<DatasetFormValues>) => (
                                        <FormControl label="Type">
                                            <Input {...field} />
                                        </FormControl>
                                    )}
                                />
                            </FlexGridItem>
                            <FlexGridItem>
                                <Field
                                    name="pi"
                                    render={({
                                        field,
                                        form
                                    }: FieldProps<DatasetFormValues>) => (
                                        <FormControl label="PI">
                                            <Input {...field} />
                                        </FormControl>
                                    )}
                                />
                            </FlexGridItem>

                            <FlexGridItem {...itemProps}>
                                <FieldArray
                                    name="categories"
                                    render={arrayHelpers => (
                                        <Block>
                                            <Block>
                                                <Label1 marginBottom="8px">
                                                    Categories
                                                </Label1>
                                                <Select
                                                    options={getParsedOptions(
                                                        codelist.CATEGORY,
                                                        formikBag.values
                                                            .categories
                                                    )}
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
                                            </Block>
                                            {renderTagList(
                                                formikBag.values.categories,
                                                arrayHelpers
                                            )}
                                        </Block>
                                    )}
                                />
                            </FlexGridItem>
                            <FlexGridItem display="none" />
                            <FlexGridItem {...itemProps}>
                                <FieldArray
                                    name="provenances"
                                    render={arrayHelpers => (
                                        <Block>
                                            <Block>
                                                <Label1 marginBottom="8px">
                                                    Provenances
                                                </Label1>
                                                <Select
                                                    options={getParsedOptions(
                                                        codelist.PROVENANCE,
                                                        formikBag.values
                                                            .provenances
                                                    )}
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
                                                    value={
                                                        currentProvenanceValue
                                                    }
                                                />
                                            </Block>
                                            {renderTagList(
                                                formikBag.values.provenances,
                                                arrayHelpers
                                            )}
                                        </Block>
                                    )}
                                />
                            </FlexGridItem>

                            <FlexGridItem {...itemProps}>
                                <FieldArray
                                    name="keywords"
                                    render={arrayHelpers => (
                                        <Block>
                                            <Label1 marginBottom="8px">
                                                Keywords
                                            </Label1>
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
                                                size="compact"
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
                            <FlexGridItem display="none" />
                            <FlexGridItem {...itemProps}>
                                <Field
                                    name="description"
                                    render={({
                                        field,
                                        form
                                    }: FieldProps<DatasetFormValues>) => (
                                        <Block>
                                            <Label1 marginBottom="8px">
                                                Beskrivelse
                                            </Label1>
                                            <Textarea
                                                {...field}
                                                placeholder="Legg inn beskrivelse av datasettet"
                                                rows={6}
                                            />
                                        </Block>
                                    )}
                                />
                            </FlexGridItem>
                        </FlexGrid>

                        <Block
                            marginTop="2rem"
                            width="100%"
                            display="flex"
                            justifyContent="flex-end"
                        >
                            <Button
                                type="submit"
                                overrides={{
                                    BaseButton: {
                                        style: ({ $theme }) => {
                                            return {
                                                alignContent: "center",
                                                paddingRight: "3rem",
                                                paddingLeft: "3rem"
                                            };
                                        }
                                    }
                                }}
                            >
                                Lagre Endringer
                            </Button>
                        </Block>
                    </Form>
                )}
            />
        </React.Fragment>
    );
};

export default DatasetForm;
