import React, { useEffect, useState } from 'react'
import { AlertEvent, AlertEventLevel, AlertEventType, ObjectType, PageResponse } from '../constants'
import { getAlertEvents } from '../api/AlertApi'
import { Cell, HeadCell, Row, Table } from '../components/common/Table'
import { intl, theme } from '../util'
import { Block } from 'baseui/block'
import { PLACEMENT, StatefulPopover } from 'baseui/popover'
import { StatefulMenu } from 'baseui/menu'
import { KIND } from 'baseui/button'
import { Pagination } from 'baseui/pagination'
import { ObjectLink } from '../components/common/RouteLink'
import { Sensitivity } from '../components/InformationType/Sensitivity'
import Button from '../components/common/Button'
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'
import { StatefulSelect } from 'baseui/select'
import { Label2 } from 'baseui/typography'


export const AlertEventPage = () => {
  const [events, setEvents] = useState<PageResponse<AlertEvent>>({content: [], numberOfElements: 0, pageNumber: 0, pages: 0, pageSize: 1, totalElements: 0})
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(50)
  const [level, setLevel] = useState<AlertEventLevel>()
  const [type, setType] = useState<AlertEventType>()

  useEffect(() => {
    (async () => {
      setEvents((await getAlertEvents(page - 1, limit, type, level)))
    })()
  }, [page, limit, level, type])

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


  const levelButton = (text: string, newLevel?: AlertEventLevel) =>
    <Button type='button' marginRight kind={level === newLevel ? 'primary' : 'outline'} size='compact' onClick={() => setLevel(newLevel)}>{text}</Button>

  return (
    <>
      <Block width='100%' display='flex' marginBottom={theme.sizing.scale200}>

        <Block width='50%' display='flex' justifyContent='flex-start' alignItems='center'>
          <Label2 marginRight={theme.sizing.scale600}>Type</Label2>
          <StatefulSelect
            options={Object.values(AlertEventType).map(t => ({id: t, label: intl[t]}))}
            onChange={params => setType(params?.option?.id as AlertEventType)}
          />
        </Block>

        <Block width='50%' display='flex' justifyContent='flex-end'>
          {levelButton('Alle')}
          {levelButton('Info', AlertEventLevel.INFO)}
          {levelButton('Advarsel', AlertEventLevel.WARNING)}
          {levelButton('Feil', AlertEventLevel.ERROR)}
        </Block>

      </Block>
      <Table
        emptyText={'events'}
        headers={
          <>
            <HeadCell title={intl.process}/>
            <HeadCell title={intl.informationType}/>
            <HeadCell title={'Nivå'}/>
            <HeadCell title={'Type'}/>
          </>
        }
      >
        {events.content.map((event, index) => {
          return (
            <Row key={event.id}>
              <Cell>
                {event.process ?
                  <ObjectLink id={event.process.id} type={ObjectType.PROCESS}>
                    {event.process?.name}
                  </ObjectLink>
                  : ''}
              </Cell>

              <Cell>
                {event.informationType ?
                  <ObjectLink id={event.informationType.id} type={ObjectType.INFORMATION_TYPE}>
                    <Sensitivity sensitivity={event.informationType.sensitivity}/>&nbsp;
                    {event.informationType?.name}
                  </ObjectLink>
                  : ''}
              </Cell>

              <Cell>{intl[event.level]}</Cell>
              <Cell>{intl[event.type]}</Cell>
            </Row>
          )
        })}
      </Table>
      <Block display="flex" justifyContent="space-between" marginTop="1rem">
        <StatefulPopover
          placement={PLACEMENT.bottom}
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
          )}>
          <div><Button kind={KIND.tertiary} iconEnd={faChevronDown}>{`${limit} ${intl.rows}`}</Button></div>
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
