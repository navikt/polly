import { Modal, ModalBody, ModalButton, ModalFooter, ModalHeader, ROLE, SIZE } from "baseui/modal"
import { Button, KIND } from "baseui/button"
import * as React from "react"
import { KeyboardEvent, useEffect, useState } from "react"
import { AddDocumentToProcessFormValues, Document, DocumentInfoTypeUse, Process } from "../../../constants"
import { Block, BlockProps } from "baseui/block"
import { ArrayHelpers, Field, FieldArray, FieldProps, Form, Formik, FormikProps } from "formik"
import { intl, useDebouncedState } from "../../../util"
import { addDocumentToProcessSchema } from "../../common/schema"
import { Error, ModalLabel } from "../../common/ModalSchema"
import { Option, Select, TYPE } from "baseui/select"
import { getDefaultProcessDocument, searchDocuments } from "../../../api"
import { ListItem } from "baseui/list"
import { useStyletron } from "baseui"
import { codelist, ListName } from "../../../service/Codelist"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faMinusCircle } from "@fortawesome/free-solid-svg-icons"
import { Sensitivity } from "../../InformationType/Sensitivity"
import { PLACEMENT, StatefulTooltip } from "baseui/tooltip"
import { Paragraph3 } from "baseui/typography"

const modalBlockProps: BlockProps = {
  width: '750px',
  paddingRight: '2rem',
  paddingLeft: '2rem'
};

const rowBlockProps: BlockProps = {
  display: 'flex',
  width: '100%',
  marginTop: '1rem'
};

type AddDocumentProps = {
  isOpen: boolean
  submit: (values: AddDocumentToProcessFormValues) => void;
  onClose: () => void;

  process: Process
  error: string | null
}

const ListInformationTypes = (props: { informationTypes: DocumentInfoTypeUse[], formik: FormikProps<AddDocumentToProcessFormValues>, arrayHelpers: ArrayHelpers }) => {
  const {informationTypes, formik, arrayHelpers} = props;
  const [css] = useStyletron()

  return <ul className={css({paddingLeft: 0, width: "100%"})}>
    {informationTypes.map((informationType, index) => (

      <ListItem key={informationType.informationTypeId} sublist>
        <Block display="flex" width="100%" justifyContent="space-between">
          <Block display="flex" justifyContent="space-between" width="90%" alignItems="center">
            <Block>
              <Sensitivity sensitivity={informationType.informationType.sensitivity}/>&nbsp;
              {informationType.informationType.name}
            </Block>
            <Block $style={{opacity: "80%"}}>
              {informationType.subjectCategories.map(s => codelist.getShortname(ListName.SUBJECT_CATEGORY, s.code)).join(", ")}
            </Block>
          </Block>
          <StatefulTooltip content={intl.remove} placement={PLACEMENT.top}>
            <Button size="compact" kind="tertiary" shape="round" onClick={() => {
              const length = formik.values.informationTypes.length
              arrayHelpers.remove(index);
              if (length === 1) {
                formik.setFieldValue('document', undefined)
              }
            }}> <FontAwesomeIcon icon={faMinusCircle}/> </Button>
          </StatefulTooltip>
        </Block>
      </ListItem>
    ))}
  </ul>
}

export const AddDocumentModal = (props: AddDocumentProps) => {
  const [defaultDoc, setDefaultDoc] = React.useState<Document | undefined>();
  const [documents, setDocuments] = useState<Document[]>([])
  const [documentSearch, setDocumentSearch] = useDebouncedState<string>('', 400)
  const [loading, setLoading] = React.useState<boolean>(false);

  useEffect(() => {
    (async () => {
      setDefaultDoc(await getDefaultProcessDocument())
    })()
  }, [])

  useEffect(() => {
    (async () => {
      if (documentSearch && documentSearch.length > 2) {
        setLoading(true)
        const res = await searchDocuments(documentSearch)
        setDocuments(res.content)
        setLoading(false)
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

  return (
    <Modal
      onClose={onCloseModal} isOpen={props.isOpen}
      animate
      size={SIZE.auto}
      role={ROLE.dialog}
    >
      <Formik
        onSubmit={props.submit}
        initialValues={{document: undefined, informationTypes: [], process: props.process, defaultDocument: false}}
        validationSchema={addDocumentToProcessSchema()}
        render={(formik: FormikProps<AddDocumentToProcessFormValues>) => {

          const selectDefaultDocument = () => {
            formik.setFieldValue('defaultDocument', true)
            selectDocument(defaultDoc!)
          }

          const selectDocument = (document: Document) => {
            formik.setFieldValue('document', document)
            const infoTypeUses = document.informationTypes.filter(infoType => !!infoType.subjectCategories.length)
            infoTypeUses.sort((a, b) => a.informationType.name.localeCompare(b.informationType.name, intl.getLanguage()))
            formik.setFieldValue('informationTypes', infoTypeUses)
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
                                 isLoading={loading}
                                 autoFocus
                                 maxDropdownHeight="400px"
                                 searchable={true}
                                 type={TYPE.search}
                                 options={documents}
                                 placeholder={intl.searchDocuments}
                                 value={form.values.document ? [form.values.document as Option] : []}
                                 onInputChange={event => setDocumentSearch(event.currentTarget.value)}
                                 onChange={(params) => {
                                   let document = params.value[0] as Document;
                                   formik.setFieldValue('defaultDocument', false)
                                   selectDocument(document)
                                 }}
                                 error={!!form.errors.document && !!form.submitCount}
                                 filterOptions={options => options.filter((doc) => !!doc.informationTypes.length)}
                                 labelKey="name"
                               />
                               {!formik.values.document && defaultDoc &&
                               <Button type="button" kind="secondary" size="compact" $style={{marginLeft: ".5rem"}}
                                       onClick={selectDefaultDocument}
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
      />
    </Modal>
  )
}
