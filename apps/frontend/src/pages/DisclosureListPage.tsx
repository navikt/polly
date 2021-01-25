import React, {useEffect, useState} from 'react'
import {H4} from 'baseui/typography'
import {intl} from '../util'
import {Disclosure} from '../constants'
import {getAll, getDisclosuresByPageAndPageSize} from '../api'
import AlphabeticList from '../components/common/AlphabeticList'


export const DisclosureListPage = () => {
  const [disclosures, setDisclosures] = useState<Disclosure[]>([])

  useEffect(() => {
    getAll(getDisclosuresByPageAndPageSize)().then(setDisclosures)
  }, [])

  return (
    <>
      <H4>{intl.disclosures}</H4>

      <AlphabeticList items={disclosures.map(dc => ({id: dc.id, label: dc.name}))} baseUrl={'/disclosure/'}/>
    </>
  )
}
