import { HeadingSmall } from 'baseui/typography'
import queryString from 'query-string'
import { useEffect, useState } from 'react'
import { generatePath, useLocation, useParams } from 'react-router'
import { processPath, processPathNoId } from '../AppRoutes'
import { getDpProcessByDepartment } from '../api/DpProcessApi'
import { getDashboard, getDisclosureByDepartment } from '../api/GetAllApi'
import Charts from '../components/Charts/Charts'
import ProcessDisclosureTabs from '../components/Dashboard/ProcessDisclosureTabs'
import ProcessList from '../components/Process/ProcessList'
import { PageHeader } from '../components/common/PageHeader'
import {
  EProcessStatus,
  EProcessStatusFilter,
  IDepartmentDashCount,
  IDisclosure,
  IDpProcess,
  IProcess,
} from '../constants'
import { EListName } from '../service/Codelist'
import { useQueryParam } from '../util/hooks'

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
  const [disclosureData, setDisclosureData] = useState<IDisclosure[]>([])
  const [dpProcessData, setDpProcessData] = useState<IDpProcess[]>([])
  const filter = useQueryParam<EProcessStatus>('filter')
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
        if (res) setChartData(res.departments.find((d) => d.department === code))

        if (code) {
          const disclosureResponse = await getDisclosureByDepartment(code)
          if (disclosureResponse) setDisclosureData(disclosureResponse.content)
          const dpProcessResponse = await getDpProcessByDepartment(code)
          if (dpProcessResponse) setDpProcessData(dpProcessResponse.content)
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
                thirdTabContent={
                  <div className="mb-12">
                    <HeadingSmall>Oversikt</HeadingSmall>
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
