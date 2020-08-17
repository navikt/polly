import * as React from 'react'
import { useEffect } from 'react'
import { getDashboard } from '../../api'
import { ProcessStatus, DepartmentProcessDashCount, ProcessField, ProcessState } from '../../constants'
import { Block } from 'baseui/block'
import { chartCardProps } from '../common/Style'
import TriChart from '../common/TriChart'
import { intl } from '../../util'
import { Chart } from '../Dashboard/Chart'
import { chartColor } from '../../util/theme'
import * as H from 'history'
import { useHistory } from 'react-router-dom'
import { Paragraph1 } from 'baseui/typography'
import RouteLink from '../common/RouteLink'
import { lowerFirst } from 'lodash'

const chartSize = 80
//const clickOnPieChartSlice = (processField: ProcessField, processState: ProcessState, processStatus: ProcessStatus, history: H.History) => () => history.push(`/dashboard/${processField}/${processState}/${processStatus}`)

type DepartmentChartsProps = {
    departmentCode: string
}

const DepartmentCharts = (props: DepartmentChartsProps) => {
    const [isLoading, setIsLoading] = React.useState(true)
    const [chartData, setChartData] = React.useState<DepartmentProcessDashCount>()
    const { departmentCode } = props
    const history = useHistory()

    useEffect(() => {
        (async () => {
            setIsLoading(true)
            const response = await getDashboard(ProcessStatus.All)
            if (response) setChartData(response.departmentProcesses.find(d => d.department === departmentCode))

            setIsLoading(false)
        })()
    }, [])

    return (
        <>
            {!isLoading && chartData && (
                <Block display='flex' flexWrap width='100%' justifyContent="space-between">
                    <Block {...chartCardProps}>
                        <TriChart
                            counter={chartData.dpia}
                            title={intl.dpiaNeeded}
                            processStatus={ProcessStatus.All}
                            field={ProcessField.DPIA} />
                    </Block>

                    <Block {...chartCardProps}>
                        <TriChart
                            counter={chartData.profiling}
                            title={intl.profiling}
                            processStatus={ProcessStatus.All}
                            field={ProcessField.PROFILING} />
                    </Block>

                    <Block {...chartCardProps}>
                        <TriChart
                            counter={chartData.automation}
                            title={intl.automaticProcessing}
                            processStatus={ProcessStatus.All}
                            field={ProcessField.AUTOMATION} />
                    </Block>

                    <Block {...chartCardProps}>
                        <Chart
                            chartTitle={intl.incompleteLegalBasis}
                            size={chartSize}
                            data={
                                [
                                    {
                                        label: intl.numberOfProcessesWithUnknownLegalBasis,
                                        size: chartData.processesMissingLegalBases,
                                        color: chartColor.generalRed,
                                    },
                                    {
                                        label: intl.numberOfProcessesWithoutArticle6LegalBasis,
                                        size: chartData.processesMissingArt6,
                                        color: chartColor.generalMustard,
                                    },
                                    {
                                        label: intl.numberOfProcessesWithoutArticle9LegalBasis,
                                        size: chartData.processesMissingArt9,
                                        color: chartColor.generalBlue,
                                    },
                                ]
                            } />
                    </Block>

                    <Block {...chartCardProps}>
                        <TriChart
                            counter={chartData.retention}
                            processStatus={ProcessStatus.All}
                            header={intl.retention}
                            title={intl.retentionPieChartTitle}
                            field={ProcessField.RETENTION} />
                        <Paragraph1>
                            {intl.processWithIncompleteRetention}
                            <RouteLink href={`/dashboard/${ProcessField.RETENTION_DATA}/${ProcessState.UNKNOWN}/${ProcessStatus.All}`}>
                                {chartData.retentionDataIncomplete}
                            </RouteLink>
                        </Paragraph1>
                    </Block>

                    <Block {...chartCardProps}>
                        <TriChart counter={chartData.dataProcessor}
                            processStatus={ProcessStatus.All}
                            header={intl.dataProcessor}
                            title={intl.isDataProcessorUsed}
                            field={ProcessField.DATA_PROCESSOR} />
                        <Paragraph1>
                            {`${intl.dataProcessorAgreement} ${lowerFirst(intl.emptyMessage)}`} &nbsp;
                            <RouteLink href={`/dashboard/${ProcessField.DATA_PROCESSOR_AGREEMENT_EMPTY}/${ProcessState.YES}/${ProcessStatus.All}`}>
                                {chartData.dataProcessorAgreementMissing}
                            </RouteLink>
                        </Paragraph1>
                        <TriChart counter={chartData.dataProcessorOutsideEU}
                            processStatus={ProcessStatus.All}
                            title={`${intl.dataProcessor} ${lowerFirst(intl.dataProcessorOutsideEU)}`}
                            field={ProcessField.DATA_PROCESSOR_OUTSIDE_EU} />
                    </Block>
                </Block>
            )}
        </>

    )
}

export default DepartmentCharts