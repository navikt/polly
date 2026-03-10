import { MinusCircleIcon } from '@navikt/aksel-icons'
import { BodyShort, Button, Label, List, Loader, Modal, Tooltip } from '@navikt/ds-react'
import {
  ArrayHelpers,
  Field,
  FieldArray,
  FieldArrayRenderProps,
  FieldProps,
  Form,
  Formik,
  FormikProps,
} from 'formik'
import { useEffect, useState } from 'react'
import { getDefaultProcessDocument, searchDocuments } from '../../../api/GetAllApi'
import {
  IAddDocumentToProcessFormValues,
  IDocument,
  IDocumentInfoTypeUse,
  IPolicy,
  IProcess,
} from '../../../constants'
import { CodelistService, EListName, ICode } from '../../../service/Codelist'
import { disableEnter } from '../../../util/helper-functions'
import { Sensitivity } from '../../InformationType/Sensitivity'
import CustomSearchSelect from '../../common/AsyncSelectComponents'
import { Error, ModalLabel } from '../../common/ModalSchema'
import { addDocumentToProcessSchema } from '../../common/schemaValidation'

type TAddDocumentProps = {
  isOpen: boolean
  addDefaultDocument: boolean
  submit: (values: IAddDocumentToProcessFormValues) => void
  onClose: () => void
  process: IProcess
  error: string | null
}

interface IListInformationTypesProps {
  informationTypes: IDocumentInfoTypeUse[]
  formik: FormikProps<IAddDocumentToProcessFormValues>
  arrayHelpers: ArrayHelpers
}

const ListInformationTypes = (props: IListInformationTypesProps) => {
  const { informationTypes, formik, arrayHelpers } = props
  const [codelistUtils] = CodelistService()

  return (
    <List as="ul" className="w-full">
      {informationTypes.map((informationType: IDocumentInfoTypeUse, index: number) => (
        <List.Item key={informationType.informationTypeId}>
          <div className="flex w-full justify-between">
            <div className="flex justify-between w-[90%] items-center">
              <div>
                <Sensitivity
                  sensitivity={informationType.informationType.sensitivity}
                  codelistUtils={codelistUtils}
                />
                &nbsp;
                {informationType.informationType.name}
              </div>
              <div className="opacity-80">
                {informationType.subjectCategories
                  .map((subjectCategory: ICode) =>
                    codelistUtils.getShortname(EListName.SUBJECT_CATEGORY, subjectCategory.code)
                  )
                  .join(', ')}
              </div>
            </div>
            <Tooltip content="Fjern">
              <Button
                size="small"
                variant="tertiary"
                type="button"
                onClick={() => {
                  const length = formik.values.informationTypes.length
                  arrayHelpers.remove(index)
                  if (length === 1) {
                    formik.setFieldValue('document', undefined)
                  }
                }}
              >
                {' '}
                <MinusCircleIcon aria-hidden className="block" />{' '}
              </Button>
            </Tooltip>
          </div>
        </List.Item>
      ))}
    </List>
  )
}

export const AddDocumentModal = (props: TAddDocumentProps) => {
  const { isOpen, submit, addDefaultDocument, process, error } = props
  const [defaultDoc, setDefaultDoc] = useState<IDocument | undefined>()
  const loading = !defaultDoc

  const useSearchDocumentOption = async (searchParam: string) => {
    if (searchParam && searchParam.length > 2) {
      const dokumenter: IDocument[] = (await searchDocuments(searchParam)).content

      const searchResult = dokumenter
        .filter((document) => !!document.informationTypes.length)
        .map((dokument) => {
          return {
            ...dokument,
            value: dokument.id,
            label: dokument.name,
          }
        })

      return searchResult
    }
    return []
  }

  useEffect(() => {
    ;(async () => {
      setDefaultDoc(await getDefaultProcessDocument())
    })()
  }, [])

  const onCloseModal = () => {
    props.onClose()
  }

  function extractInfoTypes(document: IDocument, existingPolicies: IPolicy[]) {
    const infoTypeUses = document.informationTypes
      .map((infoType) => {
        // remove subject categories already in use for this process
        const alreadyUsedSubjectCategoriies = existingPolicies
          .filter((policy) => policy.informationType.id === infoType.informationTypeId)
          .flatMap((policy) => policy.subjectCategories)
          .map((policy) => policy.code)
        const remainingSubjectCategories: ICode[] = infoType.subjectCategories.filter(
          (subjectCategory) => alreadyUsedSubjectCategoriies.indexOf(subjectCategory.code) < 0
        )

        return { ...infoType, subjectCategories: remainingSubjectCategories }
      })
      .filter((infoType) => !!infoType.subjectCategories.length) // remove infoTypes with no set subjectCategories
    infoTypeUses.sort((a, b) => a.informationType.name.localeCompare(b.informationType.name))
    return infoTypeUses
  }

  return (
    <Modal
      onClose={onCloseModal}
      open={isOpen}
      width="750px"
      header={{ heading: 'Legg til opplysningstyper fra dokument' }}
    >
      {loading && (
        <div className="flex w-full justify-center">
          <Loader size="3xlarge" />
        </div>
      )}
      {isOpen && !loading && (
        <Formik
          onSubmit={submit}
          initialValues={
            {
              document: addDefaultDocument ? defaultDoc : undefined,
              informationTypes:
                addDefaultDocument && defaultDoc
                  ? extractInfoTypes(defaultDoc, process.policies)
                  : [],
              process: process,
              linkDocumentToPolicies: !addDefaultDocument,
            } as IAddDocumentToProcessFormValues
          }
          validationSchema={addDocumentToProcessSchema()}
        >
          {(formik: FormikProps<IAddDocumentToProcessFormValues>) => {
            const selectDocument: (document: IDocument, isDefault: boolean) => void = (
              document: IDocument,
              _isDefault: boolean
            ) => {
              formik.setValues({
                ...formik.values,
                document: document,
                informationTypes: extractInfoTypes(document, process.policies),
              })
            }

            return (
              <Form onKeyDown={disableEnter}>
                <Modal.Body className="min-h-125">
                  <div className="flex flex-col gap-4 px-8 py-4">
                    <div className="flex flex-col gap-1">
                      <Label size="small">Dokument</Label>
                      <Field name="document">
                        {({}: FieldProps<IAddDocumentToProcessFormValues>) => (
                          <>
                            <CustomSearchSelect
                              ariaLabel="Søk dokumenter"
                              placeholder=""
                              loadOptions={useSearchDocumentOption}
                              onChange={(value: IDocument | undefined) => {
                                if (value) {
                                  selectDocument(value, false)
                                }
                              }}
                            />
                            {!formik.values.document && defaultDoc && (
                              <Button
                                type="button"
                                variant="secondary"
                                size="small"
                                className="mt-2 self-start"
                                onClick={() => selectDocument(defaultDoc, true)}
                              >
                                Standard opplysningstyper
                              </Button>
                            )}
                          </>
                        )}
                      </Field>
                      <Error fieldName="document" />
                    </div>

                    {!!formik.values.document && (
                      <div className="flex flex-col gap-2">
                        {formik.values.document.description && (
                          <BodyShort className="text-gray-600">
                            {formik.values.document.description}
                          </BodyShort>
                        )}
                        <div className="flex flex-col gap-1">
                          <ModalLabel label="Opplysningstyper" />
                          <FieldArray name="informationTypes">
                            {(arrayHelpers: FieldArrayRenderProps) => (
                              <ListInformationTypes
                                informationTypes={formik.values.informationTypes}
                                formik={formik}
                                arrayHelpers={arrayHelpers}
                              />
                            )}
                          </FieldArray>
                          <Error fieldName="informationTypes" />
                        </div>
                      </div>
                    )}
                  </div>
                </Modal.Body>
                <Modal.Footer>
                  <div className="flex items-center justify-end gap-2">
                    {error && <p className="text-red-600">{error}</p>}
                    <Button type="button" variant="tertiary" onClick={onCloseModal}>
                      Avbryt
                    </Button>
                    <Button type="submit">Legg til</Button>
                  </div>
                </Modal.Footer>
              </Form>
            )
          }}
        </Formik>
      )}
    </Modal>
  )
}
