import { useState } from 'react'
import { Process } from '../../../constants'
import { Code, codelist } from '../../../service/Codelist'
import { ColumnCompares, useTable } from '../../../util/hooks'
import RouteLink from '../../common/RouteLink'
import { Cell, HeadCell, Row, Table } from '../../common/Table'

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
  name: (a: DataFormat, b: DataFormat) => a.name.localeCompare(b.name),
  purposes: (a: DataFormat, b: DataFormat) => (a.purposes[0].shortName || '').localeCompare(b.purposes[0].shortName || ''),
  department: (a: DataFormat, b: DataFormat) => (a.department?.shortName || '').localeCompare(b.department?.shortName || ''),
  products: (a: DataFormat, b: DataFormat) => ((a.products.length && a.products[0].shortName) || '').localeCompare((b.products.length && b.products[0].shortName) || ''),
}

const DocumentProcessesTable = (props: DocumentProcessesProps) => {
  const { documentUsages } = props
  const [processes] = useState(
    documentUsages.map((documentUsage: Process) => ({
      id: documentUsage.id,
      name: documentUsage.name,
      purposes: documentUsage.purposes,
      department: documentUsage.affiliation.department,
      products: documentUsage.affiliation.products,
    })),
  )
  const [table, sortColumn] = useTable<DataFormat, keyof DataFormat>(processes, {
    sorting: sorting,
    initialSortColumn: 'name',
  })

  return (
    <>
      <Table
        emptyText="Ingen behandlinger"
        headers={
          <>
            <HeadCell title="Overordnet behandlingsaktivitet" column="purposes" tableState={[table, sortColumn]} />
            <HeadCell title="Behandling" column="name" tableState={[table, sortColumn]} />
            <HeadCell title="Avdeling" column="department" tableState={[table, sortColumn]} />
            <HeadCell title="System" column="products" tableState={[table, sortColumn]} />
          </>
        }
      >
        {table.data.map((process: DataFormat, index: number) => (
          <Row key={index}>
            <Cell>
              <div className="flex flex-col">
                {process.purposes.map((purpose: Code, index: number) => (
                  <div key={index}>
                    <RouteLink href={`/process/purpose/${purpose.code}`}>{codelist.getShortnameForCode(purpose)}</RouteLink>
                  </div>
                ))}
              </div>
            </Cell>
            <Cell>
              {/* todo multipurpose url */}
              <RouteLink href={`/process/purpose/${process.purposes[0].code}/${process.id}`}>{process.name}</RouteLink>
            </Cell>
            <Cell>{process.department ? <RouteLink href={`/process/department/${process.department.code}`}>{process.department.shortName}</RouteLink> : ''}</Cell>
            <Cell>
              <div className="flex flex-col">
                {process.products.map((purpose: Code, index: number) => (
                  <div key={index}>
                    <RouteLink href={`/system/${purpose.code}`}>{codelist.getShortnameForCode(purpose)}</RouteLink>
                  </div>
                ))}
              </div>
            </Cell>
          </Row>
        ))}
      </Table>
    </>
  )
}

export default DocumentProcessesTable
