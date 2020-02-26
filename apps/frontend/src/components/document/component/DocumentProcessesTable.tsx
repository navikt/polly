import React from 'react'
import { Cell, HeadCell, Row, Table } from '../../common/Table'
import { intl } from '../../../util'
import { codelist, ListName } from '../../../service/Codelist'
import { Process, processSort } from '../../../constants'
import { useTable } from '../../../util/hooks'
import { Label2 } from 'baseui/typography'

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
              column="purposeCode"
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
                {codelist.getShortname(ListName.PURPOSE, process.purposeCode)}
              </Cell>
              <Cell>
                {process.name}
              </Cell>
              <Cell>
                {process.department ? process.department.shortName : ''}
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
