import * as React from 'react'
import { useEffect } from 'react'

import ProcessList from '../components/Process'
import { ListName } from '../service/Codelist'
import { generatePath, useParams } from 'react-router-dom'
import { DepartmentDashCount, Disclosure, DisclosureFormValues, Process, ProcessStatus, ProcessStatusFilter } from '../constants'
import { useQueryParam } from '../util/hooks'
import { processPath, processPathNoId } from '../AppRoutes'
import queryString from 'query-string'
import { PageHeader } from '../components/common/PageHeader'
import { HeadingSmall, HeadingXLarge } from 'baseui/typography'
import { intl, theme } from '../util'
import { Block } from 'baseui/block/index'
import { createDisclosure, deleteDisclosure, getDashboard, getDisclosureByDepartment, updateDisclosure } from '../api'
import Charts from '../components/Charts/Charts'
import { useLocation } from 'react-router-dom'
import { ampli } from '../service/Amplitude'
import { Spacer, Tabs } from '@navikt/ds-react'
import AccordionDisclosure from '../components/ThirdParty/AccordionDisclosure'
import { user } from '../service/User'
import { Button, KIND } from 'baseui/button'
import { Plus } from 'baseui/icon'
import ModalThirdParty from '../components/ThirdParty/ModalThirdPartyForm'

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
  const [isLoading, setIsLoading] = React.useState(true)
  const [chartData, setChartData] = React.useState<DepartmentDashCount>()
  const [disclosureData, setDisclosureData] = React.useState<Disclosure[]>([])
  const filter = useQueryParam<ProcessStatus>('filter')
  const params = useParams<PathParams>()
  const { section, code, processId } = params
  const location = useLocation()
  const [error, setError] = React.useState<string>()
  const [showCreateDisclosureModal, setShowCreateDisclosureModal] = React.useState<boolean>(false)

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

  const handleCreateDisclosure = async (disclosure: DisclosureFormValues) => {
    try {
      let createdDisclosure = await createDisclosure(disclosure)

      if (!disclosureData || disclosureData.length < 1) setDisclosureData([createdDisclosure])
      else if (disclosureData && createdDisclosure) setDisclosureData([...disclosureData, createdDisclosure])

      setShowCreateDisclosureModal(false)
    } catch (err: any) {
      setShowCreateDisclosureModal(true)
      setError(err.message)
    }
  }

  const handleEditDisclosure = async (disclosure: DisclosureFormValues) => {
    try {
      await updateDisclosure(disclosure)
      return true
    } catch (err: any) {
      setError(err.message)
      return false
    }
  }

  const handleDeleteDisclosure = async (disclosure: Disclosure) => {
    if (!disclosure) return false
    try {
      await deleteDisclosure(disclosure.id)
      setDisclosureData([...disclosureData.filter((d: Disclosure) => d.id !== disclosure.id)])
      setError(undefined)
      return true
    } catch (err: any) {
      setError(err.message)
      return false
    }
  }

  const initialFormValues: DisclosureFormValues = {
    name: '',
    recipient: '',
    recipientPurpose: '',
    description: '',
    document: undefined,
    legalBases: [],
    legalBasesOpen: false,
    start: undefined,
    end: undefined,
    processes: [],
    abroad: { abroad: false, countries: [], refToAgreement: '', businessArea: '' },
    processIds: [],
    administrationArchiveCaseNumber: '',
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
      <Block overrides={{ Block: { props: { role: 'main' } } }}>
        {section && code && <PageHeader section={section} code={code} />}
        {section && code && (
          <div>
            {section !== Section.department && (
              <ProcessList code={code} listName={listNameForSection(section)} processId={processId} filter={filter} section={section} moveScroll={moveScroll} isEditable={true} />
            )}

            {section === Section.department && (
              <Tabs defaultValue="behandlinger">
                <Tabs.List>
                  <Tabs.Tab value="behandlinger" label="Behandlinger" />
                  <Tabs.Tab value="utleveringer" label="Utleveringer" />
                </Tabs.List>
                <Tabs.Panel value="behandlinger">
                  <div className="my-2">
                    <ProcessList
                      code={code}
                      listName={listNameForSection(section)}
                      processId={processId}
                      filter={filter}
                      section={section}
                      moveScroll={moveScroll}
                      isEditable={true}
                    />
                  </div>
                </Tabs.Panel>
                <Tabs.Panel value="utleveringer">
                  <div className="my-2">
                    <div className="flex">
                      <HeadingXLarge>Utleveringer ({disclosureData ? disclosureData.length : 0})</HeadingXLarge>
                      <Spacer />
                      <Block display="flex" justifyContent="flex-end">
                        {user.canWrite() && (
                          <Button
                            size="compact"
                            kind={KIND.tertiary}
                            onClick={() => setShowCreateDisclosureModal(true)}
                            startEnhancer={() => (
                              <Block display="flex" justifyContent="center">
                                <Plus size={22} />
                              </Block>
                            )}
                          >
                            {intl.createNew}
                          </Button>
                        )}
                      </Block>
                    </div>

                    <AccordionDisclosure
                      disclosureList={disclosureData}
                      showRecipient={true}
                      errorModal={error}
                      editable
                      submitDeleteDisclosure={handleDeleteDisclosure}
                      submitEditDisclosure={handleEditDisclosure}
                      onCloseModal={() => setError(undefined)}
                    />

                    <ModalThirdParty
                      title={intl.createThirdPartyModalTitle}
                      isOpen={showCreateDisclosureModal}
                      initialValues={initialFormValues}
                      submit={handleCreateDisclosure}
                      onClose={() => {
                        setShowCreateDisclosureModal(false)
                        setError(undefined)
                      }}
                      errorOnCreate={error}
                    />
                  </div>
                </Tabs.Panel>
              </Tabs>
            )}
          </div>
        )}
        {!isLoading && section === Section.department && (
          <Block marginBottom={theme.sizing.scale1200}>
            <HeadingSmall>{intl.overview}</HeadingSmall>
            <Charts
              chartData={chartData!}
              processStatus={ProcessStatusFilter.All}
              departmentCode={code}
              type={section === Section.department ? Section.department : Section.productarea}
            />
          </Block>
        )}
      </Block>
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
