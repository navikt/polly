import {H4, HeadingSmall, Label2, Paragraph2} from 'baseui/typography'
import {intl, theme} from '../util'
import {RouteComponentProps, withRouter} from 'react-router-dom'
import React, {useEffect, useState} from 'react'
import {Block} from 'baseui/block'
import {codelist, ListName} from '../service/Codelist'
import ProcessList from '../components/Purpose'
import {Section} from './ProcessPage'
import {InformationType, informationTypeSort} from '../constants'
import {getInformationTypesByOrgMaster} from '../api'
import {StyledSpinnerNext} from 'baseui/spinner'
import {useTable} from '../util/hooks'
import {Cell, HeadCell, Row, Table} from '../components/common/Table'
import RouteLink from '../components/common/RouteLink'
import {Sensitivity} from '../components/InformationType/Sensitivity'
import {DotTags} from '../components/common/DotTag'

const SystemPageImpl = (props: RouteComponentProps<{systemCode: string}>) => {
  const {systemCode} = props.match.params
  const [isLoading, setIsLoading] = React.useState<boolean>(true)
  const [informationTypeList, setInformationTypeList] = useState<InformationType[]>([])

  useEffect(() => {
    (async () => {
      setIsLoading(true)
      setInformationTypeList((await getInformationTypesByOrgMaster(systemCode)).content)
      setIsLoading(false)
    })()
  }, [systemCode])

  return (
    <>
      <Block marginBottom="3rem">
        <H4>{codelist.getShortname(ListName.SYSTEM, systemCode)}</H4>
      </Block>
      <Block marginBottom='scale1000'>
        <Label2 font='font400'>{intl.system}</Label2>
        <Paragraph2>{codelist.getDescription(ListName.SYSTEM, systemCode)}</Paragraph2>
      </Block>
      <ProcessList code={systemCode} listName={ListName.SYSTEM} section={Section.system}/>

      {isLoading && <StyledSpinnerNext/>}
      {!isLoading && <InfoTypeTable informationTypes={informationTypeList}/>}
    </>
  )
}

const InfoTypeTable = ({informationTypes}: {informationTypes: InformationType[]}) => {

  const [table, sortColumn] = useTable<InformationType, keyof InformationType>(informationTypes, {sorting: informationTypeSort, initialSortColumn: 'name'})

  return (
    <Block marginBottom={theme.sizing.scale1200}>
      <HeadingSmall>{intl.orgMasterInfTypeHeader}</HeadingSmall>

      <Table
        emptyText={intl.orgMaster.toLowerCase()}
        headers={
          <>
            <HeadCell title={intl.name} column={'name'} tableState={[table, sortColumn]}/>
            <HeadCell title={intl.description} column={'description'} tableState={[table, sortColumn]}/>
            <HeadCell title={intl.sources} column={'sources'} tableState={[table, sortColumn]}/>
          </>
        }
      >
        {table.data.map((row, index) => (
          <Row key={index}>
            <Cell>
              <RouteLink href={`/informationtype/${row.id}`}>
                <Sensitivity sensitivity={row.sensitivity}/> {row.name}
              </RouteLink>
            </Cell>
            <Cell>
              {row.description}
            </Cell>
            <Cell>
              <DotTags list={ListName.THIRD_PARTY} codes={row.sources} linkCodelist commaSeparator/>
            </Cell>
          </Row>
        ))}
      </Table>
    </Block>
  )
}

export const SystemPage = withRouter(SystemPageImpl)
