import { DocPencilIcon, GlassesIcon, TrashIcon } from '@navikt/aksel-icons'
import { Button, SortState, Table, Tooltip } from '@navikt/ds-react'
import { useEffect, useState } from 'react'
import { deleteCodelist, getCodelistUsage, updateCodelist } from '../../../api/GetAllApi'
import { ICodeListFormValues, ICodeUsage } from '../../../constants'
import { ICode } from '../../../service/Codelist'
import { handleSort } from '../../../util/handleTableSort'
import { AuditButtonDS } from '../audit/AuditButtonDS'
import { Usage } from './CodeListUsage'
import DeleteCodeListModal from './ModalDeleteCodeList'
import UpdateCodeListModal from './ModalUpdateCodeList'

type TTableCodelistProps = {
  tableData: ICode[]
  refresh: () => void
}

const CodeListTable = ({ tableData, refresh }: TTableCodelistProps) => {
  const [selectedCode, setSelectedCode] = useState<ICode>()
  const [showUsage, setShowUsage] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [errorOnResponse, setErrorOnResponse] = useState(null)
  const [usage, setUsage] = useState<ICodeUsage>()
  const [sort, setSort] = useState<SortState>()

  useEffect(() => {
    if (showUsage && selectedCode) {
      ;(async () => {
        setUsage(undefined)
        const usage = await getCodelistUsage(selectedCode.list, selectedCode.code)
        setUsage(usage)
      })()
    }
  }, [showUsage, selectedCode])
  useEffect(() => setShowUsage(false), [tableData])

  const handleEditCodelist = async (values: ICodeListFormValues): Promise<void> => {
    try {
      await updateCodelist({ ...values } as ICode)
      refresh()
      setShowEditModal(false)
    } catch (error: any) {
      setShowEditModal(true)
      setErrorOnResponse(error.message)
    }
  }

  const handleDeleteCodelist = async (values: { list: string; code: string }): Promise<void> => {
    try {
      await deleteCodelist(values.list, values.code)
      refresh()
      setShowDeleteModal(false)
    } catch (error: any) {
      setShowDeleteModal(true)
      setErrorOnResponse(error.message)
    }
  }

  let sortedData: ICode[] = tableData

  const comparator = (a: ICode, b: ICode, orderBy: string): number => {
    switch (orderBy) {
      case 'code':
        return a.code.localeCompare(b.code)
      case 'navn':
        return (a.shortName || '').localeCompare(b.shortName || '')
      default:
        return 0
    }
  }

  sortedData = sortedData.sort((a: ICode, b: ICode) => {
    if (sort) {
      return sort.direction === 'ascending'
        ? comparator(b, a, sort.orderBy)
        : comparator(a, b, sort.orderBy)
    }
    return 1
  })

  return (
    <>
      <Table
        size="large"
        zebraStripes
        sort={sort}
        onSortChange={(sortKey) => handleSort(sort, setSort, sortKey)}
      >
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader sortKey="code" className="w-[15%]" sortable>
              Kode
            </Table.ColumnHeader>
            <Table.ColumnHeader sortKey="navn" className="w-[25%]" sortable>
              Navn
            </Table.ColumnHeader>
            <Table.ColumnHeader className="w-1/2 break-all">Beskrivelse</Table.ColumnHeader>
            <Table.ColumnHeader aria-hidden />
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {sortedData.map((row: ICode, index: number) => (
            <Table.Row key={index}>
              <Table.DataCell className="w-[15%] break-all"> {row.code}</Table.DataCell>
              <Table.DataCell>{row.shortName}</Table.DataCell>
              <Table.DataCell className="w-[15%] break-all">{row.description}</Table.DataCell>
              <Table.DataCell>
                <div className="flex justify-end w-full">
                  <Tooltip content="Vis bruk">
                    <Button
                      variant={row === selectedCode && showUsage ? 'primary' : 'tertiary'}
                      onClick={() => {
                        setSelectedCode(row)
                        setShowUsage(true)
                      }}
                      icon={<GlassesIcon title="Vis bruk" />}
                    />
                  </Tooltip>

                  <AuditButtonDS id={`${row.list}-${row.code}`} variant="tertiary" />

                  <Tooltip content="Redigér">
                    <Button
                      variant="tertiary"
                      onClick={() => {
                        setSelectedCode(row)
                        setShowEditModal(true)
                      }}
                      icon={<DocPencilIcon title="Redigér" />}
                    />
                  </Tooltip>

                  <Tooltip content="Slett">
                    <Button
                      variant="tertiary"
                      onClick={() => {
                        setSelectedCode(row)
                        setShowDeleteModal(true)
                      }}
                      icon={<TrashIcon title="Slett" />}
                    />
                  </Tooltip>
                </div>
              </Table.DataCell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>

      {showEditModal && selectedCode && (
        <UpdateCodeListModal
          title="Rediger kode"
          initialValues={{
            list: selectedCode.list ?? '',
            code: selectedCode.code ?? '',
            shortName: selectedCode.shortName ?? '',
            description: selectedCode.description ?? '',
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
          title="Bekreft sletting"
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

      {showUsage && <Usage usage={usage} refresh={refresh} />}
    </>
  )
}
export default CodeListTable
