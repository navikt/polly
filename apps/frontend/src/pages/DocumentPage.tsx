import { faEdit, faPlusCircle } from '@fortawesome/free-solid-svg-icons'
import { faTrash } from '@fortawesome/free-solid-svg-icons/faTrash'
import { SIZE as ButtonSize } from 'baseui/button'
import { Notification } from 'baseui/notification'
import { Tab } from 'baseui/tabs'
import { HeadingMedium, LabelMedium, ParagraphMedium } from 'baseui/typography'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { deleteDocument, getAll, getDocument, getDocumentByPageAndPageSize, getProcessesFor } from '../api'
import { AuditButton } from '../components/admin/audit/AuditButton'
import AlphabeticList from '../components/common/AlphabeticList'
import Button from '../components/common/Button'
import { CustomizedTabs } from '../components/common/CustomizedTabs'
import { tabOverride } from '../components/common/Style'
import DocumentMetadata from '../components/document/DocumentMetadata'
import DeleteDocumentModal from '../components/document/component/DeleteDocumentModal'
import DocumentProcessesTable from '../components/document/component/DocumentProcessesTable'
import { Document, Process } from '../constants'
import { ampli } from '../service/Amplitude'
import { user } from '../service/User'

const renderTextWithLabel = (label: string, text: string) => (
  <div className="mt-10">
    <LabelMedium font="font400">{label}</LabelMedium>
    <ParagraphMedium>{text}</ParagraphMedium>
  </div>
)

const DocumentPage = () => {
  const params = useParams<{ id?: string }>()
  const navigate = useNavigate()

  const [currentDocument, setCurrentDocument] = useState<Document | undefined>()
  const [documentId, setDocumentId] = useState<string | undefined>(params.id)
  const [isDeleteModalVisible, setDeleteModalVisibility] = useState(false)
  const [documentUsages, setDocumentUsages] = useState<Process[]>()
  const [errorMessage, setErrorMessage] = useState<string>()
  const [activeKey, setActiveKey] = useState<string | number | bigint>('containsInformationType')
  const [documents, setDocuments] = useState<Document[]>([])

  ampli.logEvent('besøk', { side: 'Dokumenter', url: '/document/', app: 'Behandlingskatalogen' })

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
        <div className="w-full">
          <HeadingMedium>Dokumenter</HeadingMedium>
        </div>
        <div className="flex flex-row-reverse mt-2.5">
          {user.canWrite() && (
            <div>
              {currentDocument && <AuditButton id={currentDocument.id} />}

              {currentDocument && (
                <Button icon={faTrash} kind="outline" size={ButtonSize.compact} onClick={() => setDeleteModalVisibility(true)} marginLeft>
                  Slett
                </Button>
              )}

              {currentDocument && (
                <Button icon={faEdit} kind="outline" size={ButtonSize.compact} onClick={() => navigate(`/document/${currentDocument.id}/edit`)} marginLeft>
                  Redigér
                </Button>
              )}

              <Button kind="outline" size={ButtonSize.compact} icon={faPlusCircle} onClick={() => navigate('/document/create')} marginLeft>
                Opprett ny
              </Button>
            </div>
          )}
        </div>
        {!currentDocument && <AlphabeticList items={documents.map((d) => ({ id: d.id, label: d.name }))} baseUrl={'/document/'} />}
        {currentDocument && (
          <div className="p-[5px] mt-[5px]">
            {renderTextWithLabel('Navn', currentDocument.name)}
            {renderTextWithLabel('Beskrivelse', currentDocument.description)}
            {renderTextWithLabel('Datatilgangsklasse', currentDocument.dataAccessClass ? currentDocument.dataAccessClass.shortName : 'Ikke angitt')}
          </div>
        )}

        {currentDocument && (
          <CustomizedTabs
            onChange={({ activeKey }) => {
              setActiveKey(activeKey)
            }}
            activeKey={activeKey as Key}
          >
            <Tab key={'containsInformationType'} title="Inneholder opplysningstyper" overrides={tabOverride}>
              <div>
                <DocumentMetadata document={currentDocument} />
              </div>
            </Tab>
            <>
              {documentUsages && documentUsages.length > 0 && (
                <Tab key={'containsProcesses'} title="Brukes i behandlinger" overrides={tabOverride}>
                  <div>
                    <DocumentProcessesTable documentUsages={documentUsages} />
                  </div>
                </Tab>
              )}
            </>
          </CustomizedTabs>
        )}

        {errorMessage && <Notification kind="negative">{errorMessage}</Notification>}
      </>

      <DeleteDocumentModal
        title="Bekreft sletting"
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
