import {ColumnCompares, useTable} from "../../util/hooks";
import {Cell, HeadCell, Row, Table} from "../common/Table";
import {intl} from "../../util";
import React from "react";
import {DpProcess} from "../../constants";
import RouteLink from "../common/RouteLink";

type DpProcessTableProps = {
  dpProcesses: DpProcess[]
}

const sorting: ColumnCompares<DpProcess> = {
  name: (a, b) => a.name.localeCompare(b.name),
  externalProcessResponsible: (a, b) => (a.externalProcessResponsible?.shortName || '').localeCompare(b.externalProcessResponsible?.shortName||'')
}

const DpProcessTable = (props: DpProcessTableProps) => {

  const [table, sortColumn] = useTable<DpProcess, keyof DpProcess>(
    props.dpProcesses,
    {
      sorting,
      initialSortColumn:'name'
    }
  )

  return (
    <>
      <Table
        emptyText={intl.processes}
        headers={
          <>
            <HeadCell
              title={intl.dpProcess}
              column="name"
              tableState={[table, sortColumn]}
            />
            <HeadCell
              title={intl.externalProcessResponsible}
              column="externalProcessResponsible"
              tableState={[table, sortColumn]}
            />
          </>
        }>
        {
          table.data.map((process, index) => (
            <Row key={index}>
              <Cell>
                <RouteLink href={`/dpprocess/${process.id}`} style={{textDecoration: 'none'}}>
                  {process.name}
                </RouteLink>
              </Cell>
              <Cell>
                <RouteLink href={`/thirdparty/${process.externalProcessResponsible?.code}`} style={{textDecoration: 'none'}}>
                  {process.externalProcessResponsible?.shortName}
                </RouteLink>
              </Cell>
            </Row>
          ))
        }
      </Table>
    </>
  )
}

export default DpProcessTable
