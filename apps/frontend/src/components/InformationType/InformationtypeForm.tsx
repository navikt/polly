import { PlusIcon } from '@navikt/aksel-icons'
import { Button, ErrorSummary, Label, TextField, Textarea, UNSAFE_Combobox } from '@navikt/ds-react'
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

type TFormikError = unknown

const ANCHOR_ID_PREFIX = 'informationtype-'

const pathToAnchorKey = (path: string): string => {
  if (!path) return 'form'
  const root = path.replace(/\[\d+\]/g, '')
  return root.split('.')[0] || 'form'
}

const fieldId = (fieldName: string) => `${ANCHOR_ID_PREFIX}${pathToAnchorKey(fieldName)}`

const flattenFormikErrors = (
  errors: TFormikError,
  basePath = ''
): Array<{ path: string; message: string }> => {
  if (!errors) return []

  if (typeof errors === 'string') {
    return basePath ? [{ path: basePath, message: errors }] : [{ path: '', message: errors }]
  }

  if (Array.isArray(errors)) {
    return errors.flatMap((value, index) => flattenFormikErrors(value, `${basePath}[${index}]`))
  }

  if (typeof errors === 'object') {
    return Object.entries(errors as Record<string, unknown>).flatMap(([key, value]) =>
      flattenFormikErrors(value, basePath ? `${basePath}.${key}` : key)
    )
  }

  return []
}

const errorSummaryFieldLabels: Record<string, string> = {
  name: 'Navn',
  orgMaster: 'Master i NAV',
  term: 'Begrepsdefinisjon',
  sources: 'Kilder',
  keywords: 'Søkeord',
  productTeams: 'Team',
  categories: 'Kategorier',
  description: 'Nyttig å vite om opplysningstypen',
  sensitivity: 'Type personopplysning',
}

const errorSummaryOrder: string[] = [
  'name',
  'orgMaster',
  'term',
  'sources',
  'keywords',
  'productTeams',
  'categories',
  'description',
  'sensitivity',
]

const errorSummaryOrderIndex = (anchorKey: string): number => {
  const idx = errorSummaryOrder.indexOf(anchorKey)
  return idx === -1 ? Number.MAX_SAFE_INTEGER : idx
}

const buildErrorSummaryItems = (
  errors: TFormikError
): Array<{ anchorId: string; message: string }> => {
  const seen = new Set<string>()

  return flattenFormikErrors(errors)
    .filter((e) => e.message && e.path)
    .sort((a, b) => {
      const aKey = pathToAnchorKey(a.path)
      const bKey = pathToAnchorKey(b.path)

      const orderDiff = errorSummaryOrderIndex(aKey) - errorSummaryOrderIndex(bKey)
      if (orderDiff !== 0) return orderDiff

      return a.path.localeCompare(b.path, 'nb')
    })
    .map((e) => {
      const anchorKey = pathToAnchorKey(e.path)
      const anchorId = fieldId(anchorKey)
      const label = errorSummaryFieldLabels[anchorKey]
      return { anchorId, message: label ? `${label}: ${e.message}` : e.message }
    })
    .filter((e) => {
      if (seen.has(e.anchorId)) return false
      seen.add(e.anchorId)
      return true
    })
}

const focusById = (anchorId: string) => {
  const el = document.getElementById(anchorId)
  if (!el) return

  const isFocusableElement = (node: Element): node is HTMLElement => {
    return 'focus' in node && typeof (node as any).focus === 'function'
  }

  let target: HTMLElement = el as HTMLElement

  if (!(isFocusableElement(el) && el.matches('input, textarea, select, button'))) {
    const candidate = el.querySelector(
      'input:not([type="hidden"]):not([disabled]), textarea:not([disabled]), select:not([disabled]), button:not([disabled])'
    )

    if (candidate && isFocusableElement(candidate)) {
      target = candidate
    }
  }

  target.scrollIntoView({ block: 'center' })

  if (isFocusableElement(target)) {
    target.focus()
  }
}

const InformationtypeForm = ({ formInitialValues, submit }: TFormProps) => {
  const [codelistUtils] = CodelistService()
  const codelistLoaded = codelistUtils.isLoaded()

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

  const ignoreNextSensitivityOnChangeRef = useRef(false)

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
  }, [formInitialValues.orgMaster, codelistLoaded])

  useEffect(() => {
    const initialSensitivity = initialValueSensitivity()
    const first = initialSensitivity.length ? initialSensitivity[0] : undefined
    setSensitivityInputValue(first?.label || '')
  }, [formInitialValues.sensitivity, codelistLoaded])

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
      >
        {(formikBag: FormikProps<IInformationtypeFormValues>) => (
          <Form onKeyDown={disableEnter}>
            <div className="w-full max-w-[100ch]">
              <div className="grid gap-6 grid-cols-1">
                <div id={fieldId('name')} tabIndex={-1}>
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
                          error={
                            form.submitCount > 0 && typeof form.errors.name === 'string'
                              ? form.errors.name
                              : undefined
                          }
                        />
                      </div>
                    )}
                  </Field>
                </div>

                <div id={fieldId('orgMaster')} tabIndex={-1}>
                  <Field name="orgMaster">
                    {({ form }: FieldProps<IInformationtypeFormValues>) => (
                      <div className="mb-4">
                        <div className="mb-2 self-center">
                          <Label>Master i NAV</Label>
                        </div>

                        {(() => {
                          const parsedOptions = codelistUtils.getParsedOptions(EListName.SYSTEM)
                          const selected = formikBag.values.orgMaster
                            ? parsedOptions.find(
                                (o: IGetParsedOptionsProps) => o.id === formikBag.values.orgMaster
                              )
                            : undefined
                          const selectedLabel = selected?.label || ''

                          return (
                            <UNSAFE_Combobox
                              label=""
                              hideLabel
                              shouldShowSelectedOptions={false}
                              options={parsedOptions.map((o: IGetParsedOptionsProps) => ({
                                value: o.id,
                                label: o.label,
                              }))}
                              value={masterInputValue}
                              onChange={(newValue) => {
                                if (formikBag.values.orgMaster && newValue === '') {
                                  return
                                }

                                setMasterInputValue(newValue)

                                if (
                                  formikBag.values.orgMaster &&
                                  newValue !== '' &&
                                  newValue !== selectedLabel
                                ) {
                                  form.setFieldValue('orgMaster', undefined)
                                }
                              }}
                              selectedOptions={
                                selected ? [{ value: selected.id, label: selected.label }] : []
                              }
                              onToggleSelected={(optionValue, isSelected) => {
                                if (!isSelected) {
                                  setMasterInputValue('')
                                  form.setFieldValue('orgMaster', undefined)
                                  return
                                }

                                const picked = parsedOptions.find(
                                  (o: IGetParsedOptionsProps) => o.id === optionValue
                                )

                                setMasterInputValue(picked?.label || '')
                                form.setFieldValue('orgMaster', optionValue)
                              }}
                            />
                          )
                        })()}
                      </div>
                    )}
                  </Field>
                  <Error fieldName="orgMaster" fullWidth />
                </div>

                <div id={fieldId('term')} tabIndex={-1}>
                  <Field name="term">
                    {({ form }: FieldProps<IInformationtypeFormValues>) => (
                      <div>
                        <div className="mb-2 self-center">
                          <Label>Begrepsdefinisjon (oppslag i Begrepskatalogen)</Label>
                        </div>
                        <UNSAFE_Combobox
                          label=""
                          hideLabel
                          placeholder="Søk"
                          isLoading={termSearchLoading}
                          shouldShowSelectedOptions={false}
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
                            if (formikBag.values.term && newValue === '') {
                              return
                            }

                            setTermInputValue(newValue)
                            setTermSearch(newValue)
                            if (formikBag.values.term && newValue !== '') {
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
                  </Field>
                  <Error fieldName="term" fullWidth />
                </div>

                <div id={fieldId('sources')} tabIndex={-1}>
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
                        <div className="mt-2 flex flex-wrap gap-2">
                          {renderTagList(
                            codelistUtils.getShortnames(
                              EListName.THIRD_PARTY,
                              formikBag.values.sources
                            ),
                            arrayHelpers
                          )}
                        </div>
                      </div>
                    )}
                  />
                  <Error fieldName="sources" fullWidth />
                </div>

                <div id={fieldId('keywords')} tabIndex={-1}>
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
                            className="ml-2"
                            type="button"
                            variant="secondary"
                            icon={<PlusIcon aria-hidden />}
                            aria-label="Legg til søkeord"
                            onClick={() => onAddKeyword(arrayHelpers)}
                          />
                        </div>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {renderTagList(formikBag.values.keywords, arrayHelpers)}
                        </div>
                      </div>
                    )}
                  </FieldArray>
                  <Error fieldName="keywords" fullWidth />
                </div>

                <div id={fieldId('productTeams')} tabIndex={-1}>
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

                <div id={fieldId('categories')} tabIndex={-1}>
                  <FieldArray
                    name="categories"
                    render={(arrayHelpers: FieldArrayRenderProps) => (
                      <div>
                        <div className="mb-2 self-center">
                          <Label>Kategorier</Label>
                        </div>
                        {(() => {
                          const fieldError = formikBag.errors.categories
                          const message =
                            formikBag.submitCount > 0
                              ? typeof fieldError === 'string'
                                ? fieldError
                                : flattenFormikErrors(fieldError, 'categories').find(
                                    (e) => e.message
                                  )?.message
                              : undefined

                          return (
                            <UNSAFE_Combobox
                              label=""
                              hideLabel
                              error={message}
                              options={getParsedOptions(
                                EListName.CATEGORY,
                                formikBag.values.categories
                              ).map((o: IGetParsedOptionsProps) => ({
                                value: o.id,
                                label: o.label,
                              }))}
                              value={''}
                              onChange={() => undefined}
                              selectedOptions={[]}
                              onToggleSelected={(optionValue, isSelected) => {
                                if (!isSelected) return
                                arrayHelpers.push(optionValue)
                              }}
                            />
                          )
                        })()}
                        <div className="mt-2 flex flex-wrap gap-2">
                          {renderTagList(
                            codelistUtils.getShortnames(
                              EListName.CATEGORY,
                              formikBag.values.categories
                            ),
                            arrayHelpers
                          )}
                        </div>
                      </div>
                    )}
                  />
                </div>

                <div id={fieldId('description')} tabIndex={-1}>
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

                <div id={fieldId('sensitivity')} tabIndex={-1}>
                  <Field name="sensitivity">
                    {({ form }: FieldProps<IInformationtypeFormValues>) => (
                      <div>
                        <div className="mb-2 self-center">
                          <Label>Type personopplysning</Label>
                        </div>

                        {(() => {
                          const parsedOptions = codelistUtils
                            .getParsedOptions(EListName.SENSITIVITY)
                            .filter(
                              (sensitivity: IGetParsedOptionsProps) =>
                                !sensitivity.label.includes('Ikke')
                            )

                          const selected = formikBag.values.sensitivity
                            ? parsedOptions.find(
                                (o: IGetParsedOptionsProps) => o.id === formikBag.values.sensitivity
                              )
                            : undefined

                          const selectedLabel = selected?.label || ''

                          const comboboxOptions = parsedOptions.map(
                            (o: IGetParsedOptionsProps) => ({
                              value: o.id,
                              label: o.label,
                            })
                          )

                          return (
                            <UNSAFE_Combobox
                              label=""
                              hideLabel
                              error={
                                formikBag.submitCount > 0 &&
                                typeof form.errors.sensitivity === 'string'
                                  ? form.errors.sensitivity
                                  : undefined
                              }
                              shouldShowSelectedOptions={false}
                              options={comboboxOptions}
                              filteredOptions={comboboxOptions}
                              value={sensitivityInputValue}
                              onChange={(newValue) => {
                                if (ignoreNextSensitivityOnChangeRef.current) {
                                  ignoreNextSensitivityOnChangeRef.current = false
                                  return
                                }

                                if (formikBag.values.sensitivity && newValue === '') {
                                  return
                                }

                                setSensitivityInputValue(newValue)

                                if (
                                  formikBag.values.sensitivity &&
                                  newValue !== '' &&
                                  newValue !== selectedLabel
                                ) {
                                  form.setFieldValue('sensitivity', '')
                                }
                              }}
                              selectedOptions={
                                selected ? [{ value: selected.id, label: selected.label }] : []
                              }
                              onToggleSelected={(optionValue, isSelected) => {
                                if (!isSelected) {
                                  setSensitivityInputValue('')
                                  form.setFieldValue('sensitivity', '')
                                  return
                                }

                                ignoreNextSensitivityOnChangeRef.current = true

                                const picked = parsedOptions.find(
                                  (o: IGetParsedOptionsProps) => o.id === optionValue
                                )
                                setSensitivityInputValue(picked?.label || '')
                                form.setFieldValue('sensitivity', optionValue)
                              }}
                            />
                          )
                        })()}
                      </div>
                    )}
                  </Field>
                </div>
              </div>

              {formikBag.submitCount > 0 && Object.keys(formikBag.errors ?? {}).length > 0 && (
                <div className="mt-8">
                  <ErrorSummary
                    className="polly-error-summary-flush"
                    heading="Du må rette disse feilene før du kan lagre"
                    size="small"
                  >
                    {buildErrorSummaryItems(formikBag.errors).map((e) => (
                      <ErrorSummary.Item
                        key={e.anchorId}
                        href={`#${e.anchorId}`}
                        onClick={(evt) => {
                          evt.preventDefault()
                          focusById(e.anchorId)
                        }}
                      >
                        {e.message}
                      </ErrorSummary.Item>
                    ))}
                  </ErrorSummary>
                </div>
              )}

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
            </div>
          </Form>
        )}
      </Formik>
    </Fragment>
  )
}

export default InformationtypeForm
