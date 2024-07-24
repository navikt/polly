import React, { useEffect, useState } from 'react'
import { getAudits } from '../../../api/AuditApi'
import { AuditItem, ObjectType, PageResponse } from '../../../constants'
import moment from 'moment'
import { AuditButton } from './AuditButton'
import _ from 'lodash'
import { AuditActionIcon } from './AuditComponents'
import randomColor from 'randomcolor'
import { ObjectLink } from '../../common/RouteLink'
import {BodyShort, Button, Heading, Modal, Pagination, Select, Spacer, Table, Tooltip} from "@navikt/ds-react";
import {JsonView} from "react-json-view-lite";

const CodeView = ({ audit }: { audit: AuditItem }) => {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <div>
      <Button key={audit.id} onClick={() => setModalOpen(!modalOpen)} variant="tertiary">
        Vis data
      </Button>
      <Modal
        key={audit.id}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        className="max-h-[75%] overflow-y-scroll"
        header={{ heading: 'Data visning' }}
      >
        <Modal.Body>
          <JsonView data={audit.data} />
        </Modal.Body>
      </Modal>
    </div>
  )
}

export const AuditRecentTable = (props: { show: boolean }) => {
  const [audits, setAudits] = useState<PageResponse<AuditItem>>({ content: [], numberOfElements: 0, pageNumber: 0, pages: 0, pageSize: 1, totalElements: 0 })
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(20)
  const [table, setTable] = useState<ObjectType | undefined>(undefined)

  const colors = _.uniq(audits.content.map((a) => a.tableId)).reduce(
    (val, id) => {
      val[id] = randomColor({ seed: id, luminosity: 'dark' })
      return val
    },
    {} as { [id: string]: string },
  )

  useEffect(() => {
    ;(async () => {
      props.show && setAudits(await getAudits(page - 1, limit, table))
    })()
  }, [page, limit, props.show, table])

  const handlePageChange = (nextPage: number) => {
    if (nextPage < 1) {
      return
    }
    if (nextPage > audits.pages) {
      return
    }
    setPage(nextPage)
  }

  useEffect(() => {
    const nextPageNum = Math.ceil(audits.totalElements / limit)
    if (audits.totalElements && nextPageNum < page) {
      setPage(nextPageNum)
    }
  }, [limit, audits.totalElements])

  if (!props.show) {
    return null
  }

  const tableOptions = Object.keys(ObjectType).map((ot) => ({ value: ot, label: ot }))

  return (
    <>
      <div className="flex justify-between mb-2">
        <Heading size="small">Siste endringer</Heading>
        <div className="w-72 flex justify-between">
          <Select
            label="Tabell:"
            onChange={(e) => {
              if (e.target.value === 'Codelist') {
                setTable(e.target.value.toUpperCase() as ObjectType)
              } else {
                setTable(e.target.value as ObjectType)
              }
            }}
          >
            <option value="">Velg type for versjonering</option>
            {tableOptions.map((tableOption, index) => (
              <option key={index + '_' + tableOption.label} value={tableOption.value}>
                {tableOption.label}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <Table size="large" zebraStripes>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader className="w-[13%]">Tidspunkt</Table.ColumnHeader>
            <Table.ColumnHeader className="w-[17%]">Tabell</Table.ColumnHeader>
            <Table.ColumnHeader>ID</Table.ColumnHeader>
            <Table.ColumnHeader>Bruker</Table.ColumnHeader>
            <Table.ColumnHeader aria-hidden></Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {audits.content.map((audit, index) => {
            const length = window.innerWidth > 1000 ? (window.innerWidth > 1200 ? 40 : 30) : 20
            const rowNum = audits.pageNumber * audits.pageSize + index + 1
            return (
              <Table.Row key={audit.id}>
                <Table.HeaderCell className="w-[13%]" scope="row">
                  <div className="flex">
                  <div className="mr-2">{rowNum}</div>
                    <AuditButton kind="tertiary" id={audit.tableId} auditId={audit.id}>
                      <Tooltip content={audit.time} placement="top">
                        <div>{moment(audit.time).fromNow()}</div>
                      </Tooltip>
                    </AuditButton>
                  </div>
                </Table.HeaderCell>
                <Table.HeaderCell className="w-[17%]">
                  <AuditActionIcon action={audit.action}/> {audit.table}
                </Table.HeaderCell>
                <Table.DataCell>
                  <Tooltip content={audit.tableId} placement="top">
                    <div className={`text-[${colors[audit.tableId]}]`}>{_.truncate(audit.tableId, {length})}</div>
                  </Tooltip>
                </Table.DataCell>
                <Table.DataCell>
                  <div>{audit.user}</div>
                </Table.DataCell>
                <Table.HeaderCell>
                  <div className="flex">
                    <ObjectLink id={audit.tableId} type={audit.table} audit={audit}>
                      <Button variant="tertiary">Finn bruk</Button>
                    </ObjectLink>
                    <CodeView audit={audit}/>
                  </div>
                </Table.HeaderCell>
              </Table.Row>
            )
          })}
        </Table.Body>
      </Table>

      <div className="flex w-full justify-center items-center mt-3">
        <Select
          label="Antall rader:"
          value={limit}
          onChange={(e) => {
            setLimit(parseInt(e.target.value))
          }}
          size="small"
        >
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </Select>
        <Spacer/>
        <div>
          <Pagination
            page={page}
            onPageChange={(page) => handlePageChange(page)}
            count={audits.pages}
            prevNextTexts
            size="small"
          />
        </div>
        <Spacer/>
        <BodyShort>Totalt antall rader: {audits.totalElements}</BodyShort>
      </div>
    </>
  )
}
