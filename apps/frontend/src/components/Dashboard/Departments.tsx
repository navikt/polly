import { BodyShort, Button, Label, Loader, Tooltip } from '@navikt/ds-react'
import { useEffect, useState } from 'react'
import { getAllNomAvdelinger, getAvdelingByNomId } from '../../api/NomApi'
import {
  IDepartmentDashCount as DepartmentProcess,
  EProcessStatus,
  IDashboardData,
  IOrgEnhet,
} from '../../constants'
import { ESection, genProcessPath } from '../../pages/ProcessPage'
import RouteLink from '../common/RouteLink'

interface ITextWithNumberProps {
  label: string
  number: number
}

const TextWithNumber = (props: ITextWithNumberProps) => {
  const { label, number } = props

  return (
    <div className="flex justify-between gap-2 w-full">
      <BodyShort className="m-0">{label}</BodyShort>
      <b style={{ textDecoration: 'underline', minWidth: '1.5rem', textAlign: 'right' }}>
        {number}
      </b>
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
      } else {
        setNomDepartmentName('Ingen avdeling')
      }
    })()
  }, [department])

  return (
    <Tooltip content={nomDepartmentName}>
      <Button type="button" variant="tertiary-neutral">
        <div className="bg-white p-4 rounded-lg shadow-[0px_0px_6px_3px_rgba(0,0,0,0.08)]">
          <div className="flex flex-col items-start justify-around w-80 h-28">
            <RouteLink
              href={
                genProcessPath(
                  ESection.department,
                  department.department || 'Ingen avdeling',
                  undefined
                ) + '&tab=Dashboard'
              }
              style={{ textDecoration: 'none' }}
            >
              <Label style={{ color: 'var(--ax-text-accent)', textAlign: 'center' }}>
                {nomDepartmentName !== '' ? nomDepartmentName : 'Fant ikke'}
              </Label>
            </RouteLink>

            <RouteLink
              href={genProcessPath(
                ESection.department,
                department.department || 'Ingen avdeling',
                undefined,
                EProcessStatus.COMPLETED
              )}
              style={{ textDecoration: 'none', color: 'inherit' }}
              className="w-full"
            >
              <TextWithNumber label="Ferdig dokumentert" number={department.processesCompleted} />
            </RouteLink>
            <RouteLink
              href={genProcessPath(
                ESection.department,
                department.department || 'Ingen avdeling',
                undefined,
                EProcessStatus.IN_PROGRESS
              )}
              style={{ textDecoration: 'none', color: 'inherit' }}
              className="w-full"
            >
              <TextWithNumber label="Under arbeid" number={department.processesInProgress} />
            </RouteLink>
            <RouteLink
              href={genProcessPath(
                ESection.department,
                department.department || 'Ingen avdeling',
                undefined,
                EProcessStatus.NEEDS_REVISION
              )}
              style={{ textDecoration: 'none', color: 'inherit' }}
              className="w-full"
            >
              <TextWithNumber
                label="Trenger revidering"
                number={department.processesNeedsRevision}
              />
            </RouteLink>
          </div>
        </div>
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
    return data.departments
      .filter((department) => department.department !== '')
      .sort((a, b) => {
        const avdelingA: string =
          alleNomAvdelinger.find((avdeling) => avdeling.id === a.department)?.navn || 'Fant ikke'
        const avdelingB: string =
          alleNomAvdelinger.find((avdeling) => avdeling.id === b.department)?.navn || 'Fant ikke'

        return avdelingA.localeCompare(avdelingB)
      })
  }

  const noDepartment = data.departments.find((d) => d.department === '')

  if (alleNomAvdelinger.length === 0) return <Loader size="xlarge" />

  return (
    <div className="w-full flex flex-wrap gap-4">
      {sortedData().map((department: DepartmentProcess, index: number) => (
        <DepartmentCard key={index} department={department} />
      ))}
      {noDepartment && <DepartmentCard department={noDepartment} />}
    </div>
  )
}

export default Departments
