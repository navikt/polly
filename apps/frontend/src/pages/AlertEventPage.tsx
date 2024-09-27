import { faChevronDown, faTimes } from '@fortawesome/free-solid-svg-icons'
import { KIND } from 'baseui/button'
import { StatefulMenu } from 'baseui/menu'
import { Pagination } from 'baseui/pagination'
import { PLACEMENT, StatefulPopover } from 'baseui/popover'
import { StatefulSelect } from 'baseui/select'
import { SORT_DIRECTION } from 'baseui/table'
import { HeadingLarge, LabelMedium } from 'baseui/typography'
import moment from 'moment'
import { useEffect, useReducer } from 'react'
import { useParams } from 'react-router-dom'
import { getAlertEvents } from '../api/AlertApi'
import { Sensitivity } from '../components/InformationType/Sensitivity'
import Button from '../components/common/Button'
import { ObjectLink } from '../components/common/RouteLink'
import { Cell, HeadCell, Row, Table } from '../components/common/Table'
import { AlertEvent, AlertEventLevel, AlertEventType, ObjectType, PageResponse } from '../constants'
import { ampli } from '../service/Amplitude'
import { codelist } from '../service/Codelist'
import { user } from '../service/User'
import { theme } from '../util'
import { tekster } from '../util/codeToFineText'

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


  ampli.logEvent('besøk', { side: 'Varsler', url: '/alert/events/', app: 'Behandlingskatalogen' })

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
      <div className="flex w-full justify-between items-center">
        <HeadingLarge>Varsler</HeadingLarge>
        {(state.informationTypeId || state.processId || state.disclosureId) && (
          <div className="flex items-center">
            <LabelMedium>Filter: </LabelMedium>
            <Button kind="secondary" size="compact" marginLeft marginRight iconEnd={faTimes} onClick={() => dispatch({ type: 'OBJECT_FILTER' })}>
              {state.processId && 'Behandling'}
              {state.informationTypeId && 'Opplysningstype'}
              {state.disclosureId && 'Utlevering'}
            </Button>
          </div>
        )}
      </div>
      <div className="w-full flex mb-1.5">
        <div className="w-1/2 flex justify-start items-center">
          <LabelMedium marginRight={theme.sizing.scale600}>Type: </LabelMedium>
          <StatefulSelect
            options={Object.values(AlertEventType).map((t: AlertEventType) => ({ id: t, label: tekster[t] }))}
            onChange={(params) => setType(params?.option?.id as AlertEventType)}
          />
        </div>

        <div className="w-1/2 flex justify-end items-center">
          <LabelMedium marginRight={theme.sizing.scale600}>Nivå: </LabelMedium>
          {levelButton('Alle')}
          {levelButton('Info', AlertEventLevel.INFO)}
          {levelButton('Advarsel', AlertEventLevel.WARNING)}
          {levelButton('Feil', AlertEventLevel.ERROR)}
        </div>
      </div>
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
        {state.events.content.map((event: AlertEvent) => (
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
      <div className="flex justify-between mt-4">
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
          onPageChange={(page) => setPage(page.nextPage)}
          labels={{ nextButton: 'Neste', preposition: 'av', prevButton: 'Forrige' }}
        />
      </div>
    </>
  )
}

export const canViewAlerts = () => user.isSuper() || user.isAdmin()
