import React, { useEffect, useState } from 'react'
import { useQueryParam } from '../util/hooks'
import { Process } from '../constants'
import { getProcessesFor } from '../api'
import { Block } from 'baseui/block'
import { HeadingLarge, HeadingMedium, HeadingSmall } from 'baseui/typography'
import { Select, Value } from 'baseui/select'
import { codelist, ListName } from '../service/Codelist'
import { theme } from '../util'
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
    <div>
      <HeadingLarge>
        Søk behandlingsgrunnlag
      </HeadingLarge>
      <div className="flex">
        <div className="w-[40%]">
          <HeadingSmall>Velg GDPR artikkel</HeadingSmall>
          <Select
            maxDropdownHeight="400px"
            value={gdprArticle ? [{ id: gdprArticle }] : []}
            options={codelist.getParsedOptions(ListName.GDPR_ARTICLE)}
            onChange={(p) => navigate(location.pathname + '?' + queryString.stringify({ gdprArticle: val(p.value), nationalLaw }, { skipNull: true }))}
          />
        </div>
        <div className="w-[40%] ml-2.5">
          <HeadingSmall>
            og/eller nasjonal lov
          </HeadingSmall>
          <Select
            maxDropdownHeight="400px"
            value={nationalLaw ? [{ id: nationalLaw }] : []}
            options={codelist.getParsedOptions(ListName.NATIONAL_LAW)}
            onChange={(p) => navigate(location.pathname + '?' + queryString.stringify({ gdprArticle, nationalLaw: val(p.value) }, { skipNull: true }))}
          />
        </div>
      </div>
      <ProcessTable processes={processes} />
    </div>
  )
}

const ProcessTable = (props: { processes: Process[] }) => (
  <div className="flex flex-col">
    <HeadingMedium>
      Behandlinger ({props.processes.length})
    </HeadingMedium>
    <SimpleProcessTable title={"Behandlinger" + ' (' + props.processes.length + ')'} processes={props.processes} />
  </div>
)
