import * as React from 'react'
import {intl} from '../../util'
import {InformationType, informationTypeSort} from '../../constants'
import {useTable} from '../../util/hooks'
import {Cell, HeadCell, Row, Table} from './Table'
import RouteLink from "./RouteLink";
import {Label2} from "baseui/typography";
import {BlockProps} from "baseui/block";

type TableInformationTypes = {
  informationTypes: Array<InformationType>;
  sortName: Boolean
};

const labelBlockProps: BlockProps = {
  marginBottom: '2rem',
  font: 'font400',
  marginTop: '2rem'
}

const ThirdPartiesTable = ({informationTypes, sortName}: TableInformationTypes) => {

  const [table, sortColumn] = useTable<InformationType, keyof InformationType>(informationTypes, {sorting: informationTypeSort, initialSortColumn: sortName ? 'name' : 'orgMaster'})

  return (
    <React.Fragment>
      <Label2 {...labelBlockProps}>{intl.retrievedFromThirdParty}</Label2>

      <Table
        emptyText={intl.retrievedFromThirdParty.toLowerCase()}
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
              {row.orgMaster?.shortName}
            </Cell>
          </Row>
        ))}
      </Table>
    </React.Fragment>
  )
}

export default ThirdPartiesTable
