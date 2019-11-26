import * as React from "react";
import { SORT_DIRECTION, SortableHeadCell, StyledBody, StyledCell, StyledHead, StyledRow, StyledTable } from "baseui/table";
import { useStyletron, withStyle } from "baseui";
import { StyledLink } from "baseui/link";
import { LegalBasesNotClarified, ListLegalBasesInTable } from "../../common/LegalBasis"
import { codelist, ListName } from "../../../service/Codelist"
import { intl } from "../../../util/intl/intl"

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
    list: Array<any>;
};

const TableInformationtype = ({ list }: TableInformationtypeProps) => {
    const [useCss, theme] = useStyletron();
    const [processDirection, setProcessDirection] = React.useState<any>(null);
    const [subjectCategoryDirection, setSubjectCategoryDirection] = React.useState<any>(null);
    const [legalBasisDirection, setLegalBasisDirection] = React.useState<any>(null);

    const handleSort = (title: string, prevDirection: string) => {
        let nextDirection = null;
        if (prevDirection === "ASC") nextDirection = "DESC";

        if (prevDirection === "DESC") nextDirection = "ASC";

        if (prevDirection === null) nextDirection = "ASC";

        if (title === intl.process) {
            setProcessDirection(nextDirection);
            setSubjectCategoryDirection(null)
            setLegalBasisDirection(null);
        }

        if (title === intl.subjectCategories) {
            setProcessDirection(null);
            setSubjectCategoryDirection(nextDirection)
            setLegalBasisDirection(null);
        }

        if (title === intl.legalBasisShort) {
            setLegalBasisDirection(nextDirection);
            setSubjectCategoryDirection(null)
            setProcessDirection(null);
        }
        return;
    };

    const getSortedData = () => {
        if (processDirection) {
            const sorted = list.slice(0).sort((a: any, b: any) => a[1] - b[1]);
            if (processDirection === SORT_DIRECTION.ASC) {
                return sorted;
            }
            if (processDirection === SORT_DIRECTION.DESC) {
                return sorted.reverse();
            }
        }

        if (subjectCategoryDirection) {
            const sorted = list.slice(0).sort((a: any, b: any) => a[1] - b[1]);
            if (subjectCategoryDirection === SORT_DIRECTION.ASC) {
                return sorted;
            }
            if (subjectCategoryDirection === SORT_DIRECTION.DESC) {
                return sorted.reverse();
            }
        }

        if (legalBasisDirection) {
            const sorted = list.slice(0).sort((a: any, b: any) => a[2] - b[2]);
            if (legalBasisDirection === SORT_DIRECTION.ASC) {
                return sorted;
            }
            if (legalBasisDirection === SORT_DIRECTION.DESC) {
                return sorted.reverse();
            }
        }

        return list;
    };

    return (
        <React.Fragment>
            <StyledTable className={useCss({ overflow: "hidden !important" })}>
                <StyledHeader>
                    <SortableHeadCell
                        title={intl.process}
                        direction={processDirection}
                        onSort={() => handleSort(intl.process, processDirection)}
                        fillClickTarget
                    />

                    <SortableHeadCell
                        title={intl.subjectCategories}
                        direction={subjectCategoryDirection}
                        onSort={() => handleSort(intl.subjectCategories, subjectCategoryDirection)}
                        fillClickTarget
                    />

                    <SortableHeadCell
                        title={intl.legalBasisShort}
                        direction={legalBasisDirection}
                        onSort={() => handleSort(intl.legalBasisShort, legalBasisDirection)}
                    />
                </StyledHeader>

                <StyledBody>
                    {getSortedData().map((row: any, index: number) => (
                        <CustomStyledRow key={index}>
                            <StyledCell>
                                <StyledLink href={`/purpose/${row.purposeCode.code}/${row.process.id}`}>
                                    {row.process && row.process.name}
                                </StyledLink>

                            </StyledCell>

                            <StyledCell>{codelist.getShortname(ListName.SUBJECT_CATEGORY, row.subjectCategory.code)}</StyledCell>

                            <StyledCell>
                                {!row.legallegalBasesInherited && row.legalBases && row.legalBases.length > 0 && (
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
