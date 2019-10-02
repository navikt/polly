import * as React from "react";
import {
    StyledTable,
    StyledHead,
    StyledBody,
    StyledRow,
    StyledCell,
    SortableHeadCell,
    SORT_DIRECTION
} from "baseui/table";
import { withStyle, useStyletron } from "baseui";

// Styling for table header
const StyledHeader = withStyle(StyledHead, {
    backgroundColor: "transparent",
    boxShadow: "none",
    borderBottom: "2px solid #E9E7E7"
});

// Styling for rows in table
const CustomStyledRow = withStyle(StyledRow, {
    borderBottom: "1px solid #E9E7E7",
    padding: "8px",
    fontSize: "24px"
});

type TablePurposeProps = {
    datasets:
        | Array<{
              id: string;
              title: string | null;
          }>
        | Array<any>;
};

const TablePurpose = ({ datasets }: TablePurposeProps) => {
    const [titleDirection, settitleDirection] = React.useState<any>(null);
    const [legalBasisDirection, setLegalBasisDirection] = React.useState<any>(
        null
    );

    const handleSort = (title: string, prevDirection: string) => {
        let nextDirection = null;
        if (prevDirection === "ASC") nextDirection = "DESC";

        if (prevDirection === "DESC") nextDirection = "ASC";

        if (prevDirection === null) nextDirection = "ASC";

        if (title === "datasetTitle") {
            settitleDirection(nextDirection);
            setLegalBasisDirection(null);
        }
        if (title === "legalBasisDescription") {
            setLegalBasisDirection(nextDirection);
            settitleDirection(null);
        }
        return;
    };

    const getSortedData = () => {
        if (titleDirection) {
            const sorted = datasets
                .slice(0)
                .sort((a: any, b: any) => a[1] - b[1]);
            if (titleDirection === SORT_DIRECTION.ASC) {
                return sorted;
            }
            if (titleDirection === SORT_DIRECTION.DESC) {
                return sorted.reverse();
            }
        }

        if (legalBasisDirection) {
            const sorted = datasets
                .slice(0)
                .sort((a: any, b: any) => a[1] - b[1]);
            if (legalBasisDirection === SORT_DIRECTION.ASC) {
                return sorted;
            }
            if (legalBasisDirection === SORT_DIRECTION.DESC) {
                return sorted.reverse();
            }
        }

        return datasets;
    };

    return (
        <React.Fragment>
            <StyledTable>
                <StyledHeader>
                    <SortableHeadCell
                        title="Datasett"
                        direction={titleDirection}
                        onSort={() =>
                            handleSort("datasetTitle", titleDirection)
                        }
                    />
                    <SortableHeadCell
                        title="Rettslig Grunnlag"
                        direction={legalBasisDirection}
                        onSort={() =>
                            handleSort(
                                "legalBasisDescription",
                                legalBasisDirection
                            )
                        }
                    />
                </StyledHeader>
                <StyledBody>
                    {getSortedData().map((row: any, index: number) => (
                        <CustomStyledRow key={index}>
                            <StyledCell>{row.title}</StyledCell>

                            <StyledCell>{row.legalBasisDescription}</StyledCell>
                        </CustomStyledRow>
                    ))}
                </StyledBody>
            </StyledTable>
        </React.Fragment>
    );
};

export default TablePurpose;
