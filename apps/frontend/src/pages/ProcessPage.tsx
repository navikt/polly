import { generatePath, useLocation, useParams } from '@/util/router'
import { Heading } from '@navikt/ds-react'
import queryString from 'query-string'
import { useEffect, useState } from 'react'
import { getDpProcessByDepartment } from '../api/DpProcessApi'
import { getDashboard, getDisclosureByDepartment } from '../api/GetAllApi'
import { getAvdelingByNomId, getSeksjonerForNomAvdeling } from '../api/NomApi'
import Charts from '../components/Charts/Charts'
import ProcessDisclosureTabs from '../components/Dashboard/ProcessDisclosureTabs'
import Seksjoner from '../components/Dashboard/Seksjoner'
import ProcessList from '../components/Process/ProcessList'
import { PageHeader } from '../components/common/PageHeader'
import {
  EProcessStatus,
  EProcessStatusFilter,
  IDashboardData,
  IDepartmentDashCount,
  IDisclosure,
  IDpProcess,
  IProcess,
} from '../constants'
import { EListName } from '../service/Codelist'
import { useQueryParam } from '../util/hooks'

export const processPath = '/process/:section/:code/:processId'
export const processPathNoId = '/process/:section/:code/'

export enum ESection {
  purpose = 'purpose',
  system = 'system',
  department = 'department',
  subdepartment = 'subdepartment',
  team = 'team',
  productarea = 'productarea',
  thirdparty = 'thirdparty',
  processor = 'processor',
}

export const listNameForSection = (section: ESection) => {
  if (section === ESection.subdepartment) return EListName.SUB_DEPARTMENT
  else if (section === ESection.department) return EListName.DEPARTMENT
  else if (section === ESection.purpose) return EListName.PURPOSE
  else if (section === ESection.system) return EListName.SYSTEM
  else if (section === ESection.thirdparty) return EListName.THIRD_PARTY
  return undefined
}

export type TPathParams = {
  section: ESection
  code: string
  processId?: string
}

const ProcessPage = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [chartData, setChartData] = useState<IDepartmentDashCount>()
  const [dashboardData, setDashboardData] = useState<IDashboardData>()
  const [departmentSeksjonIds, setDepartmentSeksjonIds] = useState<string[]>([])
  const [avdelingName, setAvdelingName] = useState<string>('')
  const [disclosureData, setDisclosureData] = useState<IDisclosure[]>([])
  const [dpProcessData, setDpProcessData] = useState<IDpProcess[]>([])
  const filter = useQueryParam<EProcessStatus>('filter')
  const tab = useQueryParam<string>('tab')
  const params = useParams<TPathParams>()
  const { section, code, processId } = params
  const location = useLocation()

  const moveScroll = () => {
    window.scrollTo(
      0,
      localStorage.getItem('Yposition' + location.pathname) != null
        ? Number(localStorage.getItem('Yposition' + location.pathname)) + 200
        : 0
    )
    localStorage.removeItem('Yposition' + location.pathname)
  }

  const saveScroll = () => {
    if (window.pageYOffset !== 0) {
      localStorage.setItem('Yposition' + location.pathname, window.pageYOffset.toString())
    }
  }

  useEffect(() => {
    if (section === ESection.department) {
      ;(async () => {
        setIsLoading(true)
        const res = await getDashboard(EProcessStatusFilter.All)
        if (res) {
          setChartData(res.departments.find((d) => d.department === code))
          setDashboardData(res)
        }

        if (code) {
          const [seksjonerForAvdeling, disclosureResponse, dpProcessResponse, avdeling] =
            await Promise.all([
              getSeksjonerForNomAvdeling(code),
              getDisclosureByDepartment(code),
              getDpProcessByDepartment(code),
              getAvdelingByNomId(code),
            ])
          setDepartmentSeksjonIds(seksjonerForAvdeling.map((s) => s.id))
          if (disclosureResponse) setDisclosureData(disclosureResponse.content)
          if (dpProcessResponse) setDpProcessData(dpProcessResponse.content)
          if (avdeling) setAvdelingName(avdeling.navn)
        }

        setIsLoading(false)
      })()
    }

    window.addEventListener('scroll', saveScroll)
    return () => window.removeEventListener('scroll', saveScroll)
  }, [section, code])

  return (
    <>
      <div role="main">
        {section && code && <PageHeader section={section} code={code} />}
        {section && code && (
          <div>
            {section !== ESection.department && (
              <ProcessList
                code={code}
                listName={listNameForSection(section)}
                processId={processId}
                filter={filter}
                section={section}
                moveScroll={moveScroll}
                isEditable={true}
              />
            )}

            {!isLoading && section === ESection.department && (
              <ProcessDisclosureTabs
                disclosureData={disclosureData}
                setDisclosureData={setDisclosureData}
                dpProcessData={dpProcessData}
                code={code}
                listName={listNameForSection(section)}
                processId={processId}
                filter={filter}
                section={section}
                moveScroll={moveScroll}
                isEditable={true}
                thirdTabTitle="Dashboard"
                defaultTab={tab ?? undefined}
                thirdTabContent={
                  <div className="mb-12">
                    <Heading size="small" level="2" className="mt-4">
                      Oversikt for {avdelingName || code} med alle seksjoner
                    </Heading>
                    {chartData && (
                      <Charts
                        chartData={chartData}
                        processStatus={EProcessStatusFilter.All}
                        departmentCode={code}
                        type={
                          section === ESection.department
                            ? ESection.department
                            : ESection.productarea
                        }
                      />
                    )}
                    {dashboardData && (
                      <>
                        <Heading size="small" level="2" className="mt-6">
                          Seksjoner
                        </Heading>
                        <Seksjoner
                          data={{
                            ...dashboardData,
                            seksjoner: (dashboardData.seksjoner ?? []).filter((s) =>
                              departmentSeksjonIds.includes(s.seksjonId)
                            ),
                          }}
                        />
                      </>
                    )}
                  </div>
                }
              />
            )}
          </div>
        )}
      </div>
    </>
  )
}

export default ProcessPage

export const genProcessPath = (
  section: ESection,
  code: string,
  process?: Partial<IProcess>,
  filter?: EProcessStatus,
  create?: boolean
) => {
  if (process && process.id) {
    return (
      generatePath(processPath, {
        section,
        // todo multipurpose url
        code: section === ESection.purpose && !!process?.purposes ? process.purposes[0].code : code,
        processId: process.id,
      }) +
      '?' +
      queryString.stringify({ filter, create }, { skipNull: true, skipEmptyString: true })
    )
  }

  return (
    generatePath(processPathNoId, {
      section,
      // todo multipurpose url
      code: section === ESection.purpose && !!process?.purposes ? process.purposes[0].code : code,
    }) +
    '?' +
    queryString.stringify({ filter, create }, { skipNull: true, skipEmptyString: true })
  )
}
