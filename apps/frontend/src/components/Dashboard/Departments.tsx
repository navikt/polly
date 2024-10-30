import { Button, Tooltip } from '@navikt/ds-react'
import { Card } from 'baseui/card'
import { LabelLarge, ParagraphMedium } from 'baseui/typography'
import {
  IDepartmentDashCount as DepartmentProcess,
  EProcessStatus,
  IDashboardData,
} from '../../constants'
import { ESection, genProcessPath } from '../../pages/ProcessPage'
import { CodelistService, EListName, ICodelistProps } from '../../service/Codelist'
import { theme } from '../../util'
import RouteLink from '../common/RouteLink'
import { cardShadow } from '../common/Style'

interface ITextWithNumberProps {
  label: string
  number: number
}

const TextWithNumber = (props: ITextWithNumberProps) => {
  const { label, number } = props

  return (
    <div className="flex w-fit mb-0 justify-center">
      <ParagraphMedium margin="0">
        {label}{' '}
        <b
          style={{
            textDecoration: 'underline',
          }}
        >
          {number}
        </b>
      </ParagraphMedium>
    </div>
  )
}

const parsedDepartmentName = (department: string, codelistUtils: ICodelistProps): string => {
  if (department === 'OESA') {
    return 'ØSA'
  } else {
    const departmentCode = codelistUtils.getCode(EListName.DEPARTMENT, department)
    if (departmentCode) {
      return departmentCode.code
    } else {
      return 'fant ikke'
    }
  }
}

type TDepartmentCardProps = {
  department: DepartmentProcess
  codelistUtils: ICodelistProps
}

const DepartmentCard = (props: TDepartmentCardProps) => {
  const { department, codelistUtils } = props

  return (
    <Tooltip
      content={codelistUtils.getCode(EListName.DEPARTMENT, department.department)?.shortName || ''}
    >
      <Button type="button" variant="tertiary-neutral">
        <Card overrides={cardShadow}>
          <div className="flex flex-col items-center justify-around w-24 h-28">
            <RouteLink
              href={genProcessPath(ESection.department, department.department, undefined)}
              style={{ textDecoration: 'none' }}
            >
              <LabelLarge color={theme.colors.accent300} $style={{ textAlign: 'center' }}>
                {parsedDepartmentName(department.department, codelistUtils)}
              </LabelLarge>
            </RouteLink>

            <RouteLink
              href={genProcessPath(
                ESection.department,
                department.department,
                undefined,
                EProcessStatus.COMPLETED
              )}
              style={{ textDecoration: 'none' }}
            >
              <TextWithNumber label="Godkjent" number={department.processesCompleted} />
            </RouteLink>
            <RouteLink
              href={genProcessPath(
                ESection.department,
                department.department,
                undefined,
                EProcessStatus.IN_PROGRESS
              )}
              style={{ textDecoration: 'none' }}
            >
              <TextWithNumber label="Under arbeid" number={department.processesInProgress} />
            </RouteLink>
            <RouteLink
              href={genProcessPath(
                ESection.department,
                department.department,
                undefined,
                EProcessStatus.NEEDS_REVISION
              )}
              style={{ textDecoration: 'none' }}
            >
              <TextWithNumber label="Revidering" number={department.processesNeedsRevision} />
            </RouteLink>
          </div>
        </Card>
      </Button>
    </Tooltip>
  )
}

type TDepartmentsProps = {
  data: IDashboardData
}
const Departments = (props: TDepartmentsProps) => {
  const { data } = props
  const [codelistUtils] = CodelistService()

  const sortedData = () => {
    return data.departments.sort((a, b) =>
      parsedDepartmentName(a.department, codelistUtils).localeCompare(
        parsedDepartmentName(b.department, codelistUtils)
      )
    )
  }

  return (
    <div className="w-full flex flex-wrap justify-between">
      {sortedData().map((department: DepartmentProcess, index: number) => (
        <div key={index} className="mt-4">
          <DepartmentCard department={department} codelistUtils={codelistUtils} />
        </div>
      ))}
    </div>
  )
}

export default Departments
