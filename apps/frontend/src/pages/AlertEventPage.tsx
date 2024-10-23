import { faChevronDown, faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Dropdown, Select } from '@navikt/ds-react'
import { Pagination } from 'baseui/pagination'
import { SORT_DIRECTION } from 'baseui/table'
import { HeadingLarge, LabelMedium } from 'baseui/typography'
import moment from 'moment'
import { useEffect, useReducer } from 'react'
import { useParams } from 'react-router-dom'
import { getAlertEvents } from '../api/AlertApi'
import { Sensitivity } from '../components/InformationType/Sensitivity'
import { ObjectLink } from '../components/common/RouteLink'
import { Cell, HeadCell, Row, Table } from '../components/common/Table'
import {
  EAlertEventLevel,
  EAlertEventType,
  EObjectType,
  IAlertEvent,
  IPageResponse,
} from '../constants'
import { ampli } from '../service/Amplitude'
import { CodelistService } from '../service/Codelist'
import { user } from '../service/User'
import { theme } from '../util'
import { tekster } from '../util/codeToFineText'

type TSortCol = 'PROCESS' | 'INFORMATION_TYPE' | 'DISCLOSURE' | 'TYPE' | 'LEVEL' | 'TIME' | 'USER'

type TState = {
  events: IPageResponse<IAlertEvent>
  page: number
  limit: number
  level?: EAlertEventLevel
  type?: EAlertEventType
  processId?: string
  informationTypeId?: string
  disclosureId?: string
  sort: { column: TSortCol; dir: typeof SORT_DIRECTION.ASC | typeof SORT_DIRECTION.DESC }
}

type TAlertObjectType = 'informationtype' | 'process' | 'disclosure'

type TAction =
  | { type: 'EVENTS'; value: IPageResponse<IAlertEvent> }
  | { type: 'PAGE'; value: number }
  | { type: 'LIMIT'; value: number }
  | { type: 'EVENT_TYPE'; value?: EAlertEventType }
  | { type: 'EVENT_LEVEL'; value?: EAlertEventLevel }
  | { type: 'OBJECT_FILTER'; objectType?: TAlertObjectType; id?: string }
  | { type: 'SORT'; column: TSortCol; dir: typeof SORT_DIRECTION.ASC | typeof SORT_DIRECTION.DESC }

const clampPage = (state: TState, page: number, limit: number): number => {
  if (page < 1 || page > state.events.pages) {
    return state.page
  }
  const maxPage = Math.ceil(state.events.totalElements / limit)
  return page > maxPage ? maxPage : page
}

const reducer = (state: TState, action: TAction): TState => {
  switch (action.type) {
    case 'OBJECT_FILTER':
      return {
        ...state,
        processId: action.objectType === 'process' ? action.id : undefined,
        informationTypeId: action.objectType === 'informationtype' ? action.id : undefined,
        disclosureId: action.objectType === 'disclosure' ? action.id : undefined,
      }
    case 'EVENTS':
      return {
        ...state,
        events: action.value,
        page: clampPage({ ...state, events: action.value }, state.page, state.limit),
      }
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
  const [codelistUtils] = CodelistService()

  const { objectType, id } = useParams<{ objectType?: TAlertObjectType; id?: string }>()
  const [state, dispatch] = useReducer(reducer, {
    events: {
      content: [],
      numberOfElements: 0,
      pageNumber: 0,
      pages: 0,
      pageSize: 1,
      totalElements: 0,
    },
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
  const setType = (t?: EAlertEventType) => dispatch({ type: 'EVENT_TYPE', value: t })
  const setLevel = (l?: EAlertEventLevel) => dispatch({ type: 'EVENT_LEVEL', value: l })

  ampli.logEvent('besøk', { side: 'Varsler', url: '/alert/events/', app: 'Behandlingskatalogen' })

  useEffect(() => {
    getAlertEvents(
      state.page - 1,
      state.limit,
      state.type,
      state.level,
      state.processId,
      state.informationTypeId,
      state.disclosureId
    ).then((a) => dispatch({ type: 'EVENTS', value: a }))
  }, [
    state.page,
    state.limit,
    state.type,
    state.level,
    state.processId,
    state.informationTypeId,
    state.disclosureId,
  ])

  useEffect(() => {
    dispatch({ type: 'OBJECT_FILTER', objectType, id })
  }, [objectType, id])

  const levelButton = (text: string, newLevel?: EAlertEventLevel) => (
    <Button
      className="mr-2.5"
      type="button"
      variant={state.level === newLevel ? 'primary' : 'secondary'}
      size="xsmall"
      onClick={() => setLevel(newLevel)}
    >
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
            <Button
              variant="secondary"
              size="xsmall"
              className="mx-2.5"
              onClick={() => dispatch({ type: 'OBJECT_FILTER' })}
            >
              {state.processId && 'Behandling'}
              {state.informationTypeId && 'Opplysningstype'}
              {state.disclosureId && 'Utlevering'}
              <FontAwesomeIcon icon={faTimes} style={{ marginLeft: '.5rem' }} />
            </Button>
          </div>
        )}
      </div>
      <div className="w-full flex mb-1.5">
        <div className="w-1/2 flex justify-start items-center">
          <LabelMedium marginRight={theme.sizing.scale600}>Type: </LabelMedium>
          <Select
            label="Alert type"
            hideLabel
            onChange={(event) => {
              if (event.target.value !== '') {
                setType(event.target.value as EAlertEventType)
              } else {
                setType(undefined)
              }
            }}
          >
            <option value="">velg type</option>
            {Object.values(EAlertEventType).map((t: EAlertEventType) => (
              <option key={t} value={t}>
                {tekster[t]}
              </option>
            ))}
          </Select>
        </div>

        <div className="w-1/2 flex justify-end items-center">
          <LabelMedium marginRight={theme.sizing.scale600}>Nivå: </LabelMedium>
          {levelButton('Alle')}
          {levelButton('Info', EAlertEventLevel.INFO)}
          {levelButton('Advarsel', EAlertEventLevel.WARNING)}
          {levelButton('Feil', EAlertEventLevel.ERROR)}
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
        {state.events.content.map((event: IAlertEvent) => (
          <Row key={event.id}>
            <Cell>
              {event.process ? (
                <ObjectLink id={event.process.id} type={EObjectType.PROCESS}>
                  {codelistUtils.getShortnameForCodes(event.process.purposes)}: {event.process.name}
                </ObjectLink>
              ) : (
                ''
              )}
            </Cell>

            <Cell>
              {event.informationType ? (
                <ObjectLink id={event.informationType.id} type={EObjectType.INFORMATION_TYPE}>
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
                <ObjectLink id={event.disclosure.id} type={EObjectType.DISCLOSURE}>
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
        <Dropdown>
          <Button variant="tertiary" as={Dropdown.Toggle}>
            {`${state.limit} Rader`}{' '}
            <FontAwesomeIcon icon={faChevronDown} style={{ marginLeft: '.5rem' }} />
          </Button>
          <Dropdown.Menu className="w-fit">
            <Dropdown.Menu.List>
              {[5, 10, 20, 50, 100].map((pageSize: number) => (
                <Dropdown.Menu.List.Item
                  key={'pageSize_' + pageSize}
                  as={Button}
                  onClick={() => setLimit(pageSize)}
                >
                  {pageSize}
                </Dropdown.Menu.List.Item>
              ))}
            </Dropdown.Menu.List>
          </Dropdown.Menu>
        </Dropdown>
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
