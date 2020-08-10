import * as React from 'react'
import {useState} from 'react'
import {Card} from 'baseui/card'
import {cardShadow} from '../common/Style'
import {Block} from 'baseui/block'
import {Label1, Paragraph2} from 'baseui/typography'
import {theme, useAwait} from '../../util'
import {DashboardData, DepartmentProcessDashCount as DepartmentProcess, ProcessStatus} from '../../constants'
import {codelist, ListName} from '../../service/Codelist'
import RouteLink from '../common/RouteLink'
import {Spinner} from 'baseui/spinner'
import {genProcessPath, Section} from '../../pages/ProcessPage'
import CustomizedStatefulTooltip from "../common/CustomizedStatefulTooltip";

const TextWithNumber = (props: {label: string; number: number}) => (
  <Block display="flex" width="max-content" marginBottom="0" justifyContent="center">
    <Paragraph2 margin="0">{props.label} <b>{props.number}</b></Paragraph2>
  </Block>
)

const parsedDepartmentName = (department: string) => {
  if (department === 'OESA') return 'ØSA'
  return codelist.getCode(ListName.DEPARTMENT, department)?.code as string
}


type DepartmentCardProps = {
  department: DepartmentProcess;
}
const DepartmentCard = (props: DepartmentCardProps) => {
  const {department} = props

  return (
    <CustomizedStatefulTooltip content={codelist.getCode(ListName.DEPARTMENT, department.department)?.shortName}>
      <Block>
        <Card overrides={cardShadow}>
          <Block
            display='flex'
            flexDirection='column'
            alignItems='center'
            justifyContent='space-around'
            width="93px"
            height="93px"
          >
            <Label1 color={theme.colors.accent300} $style={{textAlign: 'center'}}>{parsedDepartmentName(department.department)}</Label1>
            <RouteLink href={genProcessPath(Section.department, department.department, undefined, ProcessStatus.COMPLETED)}>
              <TextWithNumber label="Fullført" number={department.processesCompleted}/>
            </RouteLink>
            <RouteLink href={genProcessPath(Section.department, department.department, undefined, ProcessStatus.IN_PROGRESS)}>
              <TextWithNumber label="Under arbeid" number={department.processesInProgress}/>
            </RouteLink>
          </Block>
        </Card>
      </Block>
    </CustomizedStatefulTooltip>
  )
}

type DepartmentsProps = {
  data: DashboardData;
}
const Departments = (props: DepartmentsProps) => {
  const {data} = props
  const [loading, setLoading] = useState(true)
  useAwait(codelist.wait(), setLoading)

  if (loading) {
    return <Spinner/>
  }

  const sortedData = () => data.departmentProcesses.sort((a, b) => parsedDepartmentName(a.department).localeCompare(parsedDepartmentName(b.department)))

  return (
    <Block width="100%" display="flex" flexWrap>
      {sortedData().map((department: DepartmentProcess, i: number) => (
        <Block key={i} marginTop={theme.sizing.scale600} marginRight={theme.sizing.scale500}>
          <DepartmentCard department={department}/>
        </Block>
      ))}
    </Block>
  )
}

export default Departments
