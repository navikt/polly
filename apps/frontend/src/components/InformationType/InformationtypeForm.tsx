import * as React from "react";
import {KeyboardEvent, useEffect} from "react";
import {Field, FieldArray, FieldArrayRenderProps, FieldProps, Form, Formik, FormikHelpers, FormikProps} from "formik";
import {Label2} from "baseui/typography";
import {Input} from "baseui/input";
import {Block, BlockProps} from "baseui/block";
import {FlexGrid, FlexGridItem} from "baseui/flex-grid";
import {Textarea} from "baseui/textarea";
import {Button, SHAPE} from "baseui/button";
import {Plus} from "baseui/icon";
import {Option, Select, TYPE, Value} from "baseui/select";

import {codelist, ListName} from "../../service/Codelist";
import {InformationtypeFormValues} from "../../constants";
import {intl} from "../../util"
import {getTerm, mapTermToOption, searchInformationType, useTermSearch} from "../../api"
import {infoTypeSchema} from "../common/schema"
import {renderTagList} from "../common/TagList"
import {Error} from "../common/ModalSchema"

const labelProps: BlockProps = {
  marginBottom: "8px",
  alignSelf: "center"
};

type FormProps = {
  formInitialValues: InformationtypeFormValues;
  submit: (infoType: InformationtypeFormValues) => Promise<void>;
  isEdit: boolean;
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
  const initialValueTerm = async () => {
    if (!formInitialValues.term || !codelist) return []
    return [mapTermToOption(await getTerm(formInitialValues.term))]
  }
  const keywordsRef = React.useRef<HTMLInputElement>(null);

  const [termSearchResult, setTermSearch, termSearchLoading] = useTermSearch()

  const [sensitivityValue, setSensitivityValue] = React.useState<Option>(initialValueSensitivity());
  const [termValue, setTermValue] = React.useState<Option>(formInitialValues.term ? [{id: formInitialValues.term, label: formInitialValues.term}] : []);
  const [masterValue, setMasterValue] = React.useState<Option>(initialValueMaster());
  const [currentKeywordValue, setCurrentKeywordValue] = React.useState("");

  useEffect(() => {
    (async () => {
      try {
        setTermValue(await initialValueTerm())
      } catch (e) {
        console.error("failed to get term", e)
      }
    })()
  }, [formInitialValues.term])

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

  const disableEnter = (e: KeyboardEvent) => {
    if (e.key === 'Enter') e.preventDefault()
  }
  const onAddKeyword = (arrayHelpers: FieldArrayRenderProps) => {
    if (!currentKeywordValue) {
      return
    }
    arrayHelpers.push(currentKeywordValue)
    setCurrentKeywordValue("")
    if (keywordsRef && keywordsRef.current) {
      keywordsRef.current.focus()
    }
  }

  const onSubmit = async (
    values: InformationtypeFormValues,
    actions: FormikHelpers<InformationtypeFormValues>
  ) => {
    const searchResults = (await searchInformationType(values.name!))
    .content.filter(it => it.name.toLowerCase() === values.name?.toLowerCase() && formInitialValues.id !== it.id)
    if (searchResults.length > 0) {
      actions.setFieldError('name', intl.informationTypeExists)
    } else {
      submit(values);
      actions.setSubmitting(false);
    }
  }
  return (
    <React.Fragment>
      <Formik
        validationSchema={infoTypeSchema()}
        initialValues={formInitialValues}
        enableReinitialize
        onSubmit={onSubmit}
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
                  render={({form, field}: FieldProps) => (
                    <Block>
                      <Block {...labelProps}>
                        <Label2>{intl.name}</Label2>
                      </Block>
                      <Input
                        {...field}
                        placeholder={intl.nameWrite}
                        error={!!form.errors.name && !!form.submitCount}
                      />
                    </Block>
                  )}
                />
                <Error fieldName="name" fullWidth/>
              </FlexGridItem>

              <FlexGridItem>
                <Field
                  name="term"
                  render={({form}: FieldProps<InformationtypeFormValues>) => (
                    <Block>
                      <Block {...labelProps}>
                        <Label2>{intl.termEditHeader}</Label2>
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
                          let term = params.value.length ? params.value[0] : undefined
                          setTermValue(term ? [term as Option] : [])
                          form.setFieldValue('term', term ? term.id : undefined)
                        }}
                        error={!!form.errors.term && !!form.submitCount}
                        isLoading={termSearchLoading}
                      />
                    </Block>
                  )}
                />
                <Error fieldName="term" fullWidth/>
              </FlexGridItem>

              <FlexGridItem>
                <Field
                  name="sensitivity"
                  render={({form}: FieldProps<InformationtypeFormValues>) => (
                    <Block>
                      <Block {...labelProps}>
                        <Label2>{intl.sensitivity}</Label2>
                      </Block>

                      <Select
                        options={codelist.getParsedOptions(ListName.SENSITIVITY)}
                        value={sensitivityValue as Value}
                        placeholder={intl.sensitivitySelect}
                        onChange={(params) => {
                          let sensitivity = params.value.length ? params.value[0] : undefined
                          setSensitivityValue(sensitivity as Option)
                          form.setFieldValue('sensitivity', sensitivity ? sensitivity.id : undefined)
                        }}
                        error={!!form.errors.sensitivity && !!form.submitCount}
                      />
                    </Block>
                  )}
                />
                <Error fieldName="sensitivity" fullWidth/>
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
                        maxDropdownHeight="300px"
                        onChange={({option}) => {
                          arrayHelpers.push(
                            option
                              ? option.id
                              : null
                          );
                        }}
                        error={!!arrayHelpers.form.errors.categories && !!arrayHelpers.form.submitCount}
                      />
                      {renderTagList(codelist.getShortnames(ListName.CATEGORY, formikBag.values.categories), arrayHelpers)}
                    </Block>
                  )}
                />
                <Error fieldName="categories" fullWidth/>
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
                        options={getParsedOptions(ListName.THIRD_PARTY, formikBag.values.sources)}
                        placeholder={intl.sourcesWrite}
                        maxDropdownHeight="300px"
                        onChange={({option}) => {
                          arrayHelpers.push(option ? option.id : null);
                        }}
                        error={!!arrayHelpers.form.errors.sources && !!arrayHelpers.form.submitCount}
                      />
                      {renderTagList(codelist.getShortnames(ListName.THIRD_PARTY, formikBag.values.sources), arrayHelpers)}
                    </Block>
                  )}
                />
                <Error fieldName="sources" fullWidth/>
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
                        onBlur={() => onAddKeyword(arrayHelpers)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') onAddKeyword(arrayHelpers)
                        }}
                        inputRef={keywordsRef}
                        overrides={{
                          After: () => (
                            <Button
                              type="button"
                              shape={SHAPE.square}
                            >
                              <Plus/>
                            </Button>
                          )
                        }}
                        error={!!arrayHelpers.form.errors.keywords && !!arrayHelpers.form.submitCount}
                      />
                      {renderTagList(formikBag.values.keywords, arrayHelpers)}
                    </Block>
                  )}
                />
                <Error fieldName="keywords" fullWidth/>
              </FlexGridItem>

              <FlexGridItem>
                <Field
                  name="description"
                  render={({
                             field, form
                           }: FieldProps) => (
                    <Block>
                      <Block {...labelProps}>
                        <Label2>{intl.description}</Label2>
                      </Block>
                      <Textarea onKeyDown={e => {
                        if (e.key === 'Enter') form.setFieldValue('description', form.values.description + '\n')
                      }}
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
                  render={({form}: FieldProps<InformationtypeFormValues>) => (
                    <Block marginBottom="1em">
                      <Block {...labelProps}>
                        <Label2>{intl.navMaster}</Label2>
                      </Block>

                      <Select
                        options={codelist.getParsedOptions(ListName.SYSTEM)}
                        value={masterValue as Value}
                        placeholder={intl.navMasterSelect}
                        onChange={(params) => {
                          let master = params.value.length ? params.value[0] : undefined
                          setMasterValue(master as Option)
                          form.setFieldValue('navMaster', master ? master.id : undefined)
                        }}
                        error={!!form.errors.navMaster && !!form.submitCount}
                      />
                    </Block>
                  )}
                />
                <Error fieldName="navMaster" fullWidth/>
              </FlexGridItem>

            </FlexGrid>

            <Block display="flex" marginTop="2rem" justifyContent="flex-end">
              <Button
                type="button"
                kind="secondary"
                overrides={{
                  BaseButton: {
                    style: ({$theme}) => {
                      return {
                        alignContent: "center",
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
              <Button
                type="submit"
                overrides={{
                  BaseButton: {
                    style: ({$theme}) => {
                      return {
                        alignContent: "center",
                        marginLeft: "1rem",
                        paddingRight: "4rem",
                        paddingLeft: "4rem"
                      };
                    }
                  }
                }}

              >
                {intl.save}
              </Button>
            </Block>
          </Form>
        )}
      />
    </React.Fragment>
  );
};

export default InformationtypeForm;
