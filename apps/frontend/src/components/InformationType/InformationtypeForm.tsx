import { Button, SHAPE } from 'baseui/button'
import { FlexGrid, FlexGridItem } from 'baseui/flex-grid'
import { Plus } from 'baseui/icon'
import { Input } from 'baseui/input'
import { OnChangeParams, Option, Select, TYPE, Value } from 'baseui/select'
import { Textarea } from 'baseui/textarea'
import { LabelMedium } from 'baseui/typography'
import {
  Field,
  FieldArray,
  FieldArrayRenderProps,
  FieldProps,
  Form,
  Formik,
  FormikHelpers,
  FormikProps,
} from 'formik'
import { ChangeEvent, Fragment, KeyboardEvent, RefObject, useEffect, useRef, useState } from 'react'
import { getTerm, mapTermToOption, searchInformationType, useTermSearch } from '../../api/GetAllApi'
import { IInformationType, IInformationtypeFormValues } from '../../constants'
import { CodelistService, EListName, IGetParsedOptionsProps } from '../../service/Codelist'
import { disableEnter } from '../../util/helper-functions'
import { Error } from '../common/ModalSchema'
import { renderTagList } from '../common/TagList'
import FieldProductTeam from '../common/form/FieldProductTeam'
import { infoTypeSchema } from '../common/schemaValidation'

type TFormProps = {
  formInitialValues: IInformationtypeFormValues
  submit: (infoType: IInformationtypeFormValues) => Promise<void>
  isEdit: boolean
}

const InformationtypeForm = ({ formInitialValues, submit }: TFormProps) => {
  const [codelistUtils] = CodelistService()

  const initialValueSensitivity = () => {
    if (!formInitialValues.sensitivity || !codelistUtils.isLoaded()) return []

    return [
      {
        id: formInitialValues.sensitivity,
        label: codelistUtils.getShortname(EListName.SENSITIVITY, formInitialValues.sensitivity),
      },
    ]
  }

  const initialValueMaster = () => {
    if (!formInitialValues.orgMaster || !codelistUtils) return []

    return [
      {
        id: formInitialValues.orgMaster,
        label: codelistUtils.getShortname(EListName.SYSTEM, formInitialValues.orgMaster),
      },
    ]
  }

  const initialValueTerm = async () => {
    if (!formInitialValues.term || !codelistUtils) return []
    return [mapTermToOption(await getTerm(formInitialValues.term))]
  }

  const keywordsRef: RefObject<HTMLInputElement> = useRef<HTMLInputElement>(null)

  const [termSearchResult, setTermSearch, termSearchLoading] = useTermSearch()

  const [sensitivityValue, setSensitivityValue] = useState<Option>(initialValueSensitivity())
  const [termValue, setTermValue] = useState<Option>(
    formInitialValues.term ? [{ id: formInitialValues.term, label: formInitialValues.term }] : []
  )
  const [masterValue, setMasterValue] = useState<Option>(initialValueMaster())
  const [currentKeywordValue, setCurrentKeywordValue] = useState('')

  useEffect(() => {
    ;(async () => {
      try {
        setTermValue(await initialValueTerm())
      } catch (error: any) {
        console.error('failed to get term', error)
      }
    })()
  }, [formInitialValues.term])

  const getParsedOptions = (listName: EListName, values: string[]) => {
    if (!codelistUtils) return []

    const parsedOptions: IGetParsedOptionsProps[] = codelistUtils.getParsedOptions(listName)

    if (!values) {
      return parsedOptions
    } else {
      return parsedOptions.filter((option: IGetParsedOptionsProps) =>
        values.includes(option.id) ? null : option.id
      )
    }
  }

  const onAddKeyword: (arrayHelpers: FieldArrayRenderProps) => void = (
    arrayHelpers: FieldArrayRenderProps
  ) => {
    if (!currentKeywordValue) {
      return
    }

    arrayHelpers.push(currentKeywordValue)
    setCurrentKeywordValue('')

    if (keywordsRef && keywordsRef.current) {
      keywordsRef.current.focus()
    }
  }

  const onSubmit = async (
    values: IInformationtypeFormValues,
    actions: FormikHelpers<IInformationtypeFormValues>
  ): Promise<void> => {
    if (values.name) {
      const searchResults: IInformationType[] = (
        await searchInformationType(values.name)
      ).content.filter(
        (informationType) =>
          informationType.name.toLowerCase() === values.name?.toLowerCase() &&
          formInitialValues.id !== informationType.id
      )

      if (searchResults.length > 0) {
        actions.setFieldError('name', 'Informasjonstypen eksisterer allerede')
      } else {
        submit(values)
        actions.setSubmitting(false)
      }
    }
  }

  return (
    <Fragment>
      <Formik
        validationSchema={infoTypeSchema()}
        initialValues={formInitialValues}
        enableReinitialize
        onSubmit={onSubmit}
        render={(formikBag: FormikProps<IInformationtypeFormValues>) => (
          <Form onKeyDown={disableEnter}>
            <FlexGrid
              flexGridColumnCount={2}
              flexGridColumnGap="scale1000"
              flexGridRowGap="scale1000"
            >
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
                  render={({ form }: FieldProps<IInformationtypeFormValues>) => (
                    <div className="mb-4">
                      <div className="mb-2 self-center">
                        <LabelMedium>Master i NAV</LabelMedium>
                      </div>

                      <Select
                        options={codelistUtils.getParsedOptions(EListName.SYSTEM)}
                        value={masterValue as Value}
                        onChange={(params: OnChangeParams) => {
                          const master = params.value.length ? params.value[0] : undefined
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
                  render={({ form }: FieldProps<IInformationtypeFormValues>) => (
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
                        onChange={(params: OnChangeParams) => {
                          const term = params.value.length ? params.value[0] : undefined
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
                        options={getParsedOptions(EListName.THIRD_PARTY, formikBag.values.sources)}
                        maxDropdownHeight="300px"
                        onChange={({ option }) => {
                          arrayHelpers.push(option ? option.id : null)
                        }}
                        error={
                          !!arrayHelpers.form.errors.sources && !!arrayHelpers.form.submitCount
                        }
                      />
                      {renderTagList(
                        codelistUtils.getShortnames(
                          EListName.THIRD_PARTY,
                          formikBag.values.sources
                        ),
                        arrayHelpers
                      )}
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
                        onChange={(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
                          setCurrentKeywordValue(event.currentTarget.value)
                        }
                        onBlur={() => onAddKeyword(arrayHelpers)}
                        onKeyDown={(event) => {
                          if (event.key === 'Enter') onAddKeyword(arrayHelpers)
                        }}
                        inputRef={keywordsRef}
                        overrides={{
                          After: () => (
                            <Button type="button" shape={SHAPE.square}>
                              <Plus />
                            </Button>
                          ),
                        }}
                        error={
                          !!arrayHelpers.form.errors.keywords && !!arrayHelpers.form.submitCount
                        }
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
                  <FieldProductTeam
                    productTeams={formikBag.values.productTeams}
                    fieldName="productTeams"
                  />
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
                        options={getParsedOptions(EListName.CATEGORY, formikBag.values.categories)}
                        maxDropdownHeight="300px"
                        onChange={({ option }) => {
                          arrayHelpers.push(option ? option.id : null)
                        }}
                        error={
                          !!arrayHelpers.form.errors.categories && !!arrayHelpers.form.submitCount
                        }
                      />
                      {renderTagList(
                        codelistUtils.getShortnames(
                          EListName.CATEGORY,
                          formikBag.values.categories
                        ),
                        arrayHelpers
                      )}
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
                        onKeyDown={(event: KeyboardEvent<HTMLTextAreaElement>) => {
                          if (event.key === 'Enter')
                            form.setFieldValue('description', form.values.description + '\n')
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
                  render={({ form }: FieldProps<IInformationtypeFormValues>) => (
                    <div>
                      <div className="mb-2 self-center">
                        <LabelMedium>Type personopplysning</LabelMedium>
                      </div>

                      <Select
                        options={codelistUtils
                          .getParsedOptions(EListName.SENSITIVITY)
                          .filter(
                            (sensitivity: IGetParsedOptionsProps) =>
                              !sensitivity.label.includes('Ikke')
                          )}
                        value={sensitivityValue as Value}
                        onChange={(params: OnChangeParams) => {
                          const sensitivity = params.value.length ? params.value[0] : undefined
                          setSensitivityValue(sensitivity as Option)
                          form.setFieldValue(
                            'sensitivity',
                            sensitivity ? sensitivity.id : undefined
                          )
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
                    style: () => {
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
                    style: () => {
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
    </Fragment>
  )
}

export default InformationtypeForm
