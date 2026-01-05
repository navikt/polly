import { Select } from '@navikt/ds-react'
import { HeadingLarge, HeadingMedium, HeadingSmall } from 'baseui/typography'
import queryString from 'query-string'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { getProcessesFor } from '../api/GetAllApi'
import { SimpleProcessTable } from '../components/Process/SimpleProcessTable'
import { IPageResponse, IProcess } from '../constants'
import { CodelistService, EListName, ICode } from '../service/Codelist'
import { useQueryParam } from '../util/hooks'

export const LegalPage = () => {
  const [processes, setProcesses] = useState<IProcess[]>([])
  const gdprArticle = useQueryParam('gdprArticle')
  const nationalLaw = useQueryParam('nationalLaw')
  const navigate = useNavigate()
  const location = useLocation()

  const [codelistUtils] = CodelistService()

  useEffect(() => {
    if (!gdprArticle && !nationalLaw) {
      return setProcesses([])
    }
    getProcessesFor({ gdprArticle, nationalLaw }).then((result: IPageResponse<IProcess>) =>
      setProcesses(result.content)
    )
  }, [gdprArticle, nationalLaw])

  const gdprOptions = codelistUtils.getCodes(EListName.GDPR_ARTICLE)
  const lawOptions = codelistUtils.getCodes(EListName.NATIONAL_LAW)

  return (
    <div>
      <HeadingLarge>Søk behandlingsgrunnlag</HeadingLarge>
      <div className="flex">
        <div className="w-[40%] mt-3">
          <HeadingSmall>Velg GDPR artikkel</HeadingSmall>
          <Select
            label="GDPR artikkel"
            value={gdprArticle ?? ''}
            onChange={(event) =>
              navigate(
                location.pathname +
                  '?' +
                  queryString.stringify(
                    { gdprArticle: event.target.value, nationalLaw },
                    { skipNull: true }
                  )
              )
            }
          >
            <option value="">Velg</option>
            {gdprOptions.map((option: ICode) => (
              <option key={option.code} value={option.code}>
                {option.shortName || option.code}
              </option>
            ))}
          </Select>
        </div>
        <div className="w-[40%] mt-3 ml-2.5">
          <HeadingSmall>og/eller nasjonal lov</HeadingSmall>
          <Select
            label="Nasjonal lov"
            value={nationalLaw ?? ''}
            onChange={(event) =>
              navigate(
                location.pathname +
                  '?' +
                  queryString.stringify(
                    { gdprArticle, nationalLaw: event.target.value },
                    { skipNull: true }
                  )
              )
            }
          >
            <option value="">Velg</option>
            {lawOptions.map((option: ICode) => (
              <option key={option.code} value={option.code}>
                {option.shortName || option.code}
              </option>
            ))}
          </Select>
        </div>
      </div>
      {processes && <ProcessTable processes={processes} />}
    </div>
  )
}

const ProcessTable = (props: { processes: IProcess[] }) => (
  <div className="flex flex-col mt-3">
    <HeadingMedium>Behandlinger ({props.processes.length})</HeadingMedium>
    <SimpleProcessTable
      title={'Behandlinger' + ' (' + props.processes.length + ')'}
      processes={props.processes}
    />
  </div>
)
