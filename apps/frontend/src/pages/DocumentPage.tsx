import React, {useEffect} from 'react'
import {useNavigate, useParams} from 'react-router-dom'
import {intl} from '../util'
import {Block} from 'baseui/block'
import {deleteDocument, getAll, getDocument, getDocumentByPageAndPageSize, getProcessesFor} from '../api'
import {Document, Process} from '../constants'
import DocumentMetadata from '../components/document/DocumentMetadata'
import {user} from '../service/User'
import {faEdit, faPlusCircle} from '@fortawesome/free-solid-svg-icons'
import {faTrash} from '@fortawesome/free-solid-svg-icons/faTrash'
import DeleteDocumentModal from '../components/document/component/DeleteDocumentModal'
import {Notification} from 'baseui/notification'
import {HeadingMedium, LabelMedium, ParagraphMedium} from 'baseui/typography'
import DocumentProcessesTable from '../components/document/component/DocumentProcessesTable'
import {Tab} from 'baseui/tabs'
import {CustomizedTabs} from '../components/common/CustomizedTabs'
import Button from '../components/common/Button'
import {AuditButton} from '../components/audit/AuditButton'
import {SIZE as ButtonSize} from 'baseui/button'
import {tabOverride} from '../components/common/Style'
import AlphabeticList from '../components/common/AlphabeticList'
import {ampli} from "../service/Amplitude";

const renderTextWithLabel = (label: string, text: string) => (
  <Block marginTop="scale1000">
    <LabelMedium font="font400">{label}</LabelMedium>
    <ParagraphMedium>{text}</ParagraphMedium>
  </Block>
)

const DocumentPage = () => {
  const params = useParams<{ id?: string }>()
  const navigate = useNavigate()

  const [currentDocument, setCurrentDocument] = React.useState<Document | undefined>()
  const [documentId, setDocumentId] = React.useState<string | undefined>(params.id)
  const [isDeleteModalVisible, setDeleteModalVisibility] = React.useState(false)
  const [documentUsages, setDocumentUsages] = React.useState<Process[]>()
  const [errorMessage, setErrorMessage] = React.useState<string>()
  const [activeKey, setActiveKey] = React.useState<string | number | bigint>('containsInformationType')
  const [documents, setDocuments] = React.useState<Document[]>([])

  ampli.logEvent("besøk", {side: 'Dokumenter', url: '/document/', app: 'Behandlingskatalogen'})

  useEffect(() => setDocumentId(params.id), [params.id])

  useEffect(() => {
    ;(async () => {
      setDocuments(await getAll(getDocumentByPageAndPageSize)())
    })()
  }, [])

  const handleDelete = () => {
    if (documentId) {
      deleteDocument(documentId)
        .then(() => {
          setCurrentDocument(undefined)
          setDeleteModalVisibility(false)
          navigate('/document')
        })
        .catch((e) => {
          setErrorMessage(e.message)
        })
    }
  }

  useEffect(() => {
    ;(async () => {
      setErrorMessage('')
      if (documentId) {
        const res = await getDocument(documentId)
        setDocumentUsages((await getProcessesFor({ documentId })).content)
        setCurrentDocument(res)
        if (params.id !== documentId) navigate(`/document/${documentId}`)
      } else {
        setCurrentDocument(undefined)
        if (!!params.id) navigate('/document')
      }
    })()
  }, [documentId])

  return (
    <>
      <>
        <Block width="100%">
          <HeadingMedium>{intl.documents}</HeadingMedium>
        </Block>
        <Block display="flex" flexDirection="row-reverse" marginTop="10px">
          {user.canWrite() && (
            <Block>
              {currentDocument && <AuditButton id={currentDocument.id} />}

              {currentDocument && (
                <Button tooltip={intl.delete} icon={faTrash} kind="outline" size={ButtonSize.compact} onClick={() => setDeleteModalVisibility(true)} marginLeft>
                  {intl.delete}
                </Button>
              )}

              {currentDocument && (
                <Button tooltip={intl.edit} icon={faEdit} kind="outline" size={ButtonSize.compact} onClick={() => navigate(`/document/${currentDocument.id}/edit`)} marginLeft>
                  {intl.edit}
                </Button>
              )}

              <Button kind="outline" size={ButtonSize.compact} icon={faPlusCircle} tooltip={intl.createNew} onClick={() => navigate('/document/create')} marginLeft>
                {intl.createNew}
              </Button>
            </Block>
          )}
        </Block>
        {!currentDocument && <AlphabeticList items={documents.map((d) => ({ id: d.id, label: d.name }))} baseUrl={'/document/'} />}
        {currentDocument && (
          <Block
            overrides={{
              Block: {
                style: {
                  padding: '5px',
                  marginTop: '5px',
                },
              },
            }}
          >
            {renderTextWithLabel(intl.name, currentDocument.name)}
            {renderTextWithLabel(intl.description, currentDocument.description)}
            {renderTextWithLabel(intl.dataAccessClass, currentDocument.dataAccessClass ? currentDocument.dataAccessClass.shortName : intl.emptyMessage)}
          </Block>
        )}

        {currentDocument && (
          <CustomizedTabs
            onChange={({ activeKey }) => {
              setActiveKey(activeKey)
            }}
            activeKey={activeKey as React.Key}
          >
            <Tab key={'containsInformationType'} title={intl.containsInformationType} overrides={tabOverride}>
              <Block>
                <DocumentMetadata document={currentDocument} />
              </Block>
            </Tab>
            <>
              {documentUsages && documentUsages.length > 0 && (
                <Tab key={'containsProcesses'} title={intl.containsProcesses} overrides={tabOverride}>
                  <Block>
                    <DocumentProcessesTable documentUsages={documentUsages} />
                  </Block>
                </Tab>
              )}
            </>
          </CustomizedTabs>
        )}

        {errorMessage && <Notification kind="negative">{errorMessage}</Notification>}
      </>

      <DeleteDocumentModal
        title={intl.confirmDeleteHeader}
        documentName={currentDocument?.name as string}
        isOpen={isDeleteModalVisible}
        submit={handleDelete}
        onClose={() => setDeleteModalVisibility(false)}
        documentUsageCount={documentUsages?.length}
      />
    </>
  )
}

export default DocumentPage
