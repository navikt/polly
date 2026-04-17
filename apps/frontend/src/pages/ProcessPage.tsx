import { generatePath, useLocation, useParams } from '@/util/router'
import { Heading, Select } from '@navikt/ds-react'
import queryString from 'query-string'
import { useEffect, useState } from 'react'
import { getDpProcessByDepartment } from '../api/DpProcessApi'
import { getDashboard, getDisclosureByDepartment } from '../api/GetAllApi'
import { getAvdelingByNomId, getSeksjonerForNomAvdeling } from '../api/NomApi'
import Charts from '../components/Charts/Charts'
import DashboardBreadcrumbs from '../components/Dashboard/DashboardBreadcrumbs'
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
  IOrgEnhet,
  IProcess,
  ISeksjonDashCount,
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
  seksjon = 'seksjon',
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
  const [departmentSeksjoner, setDepartmentSeksjoner] = useState<IOrgEnhet[]>([])
  const [selectedSeksjonId, setSelectedSeksjonId] = useState<string>('')
  const [seksjonChartData, setSeksjonChartData] = useState<ISeksjonDashCount>()
  const [siblingSeksjoner, setSiblingSeksjoner] = useState<ISeksjonDashCount[]>([])
  const [seksjonAvdelingId, setSeksjonAvdelingId] = useState<string>('')
  const [seksjonAvdelingName, setSeksjonAvdelingName] = useState<string>('')
  const [disclosureData, setDisclosureData] = useState<IDisclosure[]>([])
  const [dpProcessData, setDpProcessData] = useState<IDpProcess[]>([])
  const filter = useQueryParam<EProcessStatus>('filter')
  const tab = useQueryParam<string>('tab')
  const avdeling = useQueryParam<string>('avdeling')
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
          const [seksjonerForAvdeling, disclosureResponse, dpProcessResponse] = await Promise.all([
            getSeksjonerForNomAvdeling(code),
            getDisclosureByDepartment(code),
            getDpProcessByDepartment(code),
          ])
          setDepartmentSeksjoner(seksjonerForAvdeling)
          if (disclosureResponse) setDisclosureData(disclosureResponse.content)
          if (dpProcessResponse) setDpProcessData(dpProcessResponse.content)
        }

        setIsLoading(false)
      })()
    }

    if (section === ESection.seksjon && avdeling) {
      ;(async () => {
        setIsLoading(true)
        const [res, seksjonerForAvdeling, avdelingData] = await Promise.all([
          getDashboard(EProcessStatusFilter.All),
          getSeksjonerForNomAvdeling(avdeling),
          getAvdelingByNomId(avdeling),
        ])
        if (res) {
          const allSeksjoner = res.seksjoner ?? []
          setSeksjonChartData(allSeksjoner.find((s) => s.seksjonId === code))
          const seksjonIds = seksjonerForAvdeling.map((s) => s.id)
          setSiblingSeksjoner(allSeksjoner.filter((s) => seksjonIds.includes(s.seksjonId)))
        }
        setSeksjonAvdelingId(avdeling)
        if (avdelingData) setSeksjonAvdelingName(avdelingData.navn)
        setIsLoading(false)
      })()
    }

    window.addEventListener('scroll', saveScroll)
    return () => window.removeEventListener('scroll', saveScroll)
  }, [section, code])

  return (
    <>
      <div role="main">
        {section === ESection.department && code && <DashboardBreadcrumbs departmentId={code} />}
        {section === ESection.seksjon && code && (
          <DashboardBreadcrumbs departmentId={seksjonAvdelingId || undefined} seksjonId={code} />
        )}
        {section && code && <PageHeader section={section} code={code} />}
        {section && code && (
          <div>
            {section !== ESection.department && section !== ESection.seksjon && (
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
              <>
                {departmentSeksjoner.length > 0 && (
                  <div className="flex items-center gap-4 mb-4 mt-2">
                    <Select
                      label="Filtrer på seksjon"
                      hideLabel={false}
                      value={selectedSeksjonId}
                      onChange={(e) => setSelectedSeksjonId(e.target.value)}
                      style={{ minWidth: '30rem' }}
                    >
                      <option value="">Alle seksjoner</option>
                      {[...departmentSeksjoner]
                        .sort((a, b) => a.navn.localeCompare(b.navn))
                        .map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.navn}
                          </option>
                        ))}
                    </Select>
                  </div>
                )}
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
                  seksjonFilter={selectedSeksjonId || undefined}
                  thirdTabContent={
                    <div className="mt-4 mb-12">
                      {selectedSeksjonId
                        ? dashboardData &&
                          (() => {
                            const seksjonChart = dashboardData.seksjoner?.find(
                              (s) => s.seksjonId === selectedSeksjonId
                            )
                            return seksjonChart ? (
                              <Charts
                                chartData={seksjonChart}
                                processStatus={EProcessStatusFilter.All}
                                type={ESection.seksjon}
                                seksjonId={selectedSeksjonId}
                                departmentCode={code}
                              />
                            ) : null
                          })()
                        : chartData && (
                            <Charts
                              chartData={chartData}
                              processStatus={EProcessStatusFilter.All}
                              departmentCode={code}
                              type={ESection.department}
                            />
                          )}
                    </div>
                  }
                />
              </>
            )}

            {!isLoading && section === ESection.seksjon && (
              <div className="mb-12">
                <Heading size="small" level="2" className="mt-4">
                  Oversikt for {seksjonChartData?.seksjonName || code}
                </Heading>
                {seksjonChartData && (
                  <Charts
                    chartData={seksjonChartData}
                    processStatus={EProcessStatusFilter.All}
                    type={ESection.seksjon}
                    seksjonId={code}
                  />
                )}
                {siblingSeksjoner.length > 0 && (
                  <>
                    <Heading size="small" level="2" className="mt-6">
                      Andre seksjoner i {seksjonAvdelingName || seksjonAvdelingId}
                    </Heading>
                    <Seksjoner
                      data={{
                        all: { ...seksjonChartData!, disclosures: 0, disclosuresIncomplete: 0 },
                        departments: [],
                        productAreas: [],
                        seksjoner: siblingSeksjoner,
                      }}
                      activeSeksjonId={code}
                    />
                  </>
                )}
              </div>
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
