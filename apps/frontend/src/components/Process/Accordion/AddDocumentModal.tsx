import { Modal, ModalBody, ModalButton, ModalFooter, ModalHeader, ROLE, SIZE } from 'baseui/modal'
import { Button, KIND } from 'baseui/button'
import * as React from 'react'
import { useEffect, useState } from 'react'
import { AddDocumentToProcessFormValues, Document, DocumentInfoTypeUse, Policy, Process } from '../../../constants'
import { Block, BlockProps } from 'baseui/block'
import { ArrayHelpers, Field, FieldArray, FieldArrayRenderProps, FieldProps, Form, Formik, FormikProps } from 'formik'
import { useDebouncedState } from '../../../util'
import { addDocumentToProcessSchema } from '../../common/schema'
import { Error, ModalLabel } from '../../common/ModalSchema'
import { Option, Select, TYPE } from 'baseui/select'
import { getDefaultProcessDocument, searchDocuments } from '../../../api'
import { ListItem } from 'baseui/list'
import { useStyletron } from 'baseui'
import { codelist, ListName } from '../../../service/Codelist'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMinusCircle } from '@fortawesome/free-solid-svg-icons'
import { Sensitivity } from '../../InformationType/Sensitivity'
import { ParagraphSmall } from 'baseui/typography'
import CustomizedStatefulTooltip from '../../common/CustomizedStatefulTooltip'
import { Spinner } from '../../common/Spinner'
import { disableEnter } from '../../../util/helper-functions'

const modalBlockProps: BlockProps = {
  width: '750px',
  paddingRight: '2rem',
  paddingLeft: '2rem',
}

const rowBlockProps: BlockProps = {
  display: 'flex',
  width: '100%',
  marginTop: '1rem',
}

type AddDocumentProps = {
  isOpen: boolean
  addDefaultDocument: boolean
  submit: (values: AddDocumentToProcessFormValues) => void
  onClose: () => void

  process: Process
  error: string | null
}

const ListInformationTypes = (props: { informationTypes: DocumentInfoTypeUse[]; formik: FormikProps<AddDocumentToProcessFormValues>; arrayHelpers: ArrayHelpers }) => {
  const { informationTypes, formik, arrayHelpers } = props
  const [css] = useStyletron()

  return (
    <ul className={css({ paddingLeft: 0, width: '100%' })}>
      {informationTypes.map((informationType, index) => (
        <ListItem key={informationType.informationTypeId} sublist>
          <div className="flex w-full justify-between">
            <div className="flex justify-between w-[90%] items-center">
              <div>
                <Sensitivity sensitivity={informationType.informationType.sensitivity} />
                &nbsp;
                {informationType.informationType.name}
              </div>
              <div className="opacity-80">{informationType.subjectCategories.map((s) => codelist.getShortname(ListName.SUBJECT_CATEGORY, s.code)).join(', ')}</div>
            </div>
            <CustomizedStatefulTooltip content='Fjern'>
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

export const AddDocumentModal = (props: AddDocumentProps) => {
  const [defaultDoc, setDefaultDoc] = useState<Document | undefined>()
  const [documents, setDocuments] = useState<Document[]>([])
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

  function extractInfoTypes(document: Document, existingPolicies: Policy[]) {
    const infoTypeUses = document.informationTypes
      .map((infoType) => {
        // remove subject categories already in use for this process
        const alreadyUsedSubjectCategoriies = existingPolicies
          .filter((p) => p.informationType.id === infoType.informationTypeId)
          .flatMap((p) => p.subjectCategories)
          .map((c) => c.code)
        const remainingSubjectCategories = infoType.subjectCategories.filter((c) => alreadyUsedSubjectCategoriies.indexOf(c.code) < 0)
        return { ...infoType, subjectCategories: remainingSubjectCategories }
      })
      .filter((infoType) => !!infoType.subjectCategories.length) // remove infoTypes with no set subjectCategories
    infoTypeUses.sort((a, b) => a.informationType.name.localeCompare(b.informationType.name))
    return infoTypeUses
  }

  return (
    <Modal onClose={onCloseModal} isOpen={props.isOpen} animate size={SIZE.auto} role={ROLE.dialog}>
      {loading && <Spinner />}
      {!loading && (
        <Formik
          onSubmit={props.submit}
          initialValues={
            {
              document: props.addDefaultDocument ? defaultDoc : undefined,
              informationTypes: props.addDefaultDocument ? extractInfoTypes(defaultDoc!, props.process.policies) : [],
              process: props.process,
              linkDocumentToPolicies: !props.addDefaultDocument,
            } as AddDocumentToProcessFormValues
          }
          validationSchema={addDocumentToProcessSchema()}
          render={(formik: FormikProps<AddDocumentToProcessFormValues>) => {
            const selectDocument = (document: Document, isDefault: boolean) => {
              formik.setFieldValue('defaultDocument', isDefault)
              formik.setFieldValue('document', document)
              formik.setFieldValue('informationTypes', extractInfoTypes(document, props.process.policies))
            }

            return (
              <Form onKeyDown={disableEnter}>
                <ModalHeader>Legg til opplysningstyper fra dokument</ModalHeader>
                <ModalBody>
                  <Block {...modalBlockProps}>
                    <Block {...rowBlockProps}>
                      <ModalLabel label='Dokument' />
                      <Field
                        name="document"
                        render={({ form }: FieldProps<AddDocumentToProcessFormValues>) => (
                          <>
                            <Select
                              clearable={false}
                              isLoading={searchLoading}
                              autoFocus
                              noResultsMsg='Ingen'
                              maxDropdownHeight="400px"
                              searchable={true}
                              type={TYPE.search}
                              options={documents}
                              placeholder='Søk dokumenter'
                              value={form.values.document ? [form.values.document as Option] : []}
                              onInputChange={(event) => setDocumentSearch(event.currentTarget.value)}
                              onChange={(params) => {
                                let document = params.value[0] as Document
                                formik.setFieldValue('defaultDocument', false)
                                selectDocument(document, false)
                              }}
                              error={!!form.errors.document && !!form.submitCount}
                              filterOptions={(options) => options.filter((doc) => !!doc.informationTypes.length)}
                              labelKey="name"
                            />
                            {!formik.values.document && defaultDoc && (
                              <Button type="button" kind="secondary" size="compact" style={{ marginLeft: '.5rem' }} onClick={() => selectDocument(defaultDoc, true)}>
                                Standard opplysningstyper
                              </Button>
                            )}
                          </>
                        )}
                      />
                    </Block>
                    <Error fieldName="document" />

                    {!!formik.values.document && (
                      <>
                        <ParagraphSmall>{formik.values.document.description}</ParagraphSmall>
                        <Block {...rowBlockProps}>
                          <ModalLabel label='Opplysningstyper' />
                          <FieldArray
                            name="informationTypes"
                            render={(arrayHelpers: FieldArrayRenderProps) => (
                              <ListInformationTypes informationTypes={formik.values.informationTypes} formik={formik} arrayHelpers={arrayHelpers} />
                            )}
                          />
                        </Block>
                      </>
                    )}
                    <Error fieldName="informationTypes" />
                  </Block>
                </ModalBody>
                <ModalFooter>
                  <Block display="flex" justifyContent="flex-end">
                    <Block alignSelf="flex-end">{props.error && <p>{props.error}</p>}</Block>
                    <Button type="button" kind={KIND.tertiary} onClick={onCloseModal}>
                      Avbryt
                    </Button>
                    <ModalButton type="submit">Legg til</ModalButton>
                  </Block>
                </ModalFooter>
              </Form>
            )
          }}
        />
      )}
    </Modal>
  )
}
