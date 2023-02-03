import React, { useEffect, useState } from 'react'
import { SORT_DIRECTION } from 'baseui/table'
import { AaregAvtale } from '../../constants'
import { Cell, HeadCell, Row, Table } from '../common/Table'
import { PLACEMENT, StatefulPopover } from 'baseui/popover'
import { StatefulMenu } from 'baseui/menu'
import { Block } from 'baseui/block'
import { intl } from '../../util'
import Button from '../common/Button'
import { KIND } from 'baseui/button'
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'
import { Pagination } from 'baseui/pagination'
import { HeadingLarge } from 'baseui/typography'

type AaregAvtaleTableProps = {
  aaregAvtaler: AaregAvtale[]
}

export const sortAaregAvtaleList = (aaregAvtaler: AaregAvtale[]) => {
  return aaregAvtaler.sort((a,b) => {
    if(a.virksomhet > b.virksomhet) {
      return 1
    }
    else if(a.virksomhet < b.virksomhet) {
      return -1
    }
    else {
      if(a.avtalenummer > b.avtalenummer){
        return 1
      }
      else if(a.avtalenummer < b.avtalenummer){
        return -1
      }
      else {
        return 0
      }
    }
  })
}

export const AaregAvtaleTable = (props: AaregAvtaleTableProps) => {
  const [pageLimit, setPageLimit] = useState(10)
  const [page, setPage] = useState(1)
  const [sortedAaregAvtale, setSortedAaregAvtale] = useState<AaregAvtale[]>([])


  useEffect(() => {
    setSortedAaregAvtale(sortAaregAvtaleList(props.aaregAvtaler).slice(0, 10))
  }, [props.aaregAvtaler])

  useEffect(() => {

    setSortedAaregAvtale(
      sortAaregAvtaleList(props.aaregAvtaler).slice((page - 1) * pageLimit, pageLimit * page)
    )
  }, [pageLimit, page])

  return (
    <>
     <HeadingLarge>{intl.aaregAvtale}</HeadingLarge>
      <Table
        emptyText={intl.noAaregAvtaleAvailableInTable}
        headers={
          <>
            <HeadCell title={intl.name} />
            <HeadCell title={intl.aaregAvtaleContractNumber} />
          </>
        }
      >
        {sortedAaregAvtale.map((avtale) =>
          <Row key={avtale.avtalenummer}>
            <Cell>
              {avtale.virksomhet ?
                <>{avtale.virksomhet}</>
                : ''}
            </Cell>

            <Cell>
              {avtale.avtalenummer ?
                <>{avtale.avtalenummer}</>
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

export default AaregAvtaleTable