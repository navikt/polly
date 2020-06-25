import React from 'react'
import {Cell, HeadCell, Row, Table} from '../../common/Table'
import {intl} from '../../../util'
import {codelist} from '../../../service/Codelist'
import {Process, processSort} from '../../../constants'
import {useTable} from '../../../util/hooks'
import RouteLink from '../../common/RouteLink'

type DocumentProcessesProps = {
  documentUsages: Process[]
}

const DocumentProcessesTable = (props: DocumentProcessesProps) => {
  const [table, sortColumn] = useTable<Process, keyof Process>(props.documentUsages, {
    sorting: processSort,
    initialSortColumn: 'name'
  })
  return (
    <>
      <Table
        emptyText={intl.processes}
        headers={
          <>
            <HeadCell
              title={intl.purpose}
              column="purpose"
              tableState={[table, sortColumn]}
            />
            <HeadCell
              title={intl.process}
              column="name"
              tableState={[table, sortColumn]}
            />
            <HeadCell
              title={intl.department}
              column="department"
              tableState={[table, sortColumn]}
            />
            <HeadCell
              title={intl.system}
              column="products"
              tableState={[table, sortColumn]}
            />
          </>
        }>
        {
          table.data.map((process, index) => (
            <Row key={index}>
              <Cell>
                <RouteLink href={`/process/purpose/${process.purpose.code}/ALL`}>{codelist.getShortnameForCode(process.purpose)}</RouteLink>
              </Cell>
              <Cell>
                <RouteLink href={`/process/purpose/${process.purpose.code}/ALL/${process.id}`}>{process.name}</RouteLink>
              </Cell>
              <Cell>
                {process.department ? <RouteLink href={`/process/department/${process.department.code}/ALL`}>{process.department.shortName}</RouteLink> : ''}
              </Cell>
              <Cell>
                {process.products.map(product => product.shortName).join(', ')}
              </Cell>
            </Row>
          ))
        }
      </Table>
    </>
  )
}

export default DocumentProcessesTable
