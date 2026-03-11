import { Heading, Tabs } from '@navikt/ds-react'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { getDashboard, getInformationTypesBy } from '../api/GetAllApi'
import Charts from '../components/Charts/Charts'
import { InfoTypeTable } from '../components/InformationType/InfoTypeTableSimple'
import ProcessList from '../components/Process/ProcessList'
import { PageHeader } from '../components/common/PageHeader'
import { EProcessStatusFilter, IProductAreaDashCount } from '../constants'
import { ESection } from './ProcessPage'

export const ProductAreaPage = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [chartData, setChartData] = useState<IProductAreaDashCount>()
  const { productAreaId } = useParams<{ productAreaId: string }>()

  useEffect(() => {
    ;(async () => {
      setIsLoading(true)
      const response = await getDashboard(EProcessStatusFilter.All)

      if (response)
        setChartData(response.productAreas.find((p) => p.productAreaId === productAreaId))

      setIsLoading(false)
    })()
  }, [productAreaId])

  return (
    <>
      {productAreaId && (
        <>
          <PageHeader section={ESection.productarea} code={productAreaId} />

          <Tabs defaultValue="behandlinger">
            <Tabs.List>
              <Tabs.Tab value="behandlinger" label="Behandlinger" />
              <Tabs.Tab value="opplysningstyper" label="Opplysningstyper" />
              {!isLoading && chartData && <Tabs.Tab value="dashboard" label="Dashboard" />}
            </Tabs.List>
            <Tabs.Panel value="behandlinger">
              <ProcessList section={ESection.productarea} code={productAreaId} isEditable={false} />
            </Tabs.Panel>
            <Tabs.Panel value="Opplysningstyper">
              <InfoTypeTable
                title="Opplysningstyper"
                getInfoTypes={async () =>
                  (await getInformationTypesBy({ productArea: productAreaId })).content
                }
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
                    type={ESection.productarea}
                    productAreaId={productAreaId}
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
