import React, { FormEvent, useEffect, useState } from "react"
import { Block } from "baseui/block"
import { Document, Settings } from "../../constants"
import { useDebouncedState } from "../../util/hooks"
import { getDocument, searchDocuments } from "../../api"
import { Select, TYPE } from "baseui/select"
import { intl, theme } from "../../util"
import { getSettings, writeSettings } from "../../api/SettingsApi"
import { StyledSpinnerNext } from "baseui/spinner"
import { H4, Label2 } from "baseui/typography"
import { Button } from "baseui/button"
import { StatefulTextarea } from "baseui/textarea"
import ReactMarkdown from "react-markdown/with-html"

export const SettingsPage = () => {
  const [loading, setLoading] = React.useState<boolean>(true)
  const [error, setError] = useState()
  const [settings, setSettings] = useState<Settings>()


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
      } catch (e) {
        setError(e)
      }
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  return (
    <Block>
      <H4>{intl.settings}</H4>
      {loading ? <StyledSpinnerNext size={40}/> :
        error || !settings ? {error} :
          <Block>
            <DefaultProcessDocument
              documentId={settings.defaultProcessDocument}
              setDocumentId={defaultProcessDocument => setSettings({...settings, defaultProcessDocument})}
            />
            <FrontpageMessage message={settings?.frontpageMessage} setMessage={frontpageMessage => setSettings({...settings, frontpageMessage})}/>

            <Block display="flex" justifyContent="flex-end" marginTop={theme.sizing.scale800}>
              <Button type="button" kind="secondary" onClick={load}>{intl.abort}</Button>
              <Button type="button" onClick={save}>{intl.save}</Button>
            </Block>
          </Block>}
    </Block>
  )
}


const DefaultProcessDocument = (props: { documentId?: string, setDocumentId: (id: string) => void }) => {
  const [document, setDocument] = useState<Document | undefined>(undefined)
  const [documents, setDocuments] = useState<Document[]>([])
  const [documentSearch, setDocumentSearch] = useDebouncedState<string>('', 400)
  const [loading, setLoading] = React.useState<boolean>(false)

  useEffect(() => {
    (async () => {
      if (props.documentId && props.documentId !== document?.id) {
        setLoading(true)
        const doc = await getDocument(props.documentId)
        setDocument(doc)
        setLoading(false)
      }
    })()
  }, [props.documentId])


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

  return (
    <Block display="flex" alignItems="center">
      <Label2 marginRight="1rem">{intl.defaultProcessDocument}</Label2>
      <Block width="40%">
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
          onInputChange={event => setDocumentSearch(event.currentTarget.value)}
          onChange={params => {
            const doc = params.value[0] as Document
            setDocument(doc)
            props.setDocumentId(doc?.id)
          }}
          filterOptions={options => options}
          labelKey="name"
        />
      </Block>
    </Block>
  )
}

const FrontpageMessage = (props: { message?: string, setMessage: (message: string) => void }) => {
  return (
    <>
      <Block alignItems="center" marginTop="1rem">
        <Label2 marginRight="1rem">Forsidemelding</Label2>
        <Block width="100%" display="flex">
          <Block width="50%" marginRight="1rem">
            <StatefulTextarea initialState={{value: props.message}} rows={20}
                              onChange={(event: any) => props.setMessage((event as FormEvent<HTMLInputElement>).currentTarget.value)}
            />
          </Block>
          <Block width="50%">
            <ReactMarkdown source={props.message} escapeHtml={false}/>
          </Block>
        </Block>
      </Block>
    </>
  )
}
