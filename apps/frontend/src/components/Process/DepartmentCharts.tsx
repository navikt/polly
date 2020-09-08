import * as React from 'react'
import {useEffect} from 'react'
import {getDashboard} from '../../api'
import {DepartmentProcessDashCount, ProcessField, ProcessState, ProcessStatus} from '../../constants'
import {Block} from 'baseui/block'
import Charts from '../Charts/Charts'
import { ListName } from '../../service/Codelist'

type DepartmentChartsProps = {
    departmentCode: string
}

const DepartmentCharts = (props: DepartmentChartsProps) => {
    const [isLoading, setIsLoading] = React.useState(true)
    const [chartData, setChartData] = React.useState<DepartmentProcessDashCount>()
    const { departmentCode } = props

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
                <Block marginBottom={'240px'}>
                    <Charts chartData={chartData} processStatus={ProcessStatus.All} departmentCode={departmentCode} type={ListName.DEPARTMENT}/>
                </Block>
            )}
        </>
    )
}

export default DepartmentCharts
