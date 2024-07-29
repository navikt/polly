import { HeadingXLarge } from 'baseui/typography'
import React, { useEffect, useState } from 'react'
import { InformationType, informationTypeSort } from '../../constants'
import { ListName } from '../../service/Codelist'
import { theme } from '../../util'
import { useTable } from '../../util/hooks'
import { DotTags } from '../common/DotTag'
import RouteLink from '../common/RouteLink'
import { Spinner } from '../common/Spinner'
import { Cell, HeadCell, Row, Table } from '../common/Table'
import { Sensitivity } from './Sensitivity'

type TableProps = {
  title: string
  informationTypes?: InformationType[]
  getInfoTypes?: () => Promise<InformationType[]>
}
export const InfoTypeTable = ({ informationTypes, getInfoTypes, title }: TableProps) => {
  const [informationTypeList, setInformationTypeList] = useState<InformationType[]>(informationTypes || [])
  const [isLoading, setIsLoading] = React.useState<boolean>(true)

  const [table, sortColumn] = useTable<InformationType, keyof InformationType>(informationTypeList, {
    sorting: informationTypeSort,
    initialSortColumn: 'name',
  })

  useEffect(() => {
    if (!getInfoTypes) return
    ;(async () => {
      setIsLoading(true)
      setInformationTypeList(await getInfoTypes())
      setIsLoading(false)
    })()
  }, [getInfoTypes])

  if (isLoading) return <Spinner size={theme.sizing.scale1200} />

  return (
    <div className="mb-12">
      <HeadingXLarge>
        {title} ({informationTypeList.length})
      </HeadingXLarge>

      <Table
        emptyText="Ingen opplysningstyper"
        headers={
          <>
            <HeadCell title="Navn" column={'name'} tableState={[table, sortColumn]} />
            <HeadCell title="Beskrivelse" column={'description'} tableState={[table, sortColumn]} />
            <HeadCell title="Kilder" column={'sources'} tableState={[table, sortColumn]} />
          </>
        }
      >
        {table.data.map((row, index) => (
          <Row key={index}>
            <Cell>
              <RouteLink href={`/informationtype/${row.id}`}>
                <Sensitivity sensitivity={row.sensitivity} /> {row.name}
              </RouteLink>
            </Cell>
            <Cell>{row.description}</Cell>
            <Cell>
              <DotTags list={ListName.THIRD_PARTY} codes={row.sources} linkCodelist commaSeparator />
            </Cell>
          </Row>
        ))}
      </Table>
    </div>
  )
}
