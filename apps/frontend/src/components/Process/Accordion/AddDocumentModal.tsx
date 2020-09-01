import {Modal, ModalBody, ModalButton, ModalFooter, ModalHeader, ROLE, SIZE} from 'baseui/modal'
import {Button, KIND} from 'baseui/button'
import * as React from 'react'
import {KeyboardEvent, useEffect, useState} from 'react'
import {AddDocumentToProcessFormValues, Document, DocumentInfoTypeUse, Policy, Process} from '../../../constants'
import {Block, BlockProps} from 'baseui/block'
import {ArrayHelpers, Field, FieldArray, FieldProps, Form, Formik, FormikProps} from 'formik'
import {intl, useDebouncedState} from '../../../util'
import {addDocumentToProcessSchema} from '../../common/schema'
import {Error, ModalLabel} from '../../common/ModalSchema'
import {Option, Select, TYPE} from 'baseui/select'
import {getDefaultProcessDocument, searchDocuments} from '../../../api'
import {ListItem} from 'baseui/list'
import {useStyletron} from 'baseui'
import {codelist, ListName} from '../../../service/Codelist'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faMinusCircle} from '@fortawesome/free-solid-svg-icons'
import {Sensitivity} from '../../InformationType/Sensitivity'
import {Paragraph3} from 'baseui/typography'
import {Spinner} from 'baseui/spinner'
import CustomizedStatefulTooltip from "../../common/CustomizedStatefulTooltip";

const modalBlockProps: BlockProps = {
  width: '750px',
  paddingRight: '2rem',
  paddingLeft: '2rem'
}

const rowBlockProps: BlockProps = {
  display: 'flex',
  width: '100%',
  marginTop: '1rem'
}

type AddDocumentProps = {
  isOpen: boolean
  addDefaultDocument: boolean
  submit: (values: AddDocumentToProcessFormValues) => void;
  onClose: () => void;

  process: Process
  error: string | null
}

const ListInformationTypes = (props: {informationTypes: DocumentInfoTypeUse[], formik: FormikProps<AddDocumentToProcessFormValues>, arrayHelpers: ArrayHelpers}) => {
  const {informationTypes, formik, arrayHelpers} = props
  const [css] = useStyletron()

  return <ul className={css({paddingLeft: 0, width: '100%'})}>
    {informationTypes.map((informationType, index) => (

      <ListItem key={informationType.informationTypeId} sublist>
        <Block display="flex" width="100%" justifyContent="space-between">
          <Block display="flex" justifyContent="space-between" width="90%" alignItems="center">
            <Block>
              <Sensitivity sensitivity={informationType.informationType.sensitivity}/>&nbsp;
              {informationType.informationType.name}
            </Block>
            <Block $style={{opacity: '80%'}}>
              {informationType.subjectCategories.map(s => codelist.getShortname(ListName.SUBJECT_CATEGORY, s.code)).join(', ')}
            </Block>
          </Block>
          <CustomizedStatefulTooltip content={intl.remove}>
            <Button size="compact" kind="tertiary" shape="round" onClick={() => {
              const length = formik.values.informationTypes.length
              arrayHelpers.remove(index)
              if (length === 1) {
                formik.setFieldValue('document', undefined)
              }
            }}> <FontAwesomeIcon icon={faMinusCircle}/> </Button>
          </CustomizedStatefulTooltip>
        </Block>
      </ListItem>
    ))}
  </ul>
}

export const AddDocumentModal = (props: AddDocumentProps) => {
  const [defaultDoc, setDefaultDoc] = useState<Document | undefined>()
  const [documents, setDocuments] = useState<Document[]>([])
  const [documentSearch, setDocumentSearch] = useDebouncedState<string>('', 400)
  const [searchLoading, setSearchLoading] = useState<boolean>(false)

  const loading = !defaultDoc

  useEffect(() => {
    (async () => {
      setDefaultDoc(await getDefaultProcessDocument())
    })()
  }, [])

  useEffect(() => {
    (async () => {
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

  const disableEnter = (e: KeyboardEvent) => {
    if (e.key === 'Enter') e.preventDefault()
  }

  function extractInfoTypes(document: Document, existingPolicies: Policy[]) {
    const infoTypeUses = document.informationTypes
    .filter(infoType => !!infoType.subjectCategories.length) // remove infoTypes with no set subjectCategories
    .map(infoType => { // remove subject categories already in use for this process
      const alreadyUsedSubjectCategoriies = existingPolicies.filter(p => p.informationType.id === infoType.id).flatMap(p => p.subjectCategories).map(c => c.code)
      const remainingSubjectCategories = infoType.subjectCategories.filter(c => alreadyUsedSubjectCategoriies.indexOf(c.code) >= 0)
      return {...infoType, subjectCategories: remainingSubjectCategories}
    })
    .filter(infoType => !!infoType.subjectCategories.length)
    infoTypeUses.sort((a, b) => a.informationType.name.localeCompare(b.informationType.name, intl.getLanguage()))
    return infoTypeUses
  }

  return (
    <Modal
      onClose={onCloseModal} isOpen={props.isOpen}
      animate
      size={SIZE.auto}
      unstable_ModalBackdropScroll={true}
      role={ROLE.dialog}
    >
      {loading && <Spinner/>}
      {!loading &&
      <Formik
        onSubmit={props.submit}
        initialValues={{
          document: props.addDefaultDocument ? defaultDoc : undefined,
          informationTypes: props.addDefaultDocument ? extractInfoTypes(defaultDoc!, props.process.policies) : [],
          process: props.process,
          defaultDocument: props.addDefaultDocument
        } as AddDocumentToProcessFormValues}
        validationSchema={addDocumentToProcessSchema()}
        render={(formik: FormikProps<AddDocumentToProcessFormValues>) => {

          const selectDocument = (document: Document, isDefault: boolean) => {
            formik.setFieldValue('defaultDocument', isDefault)
            formik.setFieldValue('document', document)
            formik.setFieldValue('informationTypes', extractInfoTypes(document, props.process.policies))
          }

          return (
            <Form onKeyDown={disableEnter}>
              <ModalHeader>{intl.addDocument}</ModalHeader>
              <ModalBody>
                <Block {...modalBlockProps}>

                  <Block {...rowBlockProps}>
                    <ModalLabel label={intl.document}/>
                    <Field name="document"
                           render={({form}: FieldProps<AddDocumentToProcessFormValues>) => (
                             <>
                               <Select
                                 clearable={false}
                                 isLoading={searchLoading}
                                 autoFocus
                                 noResultsMsg={intl.emptyTable}
                                 maxDropdownHeight="400px"
                                 searchable={true}
                                 type={TYPE.search}
                                 options={documents}
                                 placeholder={intl.searchDocuments}
                                 value={form.values.document ? [form.values.document as Option] : []}
                                 onInputChange={event => setDocumentSearch(event.currentTarget.value)}
                                 onChange={(params) => {
                                   let document = params.value[0] as Document
                                   formik.setFieldValue('defaultDocument', false)
                                   selectDocument(document, false)
                                 }}
                                 error={!!form.errors.document && !!form.submitCount}
                                 filterOptions={options => options.filter((doc) => !!doc.informationTypes.length)}
                                 labelKey="name"
                               />
                               {!formik.values.document && defaultDoc &&
                               <Button type="button" kind="secondary" size="compact" $style={{marginLeft: '.5rem'}}
                                       onClick={() => selectDocument(defaultDoc, true)}
                               >{intl.includeDefaultDocument}</Button>}
                             </>
                           )}/>
                  </Block>
                  <Error fieldName="document"/>

                  {!!formik.values.document &&
                  <>
                    <Paragraph3>{formik.values.document.description}</Paragraph3>
                    <Block {...rowBlockProps}>
                      <ModalLabel label={intl.informationTypes}/>
                      <FieldArray name="informationTypes"
                                  render={arrayHelpers => <ListInformationTypes informationTypes={formik.values.informationTypes} formik={formik} arrayHelpers={arrayHelpers}/>}/>
                    </Block>
                  </>
                  }
                  <Error fieldName="informationTypes"/>

                </Block>
              </ModalBody>
              <ModalFooter>
                <Block display="flex" justifyContent="flex-end">
                  <Block alignSelf="flex-end">{props.error && <p>{props.error}</p>}</Block>
                  <Button type="button" kind={KIND.minimal} onClick={onCloseModal}>{intl.abort}</Button>
                  <ModalButton type="submit">{intl.add}</ModalButton>
                </Block>
              </ModalFooter>

            </Form>
          )
        }}
      />}
    </Modal>
  )
}
