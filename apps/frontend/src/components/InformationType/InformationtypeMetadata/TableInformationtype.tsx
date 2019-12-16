import * as React from "react";
import { SortableHeadCell, StyledBody, StyledCell, StyledHead, StyledRow, StyledTable } from "baseui/table";
import { useStyletron, withStyle } from "baseui";
import { StyledLink } from "baseui/link";

import { LegalBasesNotClarified, ListLegalBasesInTable } from "../../common/LegalBasis"
import { codelist, ListName } from "../../../service/Codelist"
import { intl } from "../../../util"
import { Policy, policySort } from "../../../constants"
import { useTable } from "../../../util/hooks"

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

type TableInformationtypeProps = {
    list: Array<Policy>;
};

const TableInformationtype = ({list}: TableInformationtypeProps) => {
    const [useCss, theme] = useStyletron();
    const [table, sortColumn] = useTable(list, {sorting: policySort})

    return (
        <React.Fragment>
            <StyledTable className={useCss({ overflow: "hidden !important" })}>
                <StyledHeader>
                    <SortableHeadCell
                        title={intl.process}
                        direction={table.direction.process}
                        onSort={() => sortColumn('process')}
                        fillClickTarget
                    />

                    <SortableHeadCell
                        title={intl.subjectCategories}
                        direction={table.direction.subjectCategory}
                        onSort={() => sortColumn('subjectCategory')}
                        fillClickTarget
                    />

                    <SortableHeadCell
                        title={intl.legalBasisShort}
                        direction={table.direction.legalBases}
                        onSort={() => sortColumn('legalBases')}
                    />
                </StyledHeader>

                <StyledBody>
                    {table.data.map((row, index) => (
                        <CustomStyledRow key={index}>
                            <StyledCell>
                                <StyledLink href={`/purpose/${row.purposeCode.code}/${row.process.id}`}>
                                    {row.process && row.process.name}
                                </StyledLink>

                            </StyledCell>

                            <StyledCell>{codelist.getShortname(ListName.SUBJECT_CATEGORY, row.subjectCategory.code)}</StyledCell>

                            <StyledCell>
                                {!row.legalBasesInherited && row.legalBases && row.legalBases.length > 0 && (
                                    <ListLegalBasesInTable legalBases={row.legalBases} />
                                )}

                                {row.legalBasesInherited && row.process.legalBases && (
                                    <ListLegalBasesInTable legalBases={row.process.legalBases} />
                                )}

                                {!row.legalBasesInherited && row.legalBases.length < 1 && (
                                    <LegalBasesNotClarified />
                                )}
                            </StyledCell>
                        </CustomStyledRow>
                    ))}
                </StyledBody>
            </StyledTable>
        </React.Fragment>
    );
};

export default TableInformationtype;
