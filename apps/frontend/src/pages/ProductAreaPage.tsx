import { useParams } from 'react-router-dom'
import React, { useEffect } from 'react'
import ProcessList from '../components/Process'
import { Section } from './ProcessPage'
import { PageHeader } from '../components/common/PageHeader'
import { InfoTypeTable } from '../components/InformationType/InfoTypeTableSimple'
import { intl } from '../util'
import { getDashboard, getInformationTypesBy } from '../api'
import { ProcessStatusFilter, ProductAreaDashCount } from '../constants'
import Charts from '../components/Charts/Charts'
import { Block } from 'baseui/block'
import { HeadingSmall } from 'baseui/typography'
import {ampli} from "../service/Amplitude";

export const ProductAreaPage = () => {
  const [isLoading, setIsLoading] = React.useState(true)
  const [chartData, setChartData] = React.useState<ProductAreaDashCount>()
  const { productAreaId } = useParams<{ productAreaId: string }>()

  ampli.logEvent("besøk", {side: 'ProductAreaPage'})

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
          <ProcessList section={Section.productarea} code={productAreaId} isEditable={false} />
        </>
      )}

      <InfoTypeTable title={intl.informationTypes} getInfoTypes={async () => (await getInformationTypesBy({ productArea: productAreaId })).content} />

      {!isLoading && chartData && (
        <Block marginBottom="240px">
          <HeadingSmall>{intl.overview}</HeadingSmall>
          <Charts chartData={chartData} processStatus={ProcessStatusFilter.All} type={Section.productarea} productAreaId={productAreaId} />
        </Block>
      )}
    </>
  )
}
