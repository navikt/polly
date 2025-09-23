import { Card } from 'baseui/card'
import { ParagraphLarge, ParagraphMedium } from 'baseui/typography'
import { NavigateFunction, useNavigate } from 'react-router'
import {
  EProcessField,
  EProcessState,
  EProcessStatusFilter,
  IAllDashCount,
  IDepartmentDashCount,
  IProductAreaDashCount,
} from '../../constants'
import { ESection } from '../../pages/ProcessPage'
import { clickOnPieChartSlice } from '../../util/dashboard'
import { chartColor } from '../../util/theme'
import RouteLink from '../common/RouteLink'
import { cardShadow } from '../common/Style'
import { Chart } from './Chart'
import TriChart from './TriChart'

const chartSize = 80

type TChartsProps = {
  chartData: IProductAreaDashCount | IDepartmentDashCount | IAllDashCount
  processStatus: EProcessStatusFilter
  type?: ESection
  departmentCode?: string
  productAreaId?: string
}

const Charts = (props: TChartsProps) => {
  const { chartData, processStatus, type, departmentCode, productAreaId } = props
  const navigate: NavigateFunction = useNavigate()

  const link = (
    processField: EProcessField,
    processState: EProcessState = EProcessState.UNKNOWN
  ): string => {
    if (!type) return `/dashboard/${processField}/${processState}/${processStatus}`
    else if (type === ESection.department)
      return `/dashboard/${processField}/${processState}/${processStatus}?department=${departmentCode}`
    else
      return `/dashboard/${processField}/${processState}/${processStatus}?productarea=${productAreaId}`
  }

  const handleClickPieChartSlice = (
    processField: EProcessField,
    processState: EProcessState,
    processStatus: EProcessStatusFilter
  ) => {
    if (!type) return clickOnPieChartSlice(processField, processState, processStatus, navigate)
    else if (type === ESection.department)
      return clickOnPieChartSlice(
        processField,
        processState,
        processStatus,
        navigate,
        type,
        departmentCode
      )
    else
      return clickOnPieChartSlice(
        processField,
        processState,
        processStatus,
        navigate,
        type,
        productAreaId
      )
  }

  const all = chartData as IAllDashCount
  const chartCardStyle =
    'mt-4 w-[95%] sm:w-[45%] md:w-[30%] lg:w-[30%] bg-white p-4 shadow-[0px_0px_6px_3px_rgba(0,0,0,0.08)]'

  return (
    <div className="flex flex-wrap w-full justify-between">
      <div className={chartCardStyle}>
        <TriChart
          counter={chartData.dpia}
          title="Behov for PVK"
          processStatus={processStatus}
          processField={EProcessField.DPIA}
          onClickPieChartSlice={handleClickPieChartSlice}
        />
        <ParagraphMedium>
          Ref. til PVK ikke angitt:{' '}
          <RouteLink href={link(EProcessField.DPIA_REFERENCE_MISSING, EProcessState.YES)}>
            {chartData.dpiaReferenceMissing}
          </RouteLink>
        </ParagraphMedium>
      </div>

      <div className={chartCardStyle}>
        <TriChart
          counter={chartData.profiling}
          title="Profilering"
          processStatus={processStatus}
          processField={EProcessField.PROFILING}
          onClickPieChartSlice={handleClickPieChartSlice}
        />
      </div>

      <div className={chartCardStyle}>
        <TriChart
          counter={chartData.automation}
          title="Helautomatisk behandling"
          processStatus={processStatus}
          processField={EProcessField.AUTOMATION}
          onClickPieChartSlice={handleClickPieChartSlice}
        />
      </div>

      <div className={chartCardStyle}>
        <Chart
          chartTitle="Ufullstendig behandlingsgrunnlag"
          size={chartSize}
          hidePercent
          type="bar"
          data={[
            {
              label: 'Rettslig grunnlag uavklart',
              size: chartData.processesMissingLegalBases,
              color: chartColor.generalRed,
              onClick: handleClickPieChartSlice(
                EProcessField.MISSING_LEGAL_BASIS,
                EProcessState.YES,
                processStatus
              ),
            },
            {
              label: 'Artikkel 6 mangler',
              size: chartData.processesMissingArt6,
              color: chartColor.generalMustard,
              onClick: handleClickPieChartSlice(
                EProcessField.MISSING_ARTICLE_6,
                EProcessState.YES,
                processStatus
              ),
            },
            {
              label: 'Artikkel 9 mangler',
              size: chartData.processesMissingArt9,
              color: chartColor.generalBlue,
              onClick: handleClickPieChartSlice(
                EProcessField.MISSING_ARTICLE_9,
                EProcessState.YES,
                processStatus
              ),
            },
          ]}
        />
      </div>

      <div className={chartCardStyle}>
        <TriChart
          counter={chartData.retention}
          processStatus={processStatus}
          title="Omfattes av NAVs bevarings- og kassasjonsvedtak"
          processField={EProcessField.RETENTION}
          onClickPieChartSlice={handleClickPieChartSlice}
        />
        <ParagraphLarge>
          Behandlinger med ufullstendig lagringstid:{' '}
          <RouteLink href={link(EProcessField.RETENTION_DATA)}>
            {chartData.retentionDataIncomplete}
          </RouteLink>
        </ParagraphLarge>
      </div>

      <div className={chartCardStyle}>
        <TriChart
          counter={chartData.dataProcessor}
          processStatus={processStatus}
          title="Benyttes databehandler(e)?"
          processField={EProcessField.DATA_PROCESSOR}
          onClickPieChartSlice={handleClickPieChartSlice}
        />
      </div>

      <div className={chartCardStyle}>
        <TriChart
          counter={chartData.aiUsage}
          processStatus={processStatus}
          title="KI systemer benyttes"
          processField={EProcessField.AIUSAGE}
          onClickPieChartSlice={handleClickPieChartSlice}
        />
      </div>

      {all.disclosures !== undefined && (
        <div className={chartCardStyle}>
          <Chart
            chartTitle="Utleveringer behandlingsgrunnlag"
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
        </div>
      )}

      <div className="mt-10 w-full">
        <Card
          overrides={cardShadow}
          hasThumbnail={(placeHolder: { readonly thumbnail?: string | undefined }) => {
            return !!placeHolder
          }}
        >
          <div>
            <ParagraphMedium>
              Behandlinger hvor NAV er felles behandlingsansvarlig med ekstern part:{' '}
              <RouteLink href={link(EProcessField.COMMON_EXTERNAL_PROCESSOR, EProcessState.YES)}>
                {chartData.commonExternalProcessResponsible}
              </RouteLink>
            </ParagraphMedium>
            <ParagraphMedium>
              Behandlinger hvor NAV er databehandler:{' '}
              <RouteLink href={'/dpprocess'}>{chartData.dpProcesses}</RouteLink>
            </ParagraphMedium>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default Charts
