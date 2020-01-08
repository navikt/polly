import * as React from "react";
import { SortableHeadCell, StyledBody, StyledCell, StyledHead, StyledRow, StyledTable, StyledHeadCell } from "baseui/table";
import { useStyletron, withStyle } from "baseui";

import { ListLegalBasesInTable } from "./LegalBasis"
import { intl } from "../../util"
import { Disclosure, disclosureSort, InformationType } from "../../constants"
import { useTable } from "../../util/hooks"
import RouteLink from "./RouteLink"
import { StatefulTooltip } from "baseui/tooltip";
import { Button, SIZE, KIND } from "baseui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "baseui/modal";
import { Paragraph2 } from "baseui/typography";
import { Block } from "baseui/block";

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

const SmallerStyledHeadCell = withStyle(StyledHeadCell, {
    maxWidth: '15%'
})
const SmallerStyledCell = withStyle(StyledCell, {
    maxWidth: '15%'
})

const renderInformationTypesInCell = (informationtypeList: InformationType[]) => {
    if (!informationtypeList) return ''
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
    submitDeleteDisclosure: Function;
    errorDeleteModal: string;
};

const TableDisclosure = ({ list, showRecipient, submitDeleteDisclosure, errorDeleteModal }: TableDisclosureProps) => {
    const [showDeleteModal, setShowDeleteModal] = React.useState<boolean>()
    const [selectedDisclosure, setSelectedDisclosure] = React.useState<Disclosure>()

    const [table, sortColumn] = useTable<Disclosure, keyof Disclosure>(list, { sorting: disclosureSort, initialSortColumn: "recipient" })
    const [useCss, theme] = useStyletron();


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

                    <SmallerStyledHeadCell />
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
                            <SmallerStyledCell>
                                <Block width="100%" display="flex" justifyContent="flex-end">
                                <StatefulTooltip content={intl.delete}>
                                    <Button
                                        size={SIZE.compact}
                                        kind={KIND.tertiary}
                                        onClick={() => {
                                            setSelectedDisclosure(row)
                                            setShowDeleteModal(true)
                                        }}
                                    >
                                        <FontAwesomeIcon icon={faTrash} />
                                    </Button>
                                </StatefulTooltip>
                                </Block>
                                
                            </SmallerStyledCell>
                        </CustomStyledRow>
                    ))}
                </StyledBody>
            </StyledTable>

            {showDeleteModal && (
                    <Modal
                        onClose={() => setShowDeleteModal(false)}
                        isOpen={showDeleteModal}
                        animate
                        size="default"
                    >
                        <ModalHeader>{intl.confirmDeleteHeader}</ModalHeader>
                        <ModalBody>
                            <Paragraph2>{intl.confirmDeletePolicyText} {selectedDisclosure && selectedDisclosure.recipient.code}</Paragraph2>
                        </ModalBody>

                        <ModalFooter>
                            <Block display="flex" justifyContent="flex-end">
                                <Block alignSelf="flex-end">{errorDeleteModal && <p>{errorDeleteModal}</p>}</Block>
                                <Button
                                    kind="secondary"
                                    onClick={() => setShowDeleteModal(false)}
                                    overrides={{BaseButton: {style: {marginRight: '1rem', marginLeft: '1rem'}}}}
                                >
                                    {intl.abort}
                                </Button>
                                <Button onClick={() => {
                                    if (selectedDisclosure) 
                                        submitDeleteDisclosure(selectedDisclosure) ? setShowDeleteModal(false) : setShowDeleteModal(true)
                                }}
                                >{intl.delete}</Button>
                            </Block>
                        </ModalFooter>
                    </Modal>
                )}
        </React.Fragment>
    );
};

export default TableDisclosure;
