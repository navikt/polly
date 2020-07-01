import {InformationType, informationTypeSort} from '../../constants'
import {useTable} from '../../util/hooks'
import {Block} from 'baseui/block'
import {intl, theme} from '../../util'
import {HeadingSmall} from 'baseui/typography'
import {Cell, HeadCell, Row, Table} from '../common/Table'
import RouteLink from '../common/RouteLink'
import {Sensitivity} from './Sensitivity'
import {DotTags} from '../common/DotTag'
import {ListName} from '../../service/Codelist'
import React, {useEffect, useState} from 'react'
import {Spinner} from '../common/Spinner'


type GetInfoTypes = () => Promise<InformationType[]>
type TableProps = {
  title: string
  informationTypes?: InformationType[]
  getInfoTypes?: GetInfoTypes
}
export const InfoTypeTable = ({informationTypes, getInfoTypes, title}: TableProps) => {
  const [informationTypeList, setInformationTypeList] = useState<InformationType[]>(informationTypes || [])
  const [isLoading, setIsLoading] = React.useState<boolean>(true)

  const [table, sortColumn] = useTable<InformationType, keyof InformationType>(informationTypeList, {
    sorting: informationTypeSort,
    initialSortColumn: 'name'
  })

  useEffect(() => {
    if (!getInfoTypes) return
    (async () => {
      setIsLoading(true)
      setInformationTypeList(await getInfoTypes())
      setIsLoading(false)
    })()
  }, [getInfoTypes])

  if (isLoading)
    return <Spinner size={theme.sizing.scale1200}/>

  return (
    <Block marginBottom={theme.sizing.scale1200}>
      <HeadingSmall>{title}</HeadingSmall>

      <Table
        emptyText={intl.informationTypes}
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
