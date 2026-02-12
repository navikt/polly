import { BodyShort, Button, Label, Tooltip } from '@navikt/ds-react'
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
    <div className="flex w-fit mb-0 justify-center">
      <BodyShort className="m-0">
        {label}{' '}
        <b
          style={{
            textDecoration: 'underline',
          }}
        >
          {number}
        </b>
      </BodyShort>
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
          <div className="flex flex-col items-center justify-around w-52 h-28">
            <RouteLink
              href={genProcessPath(
                ESection.department,
                department.department ? department.department : 'INGEN',
                undefined
              )}
              style={{ textDecoration: 'none' }}
            >
              <Label style={{ color: 'var(--ax-text-accent)', textAlign: 'center' }}>
                {nomDepartmentName !== '' ? nomDepartmentName : 'Fant ikke'}
              </Label>
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
      .sort((a, b) => {
        if (a.department === '') {
          return 1
        }

        if (b.department === '') {
          return -1
        }

        if (a.department !== '' && b.department !== '') {
          const avdelingA: string =
            alleNomAvdelinger.filter((avdeling) => avdeling.id === a.department)[0]?.navn ||
            'Fant ikke'
          const avdelingB: string =
            alleNomAvdelinger.filter((avdeling) => avdeling.id === b.department)[0]?.navn ||
            'Fant ikke'

          return avdelingA.localeCompare(avdelingB)
        } else {
          return 0
        }
      })
      .filter((department) => department.department !== '')
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
