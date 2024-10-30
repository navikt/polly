import { HeadingXLarge } from 'baseui/typography'
import { useEffect, useState } from 'react'
import { IInformationType, informationTypeSort } from '../../constants'
import { CodelistService, EListName } from '../../service/Codelist'
import { theme } from '../../util'
import { useTable } from '../../util/hooks'
import { DotTags } from '../common/DotTag'
import RouteLink from '../common/RouteLink'
import { Spinner } from '../common/Spinner'
import { Cell, HeadCell, Row, Table } from '../common/Table'
import { Sensitivity } from './Sensitivity'

type TTableProps = {
  title: string
  informationTypes?: IInformationType[]
  getInfoTypes?: () => Promise<IInformationType[]>
}

export const InfoTypeTable = ({ informationTypes, getInfoTypes, title }: TTableProps) => {
  const [codelistUtils] = CodelistService()

  const [informationTypeList, setInformationTypeList] = useState<IInformationType[]>(
    informationTypes || []
  )
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const [table, sortColumn] = useTable<IInformationType, keyof IInformationType>(
    informationTypeList,
    {
      sorting: informationTypeSort,
      initialSortColumn: 'name',
    }
  )

  useEffect(() => {
    if (!getInfoTypes) return
    ;(async () => {
      setIsLoading(true)
      setInformationTypeList(await getInfoTypes())
      setIsLoading(false)
    })()
  }, [getInfoTypes])

  return (
    <>
      {isLoading && <Spinner size={theme.sizing.scale1200} />}
      {!isLoading && (
        <div className="mb-12">
          <HeadingXLarge>
            {title} ({informationTypeList.length})
          </HeadingXLarge>

          <Table
            emptyText="Ingen opplysningstyper"
            headers={
              <>
                <HeadCell title="Navn" column={'name'} tableState={[table, sortColumn]} />
                <HeadCell
                  title="Beskrivelse"
                  column={'description'}
                  tableState={[table, sortColumn]}
                />
                <HeadCell title="Kilder" column={'sources'} tableState={[table, sortColumn]} />
              </>
            }
          >
            {table.data.map((row: IInformationType, index: number) => (
              <Row key={index}>
                <Cell>
                  <RouteLink href={`/informationtype/${row.id}`}>
                    <Sensitivity sensitivity={row.sensitivity} /> {row.name}
                  </RouteLink>
                </Cell>
                <Cell>{row.description}</Cell>
                <Cell>
                  <DotTags
                    list={EListName.THIRD_PARTY}
                    codes={row.sources}
                    linkCodelist
                    commaSeparator
                    codelistUtils={codelistUtils}
                  />
                </Cell>
              </Row>
            ))}
          </Table>
        </div>
      )}
    </>
  )
}
