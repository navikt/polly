import { Tabs } from '@navikt/ds-react'
import { HeadingSmall } from 'baseui/typography'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getDashboard, getInformationTypesBy } from '../api'
import Charts from '../components/Charts/Charts'
import { InfoTypeTable } from '../components/InformationType/InfoTypeTableSimple'
import ProcessList from '../components/Process/ProcessList'
import { PageHeader } from '../components/common/PageHeader'
import { ProcessStatusFilter, ProductAreaDashCount } from '../constants'
import { ampli } from '../service/Amplitude'
import { Section } from './ProcessPage'

export const ProductAreaPage = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [chartData, setChartData] = useState<ProductAreaDashCount>()
  const { productAreaId } = useParams<{ productAreaId: string }>()

  ampli.logEvent('besøk', { side: 'ProductAreaPage', url: '/productarea/:productAreaId', app: 'Behandlingskatalogen' })

  useEffect(() => {
    ;(async () => {
      setIsLoading(true)
      const response = await getDashboard(ProcessStatusFilter.All)

      if (response) setChartData(response.productAreas.find((p) => p.productAreaId === productAreaId))

      setIsLoading(false)
    })()
  }, [productAreaId])

  return (
    <>
      {productAreaId && (
        <>
          <PageHeader section={Section.productarea} code={productAreaId} />

          <Tabs defaultValue="behandlinger">
            <Tabs.List>
              <Tabs.Tab value="behandlinger" label="Behandlinger" />
              <Tabs.Tab value="opplysningstyper" label="Opplysningstyper" />
              {!isLoading && chartData && <Tabs.Tab value="dashboard" label="Dashboard" />}
            </Tabs.List>
            <Tabs.Panel value="behandlinger">
              <ProcessList section={Section.productarea} code={productAreaId} isEditable={false} />
            </Tabs.Panel>
            <Tabs.Panel value="Opplysningstyper">
              <InfoTypeTable title="Opplysningstyper" getInfoTypes={async () => (await getInformationTypesBy({ productArea: productAreaId })).content} />
            </Tabs.Panel>

            {!isLoading && chartData && (
              <Tabs.Panel value="dashboard">
                <div className="mb-60">
                  <HeadingSmall>Oversikt</HeadingSmall>
                  <Charts chartData={chartData} processStatus={ProcessStatusFilter.All} type={Section.productarea} productAreaId={productAreaId} />
                </div>
              </Tabs.Panel>
            )}
          </Tabs>
        </>
      )}
    </>
  )
}
