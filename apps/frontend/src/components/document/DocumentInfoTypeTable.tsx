import * as React from 'react'
import { useTable } from '../../util/hooks'
import { DocumentInfoTypeUse, documentSort } from '../../constants'
import { useStyletron, withStyle } from 'styletron-react'
import { StyledTable, SortableHeadCell, StyledHead, StyledBody, StyledRow, StyledCell } from 'baseui/table'
import { intl } from '../../util'
import RouteLink from '../common/RouteLink'

const StyledHeader = withStyle(StyledHead, {
    backgroundColor: "transparent",
    boxShadow: "none",
    borderBottom: "2px solid #E9E7E7"
});

const CustomStyledRow = withStyle(StyledRow, {
    borderBottom: "1px solid #E9E7E7",
    padding: "8px",
    fontSize: "24px"
});

type DocumentInfoTypeTableProps = {
    list: DocumentInfoTypeUse[]
}

const DocumentInfoTypeTable = (props: DocumentInfoTypeTableProps) => {
    const { list } = props
    const [table, sortColumn] = useTable<DocumentInfoTypeUse, keyof DocumentInfoTypeUse>(list, { sorting: documentSort, initialSortColumn: "informationType" })
    const [useCss] = useStyletron();

    return (
        <StyledTable className={useCss({ overflow: "hidden !important" })}>
            <StyledHeader>
                <SortableHeadCell
                    title={intl.informationType}
                    direction={table.direction.informationType}
                    onSort={() => sortColumn('informationType')}
                    fillClickTarget
                />
                <SortableHeadCell
                    title={intl.subjectCategories}
                    direction={table.direction.subjectCategories}
                    onSort={() => sortColumn('subjectCategories')}
                    fillClickTarget
                />
            </StyledHeader>

            <StyledBody>
                {table.data.map((row, index) => (
                    <CustomStyledRow>
                        <StyledCell>
                            <RouteLink href={`/informationtype/${row.informationType.id}`}>{row.informationType.name}</RouteLink>
                        </StyledCell>
                        <StyledCell>
                            {row.subjectCategories && row.subjectCategories.map(sc => sc.shortName).join(', ')}
                        </StyledCell>
                    </CustomStyledRow>
                ))}


            </StyledBody>
        </StyledTable>
    )
}

export default DocumentInfoTypeTable