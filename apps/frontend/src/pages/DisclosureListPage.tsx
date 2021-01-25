import React, {useEffect, useState} from 'react'
import {H4} from 'baseui/typography'
import {intl} from '../util'
import {Disclosure} from '../constants'
import {getAll, getDisclosuresByPageAndPageSize} from '../api'
import AlphabeticList from '../components/common/AlphabeticList'
import {useQueryParam} from '../util/hooks'


export const DisclosureListPage = () => {
  const [disclosures, setDisclosures] = useState<Disclosure[]>([])
  const filter = useQueryParam('filter')

  useEffect(() => {
    (async () => {
      const all = await getAll(getDisclosuresByPageAndPageSize)()
      if (filter === 'emptylegalbases') setDisclosures(all.filter(d => !d.legalBases.length))
      else if (filter === 'legalbases') setDisclosures(all.filter(d => !!d.legalBases.length))
      else setDisclosures(all)
    })()
  }, [filter])

  return (
    <>
      <H4>{intl.disclosures}</H4>

      <AlphabeticList items={disclosures.map(dc => ({id: dc.id, label: dc.name}))} baseUrl={'/disclosure/'}/>
    </>
  )
}
