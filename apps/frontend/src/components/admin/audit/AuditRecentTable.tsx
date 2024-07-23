import { LabelLarge, LabelSmall } from 'baseui/typography'
import React, { useEffect, useState } from 'react'
import { getAudits } from '../../../api/AuditApi'
import { AuditItem, ObjectType, PageResponse } from '../../../constants'
import { theme } from '../../../util'
import moment from 'moment'
import { Pagination } from 'baseui/pagination'
import { TriangleDown } from 'baseui/icon'
import { Button, KIND } from 'baseui/button'
import { PLACEMENT, StatefulPopover } from 'baseui/popover'
import { StatefulMenu } from 'baseui/menu'
import { Block } from 'baseui/block'
import { AuditButton } from './AuditButton'
import _ from 'lodash'
import ReactJson from 'react-json-view'
import { faBinoculars, faCode } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { AuditActionIcon } from './AuditComponents'
import randomColor from 'randomcolor'
import { StatefulSelect } from 'baseui/select'
import { ObjectLink } from '../../common/RouteLink'
import { Cell, HeadCell, Row, Table } from '../../common/Table'
import CustomizedStatefulTooltip from '../../common/CustomizedStatefulTooltip'

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

  return (
    <>
      <div className="flex justify-between mb-2">
        <LabelLarge>Siste endringer</LabelLarge>
        <div className="w-72 flex justify-between">
          <LabelSmall alignSelf="center" marginRight=".5rem">
            Tabellnavn:{' '}
          </LabelSmall>
          <StatefulSelect size="compact" options={Object.keys(ObjectType).map((ot) => ({ id: ot, label: ot }))} onChange={(p) => setTable(p?.value[0]?.id as ObjectType)} />
        </div>
      </div>

      <Table
        emptyText='Ingen versjonering'
        headers={
          <>
            <HeadCell $style={{ maxWidth: '13%' }} title='Tidspunkt' />
            <HeadCell $style={{ maxWidth: '17%' }} title='Tabell' />
            <HeadCell title='ID' />
            <HeadCell title='Bruker' />
          </>
        }
      >
        {audits.content.map((audit, index) => {
          const length = window.innerWidth > 1000 ? (window.innerWidth > 1200 ? 40 : 30) : 20
          const rowNum = audits.pageNumber * audits.pageSize + index + 1
          return (
            <Row key={audit.id}>
              <Cell $style={{ maxWidth: '13%' }}>
                <div className="mr-2">{rowNum}</div>
                <AuditButton kind="tertiary" id={audit.tableId} auditId={audit.id}>
                  <CustomizedStatefulTooltip content={audit.time}>{moment(audit.time).fromNow()}</CustomizedStatefulTooltip>
                </AuditButton>
              </Cell>
              <Cell $style={{ maxWidth: '17%' }}>
                <AuditActionIcon action={audit.action} /> {audit.table}
              </Cell>
              <Cell>
                <CustomizedStatefulTooltip content={audit.tableId}>
                  <div className={`text-[${colors[audit.tableId]}]`} >{_.truncate(audit.tableId, { length })}</div>
                </CustomizedStatefulTooltip>
              </Cell>
              <Cell $style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>{audit.user}</div>
                <div>
                  <ObjectLink id={audit.tableId} type={audit.table} audit={audit}>
                    <Button size="compact" shape="round" kind="tertiary">
                      <FontAwesomeIcon icon={faBinoculars} />
                    </Button>
                  </ObjectLink>
                  <StatefulPopover overrides={{ Body: { style: { width: '80%' } } }} content={() => <ReactJson src={audit.data} name={null} />}>
                    <Button size="compact" shape="round" kind="tertiary">
                      <FontAwesomeIcon icon={faCode} />
                    </Button>
                  </StatefulPopover>
                </div>
              </Cell>
            </Row>
          )
        })}
      </Table>

      <div className="flex justify-between mt-4">
        <StatefulPopover
          content={({ close }) => (
            <StatefulMenu
              items={[5, 10, 20, 50, 100].map((i) => ({ label: i }))}
              onItemSelect={({ item }) => {
                setLimit(item.label)
                close()
              }}
              overrides={{
                List: {
                  style: { height: '150px', width: '100px' },
                },
              }}
            />
          )}
          placement={PLACEMENT.bottom}
        >
          <Button kind={KIND.tertiary} endEnhancer={TriangleDown}>{`${limit} Rader`}</Button>
        </StatefulPopover>
        <Pagination
          currentPage={page}
          numPages={audits.pages}
          onPageChange={({ nextPage }) => handlePageChange(nextPage)}
          labels={{ nextButton: 'Neste', preposition: 'av', prevButton: 'Fordige' }}
        />
      </div>
    </>
  )
}
