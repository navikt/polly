import React, {useState} from 'react'
import {Cell, HeadCell, Row, Table} from '../../common/Table'
import {intl} from '../../../util'
import {Code, codelist} from '../../../service/Codelist'
import {Process} from '../../../constants'
import {ColumnCompares, useTable} from '../../../util/hooks'
import RouteLink from '../../common/RouteLink'

type DocumentProcessesProps = {
  documentUsages: Process[]
}

interface DataFormat {
  id: string
  name: string
  purpose: Code
  department?: Code
  products: Code[]
}

const sorting: ColumnCompares<DataFormat> = {
  name: (a, b) => a.name.localeCompare(b.name),
  purpose: (a, b) => (codelist.getShortnameForCode(a.purpose) || '').localeCompare(codelist.getShortnameForCode(b.purpose) || ''),
  department: (a, b) => (a.department?.shortName || '').localeCompare(b.department?.shortName || ''),
  products: (a, b) => ((a.products.length && a.products[0].shortName) || '').localeCompare((b.products.length && b.products[0].shortName) || '')
}


const DocumentProcessesTable = (props: DocumentProcessesProps) => {
  const [processes] = useState(props.documentUsages.map(p => ({
    id: p.id,
    name: p.name,
      purpose: p.purpose,
    department: p.affiliation.department,
    products: p.affiliation.products
  })))
  const [table, sortColumn] = useTable<DataFormat, keyof DataFormat>(
    processes, {
      sorting: sorting,
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
                <RouteLink href={`/process/purpose/${process.purpose.code}`}>{codelist.getShortnameForCode(process.purpose)}</RouteLink>
              </Cell>
              <Cell>
                <RouteLink href={`/process/purpose/${process.purpose.code}/${process.id}`}>{process.name}</RouteLink>
              </Cell>
              <Cell>
                {process.department ? <RouteLink href={`/process/department/${process.department.code}`}>{process.department.shortName}</RouteLink> : ''}
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
