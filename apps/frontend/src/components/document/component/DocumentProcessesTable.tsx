import React from 'react'
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
  purposes: Code[]
  department?: Code
  products: Code[]
}

const sorting: ColumnCompares<DataFormat> = {
  name: (a, b) => a.name.localeCompare(b.name),
  purposes: (a, b) => (codelist.getShortnameForCode(a.purposes[0]) || '').localeCompare(codelist.getShortnameForCode(b.purposes[0]) || ''),
  department: (a, b) => (a.department?.shortName || '').localeCompare(b.department?.shortName || ''),
  products: (a, b) => a.products.length - b.products.length,
}


const DocumentProcessesTable = (props: DocumentProcessesProps) => {
  const [table, sortColumn] = useTable<DataFormat, keyof DataFormat>(
    props.documentUsages.map(p => ({
      id: p.id,
      name: p.name,
      purposes: p.purposes,
      department: p.affiliation.department,
      products: p.affiliation.products
    })), {
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
              column="purposes"
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
                {process.purposes.map((p,i) =>
                  <RouteLink key={i} href={`/process/purpose/${p.code}`}>{codelist.getShortnameForCode(p)}</RouteLink>)}
              </Cell>
              <Cell>
                {/* todo multipurpose url */}
                <RouteLink href={`/process/purpose/${process.purposes[0].code}/${process.id}`}>{process.name}</RouteLink>
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
