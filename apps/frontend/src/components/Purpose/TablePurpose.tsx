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
import { Alert } from "baseui/icon";
import { Block } from "baseui/block";
import { Paragraph1, Paragraph2 } from "baseui/typography";
import { string } from "prop-types";

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

type DirectionT = SORT_DIRECTION | null;

type TablePurposeProps = {
    datasets:
        | Array<{
              id: string;
              title: string | null;
          }>
        | Array<any>
        | null
        | undefined;
};

const TablePurpose = ({ datasets }: TablePurposeProps) => {
    const [purposeDirection, setPurposeDirection] = React.useState<any>(null);
    const [legalBasisDirection, setLegalBasisDirection] = React.useState<any>(
        null
    );

    const handleSort = (title: string, prevDirection: string) => {
        let nextDirection = null;
        if (prevDirection === "ASC") nextDirection = "DESC";

        if (prevDirection === "DESC") nextDirection = "ASC";

        if (prevDirection === null) nextDirection = "ASC";

        if (title === "purpose") {
            setPurposeDirection(nextDirection);
            setLegalBasisDirection(null);
        }
        if (title === "legalBasis") {
            setLegalBasisDirection(nextDirection);
            setPurposeDirection(null);
        }
        return;
    };

    const getSortedData = () => {
        if (purposeDirection) {
            const sorted = datasets
                .slice(0)
                .sort((a: any, b: any) => a[1] - b[1]);
            if (purposeDirection === SORT_DIRECTION.ASC) {
                return sorted;
            }
            if (purposeDirection === SORT_DIRECTION.DESC) {
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
};

export default TablePurpose;
