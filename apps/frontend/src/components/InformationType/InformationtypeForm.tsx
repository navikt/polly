import { PlusIcon } from '@navikt/aksel-icons'
import { Button, Label, TextField, Textarea, UNSAFE_Combobox } from '@navikt/ds-react'
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
import { Fragment, KeyboardEvent, useEffect, useRef, useState } from 'react'
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

  const keywordsRef = useRef<HTMLInputElement>({} as HTMLInputElement)

  const [termSearchResult, setTermSearch, termSearchLoading] = useTermSearch()

  const [termInputValue, setTermInputValue] = useState('')
  const [masterInputValue, setMasterInputValue] = useState('')
  const [sensitivityInputValue, setSensitivityInputValue] = useState('')
  const [currentKeywordValue, setCurrentKeywordValue] = useState('')

  useEffect(() => {
    ;(async () => {
      try {
        const initialTerm = await initialValueTerm()
        const first = initialTerm.length ? initialTerm[0] : undefined
        setTermInputValue(first?.label || '')
      } catch (error: any) {
        console.error('failed to get term', error)
      }
    })()
  }, [formInitialValues.term])

  useEffect(() => {
    const initialMaster = initialValueMaster()
    const first = initialMaster.length ? initialMaster[0] : undefined
    setMasterInputValue(first?.label || '')
  }, [formInitialValues.orgMaster, codelistUtils])

  useEffect(() => {
    const initialSensitivity = initialValueSensitivity()
    const first = initialSensitivity.length ? initialSensitivity[0] : undefined
    setSensitivityInputValue(first?.label || '')
  }, [formInitialValues.sensitivity, codelistUtils])

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
            <div className="grid grid-cols-2 gap-10">
              <div>
                <Field name="name">
                  {({ form, field }: FieldProps) => (
                    <div>
                      <div className="mb-2 self-center">
                        <Label>Navn</Label>
                      </div>
                      <TextField
                        className="w-full"
                        label=""
                        hideLabel
                        {...field}
                        error={!!form.errors.name && !!form.submitCount}
                      />
                    </div>
                  )}
                </Field>
                <Error fieldName="name" fullWidth />
              </div>

              <div>
                <Field
                  name="orgMaster"
                  render={({ form }: FieldProps<IInformationtypeFormValues>) => (
                    <div className="mb-4">
                      <div className="mb-2 self-center">
                        <Label>Master i NAV</Label>
                      </div>

                      <UNSAFE_Combobox
                        label=""
                        hideLabel
                        options={codelistUtils
                          .getParsedOptions(EListName.SYSTEM)
                          .map((o: IGetParsedOptionsProps) => ({ value: o.id, label: o.label }))}
                        value={masterInputValue}
                        onChange={(newValue) => {
                          setMasterInputValue(newValue)
                          const selected = codelistUtils
                            .getParsedOptions(EListName.SYSTEM)
                            .find((o: IGetParsedOptionsProps) => o.label === newValue)
                          if (!selected) {
                            form.setFieldValue('orgMaster', undefined)
                          }
                        }}
                        selectedOptions={
                          formikBag.values.orgMaster ? [formikBag.values.orgMaster] : []
                        }
                        onToggleSelected={(optionValue, isSelected) => {
                          if (!isSelected) {
                            setMasterInputValue('')
                            form.setFieldValue('orgMaster', undefined)
                            return
                          }
                          const selected = codelistUtils
                            .getParsedOptions(EListName.SYSTEM)
                            .find((o: IGetParsedOptionsProps) => o.id === optionValue)
                          setMasterInputValue(selected?.label || '')
                          form.setFieldValue('orgMaster', optionValue)
                        }}
                      />
                    </div>
                  )}
                />
                <Error fieldName="orgMaster" fullWidth />
              </div>

              <div>
                <Field
                  name="term"
                  render={({ form }: FieldProps<IInformationtypeFormValues>) => (
                    <div>
                      <div className="mb-2 self-center">
                        <Label>Begrepsdefinisjon (oppslag i Begrepskatalogen)</Label>
                      </div>
                      <UNSAFE_Combobox
                        label=""
                        hideLabel
                        placeholder="Søk"
                        isLoading={termSearchLoading}
                        options={termSearchResult.flatMap((o) => {
                          if (!o.value) return []
                          return [
                            {
                              value: String(o.value),
                              label: String(o.label ?? ''),
                            },
                          ]
                        })}
                        value={termInputValue}
                        onChange={(newValue) => {
                          setTermInputValue(newValue)
                          setTermSearch(newValue)
                          if (formikBag.values.term && newValue !== termInputValue) {
                            form.setFieldValue('term', undefined)
                          }
                        }}
                        selectedOptions={formikBag.values.term ? [formikBag.values.term] : []}
                        onToggleSelected={(optionValue, isSelected) => {
                          if (!isSelected) {
                            setTermInputValue('')
                            form.setFieldValue('term', undefined)
                            return
                          }

                          const selected = termSearchResult.find((o) => o.value === optionValue)
                          setTermInputValue(String(selected?.label ?? ''))
                          form.setFieldValue('term', optionValue)
                        }}
                      />
                    </div>
                  )}
                />
                <Error fieldName="term" fullWidth />
              </div>

              <div>
                <FieldArray
                  name="sources"
                  render={(arrayHelpers: FieldArrayRenderProps) => (
                    <div>
                      <div className="mb-2 self-center">
                        <Label>Kilder</Label>
                      </div>
                      <UNSAFE_Combobox
                        label=""
                        hideLabel
                        options={getParsedOptions(
                          EListName.THIRD_PARTY,
                          formikBag.values.sources
                        ).map((o: IGetParsedOptionsProps) => ({ value: o.id, label: o.label }))}
                        value={''}
                        onChange={() => undefined}
                        selectedOptions={[]}
                        onToggleSelected={(optionValue, isSelected) => {
                          if (!isSelected) return
                          arrayHelpers.push(optionValue)
                        }}
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
              </div>

              <div>
                <FieldArray name="keywords">
                  {(arrayHelpers: FieldArrayRenderProps) => (
                    <div>
                      <div className="mb-2 self-center">
                        <Label>Søkeord</Label>
                      </div>
                      <div className="flex w-full">
                        <TextField
                          className="w-full"
                          label=""
                          hideLabel
                          value={currentKeywordValue}
                          onChange={(event) => setCurrentKeywordValue(event.currentTarget.value)}
                          onBlur={() => onAddKeyword(arrayHelpers)}
                          onKeyDown={(event) => {
                            if (event.key === 'Enter') onAddKeyword(arrayHelpers)
                          }}
                          ref={keywordsRef}
                        />
                        <Button
                          type="button"
                          variant="secondary"
                          icon={<PlusIcon aria-hidden />}
                          aria-label="Legg til søkeord"
                          onClick={() => onAddKeyword(arrayHelpers)}
                        />
                      </div>
                      {renderTagList(formikBag.values.keywords, arrayHelpers)}
                    </div>
                  )}
                </FieldArray>
                <Error fieldName="keywords" fullWidth />
              </div>

              <div>
                <div>
                  <div className="mb-2 self-center">
                    <Label>Team</Label>
                  </div>
                  <FieldProductTeam
                    productTeams={formikBag.values.productTeams}
                    fieldName="productTeams"
                  />
                </div>
              </div>

              <div>
                <FieldArray
                  name="categories"
                  render={(arrayHelpers: FieldArrayRenderProps) => (
                    <div>
                      <div className="mb-2 self-center">
                        <Label>Kategorier</Label>
                      </div>
                      <UNSAFE_Combobox
                        label=""
                        hideLabel
                        options={getParsedOptions(
                          EListName.CATEGORY,
                          formikBag.values.categories
                        ).map((o: IGetParsedOptionsProps) => ({ value: o.id, label: o.label }))}
                        value={''}
                        onChange={() => undefined}
                        selectedOptions={[]}
                        onToggleSelected={(optionValue, isSelected) => {
                          if (!isSelected) return
                          arrayHelpers.push(optionValue)
                        }}
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
              </div>

              <div>
                <Field name="description">
                  {({ field, form }: FieldProps) => (
                    <div>
                      <div className="mb-2 self-center">
                        <Label>Nyttig å vite om opplysningstypen</Label>
                      </div>
                      <Textarea
                        label=""
                        hideLabel
                        onKeyDown={(event: KeyboardEvent<HTMLTextAreaElement>) => {
                          if (event.key === 'Enter')
                            form.setFieldValue('description', form.values.description + '\n')
                        }}
                        {...field}
                        rows={5}
                      />
                    </div>
                  )}
                </Field>
              </div>

              <div>
                <Field
                  name="sensitivity"
                  render={({ form }: FieldProps<IInformationtypeFormValues>) => (
                    <div>
                      <div className="mb-2 self-center">
                        <Label>Type personopplysning</Label>
                      </div>

                      <UNSAFE_Combobox
                        label=""
                        hideLabel
                        options={codelistUtils
                          .getParsedOptions(EListName.SENSITIVITY)
                          .filter(
                            (sensitivity: IGetParsedOptionsProps) =>
                              !sensitivity.label.includes('Ikke')
                          )
                          .map((o: IGetParsedOptionsProps) => ({ value: o.id, label: o.label }))}
                        value={sensitivityInputValue}
                        onChange={(newValue) => {
                          setSensitivityInputValue(newValue)
                          const selected = codelistUtils
                            .getParsedOptions(EListName.SENSITIVITY)
                            .find((o: IGetParsedOptionsProps) => o.label === newValue)
                          if (!selected) {
                            form.setFieldValue('sensitivity', undefined)
                          }
                        }}
                        selectedOptions={
                          formikBag.values.sensitivity ? [formikBag.values.sensitivity] : []
                        }
                        onToggleSelected={(optionValue, isSelected) => {
                          if (!isSelected) {
                            setSensitivityInputValue('')
                            form.setFieldValue('sensitivity', undefined)
                            return
                          }
                          const selected = codelistUtils
                            .getParsedOptions(EListName.SENSITIVITY)
                            .find((o: IGetParsedOptionsProps) => o.id === optionValue)
                          setSensitivityInputValue(selected?.label || '')
                          form.setFieldValue('sensitivity', optionValue)
                        }}
                      />
                    </div>
                  )}
                />
                <Error fieldName="sensitivity" fullWidth />
              </div>
            </div>

            <div className="flex mt-8 justify-end">
              <Button
                type="button"
                variant="secondary"
                className="px-16"
                onClick={() => window.history.back()}
              >
                Avbryt
              </Button>
              <Button type="submit" className="ml-4 px-16">
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
