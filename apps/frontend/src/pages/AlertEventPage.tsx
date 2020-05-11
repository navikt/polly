import React, { useEffect, useReducer } from 'react'
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
import { HeadingLarge, Label2 } from 'baseui/typography'


type State = {
  events: PageResponse<AlertEvent>,
  page: number,
  limit: number,
  level?: AlertEventLevel,
  type?: AlertEventType
}

type Action =
  { type: 'EVENTS', value: PageResponse<AlertEvent> } |
  { type: 'PAGE', value: number } |
  { type: 'LIMIT', value: number } |
  { type: 'EVENT_TYPE', value?: AlertEventType } |
  { type: 'EVENT_LEVEL', value?: AlertEventLevel }

const clampPage = (state: State, page: number, limit: number): number => {
  if (page < 1 || page > state.events.pages) {
    return state.page
  }
  const maxPage = Math.ceil(state.events.totalElements / limit)
  return page > maxPage ? maxPage : page
}

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'EVENTS':
      return {...state, events: action.value, page: clampPage({...state, events: action.value}, state.page, state.limit)}
    case 'PAGE':
      return {...state, page: clampPage(state, action.value, state.limit)}
    case 'LIMIT':
      return {...state, limit: action.value, page: clampPage(state, state.page, action.value)}
    case 'EVENT_TYPE':
      return {...state, page: 1, type: action.value}
    case 'EVENT_LEVEL':
      return {...state, page: 1, level: action.value}
  }
}

export const AlertEventPage = () => {
  const [state, dispatch] = useReducer(reducer, {
    events: {content: [], numberOfElements: 0, pageNumber: 0, pages: 0, pageSize: 1, totalElements: 0},
    page: 1,
    limit: 50,
    level: undefined,
    type: undefined
  })

  useEffect(() => {
    (async () => {
      dispatch({type: 'EVENTS', value: (await getAlertEvents(state.page - 1, state.limit, state.type, state.level))})
    })()
  }, [state.page, state.limit, state.type, state.level])

  const levelButton = (text: string, newLevel?: AlertEventLevel) =>
    <Button type='button' marginRight kind={state.level === newLevel ? 'primary' : 'outline'} size='compact'
            onClick={() => dispatch({type: 'EVENT_LEVEL', value: newLevel})}>{text}</Button>

  return (
    <>
      <HeadingLarge>{intl.alerts}</HeadingLarge>
      <Block width='100%' display='flex' marginBottom={theme.sizing.scale200}>

        <Block width='50%' display='flex' justifyContent='flex-start' alignItems='center'>
          <Label2 marginRight={theme.sizing.scale600}>Type:</Label2>
          <StatefulSelect
            options={Object.values(AlertEventType).map(t => ({id: t, label: intl[t]}))}
            onChange={params => dispatch({type: 'EVENT_TYPE', value: params?.option?.id as AlertEventType})}
          />
        </Block>

        <Block width='50%' display='flex' justifyContent='flex-end' alignItems='center'>
          <Label2 marginRight={theme.sizing.scale600}>Nivå: </Label2>
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
        {state.events.content.map((event, index) => {
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
                dispatch({type: 'LIMIT', value: item.label})
                close()
              }}
              overrides={{
                List: {
                  style: {height: '150px', width: '100px'},
                },
              }}
            />
          )}>
          <div><Button kind={KIND.tertiary} iconEnd={faChevronDown}>{`${state.limit} ${intl.rows}`}</Button></div>
        </StatefulPopover>
        <Pagination
          currentPage={state.page}
          numPages={state.events.pages}
          onPageChange={({nextPage}) => dispatch({type: 'PAGE', value: nextPage})}
          labels={{nextButton: intl.nextButton, prevButton: intl.prevButton}}
        />
      </Block>
    </>
  )
}
