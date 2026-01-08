import { useEffect, useMemo, useState } from 'react'
import {BodyLong, Button, Link, SortState, Table} from '@navikt/ds-react'
import { getResourceById } from '../../api/TeamApi'
import { IProcessShort, IProcessShortWithEmail} from '../../constants'
import handleExcelExport from '../../util/excelExport'
import { processStatusText } from './Accordion/ProcessData'
import {handleSort} from "../../util/handleTableSort";
import {FileExcelIcon} from "@navikt/aksel-icons";

interface IProps {
  processes: IProcessShort[]
  title: string
  showCommonExternalProcessResponsible?: boolean
}

export const SimpleProcessTable = (props: IProps) => {
  const { processes, showCommonExternalProcessResponsible, title } = props
  const [processesWithEmail, setProcessesWithEmail] = useState<IProcessShortWithEmail[]>(processes)
  const [sort, setSort] = useState<SortState>()

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

  let sortedData: IProcessShortWithEmail[] = useMemo(() => processesWithEmail, [processesWithEmail])

  const comparator = (a: IProcessShortWithEmail, b: IProcessShortWithEmail, orderBy: string): number => {
    switch (orderBy) {
      case 'name':
        return (a.purposes[0].shortName || '').localeCompare(b.purposes[0].shortName || '')
      case 'affiliation':
        return (a.affiliation.nomDepartmentName || '').localeCompare(
          b.affiliation.nomDepartmentName || ''
        )
      case 'commonExternalProcessResponsible' :
        return (a.commonExternalProcessResponsible?.shortName || '').localeCompare(b.commonExternalProcessResponsible?.shortName || '')
      case 'status':
        return (a.status || '').localeCompare(b.status || '')
      case 'lastModifiedEmail':
        return (a.lastModifiedEmail || '').localeCompare(b.lastModifiedEmail || '')
      default:
        return 0
    }
  }

  sortedData = sortedData.sort((a: IProcessShortWithEmail, b: IProcessShortWithEmail) => {
    if (sort) {
      return sort.direction === 'ascending'
        ? comparator(b, a, sort.orderBy)
        : comparator(a, b, sort.orderBy)
    }
    return 1
  })

  return (
    <div>
      <div className="flex justify-end">
        <Button
          variant="tertiary"
          size="xsmall"
          icon={<FileExcelIcon/>}
          onClick={() => handleExcelExport(processesWithEmail, title)}
        >
          Eksportér
        </Button>
      </div>

      <Table
        size="small"
        sort={sort}
        onSortChange={(sortKey) => handleSort(sort, setSort, sortKey)}
      >
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader sortKey="name" sortable>Behandling</Table.ColumnHeader>
            <Table.ColumnHeader sortKey="affiliation"  sortable>Avdeling</Table.ColumnHeader>
            {showCommonExternalProcessResponsible && (
              <Table.ColumnHeader sortKey="commonExternalProcessResponsible" sortable>
                Felles behandlingsansvarlig
              </Table.ColumnHeader>
            )}
            <Table.ColumnHeader sortKey="status" sortable>Status</Table.ColumnHeader>
            <Table.ColumnHeader sortKey="lastModifiedEmail" sortable>Sist endret av</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {sortedData.length === 0 ? (
            <BodyLong>Ingen behandlinger</BodyLong>
          ) : (
            sortedData.map((process: IProcessShortWithEmail) => (
              <Table.Row key={process.id}>
                <Table.DataCell textSize='small'>
                  <Link href={`/process/purpose/${process.purposes[0].code}/${process.id}`}>
                    {process.purposes.map((purpose) => purpose.shortName).join(', ') +
                      ': ' +
                      process.name}
                  </Link>
                </Table.DataCell>
                <Table.DataCell textSize='small'>
                  {process.affiliation.nomDepartmentId === null ? (
                    ''
                  ) : (
                    <Link href={`/process/department/${process.affiliation.nomDepartmentId}`}>
                      {process.affiliation.nomDepartmentName}
                    </Link>
                  )}
                </Table.DataCell>

                {showCommonExternalProcessResponsible && (
                  <Table.DataCell textSize='small'>
                    {process.commonExternalProcessResponsible === null ? (
                      ''
                    ) : (
                      <Link href={`/thirdparty/${process.commonExternalProcessResponsible?.code}`}>
                        {process.commonExternalProcessResponsible?.shortName}
                      </Link>
                    )}
                  </Table.DataCell>
                )}

                <Table.DataCell textSize='small'>{processStatusText(process.status)}</Table.DataCell>

                <Table.DataCell>
                  <Link href={'mailto: ' + process.lastModifiedEmail}>
                    {process.lastModifiedEmail}
                  </Link>
                </Table.DataCell>
              </Table.Row>
            ))
          )}
        </Table.Body>
      </Table>
    </div>
  )
}
