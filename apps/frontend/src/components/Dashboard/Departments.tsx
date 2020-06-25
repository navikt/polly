import * as React from 'react'
import {Card} from 'baseui/card'
import {cardShadow} from '../common/Style'
import {Block} from 'baseui/block'
import {Label1, Paragraph2} from 'baseui/typography'
import {theme} from '../../util'
import {DashboardData, DepartmentProcess} from '../../constants'
import {codelist, ListName} from '../../service/Codelist'
import {PLACEMENT, StatefulTooltip} from 'baseui/tooltip'
import RouteLink from '../common/RouteLink'

const TextWithNumber = (props: { label: string; number: number }) => (
  <Block display="flex" width="100%" marginBottom="0" justifyContent="center">
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
    <StatefulTooltip content={codelist.getCode(ListName.DEPARTMENT, department.department)?.shortName} placement={PLACEMENT.topLeft}>
      <Block>
        <Card overrides={cardShadow}>
          <Block
            display='flex'
            flexDirection='column'
            alignItems='center'
            justifyContent='space-around'
            width="130px"
            height="130px"
          >
            <Label1 color={theme.colors.accent300} $style={{textAlign: 'center'}}>{parsedDepartmentName(department.department)}</Label1>
            <RouteLink href={`/process/department/${department.department}/COMPLETED`}>
              <TextWithNumber label="Fullført" number={department.processesCompleted}/>
            </RouteLink>
            <RouteLink href={`/process/department/${department.department}/IN_PROGRESS`}>
              <TextWithNumber label="Under arbeid" number={department.processesInProgress}/>
            </RouteLink>
          </Block>
        </Card>
      </Block>
    </StatefulTooltip>
  )
}

type DepartmentsProps = {
  data: DashboardData;
}
const Departments = (props: DepartmentsProps) => {
  const {data} = props

  const sortedData = () => data.departmentProcesses.sort((a, b) => parsedDepartmentName(a.department).localeCompare(b.department))

  return (
    <Block width="100%" display="flex" flexWrap>
      {sortedData().map((department: DepartmentProcess, i: number) => (
        <Block key={i} marginTop={theme.sizing.scale600} marginRight={theme.sizing.scale600}>
          <DepartmentCard department={department}/>
        </Block>
      ))}
    </Block>
  )
}

export default Departments
