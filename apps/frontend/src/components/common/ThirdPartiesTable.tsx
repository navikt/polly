import * as React from 'react'
import {intl} from '../../util'
import {InformationType, informationTypeSort} from '../../constants'
import {useTable} from '../../util/hooks'
import {Cell, HeadCell, Row, Table} from './Table'
import RouteLink from "./RouteLink";
import {HeadingSmall} from "baseui/typography";

type TableInformationTypes = {
  informationTypes: Array<InformationType>;
  sortName: Boolean
};

const ThirdPartiesTable = ({informationTypes, sortName}: TableInformationTypes) => {

  const [table, sortColumn] = useTable<InformationType, keyof InformationType>(informationTypes, {sorting: informationTypeSort, initialSortColumn: sortName ? 'name' : 'orgMaster'})

  return (
    <React.Fragment>
      <HeadingSmall>{intl.retrievedFromThirdParty}</HeadingSmall>

      <Table
        emptyText={intl.noRetrievedFromThirdPartyAvailableInTable}
        headers={
          <>
            <HeadCell title={intl.name} column={'name'} tableState={[table, sortColumn]}/>
            <HeadCell title={intl.orgMaster} column={'orgMaster'} tableState={[table, sortColumn]}/>
          </>
        }
      >
        {table.data.map((row, index) => (
          <Row key={index}>
            <Cell>
              {<RouteLink href={`/informationtype/${row.id}`}>{row.name}</RouteLink>}
            </Cell>
            <Cell>
              {row.orgMaster?.shortName && <RouteLink href={`/system/${row.orgMaster.code}`}>{row.orgMaster?.shortName}</RouteLink>}
            </Cell>
          </Row>
        ))}
      </Table>
    </React.Fragment>
  )
}

export default ThirdPartiesTable
