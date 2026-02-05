import { faEdit, faPlusCircle } from '@fortawesome/free-solid-svg-icons'
import { faTrash } from '@fortawesome/free-solid-svg-icons/faTrash'
import { Alert, BodyLong, Heading, Label, Tabs } from '@navikt/ds-react'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import {
  deleteDocument,
  getAll,
  getDocument,
  getDocumentByPageAndPageSize,
  getProcessesFor,
} from '../api/GetAllApi'
import { AuditButton } from '../components/admin/audit/AuditButton'
import AlphabeticList from '../components/common/AlphabeticList'
import Button from '../components/common/Button/CustomButton'
import DocumentMetadata from '../components/document/DocumentMetadata'
import DeleteDocumentModal from '../components/document/component/DeleteDocumentModal'
import DocumentProcessesTable from '../components/document/component/DocumentProcessesTable'
import { IDocument, IProcess } from '../constants'
import { user } from '../service/User'

const renderTextWithLabel = (label: string, text: string) => (
  <div className="mt-10">
    <Label>{label}</Label>
    <BodyLong>{text}</BodyLong>
  </div>
)

const DocumentPage = () => {
  const params = useParams<{ id?: string }>()
  const navigate = useNavigate()

  const [currentDocument, setCurrentDocument] = useState<IDocument | undefined>()
  const [documentId, setDocumentId] = useState<string | undefined>(params.id)
  const [isDeleteModalVisible, setDeleteModalVisibility] = useState(false)
  const [documentUsages, setDocumentUsages] = useState<IProcess[]>()
  const [errorMessage, setErrorMessage] = useState<string>()
  const [activeKey, setActiveKey] = useState<string>('containsInformationType')
  const [documents, setDocuments] = useState<IDocument[]>([])

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
        if (params.id) navigate('/document')
      }
    })()
  }, [documentId])

  return (
    <>
      <>
        <div className="w-full">
          <Heading size="large">Dokumenter</Heading>
        </div>
        <div className="flex flex-row-reverse mt-2.5">
          {user.canWrite() && (
            <div>
              {currentDocument && <AuditButton id={currentDocument.id} />}

              {currentDocument && (
                <Button
                  icon={faTrash}
                  kind="outline"
                  size="xsmall"
                  onClick={() => setDeleteModalVisibility(true)}
                  marginLeft
                >
                  Slett
                </Button>
              )}

              {currentDocument && (
                <Button
                  icon={faEdit}
                  kind="outline"
                  size="xsmall"
                  onClick={() => navigate(`/document/${currentDocument.id}/edit`)}
                  marginLeft
                >
                  Redigér
                </Button>
              )}

              <Button
                kind="outline"
                size="xsmall"
                icon={faPlusCircle}
                onClick={() => navigate('/document/create')}
                marginLeft
              >
                Opprett ny
              </Button>
            </div>
          )}
        </div>
        {!currentDocument && (
          <AlphabeticList
            items={documents.map((d) => ({ id: d.id, label: d.name }))}
            baseUrl={'/document/'}
          />
        )}
        {currentDocument && (
          <div className="mt-1.25 p-1.25">
            {renderTextWithLabel('Navn', currentDocument.name)}
            {renderTextWithLabel('Beskrivelse', currentDocument.description)}
            {renderTextWithLabel(
              'Datatilgangsklasse',
              currentDocument.dataAccessClass
                ? currentDocument.dataAccessClass.shortName
                : 'Ikke angitt'
            )}
          </div>
        )}

        {currentDocument && (
          <Tabs value={activeKey} onChange={(val) => setActiveKey(val as string)}>
            <Tabs.List>
              <Tabs.Tab value="containsInformationType" label="Inneholder opplysningstyper" />
              {documentUsages && documentUsages.length > 0 && (
                <Tabs.Tab value="containsProcesses" label="Brukes i behandlinger" />
              )}
            </Tabs.List>

            <Tabs.Panel value="containsInformationType">
              <DocumentMetadata document={currentDocument} />
            </Tabs.Panel>

            {documentUsages && documentUsages.length > 0 && (
              <Tabs.Panel value="containsProcesses">
                <DocumentProcessesTable documentUsages={documentUsages} />
              </Tabs.Panel>
            )}
          </Tabs>
        )}

        {errorMessage && <Alert variant="error">{errorMessage}</Alert>}
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
