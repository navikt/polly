import { Button, SHAPE } from 'baseui/button'
import { FlexGrid, FlexGridItem } from 'baseui/flex-grid'
import { Plus } from 'baseui/icon'
import { Input } from 'baseui/input'
import { Option, Select, TYPE, Value } from 'baseui/select'
import { Textarea } from 'baseui/textarea'
import { LabelMedium } from 'baseui/typography'
import { Field, FieldArray, FieldArrayRenderProps, FieldProps, Form, Formik, FormikHelpers, FormikProps } from 'formik'
import * as React from 'react'
import { useEffect } from 'react'

import { getTerm, mapTermToOption, searchInformationType, useTermSearch } from '../../api'
import { InformationtypeFormValues } from '../../constants'
import { codelist, ListName } from '../../service/Codelist'
import { disableEnter } from '../../util/helper-functions'
import FieldProductTeam from '../common/form/FieldProductTeam'
import { Error } from '../common/ModalSchema'
import { infoTypeSchema } from '../common/schema'
import { renderTagList } from '../common/TagList'

type FormProps = {
  formInitialValues: InformationtypeFormValues
  submit: (infoType: InformationtypeFormValues) => Promise<void>
  isEdit: boolean
}

const InformationtypeForm = ({ formInitialValues, submit, isEdit }: FormProps) => {
  const initialValueSensitivity = () => {
    if (!formInitialValues.sensitivity || !codelist.isLoaded()) return []
    return [
      {
        id: formInitialValues.sensitivity,
        label: codelist.getShortname(ListName.SENSITIVITY, formInitialValues.sensitivity),
      },
    ]
  }
  const initialValueMaster = () => {
    if (!formInitialValues.orgMaster || !codelist) return []
    return [
      {
        id: formInitialValues.orgMaster,
        label: codelist.getShortname(ListName.SYSTEM, formInitialValues.orgMaster),
      },
    ]
  }
  const initialValueTerm = async () => {
    if (!formInitialValues.term || !codelist) return []
    return [mapTermToOption(await getTerm(formInitialValues.term))]
  }
  const keywordsRef = React.useRef<HTMLInputElement>(null)

  const [termSearchResult, setTermSearch, termSearchLoading] = useTermSearch()

  const [sensitivityValue, setSensitivityValue] = React.useState<Option>(initialValueSensitivity())
  const [termValue, setTermValue] = React.useState<Option>(formInitialValues.term ? [{ id: formInitialValues.term, label: formInitialValues.term }] : [])
  const [masterValue, setMasterValue] = React.useState<Option>(initialValueMaster())
  const [currentKeywordValue, setCurrentKeywordValue] = React.useState('')

  useEffect(() => {
    ;(async () => {
      try {
        setTermValue(await initialValueTerm())
      } catch (e: any) {
        console.error('failed to get term', e)
      }
    })()
  }, [formInitialValues.term])

  const getParsedOptions = (listName: ListName, values: string[]) => {
    if (!codelist) return []

    let parsedOptions = codelist.getParsedOptions(listName)

    if (!values) {
      return parsedOptions
    } else {
      return parsedOptions.filter((option) => (values.includes(option.id) ? null : option.id))
    }
  }

  const onAddKeyword = (arrayHelpers: FieldArrayRenderProps) => {
    if (!currentKeywordValue) {
      return
    }
    arrayHelpers.push(currentKeywordValue)
    setCurrentKeywordValue('')
    if (keywordsRef && keywordsRef.current) {
      keywordsRef.current.focus()
    }
  }

  const onSubmit = async (values: InformationtypeFormValues, actions: FormikHelpers<InformationtypeFormValues>) => {
    const searchResults = (await searchInformationType(values.name!)).content.filter((it) => it.name.toLowerCase() === values.name?.toLowerCase() && formInitialValues.id !== it.id)
    if (searchResults.length > 0) {
      actions.setFieldError('name', 'Informasjonstypen eksisterer allerede')
    } else {
      submit(values)
      actions.setSubmitting(false)
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
            <FlexGrid flexGridColumnCount={2} flexGridColumnGap="scale1000" flexGridRowGap="scale1000">
              <FlexGridItem>
                <Field
                  name="name"
                  render={({ form, field }: FieldProps) => (
                    <div>
                      <div className="mb-2 self-center">
                        <LabelMedium>Navn</LabelMedium>
                      </div>
                      <Input {...field} error={!!form.errors.name && !!form.submitCount} />
                    </div>
                  )}
                />
                <Error fieldName="name" fullWidth />
              </FlexGridItem>

              <FlexGridItem>
                <Field
                  name="orgMaster"
                  render={({ form }: FieldProps<InformationtypeFormValues>) => (
                    <div className="mb-4">
                      <div className="mb-2 self-center">
                        <LabelMedium>Master i NAV</LabelMedium>
                      </div>

                      <Select
                        options={codelist.getParsedOptions(ListName.SYSTEM)}
                        value={masterValue as Value}
                        onChange={(params) => {
                          let master = params.value.length ? params.value[0] : undefined
                          setMasterValue(master as Option)
                          form.setFieldValue('orgMaster', master ? master.id : undefined)
                        }}
                        error={!!form.errors.orgMaster && !!form.submitCount}
                      />
                    </div>
                  )}
                />
                <Error fieldName="orgMaster" fullWidth />
              </FlexGridItem>

              <FlexGridItem>
                <Field
                  name="term"
                  render={({ form }: FieldProps<InformationtypeFormValues>) => (
                    <div>
                      <div className="mb-2 self-center">
                        <LabelMedium>Begrepsdefinisjon (oppslag i Begrepskatalogen)</LabelMedium>
                      </div>
                      <Select
                        noResultsMsg="Ingen"
                        maxDropdownHeight="350px"
                        searchable={true}
                        type={TYPE.search}
                        options={termSearchResult}
                        value={termValue as Value}
                        onInputChange={(event) => setTermSearch(event.currentTarget.value)}
                        onChange={(params) => {
                          let term = params.value.length ? params.value[0] : undefined
                          setTermValue(term ? [term as Option] : [])
                          form.setFieldValue('term', term ? term.id : undefined)
                        }}
                        error={!!form.errors.term && !!form.submitCount}
                        isLoading={termSearchLoading}
                      />
                    </div>
                  )}
                />
                <Error fieldName="term" fullWidth />
              </FlexGridItem>

              <FlexGridItem>
                <FieldArray
                  name="sources"
                  render={(arrayHelpers: FieldArrayRenderProps) => (
                    <div>
                      <div className="mb-2 self-center">
                        <LabelMedium>Kilder</LabelMedium>
                      </div>
                      <Select
                        options={getParsedOptions(ListName.THIRD_PARTY, formikBag.values.sources)}
                        maxDropdownHeight="300px"
                        onChange={({ option }) => {
                          arrayHelpers.push(option ? option.id : null)
                        }}
                        error={!!arrayHelpers.form.errors.sources && !!arrayHelpers.form.submitCount}
                      />
                      {renderTagList(codelist.getShortnames(ListName.THIRD_PARTY, formikBag.values.sources), arrayHelpers)}
                    </div>
                  )}
                />
                <Error fieldName="sources" fullWidth />
              </FlexGridItem>

              <FlexGridItem>
                <FieldArray
                  name="keywords"
                  render={(arrayHelpers: FieldArrayRenderProps) => (
                    <div>
                      <div className="mb-2 self-center">
                        <LabelMedium>Søkeord</LabelMedium>
                      </div>
                      <Input
                        type="text"
                        value={currentKeywordValue}
                        onChange={(event) => setCurrentKeywordValue(event.currentTarget.value)}
                        onBlur={() => onAddKeyword(arrayHelpers)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') onAddKeyword(arrayHelpers)
                        }}
                        inputRef={keywordsRef}
                        overrides={{
                          After: () => (
                            <Button type="button" shape={SHAPE.square}>
                              <Plus />
                            </Button>
                          ),
                        }}
                        error={!!arrayHelpers.form.errors.keywords && !!arrayHelpers.form.submitCount}
                      />
                      {renderTagList(formikBag.values.keywords, arrayHelpers)}
                    </div>
                  )}
                />
                <Error fieldName="keywords" fullWidth />
              </FlexGridItem>

              <FlexGridItem>
                <div>
                  <div className="mb-2 self-center">
                    <LabelMedium>Team</LabelMedium>
                  </div>
                  <FieldProductTeam productTeams={formikBag.values.productTeams} fieldName="productTeams" />
                </div>
              </FlexGridItem>

              <FlexGridItem>
                <FieldArray
                  name="categories"
                  render={(arrayHelpers: FieldArrayRenderProps) => (
                    <div>
                      <div className="mb-2 self-center">
                        <LabelMedium>Kategorier</LabelMedium>
                      </div>
                      <Select
                        options={getParsedOptions(ListName.CATEGORY, formikBag.values.categories)}
                        maxDropdownHeight="300px"
                        onChange={({ option }) => {
                          arrayHelpers.push(option ? option.id : null)
                        }}
                        error={!!arrayHelpers.form.errors.categories && !!arrayHelpers.form.submitCount}
                      />
                      {renderTagList(codelist.getShortnames(ListName.CATEGORY, formikBag.values.categories), arrayHelpers)}
                    </div>
                  )}
                />
                <Error fieldName="categories" fullWidth />
              </FlexGridItem>

              <FlexGridItem>
                <Field
                  name="description"
                  render={({ field, form }: FieldProps) => (
                    <div>
                      <div className="mb-2 self-center">
                        <LabelMedium>Nyttig å vite om opplysningstypen</LabelMedium>
                      </div>
                      <Textarea
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') form.setFieldValue('description', form.values.description + '\n')
                        }}
                        {...field}
                        rows={5}
                      />
                    </div>
                  )}
                />
              </FlexGridItem>

              <FlexGridItem>
                <Field
                  name="sensitivity"
                  render={({ form }: FieldProps<InformationtypeFormValues>) => (
                    <div>
                      <div className="mb-2 self-center">
                        <LabelMedium>Type personopplysning</LabelMedium>
                      </div>

                      <Select
                        options={codelist.getParsedOptions(ListName.SENSITIVITY).filter((s) => !s.label.includes('Ikke'))}
                        value={sensitivityValue as Value}
                        onChange={(params) => {
                          let sensitivity = params.value.length ? params.value[0] : undefined
                          setSensitivityValue(sensitivity as Option)
                          form.setFieldValue('sensitivity', sensitivity ? sensitivity.id : undefined)
                        }}
                        error={!!form.errors.sensitivity && !!form.submitCount}
                      />
                    </div>
                  )}
                />
                <Error fieldName="sensitivity" fullWidth />
              </FlexGridItem>
            </FlexGrid>

            <div className="flex mt-8 justify-end">
              <Button
                type="button"
                kind="secondary"
                overrides={{
                  BaseButton: {
                    style: ({ $theme }: any) => {
                      return {
                        alignContent: 'center',
                        paddingRight: '4rem',
                        paddingLeft: '4rem',
                      }
                    },
                  },
                }}
                onClick={() => window.history.back()}
              >
                Avbryt
              </Button>
              <Button
                type="submit"
                overrides={{
                  BaseButton: {
                    style: ({ $theme }: any) => {
                      return {
                        alignContent: 'center',
                        marginLeft: '1rem',
                        paddingRight: '4rem',
                        paddingLeft: '4rem',
                      }
                    },
                  },
                }}
              >
                Lagre
              </Button>
            </div>
          </Form>
        )}
      />
    </React.Fragment>
  )
}

export default InformationtypeForm
