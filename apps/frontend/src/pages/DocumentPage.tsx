import React from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { intl, useAwait } from '../util'
import { codelist } from '../service/Codelist'
import { Block } from 'baseui/block'
import { Select, TYPE, Value } from 'baseui/select'
import { deleteDocument, getDocument, getProcessesByDocument, useDocumentSearch } from '../api'
import { Document, Process } from '../constants'
import DocumentMetadata from '../components/document/DocumentMetadata'
import { user } from '../service/User'
import { faEdit, faPlusCircle } from '@fortawesome/free-solid-svg-icons'
import { faTrash } from '@fortawesome/free-solid-svg-icons/faTrash'
import DeleteDocumentModal from '../components/document/component/DeleteDocumentModal'
import { Notification } from 'baseui/notification'
import { H4, Label2, Paragraph2 } from 'baseui/typography'
import { StyledSpinnerNext } from 'baseui/spinner'
import DocumentProcessesTable from '../components/document/component/DocumentProcessesTable'
import { Tab } from 'baseui/tabs'
import { CustomizedTabs } from '../components/common/CustomizedTabs'
import Button from '../components/common/Button'
import { AuditButton } from '../components/audit/AuditButton'
import { SIZE as ButtonSize } from 'baseui/button'

const renderTextWithLabel = (label: string, text: string) => (
  <Block marginTop="scale1000">
    <Label2 font="font400">{label}</Label2>
    <Paragraph2>{text}</Paragraph2>
  </Block>
)

const DocumentPage = (props: RouteComponentProps<{ id?: string }>) => {
  const [isLoading, setLoading] = React.useState(false)
  const [selectValue, setSelectValue] = React.useState<Value>([])
  const [currentDocument, setCurrentDocument] = React.useState<Document | undefined>()
  const [documentSearchResult, setDocumentSearch, documentSearchLoading] = useDocumentSearch()
  const [documentId, setDocumentId] = React.useState<string | undefined>(props.match.params.id)
  const [isDeleteModalVisible, setDeleteModalVisibility] = React.useState(false)
  const [documentUsages, setDocumentUsages] = React.useState<[Process]>()
  const [errorMessage, setErrorMessage] = React.useState<string>()
  const [activeKey, setActiveKey] = React.useState<string | number>('containsInformationType')
  const tabOverride = {Tab: {style: {fontSize: '1.5rem'}}}

  useAwait(user.wait())

  const handleDelete = () => {
    if (documentId) {
      deleteDocument(documentId)
      .then((response) => {
        console.log(response)
        setSelectValue([])
        setCurrentDocument(undefined)
        setDocumentSearch('')
        setDeleteModalVisibility(false)
        props.history.push('/document')
      }).catch((e) => {
        setErrorMessage(e.message)
        console.log(e)
      })
    }
  }

  React.useEffect(() => {
    (async () => {
      setLoading(true)
      await codelist.wait()
      setLoading(false)
    })()
  }, [])

  React.useEffect(() => {
    (async () => {
      setErrorMessage('')
      if (documentId) {
        const res = await getDocument(documentId)
        setDocumentUsages((await getProcessesByDocument(documentId)).content)
        setCurrentDocument(res)
        setSelectValue([{id: res.id, label: res.name}])
        props.history.push(`/document/${documentId}`)
      } else {
        setCurrentDocument(undefined)
        setSelectValue([])
        props.history.push('/document')
      }
    })()
  }, [documentId, props.history])

  return (
    <React.Fragment>
      {isLoading && <StyledSpinnerNext/>}

      {!isLoading && (
        <React.Fragment>
          <Block width="100%">
            <H4>{intl.documents}</H4>
            <Select
              autoFocus
              maxDropdownHeight="400px"
              searchable={true}
              noResultsMsg={intl.emptyTable}
              type={TYPE.search}
              options={documentSearchResult.map(doc => ({id: doc.id, label: doc.name}))}
              placeholder={intl.searchDocumentPlaceholder}
              onInputChange={event => {
                setDocumentSearch(event.currentTarget.value)
              }}
              onChange={(params) => {
                params.value.length < 1 ? setDocumentId(undefined) : setDocumentId(params.value[0].id as string)
              }}
              isLoading={documentSearchLoading}
              filterOptions={options => options}
              value={selectValue}
            />
          </Block>
          <Block display="flex" flexDirection="row-reverse" marginTop="10px">
            {user.canWrite() && (
              <Block>
                {currentDocument && <AuditButton id={currentDocument.id}/>}

                {currentDocument && (
                  <Button
                    tooltip={intl.delete}
                    icon={faTrash}
                    kind="outline"
                    size={ButtonSize.compact}
                    onClick={() => setDeleteModalVisibility(true)}
                    marginLeft
                  >
                    {intl.delete}
                  </Button>
                )}

                {currentDocument && (
                  <Button
                    tooltip={intl.edit}
                    icon={faEdit}
                    kind="outline"
                    size={ButtonSize.compact}
                    onClick={() => props.history.push(`/document/edit/${currentDocument.id}`)}
                    marginLeft
                  >
                    {intl.edit}
                  </Button>
                )}

                <Button
                  kind='outline'
                  size={ButtonSize.compact}
                  icon={faPlusCircle}
                  tooltip={intl.createNew}
                  onClick={() => props.history.push('/document/create')}
                  marginLeft
                >
                  {intl.createNew}
                </Button>
              </Block>
            )}
          </Block>
          {
            currentDocument && (
              <Block overrides={{
                Block: {
                  style: {
                    padding: '5px',
                    marginTop: '5px',
                  }
                }
              }}>
                {renderTextWithLabel(intl.name, currentDocument.name)}
                {renderTextWithLabel(intl.description, currentDocument.description)}
              </Block>
            )
          }

          {
            currentDocument && (
              <CustomizedTabs
                onChange={({activeKey}) => {
                  setActiveKey(activeKey)
                }}
                activeKey={activeKey}
              >
                <Tab key={'containsInformationType'} title={intl.containsInformationType} overrides={tabOverride}>
                  <Block>
                    <DocumentMetadata document={currentDocument}/>
                  </Block>
                </Tab>
                {documentUsages && documentUsages!.length > 0 && (
                  <Tab key={'containsProcesses'} title={intl.containsProcesses} overrides={tabOverride}>
                    <Block>
                      <DocumentProcessesTable documentUsages={documentUsages}/>
                    </Block>
                  </Tab>
                )}
              </CustomizedTabs>
            )
          }

          {errorMessage &&
          <Notification kind="negative">
            {errorMessage}
          </Notification>
          }
        </React.Fragment>
      )}
      <DeleteDocumentModal
        title={intl.confirmDeleteHeader}
        documentName={currentDocument?.name as string}
        isOpen={isDeleteModalVisible}
        submit={handleDelete}
        onClose={() => setDeleteModalVisibility(false)}
        documentUsageCount={documentUsages?.length}
      />
    </React.Fragment>
  )
}

export default DocumentPage
