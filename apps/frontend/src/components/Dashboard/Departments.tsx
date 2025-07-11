import { Button, Tooltip } from '@navikt/ds-react'
import { Card } from 'baseui/card'
import { LabelLarge, ParagraphMedium } from 'baseui/typography'
import { useEffect, useState } from 'react'
import { getAllNomAvdelinger, getAvdelingByNomId } from '../../api/NomApi'
import {
  IDepartmentDashCount as DepartmentProcess,
  EProcessStatus,
  IDashboardData,
  IOrgEnhet,
} from '../../constants'
import { ESection, genProcessPath } from '../../pages/ProcessPage'
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

type TDepartmentCardProps = {
  department: DepartmentProcess
}

const DepartmentCard = (props: TDepartmentCardProps) => {
  const { department } = props
  const [nomDepartmentName, setNomDepartmentName] = useState<string>('')

  useEffect(() => {
    ;(async () => {
      if (department.department) {
        await getAvdelingByNomId(department.department).then((response) => {
          setNomDepartmentName(response.navn)
        })
      }
    })()
  }, [department])

  return (
    <Tooltip content={nomDepartmentName}>
      <Button type="button" variant="tertiary-neutral">
        <Card
          overrides={cardShadow}
          hasThumbnail={(placeHolder: { readonly thumbnail?: string | undefined }) => {
            return !!placeHolder
          }}
        >
          <div className="flex flex-col items-center justify-around w-52 h-28">
            <RouteLink
              href={genProcessPath(ESection.department, department.department, undefined)}
              style={{ textDecoration: 'none' }}
            >
              <LabelLarge color={theme.colors.accent300} $style={{ textAlign: 'center' }}>
                {nomDepartmentName !== '' ? nomDepartmentName : 'Fant ikke'}
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
  const [alleNomAvdelinger, setAlleNomAvdelinger] = useState<IOrgEnhet[]>([])

  useEffect(() => {
    ;(async () => {
      await getAllNomAvdelinger().then(setAlleNomAvdelinger)
    })()
  }, [])

  const sortedData = () => {
    return data.departments.sort((a, b) => {
      const avdelingA: string =
        alleNomAvdelinger.filter((avdeling) => avdeling.id === a.department)[0]?.navn || 'Fant ikke'
      const avdelingB: string =
        alleNomAvdelinger.filter((avdeling) => avdeling.id === b.department)[0]?.navn || 'Fant ikke'

      return avdelingA.localeCompare(avdelingB)
    })
  }

  return (
    <div className="w-full flex flex-wrap justify-between">
      {sortedData().map((department: DepartmentProcess, index: number) => (
        <div key={index} className="mt-4">
          <DepartmentCard department={department} />
        </div>
      ))}
    </div>
  )
}

export default Departments
