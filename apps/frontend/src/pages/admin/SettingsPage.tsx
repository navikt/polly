import React, { FormEvent, useEffect, useState } from 'react'
import { Document, Settings } from '../../constants'
import { useDebouncedState } from '../../util/hooks'
import { getDocument, searchDocuments } from '../../api'

import { intl } from '../../util'
import { getSettings, writeSettings } from '../../api/SettingsApi'
import { StatefulTextarea } from 'baseui/textarea'
import { Markdown } from '../../components/common/Markdown'
import {ampli} from "../../service/Amplitude";
import {Button, Heading, Label, Loader} from "@navikt/ds-react";
import Select from 'react-select'

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
        <Heading size="large">{intl.settings}</Heading>
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
                {intl.abort}
              </Button>
              <Button variant="primary" onClick={save}>
                {intl.save}
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
  const [documentSearch, setDocumentSearch] = useDebouncedState<string>('', 400)
  const [loading, setLoading] = React.useState<boolean>(false)

  useEffect(() => {
    ;(async () => {
      if (props.documentId && props.documentId !== document?.id) {
        setLoading(true)
        const doc = await getDocument(props.documentId)
        setDocument(doc)
        setLoading(false)
      }
    })()
  }, [document, props.documentId])

  useEffect(() => {
    ;(async () => {
      if (documentSearch && documentSearch.length > 2) {
        setLoading(true)
        const res = await searchDocuments(documentSearch)
        setDocuments(res.content)
        setLoading(false)
      }
    })()
  }, [documentSearch])

  return (
    <div className="flex align-middle">
      <Label className="mr-4" size="small" >{intl.defaultProcessDocument}</Label>
      <div className="w-2/5">
        <Select
          options={documents}
          placeholder={intl.searchDocuments}
          aria-label={intl.searchDocuments}
          value={document}
          onChange={(value) => {
            if (value) {
              setDocument(value)
            }
          }}
        />
      </div>
    </div>
  )
}

const FrontpageMessage = (props: { message?: string; setMessage: (message: string) => void }) => {
  return (
    <>
      <div className="align-middle mt-4">
        <Label className="mr-4" size="small">Forsidemelding</Label>
        <div className="w-full flex">
          <div className="w-1/2 mr-4">
            <StatefulTextarea
              initialState={{ value: props.message }}
              rows={20}
              onChange={(event: any) => props.setMessage((event as FormEvent<HTMLInputElement>).currentTarget.value)}
            />
          </div>
          <div className="w-1/2">
            <Markdown source={props.message} escapeHtml={false} verbatim />
          </div>
        </div>
      </div>
    </>
  )
}
