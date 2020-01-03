import * as React from "react";
import { SortableHeadCell, StyledBody, StyledCell, StyledHead, StyledRow, StyledTable } from "baseui/table";
import { useStyletron, withStyle } from "baseui";

import { LegalBasesNotClarified, ListLegalBasesInTable } from "./LegalBasis"
import { codelist, ListName } from "../../service/Codelist"
import { intl } from "../../util"
import { Policy, policySort, Disclosure, disclosureSort } from "../../constants"
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
                                <StyledCell>{row.recipient.shortName}</StyledCell>
                            )}
                            {/* <StyledCell>{row.recipientPurpose}</StyledCell> */}
                            <StyledCell>{row.informationTypes.map(i => i.name)}</StyledCell>
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
