import {Cell, HeadCell, Row, Table} from "../../common/Table";
import {intl, theme} from "../../../util";
import {Process, processSort} from "../../../constants";
import React from "react";
import {Block} from "baseui/block";
import RouteLink from "../../common/RouteLink";
import {useTable} from "../../../util/hooks";

type RelatedProcessesTableProps = {
  relatedProcesses: Process[]
}

const RelatedProcessesTable = ({relatedProcesses}: RelatedProcessesTableProps) => {
  const [table, sortColumn] = useTable<Process, keyof Process>(relatedProcesses, {sorting: processSort, initialSortColumn: 'name'})
  return (
    <>
      <Table
        emptyText={intl.emptyTable}
        backgroundColor={theme.colors.primary100}
        headers={
          <>
            <HeadCell title={intl.overallPurposeActivity} column={'purposes'} tableState={[table, sortColumn]}/>
            <HeadCell title={intl.process} column={'name'} tableState={[table, sortColumn]}/>
            <HeadCell title={intl.department} column={'affiliation'} tableState={[table, sortColumn]}/>
            <HeadCell title={intl.system}/>
          </>
        }>
        {table.data.map((row: Process, index: number) => {
          return (
            <React.Fragment key={index}>
              <Row>
                <Block display="flex" width="100%" justifyContent="space-between">
                  <Cell>
                    <RouteLink href={`/process/purpose/${row.purposes[0].code}`}>
                      {row.purposes[0].shortName}
                    </RouteLink>
                  </Cell>
                  <Cell>
                    <RouteLink href={`/process/${row.id}`} width="25%">
                      {row.name}
                    </RouteLink>
                  </Cell>
                  <Cell>
                    <RouteLink href={`/process/department/${row.affiliation.department?.code}`}>{row.affiliation.department?.shortName}</RouteLink>
                  </Cell>
                  <Cell>
                    {
                      row.affiliation.products.map(s => (
                        <span style={{marginRight:"10px"}}>
                        <RouteLink href={`/process/system/${s.code}`}>{s.shortName}</RouteLink>
                        </span>
                      ))
                    }
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
