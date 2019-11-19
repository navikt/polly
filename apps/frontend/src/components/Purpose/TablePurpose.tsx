import * as React from "react";
import { SORT_DIRECTION, SortableHeadCell, StyledBody, StyledCell, StyledHead, StyledRow, StyledTable } from "baseui/table";
import { useStyletron, withStyle } from "baseui";
import { StyledLink } from 'baseui/link'
import { renderLegalBasis } from "../../util/LegalBasis"

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



type TablePurposeProps = {
    policies: Array<any>;
};

const TablePurpose = ({ policies }: TablePurposeProps) => {
    const [useCss, theme] = useStyletron();
    const [titleDirection, setTitleDirection] = React.useState<any>(null);
    const [userDirection, setUserDirection] = React.useState<any>(null);
    const [legalBasisDirection, setLegalBasisDirection] = React.useState<any>(null);

    const handleSort = (title: string, prevDirection: string) => {
        let nextDirection = null;
        if (prevDirection === "ASC") nextDirection = "DESC";

        if (prevDirection === "DESC") nextDirection = "ASC";

        if (prevDirection === null) nextDirection = "ASC";

        if (title === "Opplysningstype") {
            setTitleDirection(nextDirection);
            setUserDirection(null)
            setLegalBasisDirection(null);
        }

        if (title === "Personkategori") {
            setTitleDirection(null);
            setUserDirection(nextDirection)
            setLegalBasisDirection(null);
        }

        if (title === "Rettslig Grunnlag") {
            setLegalBasisDirection(nextDirection);
            setUserDirection(null)
            setTitleDirection(null);
        }
        return;
    };

    const getSortedData = () => {
        if (titleDirection) {
            const sorted = policies
                .slice(0)
                .sort((a: any, b: any) => a[1] - b[1]);
            if (titleDirection === SORT_DIRECTION.ASC) {
                return sorted;
            }
            if (titleDirection === SORT_DIRECTION.DESC) {
                return sorted.reverse();
            }
        }

        if (userDirection) {
            const sorted = policies
                .slice(0)
                .sort((a: any, b: any) => a[1] - b[1]);
            if (userDirection === SORT_DIRECTION.ASC) {
                return sorted;
            }
            if (userDirection === SORT_DIRECTION.DESC) {
                return sorted.reverse();
            }
        }

        if (legalBasisDirection) {
            const sorted = policies
                .slice(0)
                .sort((a: any, b: any) => a[1] - b[1]);
            if (legalBasisDirection === SORT_DIRECTION.ASC) {
                return sorted;
            }
            if (legalBasisDirection === SORT_DIRECTION.DESC) {
                return sorted.reverse();
            }
        }

        return policies;
    };

    return (
        <React.Fragment>
            <StyledTable className={useCss({ overflow: "hidden !important" })}>
                <StyledHeader>
                    <SortableHeadCell
                        title="Opplysningstype"
                        direction={titleDirection}
                        onSort={() =>
                            handleSort('Opplysningstype', titleDirection)
                        }
                        fillClickTarget
                    />

                    <SortableHeadCell
                        title="Personkategori"
                        direction={userDirection}
                        onSort={() =>
                            handleSort('Personkategori', userDirection)
                        }
                        fillClickTarget
                    />

                    <SortableHeadCell
                        title="Rettslig Grunnlag"
                        direction={legalBasisDirection}
                        onSort={() =>
                            handleSort('Rettslig Grunnlag', legalBasisDirection)
                        }
                    />
                </StyledHeader>
                <StyledBody>
                    {getSortedData().map((row: any, index: number) => (
                        <CustomStyledRow key={index}>
                            <StyledCell>
                                <StyledLink href={`/informationtype/${row.informationType.id}`}>
                                    {row.informationType.name}
                                </StyledLink>
                            </StyledCell>

                            <StyledCell>{row.subjectCategory && (row.subjectCategory.code)}</StyledCell>

                            <StyledCell>
                                {row.legalBases && row.legalBases.length > 0 && (
                                    <ul>
                                        {row.legalBases.map((legalBasis: any, i: number) => (
                                            <li key={i}> {renderLegalBasis(legalBasis)}</li>
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

export default TablePurpose;
