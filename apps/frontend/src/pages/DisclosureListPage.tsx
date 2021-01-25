import React, {useEffect, useState} from 'react'
import {H4} from 'baseui/typography'
import {intl} from '../util'
import {Disclosure} from '../constants'
import {getAll, getDisclosuresByPageAndPageSize, getDisclosuresWithEmptyLegalBases} from '../api'
import AlphabeticList from '../components/common/AlphabeticList'
import {useQueryParam} from '../util/hooks'


export const DisclosureListPage = () => {
  const [disclosures, setDisclosures] = useState<Disclosure[]>([])
  const filter = useQueryParam('filter')

  useEffect(() => {
    if (filter === 'emptylegalbases') getDisclosuresWithEmptyLegalBases().then(setDisclosures)
    else if (filter === 'legalbases') {
      (async () => {
        const empty = await getDisclosuresWithEmptyLegalBases()
        const all = await getAll(getDisclosuresByPageAndPageSize)()
        setDisclosures(all.filter(d => !empty.find(d2 => d2.id === d.id)))
      })()
    } else getAll(getDisclosuresByPageAndPageSize)().then(setDisclosures)
  }, [filter])

  return (
    <>
      <H4>{intl.disclosures}</H4>

      <AlphabeticList items={disclosures.map(dc => ({id: dc.id, label: dc.name}))} baseUrl={'/disclosure/'}/>
    </>
  )
}
