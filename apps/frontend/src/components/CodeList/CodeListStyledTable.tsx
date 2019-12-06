import * as React from "react";
import {
    SORT_DIRECTION,
    SortableHeadCell,
    StyledBody,
    StyledCell,
    StyledHead,
    StyledHeadCell,
    StyledRow,
    StyledTable
} from "baseui/table";
import {useStyletron, withStyle} from "baseui";

const SmallerHeadCell = withStyle(StyledHeadCell, {
    maxWidth: "15%",
    wordBreak: "break-word",
});

const SmallCell = withStyle(StyledCell, {
    maxWidth: "15%",
    wordBreak: "break-word",
});

const headerStyle = {
    paddingTop: "2px",
    paddingRight: "16px",
    paddingBottom:"2px",
    paddingLeft:"0",
};

const CodeListTable = ({tableData}:any) => {
    const [useCss] = useStyletron();

    const [codeDirection, setCodeDirection] = React.useState<any>(null);
    const [shortNameDirection, setShortNameDirection] = React.useState<any>(null);
    const [descriptionDirection, setDescriptionDirection] = React.useState<any>(null);

    const handleSort = (title: string, prevDirection: string) => {
        let nextDirection = null;
        if (prevDirection === SORT_DIRECTION.ASC) {
            nextDirection = SORT_DIRECTION.DESC;
        }
        if (prevDirection === SORT_DIRECTION.DESC) {
            nextDirection = null;
        }
        if (prevDirection === null) {
            nextDirection = SORT_DIRECTION.ASC;
        }
        if (title === "Code") {
            setCodeDirection(nextDirection);
            setShortNameDirection(null);
            setDescriptionDirection(null);
            return;
        }
        if (title === "Short Name") {
            setCodeDirection(null);
            setShortNameDirection(nextDirection);
            setDescriptionDirection(null);
            return;
        }
        if (title === "Description") {
            setCodeDirection(null);
            setShortNameDirection(null);
            setDescriptionDirection(nextDirection);
            return;
        }
    };

    const getSortedData = (tableData:any) => {
        if (codeDirection) {
            const sorted = tableData.slice(0).sort((a: any, b: any) =>
                a[0].localeCompare(b[0]),
            );
            if (codeDirection === SORT_DIRECTION.ASC) {
                return sorted;
            }
            if (codeDirection === SORT_DIRECTION.DESC) {
                return sorted.reverse();
            }
        }

        if (shortNameDirection) {
            const sorted = tableData.slice(0).sort((a: any, b: any) =>
                a[0].localeCompare(b[0]),
            );
            if (shortNameDirection === SORT_DIRECTION.ASC) {
                return sorted;
            }
            if (shortNameDirection === SORT_DIRECTION.DESC) {
                return sorted.reverse();
            }
        }

        if (descriptionDirection) {
            const sorted = tableData.slice(0).sort((a: any, b: any) =>
                a[0].localeCompare(b[0]),
            );
            if (descriptionDirection === SORT_DIRECTION.ASC) {
                return sorted;
            }
            if (descriptionDirection === SORT_DIRECTION.DESC) {
                return sorted.reverse();
            }
        }
        return tableData;
    };

    return(
        <StyledTable className={useCss({overflow: "hidden !important"})}>
            <StyledHead>
                <SmallerHeadCell>
                    <SortableHeadCell
                        overrides={{
                            HeadCell: {
                                style: headerStyle
                            }
                        }}
                        title="Code"
                        direction={codeDirection}
                        onSort={() =>
                            handleSort("Code", codeDirection)
                        }
                    />
                </SmallerHeadCell>
                <SmallerHeadCell>
                    <SortableHeadCell
                        overrides={{
                            HeadCell: {
                                style: headerStyle
                            }
                        }}
                        title="Short Name"
                        direction={shortNameDirection}
                        onSort={() =>
                            handleSort("Short Name", shortNameDirection)
                        }
                    />
                </SmallerHeadCell>
                <StyledHeadCell styled={{
                    maxWidth: "55%",
                    minWidth: "24rem"
                }}>
                    <SortableHeadCell
                        overrides={{
                            HeadCell: {
                                style: headerStyle
                            }
                        }}
                        title="Description"
                        direction={descriptionDirection}
                        onSort={() =>
                            handleSort("Description", descriptionDirection)
                        }
                    />
                </StyledHeadCell>
                <SmallerHeadCell/>
            </StyledHead>
            <StyledBody>
                {getSortedData(tableData).map((row: any, index: any) => (
                    <StyledRow key={index}>
                        <SmallCell>{row[0]}</SmallCell>
                        <SmallCell>{row[1]}</SmallCell>
                        <StyledCell
                            styled={{
                                maxWidth: "55%",
                                minWidth: "24rem",
                            }}
                        >
                            {row[2]}
                        </StyledCell>
                        <SmallCell>{row[3]}</SmallCell>
                    </StyledRow>
                ))}
            </StyledBody>
        </StyledTable>
    );
};

export default CodeListTable;