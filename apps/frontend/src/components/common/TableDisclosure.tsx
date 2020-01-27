import * as React from "react";
import { SortableHeadCell, StyledBody, StyledCell, StyledHead, StyledHeadCell, StyledRow, StyledTable } from "baseui/table";
import { useStyletron, withStyle } from "baseui";

import { ListLegalBasesInTable } from "./LegalBasis"
import { intl } from "../../util"
import { Disclosure, DisclosureFormValues, disclosureSort } from "../../constants"
import { useTable } from "../../util/hooks"
import RouteLink from "./RouteLink"
import { PLACEMENT, StatefulTooltip } from "baseui/tooltip";
import { Button, KIND, SIZE } from "baseui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "baseui/modal";
import { Label2, Paragraph2 } from "baseui/typography";
import { Block } from "baseui/block";
import ModalThirdParty from "../ThirdParty/ModalThirdPartyForm";
import { mapDisclosureToFormValues } from "../../api"
import { StyledLink } from "baseui/link"
import { DocumentReferences } from "../InformationType/InformationtypeMetadata/DocumentTable"

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

type TableDisclosureProps = {
    list: Array<Disclosure>;
    showRecipient: boolean;
    editable: boolean;
    submitDeleteDisclosure?: (disclosure: Disclosure) => Promise<boolean>;
    submitEditDisclosure?: (disclosure: DisclosureFormValues) => Promise<boolean>;
    errorModal?: string;
    onCloseModal?: () => void;
    documentRef?: DocumentReferences
};

const TableDisclosure = ({list, showRecipient, submitDeleteDisclosure, submitEditDisclosure, errorModal, editable, onCloseModal, documentRef}: TableDisclosureProps) => {
    const [showDeleteModal, setShowDeleteModal] = React.useState<boolean>(false)
    const [showEditModal, setShowEditModal] = React.useState<boolean>()
    const [selectedDisclosure, setSelectedDisclosure] = React.useState<Disclosure>()

    const [table, sortColumn] = useTable<Disclosure, keyof Disclosure>(list, {sorting: disclosureSort, initialSortColumn: "recipient"})
    const [useCss, theme] = useStyletron();

    return (
        <React.Fragment>

            <StyledTable className={useCss({overflow: "hidden !important"})}>
                <StyledHeader>
                    {showRecipient && (
                        <SortableHeadCell
                            title={intl.recipient}
                            direction={table.direction.recipient}
                            onSort={() => sortColumn('recipient')}
                            fillClickTarget
                        />
                    )}

                    <SortableHeadCell
                        title={intl.document}
                        direction={table.direction.document}
                        onSort={() => sortColumn('document')}
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
                    {editable && <SmallerStyledHeadCell/>}

                </StyledHeader>

                <StyledBody>
                    {table.data.map((row, index) => (
                        <CustomStyledRow key={index}>
                            {showRecipient && (
                                <StyledCell>
                                    <RouteLink href={`/thirdparty/${row.recipient.code}`}>{row.recipient.shortName}</RouteLink>
                                </StyledCell>
                            )}
                            <StyledCell>
                              {!documentRef && <RouteLink href={`/document/${row.documentId}`}>{row.document?.name}</RouteLink>}
                              {documentRef && <StyledLink href="#" onClick={(e: Event) => {
                                e.preventDefault()
                                documentRef[row.document!.id]?.()
                              }}>
                              {row.document?.name}
                            </StyledLink>}
                            </StyledCell>
                            <StyledCell>{row.document?.description}</StyledCell>
                            <StyledCell>
                                {row.legalBases && (
                                    <ListLegalBasesInTable legalBases={row.legalBases}/>
                                )}
                            </StyledCell>
                            {editable && (
                                <SmallerStyledCell>
                                    <Block width="100%" display="flex" justifyContent="flex-end">
                                        <StatefulTooltip content={intl.edit} placement={PLACEMENT.top}>
                                            <Button
                                                size={SIZE.compact}
                                                kind={KIND.tertiary}
                                                onClick={() => {
                                                    setSelectedDisclosure(row)
                                                    setShowEditModal(true)
                                                }}
                                            >
                                                <FontAwesomeIcon icon={faEdit}/>
                                            </Button>
                                        </StatefulTooltip>

                                        <StatefulTooltip content={intl.delete} placement={PLACEMENT.top}>
                                            <Button
                                                size={SIZE.compact}
                                                kind={KIND.tertiary}
                                                onClick={() => {
                                                    setSelectedDisclosure(row)
                                                    setShowDeleteModal(true)
                                                }}
                                            >
                                                <FontAwesomeIcon icon={faTrash}/>
                                            </Button>
                                        </StatefulTooltip>
                                    </Block>

                                </SmallerStyledCell>
                            )}

                        </CustomStyledRow>
                    ))}
                </StyledBody>
            </StyledTable>
            {!table.data.length && <Label2 margin="1rem">{intl.emptyTable} {intl.disclosures}</Label2>}

            {editable && showEditModal && selectedDisclosure && (
                <ModalThirdParty
                    title="Rediger utlevering"
                    isOpen={showEditModal}
                    isEdit={true}
                    initialValues={mapDisclosureToFormValues(selectedDisclosure)}
                    submit={async (values) => submitEditDisclosure && await submitEditDisclosure(values) ? setShowEditModal(false) : setShowEditModal(true)}
                    onClose={() => {
                        onCloseModal && onCloseModal()
                        setShowEditModal(false)
                    }}
                    errorOnCreate={errorModal}
                    disableRecipientField={true}
                />
            )}

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
                            <Block alignSelf="flex-end">{errorModal && <p>{errorModal}</p>}</Block>
                            <Button
                                kind="secondary"
                                onClick={() => setShowDeleteModal(false)}
                                overrides={{BaseButton: {style: {marginRight: '1rem', marginLeft: '1rem'}}}}
                            >
                                {intl.abort}
                            </Button>
                            <Button onClick={() => {
                                if (selectedDisclosure)
                                    submitDeleteDisclosure && submitDeleteDisclosure(selectedDisclosure) ? setShowDeleteModal(false) : setShowDeleteModal(true)
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
