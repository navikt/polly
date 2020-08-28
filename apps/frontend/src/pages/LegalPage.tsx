import React, {useEffect, useState} from 'react'
import {useQueryParam} from '../util/hooks'
import {Process} from '../constants'
import {getProcessesFor} from '../api'
import {Block} from 'baseui/block'
import {HeadingMedium, HeadingSmall, LabelMedium} from 'baseui/typography'
import {StatefulSelect, Value} from 'baseui/select'
import {codelist, ListName} from '../service/Codelist'
import {intl, theme} from '../util'

const val = (v: Value) => v.length ? v[0].id as string : undefined

export const LegalPage = () => {
  const gdprArticle = useQueryParam('gdpr')
  const nationalLaw = useQueryParam('law')

  const [processes, setProcesses] = useState<Process[]>([])
  const [gdprFilter, setGdprFilter] = useState<Value>([{id: gdprArticle}])
  const [lawFilter, setLawFilter] = useState<Value>([{id: nationalLaw}])

  useEffect(() => {
    getProcessesFor(({gdprArticle: val(gdprFilter), nationalLaw: val(lawFilter)})).then(r => setProcesses(r.content))
  }, [val(gdprFilter), val(lawFilter)])

  return (
    <Block>
      <Block display={'flex'}>
        <Block width='40%'>
          <HeadingSmall>{intl.gdprSelect}</HeadingSmall>
          <StatefulSelect
            maxDropdownHeight='400px'
            initialState={{value: gdprFilter}}
            options={codelist.getParsedOptions(ListName.GDPR_ARTICLE)}
            onChange={p => setGdprFilter(p.value)}
          />
        </Block>
        <Block width='40%' marginLeft={theme.sizing.scale400}>
          <HeadingSmall>{intl.nationalLaw}</HeadingSmall>
          <StatefulSelect
            maxDropdownHeight='400px'
            initialState={{value: lawFilter}}
            options={codelist.getParsedOptions(ListName.NATIONAL_LAW)}
            onChange={p => setLawFilter(p.value)}
          />
        </Block>
      </Block>
      <ProcessTable processes={processes}/>
    </Block>
  )
}

const ProcessTable = (props: {processes: Process[]}) => (
  <Block display={'flex'} flexDirection={'column'}>
    <HeadingMedium>{intl.processes} ({props.processes.length})</HeadingMedium>
    {props.processes.map(p =>
      <Block key={p.id}>
        <LabelMedium>{codelist.getShortnameForCode(p.purpose)}: {p.name}</LabelMedium>
      </Block>
    )}
  </Block>
)

