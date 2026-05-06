import { useParams } from '@/util/router'
import { Heading, Tabs } from '@navikt/ds-react'
import { useEffect, useState } from 'react'
import { getDashboard } from '../api/GetAllApi'
import Charts from '../components/Charts/Charts'
import ProcessList from '../components/Process/ProcessList'
import { PageHeader } from '../components/common/PageHeader'
import { EProcessStatusFilter, ISeksjonDashCount } from '../constants'
import { ESection } from './ProcessPage'

export const SectionPage = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [chartData, setChartData] = useState<ISeksjonDashCount>()
  const { seksjonId } = useParams<{ seksjonId: string }>()

  useEffect(() => {
    ;(async () => {
      setIsLoading(true)
      const response = await getDashboard(EProcessStatusFilter.All)

      if (response) setChartData(response.seksjoner.find((s) => s.seksjonId === seksjonId))

      setIsLoading(false)
    })()
  }, [seksjonId])

  return (
    <>
      {seksjonId && (
        <>
          <PageHeader section={ESection.seksjon} code={seksjonId} />

          <Tabs defaultValue="behandlinger">
            <Tabs.List>
              <Tabs.Tab value="behandlinger" label="Behandlinger" />
              {!isLoading && chartData && <Tabs.Tab value="dashboard" label="Dashboard" />}
            </Tabs.List>
            <Tabs.Panel value="behandlinger">
              <ProcessList
                section={ESection.seksjon}
                seksjonFilter={seksjonId}
                code={seksjonId}
                isEditable={false}
              />
            </Tabs.Panel>
            {!isLoading && chartData && (
              <Tabs.Panel value="dashboard">
                <div className="mb-60">
                  <Heading size="small" level="2">
                    Oversikt
                  </Heading>
                  <Charts
                    chartData={chartData}
                    processStatus={EProcessStatusFilter.All}
                    type={ESection.seksjon}
                    seksjonId={seksjonId}
                  />
                </div>
              </Tabs.Panel>
            )}
          </Tabs>
        </>
      )}
    </>
  )
}
