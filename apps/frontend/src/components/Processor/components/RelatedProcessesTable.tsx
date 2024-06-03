import { Cell, HeadCell, Row, Table } from '../../common/Table'
import { theme } from '../../../util'
import { Process, processSort } from '../../../constants'
import React from 'react'
import { Block } from 'baseui/block'
import RouteLink from '../../common/RouteLink'
import { useTable } from '../../../util/hooks'

type RelatedProcessesTableProps = {
  relatedProcesses: Process[]
}

const RelatedProcessesTable = ({ relatedProcesses }: RelatedProcessesTableProps) => {
  const [table, sortColumn] = useTable<Process, keyof Process>(relatedProcesses, { sorting: processSort, initialSortColumn: 'name' })
  return (
    <>
      <Table
        emptyText='Ingen'
        backgroundColor={theme.colors.primary100}
        headers={
          <>
            <HeadCell title='Overordnet behandlingsaktivitet' column={'purposes'} tableState={[table, sortColumn]} $style={{ maxWidth: '25%' }} />
            <HeadCell title='Behandling ja' column={'name'} tableState={[table, sortColumn]} $style={{ maxWidth: '25%' }} />
            <HeadCell title='Avdeling' column={'affiliation'} tableState={[table, sortColumn]} $style={{ maxWidth: '25%' }} />
            <HeadCell title='System'$style={{ maxWidth: '25%' }} />
          </>
        }
      >
        {table.data.map((row: Process, index: number) => {
          return (
            <React.Fragment key={index}>
              <Row>
                <Block display="flex" width="100%" justifyContent="space-between">
                  <Cell $style={{ maxWidth: '25%' }}>
                    <RouteLink href={`/process/purpose/${row.purposes[0].code}`}>{row.purposes[0].shortName}</RouteLink>
                  </Cell>
                  <Cell $style={{ maxWidth: '25%' }}>
                    <RouteLink href={`/process/${row.id}`} width="25%">
                      {row.name}
                    </RouteLink>
                  </Cell>
                  <Cell $style={{ maxWidth: '25%' }}>
                    <RouteLink href={`/process/department/${row.affiliation.department?.code}`}>{row.affiliation.department?.shortName}</RouteLink>
                  </Cell>
                  <Cell $style={{ maxWidth: '25%' }}>
                    <Block>
                      {row.affiliation.products.map((s) => (
                        <Block marginRight={'10%'}>
                          <RouteLink href={`/process/system/${s.code}`}>{s.shortName}</RouteLink>
                        </Block>
                      ))}
                    </Block>
                  </Cell>
                </Block>
              </Row>
            </React.Fragment>
          )
        })}
      </Table>
    </>
  )
}

export default RelatedProcessesTable
