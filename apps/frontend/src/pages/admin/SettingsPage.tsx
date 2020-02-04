import React, { useEffect, useState } from "react"
import { Block } from "baseui/block"
import { Document, Settings } from "../../constants"
import { useDebouncedState } from "../../util/hooks"
import { getDocument, searchDocuments } from "../../api"
import { Select, TYPE } from "baseui/select"
import { intl, theme } from "../../util"
import { getSettings, writeSettings } from "../../api/SettingsApi"
import { Spinner } from "baseui/spinner"
import { Label2 } from "baseui/typography"
import Banner from "../../components/Banner"
import { Button } from "baseui/button"

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
      <Banner title={intl.settings}/>
      {loading ? <Spinner size={40}/> :
        error ? {error} :
          <Block>
            <DefaultProcessDocument
              document={settings?.defaultProcessDocument}
              setDocument={id => setSettings({...settings, defaultProcessDocument: id})}
            />

            <Block display="flex" justifyContent="flex-end" marginTop={theme.sizing.scale800}>
              <Button type="button" kind="secondary" onClick={load}>{intl.abort}</Button>
              <Button type="button" onClick={save}>{intl.save}</Button>
            </Block>
          </Block>}
    </Block>
  )
}


const DefaultProcessDocument = (props: { document?: string, setDocument: (id: string) => void }) => {
  const [document, setDocument] = useState<Document | undefined>(undefined)
  const [documents, setDocuments] = useState<Document[]>([])
  const [documentSearch, setDocumentSearch] = useDebouncedState<string>('', 400)
  const [loading, setLoading] = React.useState<boolean>(false)

  useEffect(() => {
    (async () => {
      if (props.document) {
        setLoading(true)
        var doc = await getDocument(props.document)
        setDocument(doc)
        setLoading(false)
      }
    })()
  }, [props.document])


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
          clearable={false}
          isLoading={loading}
          autoFocus
          maxDropdownHeight="400px"
          searchable={true}
          type={TYPE.search}
          options={documents}
          placeholder={intl.searchDocuments}
          value={document as any}
          onInputChange={event => setDocumentSearch(event.currentTarget.value)}
          onChange={params => {
            const doc = params.value[0] as Document
            setDocument(doc)
            props.setDocument((doc).id)
          }}
          filterOptions={options => options}
          labelKey="name"
        />
      </Block>
    </Block>
  )
}
