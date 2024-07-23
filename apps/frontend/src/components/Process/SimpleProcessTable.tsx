import { Cell, HeadCell, Row, Table } from '../common/Table'
import RouteLink from '../common/RouteLink'
import { ProcessShort, ProcessShortWithEmail } from '../../constants'
import React, { useEffect, useState } from 'react'
import { useTable } from '../../util/hooks'
import { StyleObject } from 'styletron-standard'
import { processStatusText } from './Accordion/ProcessData'
import { getResourceById } from '../../api'
import { StyledLink } from 'baseui/link'
import { Block } from 'baseui/block'
import { KIND, SIZE as ButtonSize } from 'baseui/button'
import Button from '../common/Button'
import { faFileExcel } from '@fortawesome/free-solid-svg-icons'
import handleExcelExport from '../../util/excelExport'

const cellStyle: StyleObject = {
  wordBreak: 'break-word',
}

export const SimpleProcessTable = (props: { processes: ProcessShort[]; title: string; showCommonExternalProcessResponsible?: boolean }) => {
  const { processes } = props
  const [processesWithEmail, setProcessesWithEmail] = useState<ProcessShortWithEmail[]>(processes)

  useEffect(() => {
    ;(async () => {
      if (processes) {
        const newProcessesList: ProcessShortWithEmail[] = []
        await Promise.all(
          processes.map(async (p) => {
            const userIdent = p.changeStamp.lastModifiedBy.split(' ')[0]
            if (userIdent !== 'migration') {
              await getResourceById(userIdent).then((res) => {
                newProcessesList.push({
                  ...p,
                  lastModifiedEmail: res.email,
                })
              })
            } else {
              newProcessesList.push({ ...p })
            }
          }),
        ).then(() => setProcessesWithEmail(newProcessesList))
      }
    })()
  }, [processes])

  const [table, sortColumn] = useTable<ProcessShortWithEmail, keyof ProcessShortWithEmail>(processesWithEmail, {
    useDefaultStringCompare: true,
    initialSortColumn: 'name',
    sorting: {
      name: (a, b) => ((a.purposes[0].shortName || '') + ':' + (a.name || '')).localeCompare((b.purposes[0].shortName || '') + ': ' + b.name || ''),
      affiliation: (a, b) => (a.affiliation.department?.shortName || ' ').localeCompare(b.affiliation.department?.shortName || ' '),
      status: (a, b) => (a.status || '').localeCompare(b.status || ''),
      commonExternalProcessResponsible: (a, b) => (a.commonExternalProcessResponsible?.shortName || ' ').localeCompare(b.commonExternalProcessResponsible?.shortName || ' '),
      changeStamp: (a, b) => (a.changeStamp.lastModifiedBy || '').localeCompare(b.changeStamp.lastModifiedBy || ''),
      lastModifiedEmail: (a, b) => (a.lastModifiedEmail || '').localeCompare(b.lastModifiedEmail || ''),
    },
  })

  return (
    <div>
      <div className="flex justify-end">
        <Button
          kind={KIND.tertiary}
          size={ButtonSize.compact}
          icon={faFileExcel}
          tooltip='Eksportér'
          marginRight
          onClick={() => handleExcelExport(processesWithEmail, props.title)}
        >
          Eksportér
        </Button>
      </div>
      <Table
        emptyText='Ingen behandlinger'
        headers={
          <>
            <HeadCell title='Behandling' column="name" tableState={[table, sortColumn]} $style={cellStyle} />
            <HeadCell title='Avdeling' column="affiliation" tableState={[table, sortColumn]} $style={cellStyle} />
            {props.showCommonExternalProcessResponsible && (
              <HeadCell title='Felles behandlingsansvarlig' column="commonExternalProcessResponsible" tableState={[table, sortColumn]} $style={cellStyle} />
            )}
            <HeadCell title='Status' column="status" tableState={[table, sortColumn]} $style={cellStyle} />
            <HeadCell title='Sist endret av' column="lastModifiedEmail" tableState={[table, sortColumn]} $style={cellStyle} />
          </>
        }
      >
        {table.data.map((process) => (
          <Row key={process.id}>
            <Cell $style={cellStyle}>
              {/* todo multipurpose url */}
              <RouteLink href={`/process/purpose/${process.purposes[0].code}/${process.id}`}>{process.purposes.map((p) => p.shortName).join(', ') + ': ' + process.name}</RouteLink>
            </Cell>
            <Cell $style={cellStyle}>
              {process.affiliation.department === null ? (
                ''
              ) : (
                <RouteLink href={`/process/department/${process.affiliation.department?.code}`}>{process.affiliation.department?.shortName}</RouteLink>
              )}
            </Cell>
            {props.showCommonExternalProcessResponsible && (
              <Cell $style={cellStyle}>
                {process.commonExternalProcessResponsible === null ? (
                  ''
                ) : (
                  <RouteLink href={`/thirdparty/${process.commonExternalProcessResponsible?.code}`}>{process.commonExternalProcessResponsible?.shortName}</RouteLink>
                )}
              </Cell>
            )}
            <Cell $style={cellStyle}>{processStatusText(process.status)}</Cell>
            <Cell $style={cellStyle}>
              <StyledLink href={'mailto: ' + process.lastModifiedEmail}>{process.lastModifiedEmail}</StyledLink>
            </Cell>
          </Row>
        ))}
      </Table>
    </div>
  )
}
