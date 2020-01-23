import { Modal, ModalBody, ModalButton, ModalFooter, ModalHeader, ROLE, SIZE } from "baseui/modal"
import { Button, KIND } from "baseui/button"
import * as React from "react"
import { KeyboardEvent, useEffect, useState } from "react"
import { AddDocumentToProcessFormValues, Document, Process } from "../../../constants"
import { Block, BlockProps } from "baseui/block"
import { Field, FieldArray, FieldProps, Form, Formik, FormikProps } from "formik"
import { intl, useDebouncedState } from "../../../util"
import { addDocumentToProcessSchema } from "../../common/schema"
import { Error, ModalLabel } from "../../common/ModalSchema"
import { Option, Select, TYPE } from "baseui/select"
import { searchDocuments } from "../../../api"
import { ListItem } from "baseui/list"
import { useStyletron } from "baseui"
import { codelist, ListName } from "../../../service/Codelist"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTrash } from "@fortawesome/free-solid-svg-icons"
import { Paragraph2 } from "baseui/typography"
import { Sensitivity } from "../../InformationType/Sensitivity"

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

export const AddDocumentModal = (props: AddDocumentProps) => {
  const [documents, setDocuments] = useState<Document[]>([])
  const [documentSearch, setDocumentSearch] = useDebouncedState<string>('', 400)
  const [loading, setLoading] = React.useState<boolean>(false);
  const [css] = useStyletron()

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
        initialValues={{document: undefined, informationTypes: [], process: props.process}}
        validationSchema={addDocumentToProcessSchema()}
        render={(formik: FormikProps<AddDocumentToProcessFormValues>) => (
          <Form onKeyDown={disableEnter}>
            <ModalHeader>{intl.addDocument}</ModalHeader>
            <ModalBody>
              <Block {...modalBlockProps}>

                <Block {...rowBlockProps}>
                  <ModalLabel label={intl.document}/>
                  <Field name="document"
                         render={({form}: FieldProps<AddDocumentToProcessFormValues>) => (
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
                               form.setFieldValue('document', document)
                               const infoTypeUses = document.informationTypes.filter(infoType => !!infoType.subjectCategories.length)
                               infoTypeUses.sort((a, b) => a.informationType.name.localeCompare(b.informationType.name, intl.getLanguage()))
                               form.setFieldValue('informationTypes', infoTypeUses)
                             }}
                             error={!!form.errors.document && !!form.submitCount}
                             filterOptions={options => options.filter((doc) => !!doc.informationTypes.length)}
                             labelKey="name"
                           />
                         )}/>
                </Block>
                <Error fieldName="document"/>

                <Block {...rowBlockProps}>
                  <ModalLabel label={intl.informationTypes}/>
                  <FieldArray name="informationTypes"
                              render={arrayProps => (
                                <>
                                  {!formik.values.document && <Paragraph2>{intl.chooseDocument}</Paragraph2>}
                                  {!!formik.values.document &&
                                  <ul className={css({paddingLeft: 0, width: "100%"})}>
                                    {formik.values.informationTypes.map((informationType, index) => (
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
                                          <Button size="compact" kind="tertiary" onClick={() => {
                                            const length = formik.values.informationTypes.length
                                            arrayProps.remove(index);
                                            if (length === 1) {
                                              formik.setFieldValue('document', undefined)
                                            }
                                          }}>
                                            <FontAwesomeIcon icon={faTrash}/> </Button>
                                        </Block>
                                      </ListItem>
                                    ))}
                                  </ul>
                                  }
                                </>
                              )}/>
                </Block>
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
        )}
      />
    </Modal>
  )
}
