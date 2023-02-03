import { Block } from 'baseui/block'
import React from 'react'
import { intl } from '../../util'
import DataText from '../common/DataText'
import { DotTags } from '../common/DotTag'

type AAregHjemmelDataTextProps = {
  data: string
}

export const AAregHjemmelDataText = (props: AAregHjemmelDataTextProps) => {
  const rawData = props.data

  const purposeList = rawData ? rawData.split('\n').filter(d => d.match('Formål:')).map(a => a.replace('Formål:', '')) : []
  const authoryList = rawData ? rawData.split('\n').filter(d => d.match('Hjemmel:')).map(a => a.replace('Hjemmel:', '')) : []
  const processorList = rawData ? rawData.split('\n').filter(d => d.match('Behandlingsgrunnlag:')).map(a => a.replace('Behandlingsgrunnlag:', '')) : []

  return (
    <Block>
      <DataText label={intl.purposeForProcess}>
        <DotTags wrapText noFlex items={purposeList} />
      </DataText>
      <DataText label={intl.authorityAndGroundsForDelivery}>
        <DotTags wrapText noFlex items={authoryList} />
      </DataText>
      <DataText label={intl.consumerAuthorityForProcess}>
        <DotTags wrapText noFlex items={processorList} />
      </DataText>
    </Block>
  )
}
export default AAregHjemmelDataText