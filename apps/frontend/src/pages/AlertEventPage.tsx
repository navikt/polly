import React, { useEffect, useReducer } from 'react'
import { AlertEvent, AlertEventLevel, AlertEventType, ObjectType, PageResponse } from '../constants'
import { getAlertEvents } from '../api/AlertApi'
import { Cell, HeadCell, Row, Table } from '../components/common/Table'
import { theme } from '../util'
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
import { HeadingLarge, LabelMedium } from 'baseui/typography'
import { useParams } from 'react-router-dom'
import { user } from '../service/User'
import { codelist } from '../service/Codelist'
import moment from 'moment'
import { SORT_DIRECTION } from 'baseui/table'
import {ampli} from "../service/Amplitude";
import {tekster} from "../util/codeToFineText";

type SortCol = 'PROCESS' | 'INFORMATION_TYPE' | 'DISCLOSURE' | 'TYPE' | 'LEVEL' | 'TIME' | 'USER'

type State = {
  events: PageResponse<AlertEvent>
  page: number
  limit: number
  level?: AlertEventLevel
  type?: AlertEventType
  processId?: string
  informationTypeId?: string
  disclosureId?: string
  sort: { column: SortCol; dir: typeof SORT_DIRECTION.ASC | typeof SORT_DIRECTION.DESC }
}

type AlertObjectType = 'informationtype' | 'process' | 'disclosure'

type Action =
  | { type: 'EVENTS'; value: PageResponse<AlertEvent> }
  | { type: 'PAGE'; value: number }
  | { type: 'LIMIT'; value: number }
  | { type: 'EVENT_TYPE'; value?: AlertEventType }
  | { type: 'EVENT_LEVEL'; value?: AlertEventLevel }
  | { type: 'OBJECT_FILTER'; objectType?: AlertObjectType; id?: string }
  | { type: 'SORT'; column: SortCol; dir: typeof SORT_DIRECTION.ASC | typeof SORT_DIRECTION.DESC }

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
        informationTypeId: action.objectType === 'informationtype' ? action.id : undefined,
        disclosureId: action.objectType === 'disclosure' ? action.id : undefined,
      }
    case 'EVENTS':
      return { ...state, events: action.value, page: clampPage({ ...state, events: action.value }, state.page, state.limit) }
    case 'PAGE':
      return { ...state, page: clampPage(state, action.value, state.limit) }
    case 'LIMIT':
      return { ...state, limit: action.value, page: clampPage(state, state.page, action.value) }
    case 'EVENT_TYPE':
      return { ...state, page: 1, type: action.value }
    case 'EVENT_LEVEL':
      return { ...state, page: 1, level: action.value }
    case 'SORT':
      return { ...state, sort: { column: action.column, dir: action.dir } }
  }
}

export const AlertEventPage = () => {
  const { objectType, id } = useParams<{ objectType?: AlertObjectType; id?: string }>()
  const [state, dispatch] = useReducer(reducer, {
    events: { content: [], numberOfElements: 0, pageNumber: 0, pages: 0, pageSize: 1, totalElements: 0 },
    page: 1,
    limit: 50,
    level: undefined,
    type: undefined,
    processId: objectType === 'process' ? id : undefined,
    informationTypeId: objectType === 'informationtype' ? id : undefined,
    disclosureId: objectType === 'disclosure' ? id : undefined,
    sort: { column: 'TIME', dir: SORT_DIRECTION.DESC },
  })
  const setPage = (p: number) => dispatch({ type: 'PAGE', value: p })
  const setLimit = (l: number) => dispatch({ type: 'LIMIT', value: l })
  const setType = (t?: AlertEventType) => dispatch({ type: 'EVENT_TYPE', value: t })
  const setLevel = (l?: AlertEventLevel) => dispatch({ type: 'EVENT_LEVEL', value: l })
  const setSort = (column: SortCol) =>
    dispatch({
      type: 'SORT',
      column,
      dir: state.sort.column !== column ? SORT_DIRECTION.ASC : state.sort.dir === SORT_DIRECTION.ASC ? SORT_DIRECTION.DESC : SORT_DIRECTION.ASC,
    })

  ampli.logEvent("besøk", {side: 'Varsler', url: '/alert/events/', app: 'Behandlingskatalogen'})

  useEffect(() => {
    getAlertEvents(state.page - 1, state.limit, state.type, state.level, state.processId, state.informationTypeId, state.disclosureId).then((a) =>
      dispatch({ type: 'EVENTS', value: a }),
    )
  }, [state.page, state.limit, state.type, state.level, state.processId, state.informationTypeId, state.disclosureId])

  useEffect(() => {
    dispatch({ type: 'OBJECT_FILTER', objectType, id })
  }, [objectType, id])

  const levelButton = (text: string, newLevel?: AlertEventLevel) => (
    <Button type="button" marginRight kind={state.level === newLevel ? 'primary' : 'outline'} size="compact" onClick={() => setLevel(newLevel)}>
      {text}
    </Button>
  )

  return (
    <>
      <Block display="flex" width="100%" justifyContent="space-between" alignItems="center">
        <HeadingLarge>Varsler</HeadingLarge>
        {(state.informationTypeId || state.processId || state.disclosureId) && (
          <Block display="flex" alignItems="center">
            <LabelMedium>Filter: </LabelMedium>
            <Button kind="secondary" size="compact" marginLeft marginRight iconEnd={faTimes} onClick={() => dispatch({ type: 'OBJECT_FILTER' })}>
              {state.processId && "Behandling"}
              {state.informationTypeId && "Opplysningstype"}
              {state.disclosureId && "Utlevering"}
            </Button>
          </Block>
        )}
      </Block>
      <Block width="100%" display="flex" marginBottom={theme.sizing.scale200}>
        <Block width="50%" display="flex" justifyContent="flex-start" alignItems="center">
          <LabelMedium marginRight={theme.sizing.scale600}>Type: </LabelMedium>
          <StatefulSelect options={Object.values(AlertEventType).map((t) => ({ id: t, label: tekster[t] }))} onChange={(params) => setType(params?.option?.id as AlertEventType)} />
        </Block>

        <Block width="50%" display="flex" justifyContent="flex-end" alignItems="center">
          <LabelMedium marginRight={theme.sizing.scale600}>Nivå: </LabelMedium>
          {levelButton('Alle')}
          {levelButton('Info', AlertEventLevel.INFO)}
          {levelButton('Advarsel', AlertEventLevel.WARNING)}
          {levelButton('Feil', AlertEventLevel.ERROR)}
        </Block>
      </Block>
      <Table
        emptyText="Ingen varsler"
        headers={
          <>
            <HeadCell title="Behandling" />
            <HeadCell title="Opplysningstype" />
            <HeadCell title="Utlevering" />
            <HeadCell title="Nivå - Type" />
            <HeadCell title="Tidspunkt" />
            <HeadCell title="Bruker" />
          </>
        }
      >
        {state.events.content.map((event) => (
          <Row key={event.id}>
            <Cell>
              {event.process ? (
                <ObjectLink id={event.process.id} type={ObjectType.PROCESS}>
                  {codelist.getShortnameForCodes(event.process.purposes)}: {event.process.name}
                </ObjectLink>
              ) : (
                ''
              )}
            </Cell>

            <Cell>
              {event.informationType ? (
                <ObjectLink id={event.informationType.id} type={ObjectType.INFORMATION_TYPE}>
                  <Sensitivity sensitivity={event.informationType.sensitivity} />
                  &nbsp;
                  {event.informationType.name}
                </ObjectLink>
              ) : (
                ''
              )}
            </Cell>

            <Cell>
              {event.disclosure ? (
                <ObjectLink id={event.disclosure.id} type={ObjectType.DISCLOSURE}>
                  {event.disclosure.name}
                </ObjectLink>
              ) : (
                ''
              )}
            </Cell>

            <Cell>
              {tekster[event.level]} - {tekster[event.type]}
            </Cell>
            <Cell>{moment(event.changeStamp.lastModifiedDate).format('lll')}</Cell>
            <Cell>{event.changeStamp.lastModifiedBy}</Cell>
          </Row>
        ))}
      </Table>
      <Block display="flex" justifyContent="space-between" marginTop="1rem">
        <StatefulPopover
          placement={PLACEMENT.bottom}
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
        >
          <div>
            <Button kind={KIND.tertiary} iconEnd={faChevronDown}>{`${state.limit} Rader`}</Button>
          </div>
        </StatefulPopover>
        <Pagination
          currentPage={state.page}
          numPages={state.events.pages}
          onPageChange={(a) => setPage(a.nextPage)}
          labels={{ nextButton: "Neste", preposition: "av", prevButton: "Forrige" }}
        />
      </Block>
    </>
  )
}

export const canViewAlerts = () => user.isSuper() || user.isAdmin()
