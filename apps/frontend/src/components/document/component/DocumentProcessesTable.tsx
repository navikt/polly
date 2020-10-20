import React, {useState} from 'react'
import {Cell, HeadCell, Row, Table} from '../../common/Table'
import {intl} from '../../../util'
import {Code, codelist} from '../../../service/Codelist'
import {Process} from '../../../constants'
import {ColumnCompares, useTable} from '../../../util/hooks'
import RouteLink from '../../common/RouteLink'
import {Block} from 'baseui/block'

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
  purposes: (a, b) => (a.purposes[0].shortName || '').localeCompare(b.purposes[0].shortName || ''),
  department: (a, b) => (a.department?.shortName || '').localeCompare(b.department?.shortName || ''),
  products: (a, b) => ((a.products.length && a.products[0].shortName) || '').localeCompare((b.products.length && b.products[0].shortName) || '')
}


const DocumentProcessesTable = (props: DocumentProcessesProps) => {
  const [processes] = useState(props.documentUsages.map(p => ({
    id: p.id,
    name: p.name,
    purposes: p.purposes,
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
                <Block display='flex' flexDirection='column'>
                  {process.purposes.map((p, i) =>
                    <Block key={i}>
                      <RouteLink href={`/process/purpose/${p.code}`}>
                        {codelist.getShortnameForCode(p)}
                      </RouteLink>
                    </Block>
                  )}
                </Block>
              </Cell>
              <Cell>
                {/* todo multipurpose url */}
                <RouteLink href={`/process/purpose/${process.purposes[0].code}/${process.id}`}>{process.name}</RouteLink>
              </Cell>
              <Cell>
                {process.department ? <RouteLink href={`/process/department/${process.department.code}`}>{process.department.shortName}</RouteLink> : ''}
              </Cell>
              <Cell>
                <Block display='flex' flexDirection='column'>
                  {process.products.map((p, i) =>
                    <Block key={i}>
                      <RouteLink href={`/system/${p.code}`}>
                        {codelist.getShortnameForCode(p)}
                      </RouteLink>
                    </Block>
                  )}
                </Block>
              </Cell>
            </Row>
          ))
        }
      </Table>
    </>
  )
}

export default DocumentProcessesTable
