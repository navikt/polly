import React, {useEffect, useState} from 'react'
import {HeadingLarge, LabelMedium} from 'baseui/typography'
import {intl, theme} from '../util'
import {Disclosure} from '../constants'
import {getAll, getDisclosuresByPageAndPageSize} from '../api'
import AlphabeticList from '../components/common/AlphabeticList'
import {useQueryParam} from '../util/hooks'
import {Block} from 'baseui/block'
import {Button as BButton} from 'baseui/button'
import {ButtonGroup} from 'baseui/button-group'
import {useHistory} from 'react-router-dom'
import {lowerFirst} from 'lodash'

enum FilterType {
  legalbases = 'legalbases',
  emptylegalbases = 'emptylegalbases'
}

export const DisclosureListPage = () => {
  const [disclosures, setDisclosures] = useState<Disclosure[]>([])
  const filter = useQueryParam<FilterType>('filter')
  const history = useHistory()

  useEffect(() => {
    (async () => {
      const all = await getAll(getDisclosuresByPageAndPageSize)()
      if (filter === FilterType.emptylegalbases) setDisclosures(all.filter(d => !d.legalBases.length))
      else if (filter === FilterType.legalbases) setDisclosures(all.filter(d => !!d.legalBases.length))
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

      <AlphabeticList items={disclosures.map(dc => ({id: dc.id, label: dc.name}))} baseUrl={'/disclosure/'}/>
    </>
  )
}
