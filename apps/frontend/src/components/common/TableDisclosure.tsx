import * as React from "react";
import { SortableHeadCell, StyledBody, StyledCell, StyledHead, StyledRow, StyledTable } from "baseui/table";
import { useStyletron, withStyle } from "baseui";

import { ListLegalBasesInTable } from "./LegalBasis"
import { intl } from "../../util"
import { Disclosure, disclosureSort, InformationType } from "../../constants"
import { useTable } from "../../util/hooks"
import RouteLink from "./RouteLink"

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

const renderInformationTypesInCell = (informationtypeList: InformationType[]) => {
    const informationTypeNameList = informationtypeList.reduce((acc, curr) => {
        if (!acc) acc = [curr.name]
        else acc = [...acc, curr.name]
        return acc 
    }, [] as string[]) 

    return (
        <React.Fragment>
            {informationTypeNameList.join(', ')}
        </React.Fragment>
    )
}

type TableDisclosureProps = {
    list: Array<Disclosure>;
    showRecipient: boolean;
};

const TableDisclosure = ({ list, showRecipient }: TableDisclosureProps) => {
    const [useCss, theme] = useStyletron();
    const [table, sortColumn] = useTable<Disclosure, keyof Disclosure>(list, { sorting: disclosureSort, initialSortColumn: "recipient" })

    return (
        <React.Fragment>
            <StyledTable className={useCss({ overflow: "hidden !important" })}>
                <StyledHeader>
                    {showRecipient && (
                        <SortableHeadCell
                            title={intl.recipient}
                            direction={table.direction.recipient}
                            onSort={() => sortColumn('recipient')}
                            fillClickTarget
                        />
                    )}


                    {/* <SortableHeadCell
                        title={intl.recipientPurpose}
                        direction={table.direction.recipientPurpose}
                        onSort={() => sortColumn('recipientPurpose')}
                        fillClickTarget
                    /> */}

                    <SortableHeadCell
                        title={intl.informationTypes}
                        direction={table.direction.informationTypes}
                        onSort={() => sortColumn('informationTypes')}
                        fillClickTarget
                    />

                    <SortableHeadCell
                        title={intl.description}
                        direction={table.direction.description}
                        onSort={() => sortColumn('description')}
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
                            {showRecipient && (
                                <StyledCell>
                                    <RouteLink href={`/thirdparty/${row.recipient.code}`}>{row.recipient.shortName}</RouteLink>
                                </StyledCell>
                            )}
                            {/* <StyledCell>{row.recipientPurpose}</StyledCell> */}
                            <StyledCell>{renderInformationTypesInCell(row.informationTypes)}</StyledCell>
                            <StyledCell>{row.description}</StyledCell>
                            <StyledCell>
                                {row.legalBases && (
                                    <ListLegalBasesInTable legalBases={row.legalBases} />
                                )}
                            </StyledCell>
                        </CustomStyledRow>
                    ))}
                </StyledBody>
            </StyledTable>
        </React.Fragment>
    );
};

export default TableDisclosure;
