import React, {useEffect, useState} from 'react'
import {HeadingLarge, LabelMedium} from 'baseui/typography'
import {intl, theme} from '../util'
import {DisclosureSummary, getAll, getDisclosureSummaries} from '../api'
import {useQueryParam, useTable} from '../util/hooks'
import {Block} from 'baseui/block'
import {Button as BButton} from 'baseui/button'
import {ButtonGroup} from 'baseui/button-group'
import {useHistory} from 'react-router-dom'
import {lowerFirst} from 'lodash'
import {Cell, HeadCell, Row, Table} from '../components/common/Table'
import {ObjectLink} from '../components/common/RouteLink'
import {ObjectType} from '../constants'

enum FilterType {
  legalbases = 'legalbases',
  emptylegalbases = 'emptylegalbases'
}

export const DisclosureListPage = () => {
  const [disclosures, setDisclosures] = useState<DisclosureSummary[]>([])
  const [table, sortColumn] = useTable<DisclosureSummary, keyof DisclosureSummary>(disclosures, {
    sorting: {
      name: (a, b) => a.name.localeCompare(b.name),
      legalBases: (a, b) => a.legalBases - b.legalBases,
      recipient: (a, b) => a.recipient.shortName.localeCompare(b.recipient.shortName),
      processes: (a, b) => a.processes.length - b.processes.length
    },
    initialSortColumn: 'name'
  })
  const filter = useQueryParam<FilterType>('filter')
  const history = useHistory()

  useEffect(() => {
    (async () => {
      const all = await getAll(getDisclosureSummaries)()
      if (filter === FilterType.emptylegalbases) setDisclosures(all.filter(d => !d.legalBases))
      else if (filter === FilterType.legalbases) setDisclosures(all.filter(d => !!d.legalBases))
      else setDisclosures(all)
    })()
  }, [filter])

  return (
    <>
      <Block display='flex' justifyContent='space-between' alignItems='center'>
        <HeadingLarge>{intl.disclosures}</HeadingLarge>
        <Block>
          <LabelMedium marginBottom={theme.sizing.scale600}>{intl.filter} {lowerFirst(intl.legalBasisShort)}</LabelMedium>
          <ButtonGroup
            selected={!filter ? 0 : filter === FilterType.legalbases ? 1 : 2}
            mode='radio' shape='pill'
          >
            <BButton onClick={() => history.replace("/disclosure")}>{intl.all}</BButton>
            <BButton onClick={() => history.replace("/disclosure?filter=legalbases")}>{intl.filled}</BButton>
            <BButton onClick={() => history.replace("/disclosure?filter=emptylegalbases")}>{intl.incomplete}</BButton>
          </ButtonGroup>
        </Block>
      </Block>

      <Table emptyText={intl.disclosures}
             headers={
               <>
                 <HeadCell title={intl.name} column='name' tableState={[table, sortColumn]}/>
                 <HeadCell title={intl.thirdParty} column='recipient' tableState={[table, sortColumn]}/>
                 <HeadCell title={intl.processes} column='processes' tableState={[table, sortColumn]}/>
                 <HeadCell title={intl.legalBasesShort} column='legalBases' tableState={[table, sortColumn]}/>
               </>
             }>
        {table.data.map(d => (
          <Row key={d.id}>
            <Cell>{d.name}</Cell>
            <Cell>{d.recipient.shortName}</Cell>
            <Cell>
              <Block display='flex' flexDirection='column'>
                {d.processes.map(p =>
                  <Block key={p.id} marginRight={theme.sizing.scale400}>
                    <ObjectLink id={p.id} type={ObjectType.PROCESS}>
                      {p.purposes.map(pu => pu.shortName).join(', ')}: {p.name}
                    </ObjectLink>
                  </Block>
                )}
              </Block>
            </Cell>
            <Cell>{d.legalBases ? intl.yes : intl.no}</Cell>
          </Row>
        ))}
      </Table>
    </>
  )
}
