import { faFileExcel } from '@fortawesome/free-solid-svg-icons'
import { StyledLink } from 'baseui/link'
import { useEffect, useState } from 'react'
import { StyleObject } from 'styletron-standard'
import { getResourceById } from '../../api'
import { IProcessShort, IProcessShortWithEmail } from '../../constants'
import handleExcelExport from '../../util/excelExport'
import { useTable } from '../../util/hooks'
import Button from '../common/Button'
import RouteLink from '../common/RouteLink'
import { Cell, HeadCell, Row, Table } from '../common/Table'
import { processStatusText } from './Accordion/ProcessData'

const cellStyle: StyleObject = {
  wordBreak: 'break-word',
}

interface IProps {
  processes: IProcessShort[]
  title: string
  showCommonExternalProcessResponsible?: boolean
}

export const SimpleProcessTable = (props: IProps) => {
  const { processes, showCommonExternalProcessResponsible, title } = props
  const [processesWithEmail, setProcessesWithEmail] = useState<IProcessShortWithEmail[]>(processes)

  useEffect(() => {
    ;(async () => {
      if (processes) {
        const newProcessesList: IProcessShortWithEmail[] = []
        await Promise.all(
          processes.map(async (process: IProcessShort) => {
            const userIdent = process.changeStamp.lastModifiedBy.split(' ')[0]
            if (userIdent !== 'migration') {
              await getResourceById(userIdent).then((result) => {
                newProcessesList.push({
                  ...process,
                  lastModifiedEmail: result.email,
                })
              })
            } else {
              newProcessesList.push({ ...process })
            }
          })
        ).then(() => setProcessesWithEmail(newProcessesList))
      }
    })()
  }, [processes])

  const [table, sortColumn] = useTable<IProcessShortWithEmail, keyof IProcessShortWithEmail>(
    processesWithEmail,
    {
      useDefaultStringCompare: true,
      initialSortColumn: 'name',
      sorting: {
        name: (a, b) =>
          ((a.purposes[0].shortName || '') + ':' + (a.name || '')).localeCompare(
            (b.purposes[0].shortName || '') + ': ' + b.name || ''
          ),
        affiliation: (a, b) =>
          (a.affiliation.department?.shortName || ' ').localeCompare(
            b.affiliation.department?.shortName || ' '
          ),
        status: (a, b) => (a.status || '').localeCompare(b.status || ''),
        commonExternalProcessResponsible: (a, b) =>
          (a.commonExternalProcessResponsible?.shortName || ' ').localeCompare(
            b.commonExternalProcessResponsible?.shortName || ' '
          ),
        changeStamp: (a, b) =>
          (a.changeStamp.lastModifiedBy || '').localeCompare(b.changeStamp.lastModifiedBy || ''),
        lastModifiedEmail: (a, b) =>
          (a.lastModifiedEmail || '').localeCompare(b.lastModifiedEmail || ''),
      },
    }
  )

  return (
    <div>
      <div className="flex justify-end">
        <Button
          kind="tertiary"
          size="xsmall"
          icon={faFileExcel}
          tooltip="Eksportér"
          marginRight
          onClick={() => handleExcelExport(processesWithEmail, title)}
        >
          Eksportér
        </Button>
      </div>
      <Table
        emptyText="Ingen behandlinger"
        headers={
          <>
            <HeadCell
              title="Behandling"
              column="name"
              tableState={[table, sortColumn]}
              $style={cellStyle}
            />
            <HeadCell
              title="Avdeling"
              column="affiliation"
              tableState={[table, sortColumn]}
              $style={cellStyle}
            />
            {showCommonExternalProcessResponsible && (
              <HeadCell
                title="Felles behandlingsansvarlig"
                column="commonExternalProcessResponsible"
                tableState={[table, sortColumn]}
                $style={cellStyle}
              />
            )}
            <HeadCell
              title="Status"
              column="status"
              tableState={[table, sortColumn]}
              $style={cellStyle}
            />
            <HeadCell
              title="Sist endret av"
              column="lastModifiedEmail"
              tableState={[table, sortColumn]}
              $style={cellStyle}
            />
          </>
        }
      >
        {table.data.map((process: IProcessShortWithEmail) => (
          <Row key={process.id}>
            <Cell $style={cellStyle}>
              {/* todo multipurpose url */}
              <RouteLink href={`/process/purpose/${process.purposes[0].code}/${process.id}`}>
                {process.purposes.map((purpose) => purpose.shortName).join(', ') +
                  ': ' +
                  process.name}
              </RouteLink>
            </Cell>
            <Cell $style={cellStyle}>
              {process.affiliation.department === null ? (
                ''
              ) : (
                <RouteLink href={`/process/department/${process.affiliation.department?.code}`}>
                  {process.affiliation.department?.shortName}
                </RouteLink>
              )}
            </Cell>
            {showCommonExternalProcessResponsible && (
              <Cell $style={cellStyle}>
                {process.commonExternalProcessResponsible === null ? (
                  ''
                ) : (
                  <RouteLink href={`/thirdparty/${process.commonExternalProcessResponsible?.code}`}>
                    {process.commonExternalProcessResponsible?.shortName}
                  </RouteLink>
                )}
              </Cell>
            )}
            <Cell $style={cellStyle}>{processStatusText(process.status)}</Cell>
            <Cell $style={cellStyle}>
              <StyledLink href={'mailto: ' + process.lastModifiedEmail}>
                {process.lastModifiedEmail}
              </StyledLink>
            </Cell>
          </Row>
        ))}
      </Table>
    </div>
  )
}
