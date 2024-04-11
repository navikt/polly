import React, { FormEvent, useEffect, useState } from 'react'
import { Block } from 'baseui/block'
import { Document, Settings } from '../../constants'
import { useDebouncedState } from '../../util/hooks'
import { getDocument, searchDocuments } from '../../api'
import { Select, TYPE } from 'baseui/select'
import { intl, theme } from '../../util'
import { getSettings, writeSettings } from '../../api/SettingsApi'
import { Spinner } from 'baseui/spinner'
import { HeadingMedium, LabelMedium } from 'baseui/typography'
import { Button } from 'baseui/button'
import { StatefulTextarea } from 'baseui/textarea'
import { Markdown } from '../../components/common/Markdown'
import {ampli} from "../../service/Amplitude";

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
        <HeadingMedium>{intl.settings}</HeadingMedium>
        {loading ? (
          <Spinner $size={40} />
        ) : error || !settings ? (
          { error }
        ) : (
          <div>
            <DefaultProcessDocument documentId={settings.defaultProcessDocument} setDocumentId={(defaultProcessDocument) => setSettings({ ...settings, defaultProcessDocument })} />
            <FrontpageMessage message={settings?.frontpageMessage} setMessage={(frontpageMessage) => setSettings({ ...settings, frontpageMessage })} />

            <Block display="flex" justifyContent="flex-end" marginTop={theme.sizing.scale800}>
              <Button type="button" kind="secondary" onClick={load}>
                {intl.abort}
              </Button>
              <Button type="button" onClick={save}>
                {intl.save}
              </Button>
            </Block>
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
      <LabelMedium marginRight="1rem">{intl.defaultProcessDocument}</LabelMedium>
      <div className="w-2/5">
        <Select
          clearable
          searchable
          noResultsMsg={intl.emptyTable}
          isLoading={loading}
          maxDropdownHeight="400px"
          type={TYPE.search}
          options={documents}
          placeholder={intl.searchDocuments}
          value={document ? [document as any] : []}
          onInputChange={(event) => setDocumentSearch(event.currentTarget.value)}
          onChange={(params) => {
            const doc = params.value[0] as Document
            setDocument(doc)
            props.setDocumentId(doc?.id)
          }}
          filterOptions={(options) => options}
          labelKey="name"
        />
      </div>
    </div>
  )
}

const FrontpageMessage = (props: { message?: string; setMessage: (message: string) => void }) => {
  return (
    <>
      <div className="align-middle mt-4">
        <LabelMedium marginRight="1rem">Forsidemelding</LabelMedium>
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
