import { useEffect, useState } from 'react'

import { HeadingSmall } from 'baseui/typography'
import queryString from 'query-string'
import { generatePath, useLocation, useParams } from 'react-router-dom'
import { processPath, processPathNoId } from '../AppRoutes'
import { getDashboard, getDisclosureByDepartment } from '../api'
import Charts from '../components/Charts/Charts'
import ProcessDisclosureTabs from '../components/Dashboard/ProcessDisclosureTabs'
import ProcessList from '../components/Process/ProcessList'
import { PageHeader } from '../components/common/PageHeader'
import { DepartmentDashCount, Disclosure, Process, ProcessStatus, ProcessStatusFilter } from '../constants'
import { ampli } from '../service/Amplitude'
import { ListName } from '../service/Codelist'
import { useQueryParam } from '../util/hooks'

export enum Section {
  purpose = 'purpose',
  system = 'system',
  department = 'department',
  subdepartment = 'subdepartment',
  team = 'team',
  productarea = 'productarea',
  thirdparty = 'thirdparty',
  processor = 'processor',
}

export const listNameForSection = (section: Section) => {
  if (section === Section.subdepartment) return ListName.SUB_DEPARTMENT
  else if (section === Section.department) return ListName.DEPARTMENT
  else if (section === Section.purpose) return ListName.PURPOSE
  else if (section === Section.system) return ListName.SYSTEM
  else if (section === Section.thirdparty) return ListName.THIRD_PARTY
  return undefined
}

export type PathParams = {
  section: Section
  code: string
  processId?: string
}

const ProcessPage = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [chartData, setChartData] = useState<DepartmentDashCount>()
  const [disclosureData, setDisclosureData] = useState<Disclosure[]>([])
  const filter = useQueryParam<ProcessStatus>('filter')
  const params = useParams<PathParams>()
  const { section, code, processId } = params
  const location = useLocation()

  ampli.logEvent('besøk', { side: 'Behandlinger', url: '/process/:section/:code/', app: 'Behandlingskatalogen' })

  const moveScroll = () => {
    window.scrollTo(0, localStorage.getItem('Yposition' + location.pathname) != null ? Number(localStorage.getItem('Yposition' + location.pathname)) + 200 : 0)
    localStorage.removeItem('Yposition' + location.pathname)
  }

  const saveScroll = () => {
    if (window.pageYOffset !== 0) {
      localStorage.setItem('Yposition' + location.pathname, window.pageYOffset.toString())
    }
  }

  useEffect(() => {
    if (section === Section.department) {
      ;(async () => {
        setIsLoading(true)
        let res = await getDashboard(ProcessStatusFilter.All)
        if (res) setChartData(res.departments.find((d) => d.department === code))

        if (code) {
          let disclosureResponse = await getDisclosureByDepartment(code)
          if (disclosureResponse) setDisclosureData(disclosureResponse.content)
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
            {section !== Section.department && (
              <ProcessList code={code} listName={listNameForSection(section)} processId={processId} filter={filter} section={section} moveScroll={moveScroll} isEditable={true} />
            )}

            {!isLoading && section === Section.department && (
              <ProcessDisclosureTabs
                disclosureData={disclosureData}
                setDisclosureData={setDisclosureData}
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
                    <Charts
                      chartData={chartData!}
                      processStatus={ProcessStatusFilter.All}
                      departmentCode={code}
                      type={section === Section.department ? Section.department : Section.productarea}
                    />
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

export const genProcessPath = (section: Section, code: string, process?: Partial<Process>, filter?: ProcessStatus, create?: boolean) => {
  if (process && process.id) {
    return (
      generatePath(processPath, {
        section,
        // todo multipurpose url
        code: section === Section.purpose && !!process?.purposes ? process.purposes[0].code : code,
        processId: process.id,
      }) +
      '?' +
      queryString.stringify({ filter, create }, { skipNull: true })
    )
  }

  return (
    generatePath(processPathNoId, {
      section,
      // todo multipurpose url
      code: section === Section.purpose && !!process?.purposes ? process.purposes[0].code : code,
    }) +
    '?' +
    queryString.stringify({ filter, create }, { skipNull: true })
  )
}
