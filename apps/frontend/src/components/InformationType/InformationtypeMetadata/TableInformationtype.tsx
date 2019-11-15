import * as React from "react";
import { SORT_DIRECTION, SortableHeadCell, StyledBody, StyledCell, StyledHead, StyledRow, StyledTable } from "baseui/table";
import { useStyletron, withStyle } from "baseui";
import { Codelist } from "../../../constants";
import { legalBasisLinkProcessor } from "../../../util/string-processor"

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

const renderListItem = (codelist: Codelist, legalBasis: any | object) => {
    let gdpr = legalBasis.gdpr && legalBasis.gdpr.code
    let nationalLaw = legalBasis.nationalLaw && legalBasis.nationalLaw.code

    let description = legalBasisLinkProcessor(codelist, nationalLaw, legalBasis.description)
    console.log(description, "description")

    return (
        <li> {gdpr && (gdpr + ', ')} {nationalLaw && nationalLaw} {description}</li>
    )
}

type TableInformationtypeProps = {
    list: Array<any>;
    codelist: Codelist;
};

const TableInformationtype = ({ codelist, list }: TableInformationtypeProps) => {
    const [useCss, theme] = useStyletron();
    const [processDirection, setProcessDirection] = React.useState<any>(null);
    const [subjectCategoryDirection, setSubjectCategoryDirection] = React.useState<any>(null);
    const [legalBasisDirection, setLegalBasisDirection] = React.useState<any>(null);

    const handleSort = (title: string, prevDirection: string) => {
        let nextDirection = null;
        if (prevDirection === "ASC") nextDirection = "DESC";

        if (prevDirection === "DESC") nextDirection = "ASC";

        if (prevDirection === null) nextDirection = "ASC";

        if (title === "Behandling") {
            setProcessDirection(nextDirection);
            setSubjectCategoryDirection(null)
            setLegalBasisDirection(null);
        }

        if (title === "Personkategori") {
            setProcessDirection(null);
            setSubjectCategoryDirection(nextDirection)
            setLegalBasisDirection(null);
        }

        if (title === "Rettslig Grunnlag") {
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
                        title="Behandling"
                        direction={processDirection}
                        onSort={() => handleSort('Behandling', processDirection)}
                        fillClickTarget
                    />

                    <SortableHeadCell
                        title="Personkategori"
                        direction={subjectCategoryDirection}
                        onSort={() => handleSort('Personkategori', subjectCategoryDirection)}
                        fillClickTarget
                    />

                    <SortableHeadCell
                        title="Rettslig grunnlag"
                        direction={legalBasisDirection}
                        onSort={() => handleSort('Rettslig Grunnlag', legalBasisDirection)}
                    />
                </StyledHeader>

                <StyledBody>
                    {getSortedData().map((row: any, index: number) => (
                        <CustomStyledRow key={index}>
                            <StyledCell>{row.process ? row.process.name : ''}</StyledCell>
                            <StyledCell>{row.subjectCategory && (row.subjectCategory.code)}</StyledCell>

                            <StyledCell>
                                {!row.legallegalBasesInherited && row.legalBases && row.legalBases.length > 0 && (
                                    <ul>
                                        {row.legalBases.map((legalBasis: any) => (
                                            <li>{renderListItem(codelist, legalBasis)}</li>
                                        ))}
                                    </ul>
                                )}

                                {row.legalBasesInherited && row.process.legalBases && (
                                    <ul>
                                        {row.process.legalBases.map((legalBasis: any) => (
                                            <li>{renderListItem(codelist, legalBasis)}</li>
                                        ))}
                                    </ul>
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
