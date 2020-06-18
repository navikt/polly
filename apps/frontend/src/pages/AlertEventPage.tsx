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
import { faChevronDown, faTimes } from '@fortawesome/free-solid-svg-icons'
import { StatefulSelect } from 'baseui/select'
import { HeadingLarge, Label2 } from 'baseui/typography'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import { user } from '../service/User'
import { codelist } from '../service/Codelist'
import moment from 'moment'


type State = {
  events: PageResponse<AlertEvent>,
  page: number,
  limit: number,
  level?: AlertEventLevel,
  type?: AlertEventType,
  processId?: string,
  informationTypeId?: string,
}

type Action =
  { type: 'EVENTS', value: PageResponse<AlertEvent> } |
  { type: 'PAGE', value: number } |
  { type: 'LIMIT', value: number } |
  { type: 'EVENT_TYPE', value?: AlertEventType } |
  { type: 'EVENT_LEVEL', value?: AlertEventLevel } |
  { type: 'OBJECT_FILTER', objectType?: 'informationtype' | 'process', id?: string }

const clampPage = (state: State, page: number, limit: number): number => {
  if (page < 1 || page > state.events.pages) {
    return state.page
  }
  const maxPage = Math.ceil(state.events.totalElements / limit)
  return page > maxPage ? maxPage : page
}

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'OBJECT_FILTER':
      return {
        ...state,
        processId: action.objectType === 'process' ? action.id : undefined,
        informationTypeId: action.objectType === 'informationtype' ? action.id : undefined
      }
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

const AlertEventPageImpl = (props: RouteComponentProps<{ objectType?: 'informationtype' | 'process', id?: string }>) => {
  const {objectType, id} = props.match.params
  const [state, dispatch] = useReducer(reducer, {
    events: {content: [], numberOfElements: 0, pageNumber: 0, pages: 0, pageSize: 1, totalElements: 0},
    page: 1,
    limit: 50,
    level: undefined,
    type: undefined,
    processId: objectType === 'process' ? id : undefined,
    informationTypeId: objectType === 'informationtype' ? id : undefined
  })
  const setPage = (p: number) => dispatch({type: 'PAGE', value: p})
  const setLimit = (l: number) => dispatch({type: 'LIMIT', value: l})
  const setType = (t?: AlertEventType) => dispatch({type: 'EVENT_TYPE', value: t})
  const setLevel = (l?: AlertEventLevel) => dispatch({type: 'EVENT_LEVEL', value: l})

  useEffect(() => {
    getAlertEvents(state.page - 1, state.limit, state.type, state.level, state.processId, state.informationTypeId)
    .then(a => dispatch({type: 'EVENTS', value: a}))
  }, [state.page, state.limit, state.type, state.level, state.processId, state.informationTypeId])

  useEffect(() => {
    dispatch({type: 'OBJECT_FILTER', objectType, id})
  }, [objectType, id])

  const levelButton = (text: string, newLevel?: AlertEventLevel) =>
    <Button type='button' marginRight kind={state.level === newLevel ? 'primary' : 'outline'} size='compact'
            onClick={() => setLevel(newLevel)}>{text}</Button>

  return (
    <>
      <Block display='flex' width='100%' justifyContent='space-between' alignItems='center'>
        <HeadingLarge>{intl.alerts}</HeadingLarge>
        {(state.informationTypeId || state.processId) && <Block display='flex' alignItems='center'>
          <Label2>{intl.filter}: </Label2>
          <Button kind='secondary'
                  size='compact' marginLeft marginRight
                  iconEnd={faTimes} onClick={() => dispatch({type: 'OBJECT_FILTER'})}
          >{state.processId && intl.process}{state.informationTypeId && intl.informationType}</Button>
        </Block>}
      </Block>
      <Block width='100%' display='flex' marginBottom={theme.sizing.scale200}>

        <Block width='50%' display='flex' justifyContent='flex-start' alignItems='center'>
          <Label2 marginRight={theme.sizing.scale600}>{intl.type}: </Label2>
          <StatefulSelect
            options={Object.values(AlertEventType).map(t => ({id: t, label: intl[t]}))}
            onChange={params => setType(params?.option?.id as AlertEventType)}
          />
        </Block>

        <Block width='50%' display='flex' justifyContent='flex-end' alignItems='center'>
          <Label2 marginRight={theme.sizing.scale600}>{intl.level}: </Label2>
          {levelButton(intl.all)}
          {levelButton(intl.INFO, AlertEventLevel.INFO)}
          {levelButton(intl.WARNING, AlertEventLevel.WARNING)}
          {levelButton(intl.ERROR, AlertEventLevel.ERROR)}
        </Block>

      </Block>
      <Table
        emptyText={intl.alerts.toLowerCase()}
        headers={
          <>
            <HeadCell title={intl.process}/>
            <HeadCell title={intl.informationType}/>
            <HeadCell title={intl.level + ' ' + intl.type}/>
            <HeadCell title={intl.time}/>
            <HeadCell title={intl.user}/>
          </>
        }
      >
        {state.events.content.map(event =>
          <Row key={event.id}>
            <Cell>
              {event.process ?
                <ObjectLink id={event.process.id} type={ObjectType.PROCESS}>
                  {codelist.getShortnameForCode(event.process.purposeCode)}: {event.process?.name}
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

            <Cell>{intl[event.level]} {intl[event.type]}</Cell>
            <Cell>{moment(event.changeStamp.lastModifiedDate).format('lll')}</Cell>
            <Cell>{event.changeStamp.lastModifiedBy}</Cell>
          </Row>)}
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
          <div><Button kind={KIND.tertiary} iconEnd={faChevronDown}>{`${state.limit} ${intl.rows}`}</Button></div>
        </StatefulPopover>
        <Pagination
          currentPage={state.page}
          numPages={state.events.pages}
          onPageChange={a => setPage(a.nextPage)}
          labels={{nextButton: intl.nextButton, preposition: intl.of, prevButton: intl.prevButton}}
        />
      </Block>
    </>
  )
}

export const AlertEventPage = withRouter(AlertEventPageImpl)
export const canViewAlerts = () => user.isAdmin()
