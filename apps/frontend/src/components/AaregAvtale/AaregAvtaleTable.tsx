import React, {useReducer} from 'react'
import {SORT_DIRECTION} from "baseui/table";
import {AaregAvtale} from "../../constants";
import {HeadCell, Table} from '../common/Table';
import {PLACEMENT, StatefulPopover} from "baseui/popover";
import {StatefulMenu} from "baseui/menu";
import {Block} from 'baseui/block';
import {intl} from "../../util";
import Button from "../common/Button";
import {KIND} from "baseui/button";
import {faChevronDown} from "@fortawesome/free-solid-svg-icons";


type SortCol = 'PROCESS' | 'INFORMATION_TYPE' | 'DISCLOSURE' | 'TYPE' | 'LEVEL' | 'TIME' | 'USER'

type State = {

  page: number,
  limit: number,
  sort: { column: SortCol, dir: typeof SORT_DIRECTION.ASC | typeof SORT_DIRECTION.DESC }
}


type Action =
  { type: 'PAGE', value: number } |
  { type: 'LIMIT', value: number } |
  { type: 'SORT', column: SortCol, dir: typeof SORT_DIRECTION.ASC | typeof SORT_DIRECTION.DESC }

type AaregAvtaleTableProps = {
  aaregAvtaler: AaregAvtale[]
}


const clampPage = (state: State, page: number, limit: number): number => {
  if (page < 1) {
    return state.page
  }
  const maxPage = Math.ceil(1 / limit)
  return page > maxPage ? maxPage : page
}

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'PAGE':
      return {...state, page: clampPage(state, action.value, state.limit)}
    case 'LIMIT':
      return {...state, limit: action.value, page: clampPage(state, state.page, action.value)}
    case 'SORT':
      return {...state, sort: {column: action.column, dir: action.dir}}
  }
}

export const AaregAvtaleTable = (props: AaregAvtaleTableProps) => {

  const [state, dispatch] = useReducer(reducer, {
    // events: {content: [], numberOfElements: 0, pageNumber: 0, pages: 0, pageSize: 1, totalElements: 0},
    page: 1,
    limit: 50,
    sort: {column: 'TIME', dir: SORT_DIRECTION.DESC}
  })
  const setPage = (p: number) => dispatch({type: 'PAGE', value: p})
  const setLimit = (l: number) => dispatch({type: 'LIMIT', value: l})

  const setSort = (column: SortCol) => dispatch({
    type: 'SORT', column, dir: state.sort.column !== column ? SORT_DIRECTION.ASC :
      state.sort.dir === SORT_DIRECTION.ASC ? SORT_DIRECTION.DESC : SORT_DIRECTION.ASC
  })

  /*  useEffect(() => {
      getAlertEvents(state.page - 1, state.limit, state.type, state.level, state.processId, state.informationTypeId, state.disclosureId)
        .then(a => dispatch({type: 'EVENTS', value: a}))
    }, [state.page, state.limit, state.type, state.level, state.processId, state.informationTypeId, state.disclosureId])

    useEffect(() => {
      dispatch({type: 'OBJECT_FILTER', objectType, id})
    }, [objectType, id])*/


  return (
    <>

      <Table
        emptyText={intl.noAlertsAvailableInTable}
        headers={
          <>
            <HeadCell title={intl.process}/>
            <HeadCell title={intl.informationType}/>
            <HeadCell title={intl.disclosure}/>
            <HeadCell title={intl.level + ' - ' + intl.type}/>
            <HeadCell title={intl.time}/>
            <HeadCell title={intl.user}/>
          </>
        }
      >
        {/*  {state.events.content.map(event =>
          <Row key={event.id}>
            <Cell>
              {event.process ?
 <></>
                : ''}
            </Cell>

            <Cell>
              {event.informationType ?
  <></>
                : ''}
            </Cell>

            <Cell>
              {event.disclosure ?
<></>
                : ''}
            </Cell>


            <Cell>{moment(event.changeStamp.lastModifiedDate).format('lll')}</Cell>
            <Cell>{event.changeStamp.lastModifiedBy}</Cell>
          </Row>)}*/}
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
        {/*  <Pagination
          currentPage={state.page}
          numPages={state.events.pages}
          onPageChange={a => setPage(a.nextPage)}
          labels={{nextButton: intl.nextButton, preposition: intl.of, prevButton: intl.prevButton}}
        />*/}
      </Block>
    </>
  )
}
