import * as React from 'react'
import {useEffect, useState} from 'react'
import {Code} from '../../service/Codelist'
import {Block} from 'baseui/block'
import {KIND, SIZE as ButtonSize} from 'baseui/button'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faEdit, faGhost, faTrash} from '@fortawesome/free-solid-svg-icons'
import UpdateCodeListModal from './ModalUpdateCodeList'
import {intl} from '../../util'
import DeleteCodeListModal from './ModalDeleteCodeList'
import {useTable} from '../../util/hooks'
import {deleteCodelist, getCodelistUsage, updateCodelist} from '../../api'
import {Usage} from './CodeListUsage'
import {CodeListFormValues, CodeUsage} from '../../constants'
import {AuditButton} from '../audit/AuditButton'
import {Cell, HeadCell, Row, Table} from '../common/Table'
import Button from '../common/Button'

type TableCodelistProps = {
  tableData: Code[],
  refresh: () => void
};

const CodeListTable = ({tableData, refresh}: TableCodelistProps) => {
  const [selectedCode, setSelectedCode] = React.useState<Code>()
  const [showUsage, setShowUsage] = React.useState(false)
  const [showEditModal, setShowEditModal] = React.useState(false)
  const [showDeleteModal, setShowDeleteModal] = React.useState(false)
  const [errorOnResponse, setErrorOnResponse] = React.useState(null)
  const [table, sortColumn] = useTable<Code, keyof Code>(tableData, {
    useDefaultStringCompare: true,
    initialSortColumn: 'code'
  })
  const [usage, setUsage] = useState<CodeUsage>()

  useEffect(() => {
    if (showUsage && selectedCode) {
      (async () => {
        setUsage(undefined)
        const usage = await getCodelistUsage(selectedCode.list, selectedCode.code)
        setUsage(usage)
      })()
    }
  }, [showUsage, selectedCode])
  useEffect(() => setShowUsage(false), [tableData])

  const handleEditCodelist = async (values: CodeListFormValues) => {
    try {
      await updateCodelist({...values} as Code)
      refresh()
      setShowEditModal(false)
    } catch (error:any) {
      setShowEditModal(true)
      setErrorOnResponse(error.message)
    }
  }

  const handleDeleteCodelist = async (values: { list: string, code: string }) => {
    try {
      await deleteCodelist(values.list, values.code)
      refresh()
      setShowDeleteModal(false)
    } catch (error) {
      setShowDeleteModal(true)
      setErrorOnResponse(error.message)
    }
  }

  return (
    <>
      <Table emptyText={intl.noCodesAvailableInTable} headers={
        <>
          <HeadCell
            small
            title={intl.code}
            column='code'
            tableState={[table, sortColumn]}
          />
          <HeadCell
            small
            title={intl.shortName}
            column='shortName'
            tableState={[table, sortColumn]}
          />
          <HeadCell
            $style={{width: '55%'}}
            title={intl.description}
            column='description'
            tableState={[table, sortColumn]}
          />
          <HeadCell small/>
        </>
      }>
        {table.data.map((row, index) => <Row key={index}>
          <Cell small $style={{wordBreak:"break-word"}}>{row.code}</Cell>
          <Cell small>{row.shortName}</Cell>
          <Cell $style={{width: '55%'}}>{row.description}</Cell>
          <Cell small>
            <Block display="flex" justifyContent="flex-end" width="100%">
              <Button
                tooltip={intl.ghost}
                size={ButtonSize.compact}
                kind={row === selectedCode && showUsage ? KIND.primary : KIND.tertiary}
                onClick={() => {
                  setSelectedCode(row)
                  setShowUsage(true)
                }}>
                <FontAwesomeIcon icon={faGhost}/>
              </Button>
              <AuditButton id={`${row.list}-${row.code}`} kind={KIND.tertiary}/>
              <Button
                tooltip={intl.edit}
                size={ButtonSize.compact}
                kind={KIND.tertiary}
                onClick={() => {
                  setSelectedCode(row)
                  setShowEditModal(true)
                }}>
                <FontAwesomeIcon icon={faEdit}/>
              </Button>
              <Button
                tooltip={intl.delete}
                size={ButtonSize.compact}
                kind={KIND.tertiary}
                onClick={() => {
                  setSelectedCode(row)
                  setShowDeleteModal(true)
                }}>
                <FontAwesomeIcon icon={faTrash}/>
              </Button>
            </Block>
          </Cell>
        </Row>)}
      </Table>

      {showEditModal && selectedCode && (
        <UpdateCodeListModal
          title={intl.editCodeListTitle}
          initialValues={{
            list: selectedCode.list ?? '',
            code: selectedCode.code ?? '',
            shortName: selectedCode.shortName ?? '',
            description: selectedCode.description ?? ''
          }}
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(!showEditModal)
            setErrorOnResponse(null)
          }}
          errorOnUpdate={errorOnResponse}
          submit={handleEditCodelist}
        />
      )}
      {showDeleteModal && selectedCode && (
        <DeleteCodeListModal
          title={intl.deleteCodeListConfirmationTitle}
          initialValues={{
            list: selectedCode.list ?? '',
            code: selectedCode.code ?? '',
          }}
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(!showDeleteModal)
            setErrorOnResponse(null)
          }}
          errorOnDelete={errorOnResponse}
          submit={handleDeleteCodelist}
        />
      )}

      {showUsage && <Usage usage={usage} refresh={refresh}/>}
    </>
  )
}
export default CodeListTable
