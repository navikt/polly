import * as React from 'react'
import { Document, DocumentFormValues } from '../../constants'
import { useDebouncedState } from '../../util'
import { searchDocuments } from '../../api'
import { Option, Select, TYPE } from 'baseui/select'

type SelectDocumentProps = {
  document: DocumentFormValues | undefined
  handleChange: Function
}

const SelectDocument = (props: SelectDocumentProps) => {
  const [documents, setDocuments] = React.useState<Document[]>([])
  const [documentSearch, setDocumentSearch] = useDebouncedState<string>('', 400)
  const [isLoadingDocuments, setLoadingDocuments] = React.useState<boolean>(false)

  const { handleChange, document } = props

  React.useEffect(() => {
    ;(async () => {
      if (documentSearch && documentSearch.length > 2) {
        setLoadingDocuments(true)
        const res = await searchDocuments(documentSearch)
        setDocuments(res.content)
        setLoadingDocuments(false)
      }
    })()
  }, [documentSearch])

  return (
    <Select
      options={documents}
      isLoading={isLoadingDocuments}
      clearable
      searchable={true}
      noResultsMsg='Ingen'
      type={TYPE.search}
      maxDropdownHeight="400px"
      placeholder='Søk dokumenter'
      value={document ? [document as Option] : []}
      onInputChange={(event) => setDocumentSearch(event.currentTarget.value)}
      onChange={(params) => handleChange(params.value[0] as Document)}
      labelKey="name"
    />
  )
}

export default SelectDocument
