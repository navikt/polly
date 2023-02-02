import React, { useEffect, useReducer, useState } from 'react'
import { SORT_DIRECTION } from 'baseui/table'
import { AaregAvtale, PageResponse } from '../../constants'
import { Cell, HeadCell, Row, Table } from '../common/Table'
import { PLACEMENT, StatefulPopover } from 'baseui/popover'
import { StatefulMenu } from 'baseui/menu'
import { Block } from 'baseui/block'
import { intl } from '../../util'
import Button from '../common/Button'
import { KIND } from 'baseui/button'
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'
import { Pagination } from 'baseui/pagination'

type AaregAvtaleTableProps = {
  aaregAvtaler: AaregAvtale[]
}

export const AaregAvtaleTable = (props: AaregAvtaleTableProps) => {
  const [pageLimit, setPageLimit] = useState(50)
  const [page, setPage] = useState(1)
  const [sortedAaregAvtale, setSortedAaregAvtale] = useState<AaregAvtale[]>([])


  useEffect(() => {
    setSortedAaregAvtale(props.aaregAvtaler.sort((a, b) =>
      a.avtalenummer > b.avtalenummer ? 1 : -1
    ).slice(0, 50))
  }, [props.aaregAvtaler])

  useEffect(() => {

    setSortedAaregAvtale(
      props.aaregAvtaler.sort((a, b) =>
        a.avtalenummer > b.avtalenummer ? 1 : -1
      ).slice((page - 1) * pageLimit, pageLimit * page)
    )
  }, [pageLimit, page])

  return (
    <>
      <Table
        emptyText={intl.noAlertsAvailableInTable}
        headers={
          <>
            <HeadCell title="avtalenummer" />
          </>
        }
      >
        {sortedAaregAvtale.map((avtale) =>
          <Row key={avtale.avtalenummer}>
            <Cell>
              {avtale.avtalenummer ?
                <>{avtale.avtalenummer}</>
                : ''}
            </Cell>

            <Cell>
              {avtale ?
                <></>
                : ''}
            </Cell>

            <Cell>
              {avtale ?
                <></>
                : ''}
            </Cell>
          </Row>)}
      </Table>
      <Block display="flex" justifyContent="space-between" marginTop="1rem">
        <StatefulPopover
          placement={PLACEMENT.bottom}
          content={({ close }) => (
            <StatefulMenu
              items={[5, 10, 20, 50, 100].map(i => ({ label: i, }))}
              onItemSelect={({ item }) => {
                setPageLimit(item.label)
                close()
              }}
              overrides={{
                List: {
                  style: { height: '150px', width: '100px' },
                },
              }}
            />
          )}>
          <div><Button kind={KIND.tertiary} iconEnd={faChevronDown}>{`${pageLimit} ${intl.rows}`}</Button></div>
        </StatefulPopover>
        <Pagination
          currentPage={page}
          numPages={Math.ceil(props.aaregAvtaler.length / pageLimit)}
          onPageChange={a => setPage(a.nextPage)}
          labels={{ nextButton: intl.nextButton, preposition: intl.of, prevButton: intl.prevButton }}
        />
      </Block>
    </>
  )
}
