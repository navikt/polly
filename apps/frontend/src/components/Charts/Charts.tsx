import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import { Block } from 'baseui/block'
import { cardShadow, chartCardProps } from '../common/Style'
import { AllDashCount, DepartmentDashCount, ProcessField, ProcessState, ProcessStatusFilter, ProductAreaDashCount } from '../../constants'
import TriChart from './TriChart'
import { Chart } from './Chart'
import { clickOnPieChartSlice } from '../../util/dashboard'
import { chartColor } from '../../util/theme'
import { ParagraphLarge, ParagraphMedium } from 'baseui/typography'
import RouteLink from '../common/RouteLink'
import { Section } from '../../pages/ProcessPage'
import { Card } from 'baseui/card'

const chartSize = 80

type ChartsProps = {
  chartData: ProductAreaDashCount | DepartmentDashCount | AllDashCount
  processStatus: ProcessStatusFilter
  type?: Section
  departmentCode?: string
  productAreaId?: string
}

const Charts = (props: ChartsProps) => {
  const { chartData, processStatus, type, departmentCode, productAreaId } = props
  const navigate = useNavigate()

  const link = (processField: ProcessField, processState: ProcessState = ProcessState.UNKNOWN) => {
    if (!type) return `/dashboard/${processField}/${processState}/${processStatus}`
    else if (type === Section.department) return `/dashboard/${processField}/${processState}/${processStatus}?department=${departmentCode}`
    else return `/dashboard/${processField}/${processState}/${processStatus}?productarea=${productAreaId}`
  }

  const handleClickPieChartSlice = (processField: ProcessField, processState: ProcessState, processStatus: ProcessStatusFilter) => {
    if (!type) return clickOnPieChartSlice(processField, processState, processStatus, navigate)
    else if (type === Section.department) return clickOnPieChartSlice(processField, processState, processStatus, navigate, type, departmentCode)
    else return clickOnPieChartSlice(processField, processState, processStatus, navigate, type, productAreaId)
  }

  const all = chartData as AllDashCount

  return (
    <Block display="flex" flexWrap={true} width={'100%'} justifyContent={'space-between'}>
      <Block {...chartCardProps}>
        <TriChart counter={chartData.dpia} title='Behov for PVK' processStatus={processStatus} processField={ProcessField.DPIA} onClickPieChartSlice={handleClickPieChartSlice} />
        <ParagraphMedium>
          Ref. til PVK ikke angitt: <RouteLink href={link(ProcessField.DPIA_REFERENCE_MISSING, ProcessState.YES)}>{chartData.dpiaReferenceMissing}</RouteLink>
        </ParagraphMedium>
      </Block>

      <Block {...chartCardProps}>
        <TriChart
          counter={chartData.profiling}
          title='Profilering'
          processStatus={processStatus}
          processField={ProcessField.PROFILING}
          onClickPieChartSlice={handleClickPieChartSlice}
        />
      </Block>

      <Block {...chartCardProps}>
        <TriChart
          counter={chartData.automation}
          title='Helautomatisk behandling'
          processStatus={processStatus}
          processField={ProcessField.AUTOMATION}
          onClickPieChartSlice={handleClickPieChartSlice}
        />
      </Block>

      <Block {...chartCardProps}>
        <Chart
          chartTitle='Ufullstendig behandlingsgrunnlag'
          size={chartSize}
          hidePercent
          type="bar"
          data={[
            {
              label: 'Rettslig grunnlag uavklart',
              size: chartData.processesMissingLegalBases,
              color: chartColor.generalRed,
              onClick: handleClickPieChartSlice(ProcessField.MISSING_LEGAL_BASIS, ProcessState.YES, processStatus),
            },
            {
              label: 'Artikkel 6 mangler',
              size: chartData.processesMissingArt6,
              color: chartColor.generalMustard,
              onClick: handleClickPieChartSlice(ProcessField.MISSING_ARTICLE_6, ProcessState.YES, processStatus),
            },
            {
              label: 'Artikkel 9 mangler',
              size: chartData.processesMissingArt9,
              color: chartColor.generalBlue,
              onClick: handleClickPieChartSlice(ProcessField.MISSING_ARTICLE_9, ProcessState.YES, processStatus),
            },
          ]}
        />
      </Block>

      <Block {...chartCardProps}>
        <TriChart
          counter={chartData.retention}
          processStatus={processStatus}
          title='Omfattes av NAVs bevarings- og kassasjonsvedtak'
          processField={ProcessField.RETENTION}
          onClickPieChartSlice={handleClickPieChartSlice}
        />
        <ParagraphLarge>
          Behandlinger med ufullstendig lagringstid: <RouteLink href={link(ProcessField.RETENTION_DATA)}>{chartData.retentionDataIncomplete}</RouteLink>
        </ParagraphLarge>
      </Block>

      <Block {...chartCardProps}>
        <TriChart
          counter={chartData.dataProcessor}
          processStatus={processStatus}
          title='Benyttes databehandler(e)?'
          processField={ProcessField.DATA_PROCESSOR}
          onClickPieChartSlice={handleClickPieChartSlice}
        />
      </Block>

      {all.disclosures !== undefined && (
        <Block {...chartCardProps}>
          <Chart
            chartTitle='Utleveringer behandlingsgrunnlag'
            data={[
              {
                label: 'Utfylt',
                size: all.disclosures - all.disclosuresIncomplete,
                color: chartColor.generalBlue,
                onClick: () => navigate('/disclosure?filter=legalbases'),
              },
              {
                label: 'Ufullstendig',
                size: all.disclosuresIncomplete,
                color: chartColor.generalRed,
                onClick: () => navigate('/disclosure?filter=emptylegalbases'),
              },
            ]}
            size={chartSize}
          />
          <ParagraphMedium>
            Utleveringer: <RouteLink href={'/disclosure'}>{all.disclosures}</RouteLink>
          </ParagraphMedium>
        </Block>
      )}

      <Block marginTop="2.5rem" width={'100%'}>
        <Card overrides={cardShadow}>
          <Block>
            <ParagraphMedium>
              Behandlinger hvor NAV er felles behandlingsansvarlig med ekstern part: <RouteLink href={link(ProcessField.COMMON_EXTERNAL_PROCESSOR, ProcessState.YES)}>{chartData.commonExternalProcessResponsible}</RouteLink>
            </ParagraphMedium>
            <ParagraphMedium>
              Behandlinger hvor NAV er databehandler: <RouteLink href={'/dpprocess'}>{chartData.dpProcesses}</RouteLink>
            </ParagraphMedium>
          </Block>
        </Card>
      </Block>
    </Block>
  )
}

export default Charts
