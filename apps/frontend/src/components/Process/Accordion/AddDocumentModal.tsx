import { faMinusCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useStyletron } from 'baseui'
import { Button, KIND } from 'baseui/button'
import { ListItem } from 'baseui/list'
import { Modal, ModalBody, ModalButton, ModalFooter, ModalHeader, ROLE, SIZE } from 'baseui/modal'
import { OnChangeParams, Option, Select, TYPE } from 'baseui/select'
import { ParagraphSmall } from 'baseui/typography'
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
import { ChangeEvent, useEffect, useState } from 'react'
import { getDefaultProcessDocument, searchDocuments } from '../../../api'
import {
  IAddDocumentToProcessFormValues,
  IDocument,
  IDocumentInfoTypeUse,
  IPolicy,
  IProcess,
} from '../../../constants'
import { EListName, ICode, codelist } from '../../../service/Codelist'
import { useDebouncedState } from '../../../util'
import { disableEnter } from '../../../util/helper-functions'
import { Sensitivity } from '../../InformationType/Sensitivity'
import CustomizedStatefulTooltip from '../../common/CustomizedStatefulTooltip'
import { Error, ModalLabel } from '../../common/ModalSchema'
import { Spinner } from '../../common/Spinner'
import { addDocumentToProcessSchema } from '../../common/schema'

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
  const [css] = useStyletron()

  return (
    <ul className={css({ paddingLeft: 0, width: '100%' })}>
      {informationTypes.map((informationType: IDocumentInfoTypeUse, index: number) => (
        <ListItem key={informationType.informationTypeId} sublist>
          <div className="flex w-full justify-between">
            <div className="flex justify-between w-[90%] items-center">
              <div>
                <Sensitivity sensitivity={informationType.informationType.sensitivity} />
                &nbsp;
                {informationType.informationType.name}
              </div>
              <div className="opacity-80">
                {informationType.subjectCategories
                  .map((subjectCategory: ICode) =>
                    codelist.getShortname(EListName.SUBJECT_CATEGORY, subjectCategory.code)
                  )
                  .join(', ')}
              </div>
            </div>
            <CustomizedStatefulTooltip content="Fjern">
              <Button
                size="compact"
                kind="tertiary"
                shape="round"
                onClick={() => {
                  const length = formik.values.informationTypes.length
                  arrayHelpers.remove(index)
                  if (length === 1) {
                    formik.setFieldValue('document', undefined)
                  }
                }}
              >
                {' '}
                <FontAwesomeIcon icon={faMinusCircle} />{' '}
              </Button>
            </CustomizedStatefulTooltip>
          </div>
        </ListItem>
      ))}
    </ul>
  )
}

export const AddDocumentModal = (props: TAddDocumentProps) => {
  const { isOpen, submit, addDefaultDocument, process, error } = props
  const [defaultDoc, setDefaultDoc] = useState<IDocument | undefined>()
  const [documents, setDocuments] = useState<IDocument[]>([])
  const [documentSearch, setDocumentSearch] = useDebouncedState<string>('', 400)
  const [searchLoading, setSearchLoading] = useState<boolean>(false)

  const loading = !defaultDoc

  useEffect(() => {
    ;(async () => {
      setDefaultDoc(await getDefaultProcessDocument())
    })()
  }, [])

  useEffect(() => {
    ;(async () => {
      if (documentSearch && documentSearch.length > 2) {
        setSearchLoading(true)
        const res = await searchDocuments(documentSearch)
        setDocuments(res.content)
        setSearchLoading(false)
      }
    })()
  }, [documentSearch])

  const onCloseModal = () => {
    setDocumentSearch('')
    setDocuments([])
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
    <Modal onClose={onCloseModal} isOpen={isOpen} animate size={SIZE.auto} role={ROLE.dialog}>
      {loading && <Spinner />}
      {!loading && (
        <Formik
          onSubmit={submit}
          initialValues={
            {
              document: addDefaultDocument ? defaultDoc : undefined,
              informationTypes: addDefaultDocument
                ? extractInfoTypes(defaultDoc!, process.policies)
                : [],
              process: process,
              linkDocumentToPolicies: !addDefaultDocument,
            } as IAddDocumentToProcessFormValues
          }
          validationSchema={addDocumentToProcessSchema()}
          render={(formik: FormikProps<IAddDocumentToProcessFormValues>) => {
            const selectDocument: (document: IDocument, isDefault: boolean) => void = (
              document: IDocument,
              isDefault: boolean
            ) => {
              formik.setFieldValue('defaultDocument', isDefault)
              formik.setFieldValue('document', document)
              formik.setFieldValue('informationTypes', extractInfoTypes(document, process.policies))
            }

            return (
              <Form onKeyDown={disableEnter}>
                <ModalHeader>Legg til opplysningstyper fra dokument</ModalHeader>
                <ModalBody>
                  <div className="w-[750px] px-8">
                    <div className="flex w-full mt-4">
                      <ModalLabel label="Dokument" />
                      <Field
                        name="document"
                        render={({ form }: FieldProps<IAddDocumentToProcessFormValues>) => (
                          <>
                            <Select
                              clearable={false}
                              isLoading={searchLoading}
                              noResultsMsg="Ingen"
                              maxDropdownHeight="400px"
                              searchable={true}
                              type={TYPE.search}
                              options={documents}
                              placeholder="Søk dokumenter"
                              value={form.values.document ? [form.values.document as Option] : []}
                              onInputChange={(event: ChangeEvent<HTMLInputElement>) =>
                                setDocumentSearch(event.currentTarget.value)
                              }
                              onChange={(params: OnChangeParams) => {
                                const document = params.value[0] as IDocument
                                formik.setFieldValue('defaultDocument', false)
                                selectDocument(document, false)
                              }}
                              error={!!form.errors.document && !!form.submitCount}
                              filterOptions={(options) =>
                                options.filter((doc) => !!doc.informationTypes.length)
                              }
                              labelKey="name"
                            />
                            {!formik.values.document && defaultDoc && (
                              <Button
                                type="button"
                                kind="secondary"
                                size="compact"
                                style={{ marginLeft: '.5rem' }}
                                onClick={() => selectDocument(defaultDoc, true)}
                              >
                                Standard opplysningstyper
                              </Button>
                            )}
                          </>
                        )}
                      />
                    </div>
                    <Error fieldName="document" />

                    {!!formik.values.document && (
                      <>
                        <ParagraphSmall>{formik.values.document.description}</ParagraphSmall>
                        <div className="flex w-full mt-4">
                          <ModalLabel label="Opplysningstyper" />
                          <FieldArray
                            name="informationTypes"
                            render={(arrayHelpers: FieldArrayRenderProps) => (
                              <ListInformationTypes
                                informationTypes={formik.values.informationTypes}
                                formik={formik}
                                arrayHelpers={arrayHelpers}
                              />
                            )}
                          />
                        </div>
                      </>
                    )}
                    <Error fieldName="informationTypes" />
                  </div>
                </ModalBody>
                <ModalFooter>
                  <div className="flex justify-end">
                    <div className="self-end">{error && <p>{error}</p>}</div>
                    <Button type="button" kind={KIND.tertiary} onClick={onCloseModal}>
                      Avbryt
                    </Button>
                    <ModalButton type="submit">Legg til</ModalButton>
                  </div>
                </ModalFooter>
              </Form>
            )
          }}
        />
      )}
    </Modal>
  )
}
