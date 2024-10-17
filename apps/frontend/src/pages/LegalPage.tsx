import { OnChangeParams, Select, Value } from 'baseui/select'
import { HeadingLarge, HeadingMedium, HeadingSmall } from 'baseui/typography'
import queryString from 'query-string'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { getProcessesFor } from '../api/GetAllApi'
import { SimpleProcessTable } from '../components/Process/SimpleProcessTable'
import { IPageResponse, IProcess } from '../constants'
import { ampli } from '../service/Amplitude'
import { EListName, codelist } from '../service/Codelist'
import { useQueryParam } from '../util/hooks'

const value = (value: Value) => (value.length ? (value[0].id as string) : undefined)

export const LegalPage = () => {
  const [processes, setProcesses] = useState<IProcess[]>([])
  const gdprArticle = useQueryParam('gdprArticle')
  const nationalLaw = useQueryParam('nationalLaw')
  const navigate = useNavigate()
  const location = useLocation()

  ampli.logEvent('besøk', {
    side: 'Legal Page',
    url: '/process/legal',
    app: 'Behandlingskatalogen',
  })

  useEffect(() => {
    if (!gdprArticle && !nationalLaw) {
      return setProcesses([])
    }
    getProcessesFor({ gdprArticle, nationalLaw }).then((result: IPageResponse<IProcess>) =>
      setProcesses(result.content)
    )
  }, [gdprArticle, nationalLaw])

  return (
    <div>
      <HeadingLarge>Søk behandlingsgrunnlag</HeadingLarge>
      <div className="flex">
        <div className="w-[40%]">
          <HeadingSmall>Velg GDPR artikkel</HeadingSmall>
          <Select
            maxDropdownHeight="400px"
            value={gdprArticle ? [{ id: gdprArticle }] : []}
            options={codelist.getParsedOptions(EListName.GDPR_ARTICLE)}
            onChange={(event: OnChangeParams) =>
              navigate(
                location.pathname +
                  '?' +
                  queryString.stringify(
                    { gdprArticle: value(event.value), nationalLaw },
                    { skipNull: true }
                  )
              )
            }
          />
        </div>
        <div className="w-[40%] ml-2.5">
          <HeadingSmall>og/eller nasjonal lov</HeadingSmall>
          <Select
            maxDropdownHeight="400px"
            value={nationalLaw ? [{ id: nationalLaw }] : []}
            options={codelist.getParsedOptions(EListName.NATIONAL_LAW)}
            onChange={(event: OnChangeParams) =>
              navigate(
                location.pathname +
                  '?' +
                  queryString.stringify(
                    { gdprArticle, nationalLaw: value(event.value) },
                    { skipNull: true }
                  )
              )
            }
          />
        </div>
      </div>
      <ProcessTable processes={processes} />
    </div>
  )
}

const ProcessTable = (props: { processes: IProcess[] }) => (
  <div className="flex flex-col">
    <HeadingMedium>Behandlinger ({props.processes.length})</HeadingMedium>
    <SimpleProcessTable
      title={'Behandlinger' + ' (' + props.processes.length + ')'}
      processes={props.processes}
    />
  </div>
)
