import { Button, Heading, Loader, Select, Textarea } from '@navikt/ds-react'
import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { getDocument, getDocumentByPageAndPageSize } from '../../../api'
import { getSettings, writeSettings } from '../../../api/SettingsApi'
import { Document, Settings } from '../../../constants'
import { ampli } from '../../../service/Amplitude'
import { Markdown } from '../../common/Markdown'

export const SettingsPage = () => {
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState()
  const [settings, setSettings] = useState<Settings>()

  ampli.logEvent('besøk', { side: 'Admin', url: '/admin/settings', app: 'Behandlingskatalogen', type: 'Instillinger' })

  const load = async () => {
    setLoading(true)
    setSettings(await getSettings())
    setLoading(false)
  }

  const save = async () => {
    if (settings) {
      setLoading(true)
      try {
        setSettings(await writeSettings(settings))
      } catch (error: any) {
        setError(error)
      }
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  return (
    <div>
      <>
        <Heading size="large">Innstillinger</Heading>
        {loading ? (
          <Loader size="large" />
        ) : error || !settings ? (
          { error }
        ) : (
          <div>
            <DefaultProcessDocument documentId={settings.defaultProcessDocument} setDocumentId={(defaultProcessDocument) => setSettings({ ...settings, defaultProcessDocument })} />
            <FrontpageMessage message={settings?.frontpageMessage} setMessage={(frontpageMessage) => setSettings({ ...settings, frontpageMessage })} />
            <div className="flex justify-end mt-6 gap-2">
              <Button variant="secondary" onClick={load}>
                Avbryt
              </Button>
              <Button type="button" onClick={save}>
                Lagre
              </Button>
            </div>
          </div>
        )}
      </>
    </div>
  )
}

interface DefaultProcessDocumentProps {
  documentId?: string
  setDocumentId: (id: string) => void
}

const DefaultProcessDocument = (props: DefaultProcessDocumentProps) => {
  const { documentId, setDocumentId } = props
  const [document, setDocument] = useState<Document | undefined>(undefined)
  const [documents, setDocuments] = useState<Document[]>([])

  useEffect(() => {
    ;(async () => {
      if (documentId && documentId !== document?.id) {
        const doc: Document = await getDocument(documentId)
        setDocument(doc)
      }
    })()
  }, [document, documentId])

  useEffect(() => {
    ;(async () => {
      const result = await getDocumentByPageAndPageSize(0, 200)
      setDocuments(result.content)
    })()
  }, [])

  return (
    <div className="flex align-middle">
      <div className="w-2/5">
        <Select
          label="Dokument for standard informasjonstyper i behandling"
          value={documentId}
          onChange={(event: ChangeEvent<HTMLSelectElement>) => {
            setDocumentId(event.target.value)
          }}
        >
          {documents.map((document: Document) => (
            <option key={document.id} value={document.id}>
              {document.name}
            </option>
          ))}
        </Select>
      </div>
    </div>
  )
}

interface FrontpageMessageProps {
  message?: string
  setMessage: (message: string) => void
}

const FrontpageMessage = (props: FrontpageMessageProps) => {
  const { message, setMessage } = props

  return (
    <div className="align-middle mt-4">
      <div className="w-full flex">
        <div className="w-1/2 mr-4">
          <Textarea label="Forsidemelding" value={message} minRows={16} onChange={(event: any) => setMessage((event as FormEvent<HTMLInputElement>).currentTarget.value)} />
        </div>
        <div className="w-1/2 mt-8">
          <Markdown source={message} escapeHtml={false} verbatim />
        </div>
      </div>
    </div>
  )
}
