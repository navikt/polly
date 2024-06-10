import React, { FormEvent, useEffect, useState } from 'react'
import { Document, Settings } from '../../../constants'
import {getDocument, getDocumentByPageAndPageSize} from '../../../api'
import { getSettings, writeSettings } from '../../../api/SettingsApi'
import { Markdown } from '../../common/Markdown'
import {ampli} from "../../../service/Amplitude";
import {Button, Heading, Loader, Select, Textarea} from "@navikt/ds-react";


export const SettingsPage = () => {
  const [loading, setLoading] = React.useState<boolean>(true)
  const [error, setError] = useState()
  const [settings, setSettings] = useState<Settings>()

  ampli.logEvent("besøk", {side: 'Admin', url: '/admin/settings', app: 'Behandlingskatalogen', type: 'Instillinger'})

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
      } catch (e: any) {
        setError(e)
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

const DefaultProcessDocument = (props: { documentId?: string; setDocumentId: (id: string) => void }) => {
  const [document, setDocument] = useState<Document | undefined>(undefined)
  const [documents, setDocuments] = useState<Document[]>([])

  useEffect(() => {
    ;(async () => {
      if (props.documentId && props.documentId !== document?.id) {
        const doc = await getDocument(props.documentId)
        setDocument(doc)
      }
    })()
  }, [document, props.documentId])


  useEffect(() => {
    ;(async () => {
        const res = await getDocumentByPageAndPageSize(0, 200)
        setDocuments(res.content)
    })()
  }, [])


  return (
    <div className="flex align-middle">
      <div className="w-2/5">
        <Select
          label="Dokument for standard informasjonstyper i behandling"
          value={props.documentId}
          onChange={(event) => {
            props.setDocumentId(event.target.value)
          }}
        >
          {documents.map((value)=> {
            return (
              <>
                <option key={value.id} value={value.id}>{value.name}</option>
              </>
            )
          })}
        </Select>
      </div>
    </div>
  )
}

const FrontpageMessage = (props: { message?: string; setMessage: (message: string) => void }) => {
  return (
    <>
      <div className="align-middle mt-4">
        <div className="w-full flex">
          <div className="w-1/2 mr-4">
            <Textarea
              label="Forsidemelding"
              value={props.message }
              minRows={16}
              onChange={(event: any) => props.setMessage((event as FormEvent<HTMLInputElement>).currentTarget.value)}
            />
          </div>
          <div className="w-1/2 mt-8">
            <Markdown source={props.message} escapeHtml={false} verbatim />
          </div>
        </div>
      </div>
    </>
  )
}
