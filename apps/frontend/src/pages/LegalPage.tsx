import React, { useEffect, useState } from 'react'
import { useQueryParam } from '../util/hooks'
import { Process } from '../constants'
import { getProcessesFor } from '../api'
import { Block } from 'baseui/block'
import { HeadingLarge, HeadingMedium, HeadingSmall } from 'baseui/typography'
import { Select, Value } from 'baseui/select'
import { codelist, ListName } from '../service/Codelist'
import { intl, theme } from '../util'
import { lowerFirst } from 'lodash'
import { SimpleProcessTable } from '../components/Process/SimpleProcessTable'
import { useLocation, useNavigate } from 'react-router-dom'
import queryString from 'query-string'
import {ampli} from "../service/Amplitude";

const val = (v: Value) => (v.length ? (v[0].id as string) : undefined)

export const LegalPage = () => {
  const [processes, setProcesses] = useState<Process[]>([])
  const gdprArticle = useQueryParam('gdprArticle')
  const nationalLaw = useQueryParam('nationalLaw')
  const navigate = useNavigate()
  const location = useLocation()

  ampli.logEvent("besøk", {side: 'Legal Page', url: '/process/legal', app: 'Behandlingskatalogen'})

  useEffect(() => {
    if (!gdprArticle && !nationalLaw) {
      return setProcesses([])
    }
    getProcessesFor({ gdprArticle, nationalLaw }).then((r) => setProcesses(r.content))
  }, [gdprArticle, nationalLaw])

  return (
    <Block>
      <HeadingLarge>
        {intl.search} {lowerFirst(intl.legalBasisShort)}
      </HeadingLarge>
      <Block display={'flex'}>
        <Block width="40%">
          <HeadingSmall>{intl.gdprSelect}</HeadingSmall>
          <Select
            maxDropdownHeight="400px"
            value={gdprArticle ? [{ id: gdprArticle }] : []}
            options={codelist.getParsedOptions(ListName.GDPR_ARTICLE)}
            onChange={(p) => navigate(location.pathname + '?' + queryString.stringify({ gdprArticle: val(p.value), nationalLaw }, { skipNull: true }))}
          />
        </Block>
        <Block width="40%" marginLeft={theme.sizing.scale400}>
          <HeadingSmall>
            {intl.and}/{intl.or} {lowerFirst(intl.nationalLaw)}
          </HeadingSmall>
          <Select
            maxDropdownHeight="400px"
            value={nationalLaw ? [{ id: nationalLaw }] : []}
            options={codelist.getParsedOptions(ListName.NATIONAL_LAW)}
            onChange={(p) => navigate(location.pathname + '?' + queryString.stringify({ gdprArticle, nationalLaw: val(p.value) }, { skipNull: true }))}
          />
        </Block>
      </Block>
      <ProcessTable processes={processes} />
    </Block>
  )
}

const ProcessTable = (props: { processes: Process[] }) => (
  <Block display={'flex'} flexDirection={'column'}>
    <HeadingMedium>
      {intl.processes} ({props.processes.length})
    </HeadingMedium>
    <SimpleProcessTable title={intl.processes + ' (' + props.processes.length + ')'} processes={props.processes} />
  </Block>
)
