import {useTable} from "../../util/hooks";
import {Cell, HeadCell, Row, Table} from "../common/Table";
import {intl} from "../../util";
import React from "react";
import {DpProcess, dpProcessSort} from "../../constants";
import RouteLink from "../common/RouteLink";

type DpProcessTableProps = {
  dpProcesses: DpProcess[]
}

const DpProcessTable = (props: DpProcessTableProps) => {

  const [table, sortColumn] = useTable<DpProcess, keyof DpProcess>(
    props.dpProcesses,
    {
      sorting: dpProcessSort,
      initialSortColumn: 'name'
    }
  )

  return (
    <>
      <Table
        emptyText={intl.noProcessesAvailableInTable}
        headers={
          <>
            <HeadCell
              title={intl.process}
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
