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
import { Label2 } from "baseui/typography";
import { Input } from "baseui/input";
import { BlockProps, Block } from "baseui/block";
import { FlexGrid, FlexGridItem } from "baseui/flex-grid";
import { Textarea } from "baseui/textarea";
import { Button, SHAPE, KIND as ButtonKind } from "baseui/button";
import { Plus } from "baseui/icon";
import { Tag, VARIANT } from "baseui/tag";
import { Select, TYPE, Value } from "baseui/select";
import { Radio, RadioGroup } from "baseui/radio";

import { InformationtypeFormValues } from "../../constants";

const labelProps: BlockProps = {
    marginBottom: "8px",
    width: "20%",
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
    codelist: {
        CATEGORY: any;
        PURPOSE: any;
        PROVENANCE: any;
    };
};

const InformationtypeForm = ({
    formInitialValues,
    submit,
    isEdit,
    codelist
}: FormProps) => {
    const [value, setValue] = React.useState<Value>([]);
    const [currentKeywordValue, setCurrentKeywordValue] = React.useState("");

    const getParsedOptions = (
        codelist: object | undefined | null,
        values: any | undefined
    ) => {
        if (!codelist) return [];

        let parsedOptions = Object.keys(codelist).reduce(
            (acc: any, curr: any) => {
                return [...acc, { id: curr }];
            },
            []
        );

        return parsedOptions.filter(option =>
            values.includes(option.id) ? null : option.id
        );
    };

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
                            {!isEdit && (
                                <React.Fragment>
                                    <FlexGridItem>
                                        <Field
                                            name="term"
                                            render={({
                                                field
                                            }: FieldProps<
                                                InformationtypeFormValues
                                            >) => (
                                                <Block>
                                                    <Block {...labelProps}>
                                                        <Label2>Begrep</Label2>
                                                    </Block>
                                                    <Input
                                                        {...field}
                                                        placeholder="Skriv inn et begrep"
                                                    />
                                                </Block>
                                            )}
                                        />
                                    </FlexGridItem>

                                    <FlexGridItem>
                                        <Field
                                            name="name"
                                            render={({
                                                field
                                            }: FieldProps<
                                                InformationtypeFormValues
                                            >) => (
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
                                </React.Fragment>
                            )}

                            <FlexGridItem>
                                <Field
                                    name="context"
                                    render={({
                                        field
                                    }: FieldProps<
                                        InformationtypeFormValues
                                    >) => (
                                        <Block>
                                            <Block {...labelProps}>
                                                <Label2>Kontekst</Label2>
                                            </Block>
                                            <Input
                                                {...field}
                                                placeholder="Skriv inn kontekst for opplysningstypen"
                                            />
                                        </Block>
                                    )}
                                />
                            </FlexGridItem>

                            <FlexGridItem>
                                <Field
                                    name="sensitivity"
                                    render={({
                                        field
                                    }: FieldProps<
                                        InformationtypeFormValues
                                    >) => (
                                        <Block>
                                            <Block {...labelProps}>
                                                <Label2>Sensitivitet</Label2>
                                            </Block>
                                            <Input
                                                {...field}
                                                placeholder="Skriv inn ..."
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
                                                options={getParsedOptions(
                                                    codelist.CATEGORY,
                                                    formikBag.values.categories
                                                )}
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
                                                value={
                                                    !formikBag.values.pii
                                                        ? "Nei"
                                                        : formikBag.values.pii.toString()
                                                }
                                                onChange={e => {
                                                    (e.target as HTMLInputElement)
                                                        .value === "Ja"
                                                        ? form.setFieldValue(
                                                              "pii",
                                                              "Ja"
                                                          )
                                                        : form.setFieldValue(
                                                              "pii",
                                                              "Nei"
                                                          );
                                                }}
                                                align="horizontal"
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
