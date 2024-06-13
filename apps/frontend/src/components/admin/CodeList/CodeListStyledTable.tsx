import * as React from 'react'
import { useEffect, useState } from 'react'
import { Code } from '../../../service/Codelist'
import { KIND} from 'baseui/button'
import UpdateCodeListModal from './ModalUpdateCodeList'
import DeleteCodeListModal from './ModalDeleteCodeList'
import { deleteCodelist, getCodelistUsage, updateCodelist } from '../../../api'
import { Usage } from './CodeListUsage'
import { CodeListFormValues, CodeUsage } from '../../../constants'
import { AuditButton } from '../audit/AuditButton'
import {Button, SortState, Table, Tooltip} from "@navikt/ds-react";
import {DocPencilIcon, GlassesIcon, TrashIcon} from "@navikt/aksel-icons";
import {handleSort} from "../../../util/handleTableSort";

type TableCodelistProps = {
  tableData: Code[]
  refresh: () => void
}

const CodeListTable = ({ tableData, refresh }: TableCodelistProps) => {
  const [selectedCode, setSelectedCode] = React.useState<Code>()
  const [showUsage, setShowUsage] = React.useState(false)
  const [showEditModal, setShowEditModal] = React.useState(false)
  const [showDeleteModal, setShowDeleteModal] = React.useState(false)
  const [errorOnResponse, setErrorOnResponse] = React.useState(null)
  const [usage, setUsage] = useState<CodeUsage>()
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

  const handleEditCodelist = async (values: CodeListFormValues) => {
    try {
      await updateCodelist({ ...values } as Code)
      refresh()
      setShowEditModal(false)
    } catch (error: any) {
      setShowEditModal(true)
      setErrorOnResponse(error.message)
    }
  }

  const handleDeleteCodelist = async (values: { list: string; code: string }) => {
    try {
      await deleteCodelist(values.list, values.code)
      refresh()
      setShowDeleteModal(false)
    } catch (error: any) {
      setShowDeleteModal(true)
      setErrorOnResponse(error.message)
    }
  }

  let sortedData = tableData

  const comparator = (a: Code, b: Code, orderBy: string) => {
    switch (orderBy) {
      case 'code':
        return a.code.localeCompare(b.code)
      case 'navn':
        return (a.shortName || '').localeCompare(b.shortName || '')
      default:
        return 0
    }
  }

  sortedData = sortedData.sort((a, b) => {
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
        onSortChange={(sortKey)=> handleSort(sort, setSort, sortKey)}
        >
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader sortKey="code" className="w-[15%]" sortable>
              ICode
            </Table.ColumnHeader>
            <Table.ColumnHeader sortKey="navn" className="w-[25%]" sortable>
              Navn
            </Table.ColumnHeader>
            <Table.ColumnHeader className="w-1/2 break-all">
              Beskrivelse
            </Table.ColumnHeader>
            <Table.ColumnHeader/>
          </Table.Row>
          </Table.Header>
        <Table.Body>
          {sortedData.map((row, index) => {
            return (
            <Table.Row key={index}>
              <Table.DataCell className="w-[15%] break-all" scope="row">
                {row.code}
              </Table.DataCell>
              <Table.DataCell>{row.shortName}</Table.DataCell>
              <Table.DataCell className="w-[15%] break-all">{row.description}</Table.DataCell>
              <Table.DataCell>
                <div className="flex justify-end w-full">
                  <Tooltip content="Vis bruk">
                    <Button
                      variant={row === selectedCode  && showUsage ? "primary" : "tertiary"}
                      onClick={() => {
                        setSelectedCode(row)
                        setShowUsage(true)
                      }}
                      icon={<GlassesIcon title="Vis bruk"/>}
                    />
                  </Tooltip>

                  <AuditButton id={`${row.list}-${row.code}`} kind={KIND.tertiary} />

                  <Tooltip content="Redigér">
                    <Button
                      variant="tertiary"
                      onClick={() => {
                        setSelectedCode(row)
                        setShowEditModal(true)
                      }}
                      icon={<DocPencilIcon title="Redigér"/>}
                    />
                  </Tooltip>

                  <Tooltip content="Slett">
                    <Button
                      variant="tertiary"
                      onClick={() => {
                        setSelectedCode(row)
                        setShowDeleteModal(true)
                      }}
                      icon={<TrashIcon title="Slett"/>}
                    />
                  </Tooltip>

                </div>
              </Table.DataCell>
            </Table.Row>
          )})}

        </Table.Body>

      </Table>

      {showEditModal && selectedCode && (
        <UpdateCodeListModal
          title='Rediger kode'
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
          title='Bekreft sletting'
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
