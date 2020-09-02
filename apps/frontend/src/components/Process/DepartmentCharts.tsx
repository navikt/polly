import * as React from 'react'
import {useEffect} from 'react'
import {getDashboard} from '../../api'
import {DepartmentProcessDashCount, ProcessField, ProcessState, ProcessStatus} from '../../constants'
import {Block} from 'baseui/block'
import {chartCardProps} from '../common/Style'
import TriChart from '../common/TriChart'
import {intl} from '../../util'
import {Chart} from '../Dashboard/Chart'
import {chartColor} from '../../util/theme'
import {useHistory} from 'react-router-dom'
import {Paragraph1} from 'baseui/typography'
import RouteLink from '../common/RouteLink'
import {lowerFirst} from 'lodash'
import {clickOnPieChartSlice} from '../../util/dashboard'

const chartSize = 80

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
    }, [departmentCode])

    return (
        <>
            {!isLoading && chartData && (
                <Block display='flex' flexWrap width='100%' justifyContent='space-between' marginBottom={'240px'}>
                    <Block {...chartCardProps}>
                        <TriChart
                            counter={chartData.dpia}
                            title={intl.dpiaNeeded}
                            processStatus={ProcessStatus.All}
                            processField={ProcessField.DPIA}
                            departmentCode={departmentCode}
                        />
                    </Block>

                    <Block {...chartCardProps}>
                        <TriChart
                            counter={chartData.profiling}
                            title={intl.profiling}
                            processStatus={ProcessStatus.All}
                            processField={ProcessField.PROFILING}
                            departmentCode={departmentCode}
                        />
                    </Block>

                    <Block {...chartCardProps}>
                        <TriChart
                            counter={chartData.automation}
                            title={intl.automaticProcessing}
                            processStatus={ProcessStatus.All}
                            processField={ProcessField.AUTOMATION}
                            departmentCode={departmentCode}
                        />
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
                                        onClick: clickOnPieChartSlice(ProcessField.MISSING_LEGAL_BASIS, ProcessState.YES, ProcessStatus.All, history, departmentCode)
                                    },
                                    {
                                        label: intl.numberOfProcessesWithoutArticle6LegalBasis,
                                        size: chartData.processesMissingArt6,
                                        color: chartColor.generalMustard,
                                        onClick: clickOnPieChartSlice(ProcessField.MISSING_ARTICLE_6, ProcessState.YES, ProcessStatus.All, history, departmentCode)
                                    },
                                    {
                                        label: intl.numberOfProcessesWithoutArticle9LegalBasis,
                                        size: chartData.processesMissingArt9,
                                        color: chartColor.generalBlue,
                                        onClick: clickOnPieChartSlice(ProcessField.MISSING_ARTICLE_9, ProcessState.YES, ProcessStatus.All, history, departmentCode)
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
                            processField={ProcessField.RETENTION}
                            departmentCode={departmentCode}
                        />
                        <Paragraph1>
                            {intl.processWithIncompleteRetention}
                            <RouteLink href={`/dashboard/${ProcessField.RETENTION_DATA}/${ProcessState.UNKNOWN}/${ProcessStatus.All}/${departmentCode}`}>
                                {chartData.retentionDataIncomplete}
                            </RouteLink>
                        </Paragraph1>
                    </Block>

                    <Block {...chartCardProps}>
                        <TriChart counter={chartData.dataProcessor}
                            processStatus={ProcessStatus.All}
                            header={intl.dataProcessor}
                            title={intl.isDataProcessorUsed}
                            processField={ProcessField.DATA_PROCESSOR}
                            departmentCode={departmentCode}
                        />
                        <Paragraph1>
                            {`${intl.dataProcessorAgreement} ${lowerFirst(intl.emptyMessage)}`} &nbsp;
                            <RouteLink href={`/dashboard/${ProcessField.DATA_PROCESSOR_AGREEMENT_EMPTY}/${ProcessState.YES}/${ProcessStatus.All}/${departmentCode}`}>
                                {chartData.dataProcessorAgreementMissing}
                            </RouteLink>
                        </Paragraph1>
                        <TriChart counter={chartData.dataProcessorOutsideEU}
                            processStatus={ProcessStatus.All}
                            title={`${intl.dataProcessor} ${lowerFirst(intl.dataProcessorOutsideEU)}`}
                            processField={ProcessField.DATA_PROCESSOR_OUTSIDE_EU}
                            departmentCode={departmentCode}
                        />
                    </Block>
                </Block>
            )}
        </>

    )
}

export default DepartmentCharts
