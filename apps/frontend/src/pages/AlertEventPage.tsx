import { ChevronDownIcon, XMarkIcon } from '@navikt/aksel-icons'
import {
  Button,
  Chips,
  Dropdown,
  Heading,
  Label,
  Pagination,
  Select,
  Table,
} from '@navikt/ds-react'
import moment from 'moment'
import { useEffect, useReducer } from 'react'
import { useParams } from 'react-router'
import { getAlertEvents } from '../api/AlertApi'
import { Sensitivity } from '../components/InformationType/Sensitivity'
import { ObjectLink } from '../components/common/RouteLink'
import {
  EAlertEventLevel,
  EAlertEventType,
  EObjectType,
  IAlertEvent,
  IPageResponse,
} from '../constants'
import { CodelistService } from '../service/Codelist'
import { user } from '../service/User'
import { tekster } from '../util/codeToFineText'

type TState = {
  events: IPageResponse<IAlertEvent>
  page: number
  limit: number
  level?: EAlertEventLevel
  type?: EAlertEventType
  processId?: string
  informationTypeId?: string
  disclosureId?: string
}

type TAlertObjectType = 'informationtype' | 'process' | 'disclosure'

type TAction =
  | { type: 'EVENTS'; value: IPageResponse<IAlertEvent> }
  | { type: 'PAGE'; value: number }
  | { type: 'LIMIT'; value: number }
  | { type: 'EVENT_TYPE'; value?: EAlertEventType }
  | { type: 'EVENT_LEVEL'; value?: EAlertEventLevel }
  | { type: 'OBJECT_FILTER'; objectType?: TAlertObjectType; id?: string }

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
  })
  const setPage = (p: number) => dispatch({ type: 'PAGE', value: p })
  const setLimit = (l: number) => dispatch({ type: 'LIMIT', value: l })
  const setType = (t?: EAlertEventType) => dispatch({ type: 'EVENT_TYPE', value: t })
  const setLevel = (l?: EAlertEventLevel) => dispatch({ type: 'EVENT_LEVEL', value: l })

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

  const filterToggle = (text: string, newLevel?: EAlertEventLevel) => (
    <Chips.Toggle
      checkmark={false}
      key={text}
      selected={state.level === newLevel}
      onClick={() => setLevel(newLevel)}
    >
      {text}
    </Chips.Toggle>
  )

  return (
    <>
      <div className="flex w-full justify-between items-center">
        <Heading size="large">Varsler</Heading>
        {(state.informationTypeId || state.processId || state.disclosureId) && (
          <div className="flex items-center">
            <Label className="mr-3">Filter:</Label>
            <Button
              variant="secondary"
              size="xsmall"
              className="mx-2.5"
              onClick={() => dispatch({ type: 'OBJECT_FILTER' })}
            >
              {state.processId && 'Behandling'}
              {state.informationTypeId && 'Opplysningstype'}
              {state.disclosureId && 'Utlevering'}
              <span className="ml-2 inline-flex items-center leading-none">
                <XMarkIcon aria-hidden className="block" />
              </span>
            </Button>
          </div>
        )}
      </div>
      <div className="w-full flex mb-1.5">
        <Select
          label="Type varsel"
          onChange={(event) => {
            if (event.target.value !== '') {
              setType(event.target.value as EAlertEventType)
            } else {
              setType(undefined)
            }
          }}
        >
          <option value="">Velg type</option>
          {Object.values(EAlertEventType).map((t: EAlertEventType) => (
            <option key={t} value={t}>
              {tekster[t]}
            </option>
          ))}
        </Select>

        <div className="w-full flex justify-end items-center">
          <Label className="mr-3">Nivå:</Label>
          <Chips>
            {filterToggle('Alle')}
            {filterToggle('Info', EAlertEventLevel.INFO)}
            {filterToggle('Advarsel', EAlertEventLevel.WARNING)}
            {filterToggle('Feil', EAlertEventLevel.ERROR)}
          </Chips>
        </div>
      </div>
      <Table size="small">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>Behandling</Table.ColumnHeader>
            <Table.ColumnHeader>Opplysningstype</Table.ColumnHeader>
            <Table.ColumnHeader>Utlevering</Table.ColumnHeader>
            <Table.ColumnHeader>Nivå - Type</Table.ColumnHeader>
            <Table.ColumnHeader>Tidspunkt</Table.ColumnHeader>
            <Table.ColumnHeader>Bruker</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {state.events.content.map((event: IAlertEvent, index: number) => (
            <Table.Row key={index}>
              <Table.DataCell textSize="small">
                {event.process ? (
                  <ObjectLink id={event.process.id} type={EObjectType.PROCESS}>
                    {codelistUtils.getShortnameForCodes(event.process.purposes)}:{' '}
                    {event.process.name}
                  </ObjectLink>
                ) : (
                  ''
                )}
              </Table.DataCell>

              <Table.DataCell textSize="small">
                {event.informationType ? (
                  <ObjectLink id={event.informationType.id} type={EObjectType.INFORMATION_TYPE}>
                    <Sensitivity
                      sensitivity={event.informationType.sensitivity}
                      codelistUtils={codelistUtils}
                    />
                    &nbsp;
                    {event.informationType.name}
                  </ObjectLink>
                ) : (
                  ''
                )}
              </Table.DataCell>

              <Table.DataCell textSize="small">
                {event.disclosure ? (
                  <ObjectLink id={event.disclosure.id} type={EObjectType.DISCLOSURE}>
                    {event.disclosure.name}
                  </ObjectLink>
                ) : (
                  ''
                )}
              </Table.DataCell>

              <Table.DataCell textSize="small">
                {tekster[event.level]} - {tekster[event.type]}
              </Table.DataCell>
              <Table.DataCell textSize="small">
                {moment(event.changeStamp.lastModifiedDate).format('lll')}
              </Table.DataCell>
              <Table.DataCell textSize="small">{event.changeStamp.lastModifiedBy}</Table.DataCell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
      <div className="flex justify-between mt-4">
        <Dropdown>
          <Button variant="tertiary" as={Dropdown.Toggle}>
            {`${state.limit} Rader`}
            <span className="ml-2 inline-flex items-center leading-none">
              <ChevronDownIcon aria-hidden className="block" />
            </span>
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
          page={state.page}
          onPageChange={setPage}
          count={state.events.pages || 1}
          prevNextTexts
          size="small"
        />
      </div>
    </>
  )
}

export const canViewAlerts = () => user.isSuper() || user.isAdmin()
