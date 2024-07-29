import { Card } from 'baseui/card'
import { LabelLarge, ParagraphMedium } from 'baseui/typography'
import { useState } from 'react'
import { DashboardData, DepartmentDashCount as DepartmentProcess, ProcessStatus } from '../../constants'
import { Section, genProcessPath } from '../../pages/ProcessPage'
import { ListName, codelist } from '../../service/Codelist'
import { theme, useAwait } from '../../util'
import CustomizedStatefulTooltip from '../common/CustomizedStatefulTooltip'
import RouteLink from '../common/RouteLink'
import { Spinner } from '../common/Spinner'
import { cardShadow } from '../common/Style'

const TextWithNumber = (props: { label: string; number: number }) => (
  <div className="flex w-fit mb-0 justify-center">
    <ParagraphMedium margin="0">
      {props.label}{' '}
      <b
        style={{
          textDecoration: 'underline',
        }}
      >
        {props.number}
      </b>
    </ParagraphMedium>
  </div>
)

const parsedDepartmentName = (department: string) => {
  if (department === 'OESA') return 'ØSA'
  return codelist.getCode(ListName.DEPARTMENT, department)?.code as string
}

type DepartmentCardProps = {
  department: DepartmentProcess
}
const DepartmentCard = (props: DepartmentCardProps) => {
  const { department } = props

  return (
    <CustomizedStatefulTooltip content={codelist.getCode(ListName.DEPARTMENT, department.department)?.shortName}>
      <div>
        <Card overrides={cardShadow}>
          <div className="flex flex-col items-center justify-around w-24 h-24">
            <RouteLink href={genProcessPath(Section.department, department.department, undefined)} style={{ textDecoration: 'none' }}>
              <LabelLarge color={theme.colors.accent300} $style={{ textAlign: 'center' }}>
                {parsedDepartmentName(department.department)}
              </LabelLarge>
            </RouteLink>

            <RouteLink href={genProcessPath(Section.department, department.department, undefined, ProcessStatus.COMPLETED)} style={{ textDecoration: 'none' }}>
              <TextWithNumber label="Godkjent" number={department.processesCompleted} />
            </RouteLink>
            <RouteLink href={genProcessPath(Section.department, department.department, undefined, ProcessStatus.IN_PROGRESS)} style={{ textDecoration: 'none' }}>
              <TextWithNumber label="Under arbeid" number={department.processesInProgress} />
            </RouteLink>
            <RouteLink href={genProcessPath(Section.department, department.department, undefined, ProcessStatus.NEEDS_REVISION)} style={{ textDecoration: 'none' }}>
              <TextWithNumber label="Revidering" number={department.processesNeedsRevision} />
            </RouteLink>
          </div>
        </Card>
      </div>
    </CustomizedStatefulTooltip>
  )
}

type DepartmentsProps = {
  data: DashboardData
}
const Departments = (props: DepartmentsProps) => {
  const { data } = props
  const [loading, setLoading] = useState(true)
  useAwait(codelist.wait(), setLoading)

  if (loading) {
    return <Spinner />
  }

  const sortedData = () => data.departments.sort((a, b) => parsedDepartmentName(a.department).localeCompare(parsedDepartmentName(b.department)))

  return (
    <div className="w-full flex flex-wrap justify-between">
      {sortedData().map((department: DepartmentProcess, i: number) => (
        <div key={i} className="mt-4">
          <DepartmentCard department={department} />
        </div>
      ))}
    </div>
  )
}

export default Departments
