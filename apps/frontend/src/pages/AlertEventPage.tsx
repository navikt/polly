import React, { useEffect, useState } from 'react'
import { AlertEvent, PageResponse } from '../constants'
import { getAlertEvents } from '../api/AlertApi'
import { Cell, HeadCell, Row, Table } from '../components/common/Table'
import { intl } from '../util'
import { Block } from 'baseui/block'
import { PLACEMENT, StatefulPopover } from 'baseui/popover'
import { StatefulMenu } from 'baseui/menu'
import { Button, KIND } from 'baseui/button'
import { TriangleDown } from 'baseui/icon'
import { Pagination } from 'baseui/pagination'


export const AlertEventPage = () => {
  const [events, setEvents] = useState<PageResponse<AlertEvent>>({content: [], numberOfElements: 0, pageNumber: 0, pages: 0, pageSize: 1, totalElements: 0})
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(20)

  useEffect(() => {
    (async () => {
      setEvents((await getAlertEvents(page - 1, limit)))
    })()
  }, [page, limit])

  const handlePageChange = (nextPage: number) => {
    if (nextPage < 1) {
      return
    }
    if (nextPage > events.pages) {
      return
    }
    setPage(nextPage)
  }

  useEffect(() => {
    const nextPageNum = Math.ceil(events.totalElements / limit)
    if (events.totalElements && nextPageNum < page) {
      setPage(nextPageNum)
    }
  }, [limit, events.totalElements])


  return (
    <>
      <Table
        emptyText={'events'}
        headers={
          <>
            <HeadCell title={intl.informationType}/>
            <HeadCell title={intl.process}/>
            <HeadCell title={'level'}/>
            <HeadCell title={'type'}/>
          </>
        }
      >
        {events.content.map((event, index) => {
          return (
            <Row key={event.id}>
              <Cell>{event.informationType?.name}</Cell>
              <Cell>{event.process?.name}</Cell>
              <Cell>{event.level}</Cell>
              <Cell>{event.type}</Cell>
            </Row>
          )
        })}
      </Table>
      <Block display="flex" justifyContent="space-between" marginTop="1rem">
        <StatefulPopover
          content={({close}) => (
            <StatefulMenu
              items={[5, 10, 20, 50, 100].map(i => ({label: i,}))}
              onItemSelect={({item}) => {
                setLimit(item.label)
                close()
              }}
              overrides={{
                List: {
                  style: {height: '150px', width: '100px'},
                },
              }}
            />
          )}
          placement={PLACEMENT.bottom}
        >
          <Button kind={KIND.tertiary} endEnhancer={TriangleDown}>{`${limit} ${intl.rows}`}</Button>
        </StatefulPopover>
        <Pagination
          currentPage={page}
          numPages={events.pages}
          onPageChange={({nextPage}) => handlePageChange(nextPage)}
          labels={{nextButton: intl.nextButton, prevButton: intl.prevButton}}
        />
      </Block>
    </>
  )
}
