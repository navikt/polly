import * as React from "react";
import { SortableHeadCell, StyledBody, StyledCell, StyledHead, StyledRow, StyledTable, StyledHeadCell } from "baseui/table";
import { useStyletron, withStyle } from "baseui";

import { ListLegalBasesInTable } from "./LegalBasis"
import { intl } from "../../util"
import { Disclosure, disclosureSort, InformationType, DisclosureFormValues, LegalBasis, LegalBasisFormValues, DocumentFormValues } from "../../constants"
import { useTable } from "../../util/hooks"
import RouteLink from "./RouteLink"
import { StatefulTooltip } from "baseui/tooltip";
import { Button, SIZE, KIND } from "baseui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "baseui/modal";
import { Paragraph2 } from "baseui/typography";
import { Block } from "baseui/block";
import ModalThirdParty from "../ThirdParty/ModalThirdPartyForm";

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
    editable: boolean;
    submitDeleteDisclosure?: Function;
    submitEditDisclosure?: Function;
    errorModal?: string | undefined;
    onCloseModal?: Function;
};

const TableDisclosure = ({list, showRecipient, submitDeleteDisclosure, submitEditDisclosure, errorModal, editable, onCloseModal}: TableDisclosureProps) => {
    const [showDeleteModal, setShowDeleteModal] = React.useState<boolean>(false)
    const [showEditModal, setShowEditModal] = React.useState<boolean>()
    const [selectedDisclosure, setSelectedDisclosure] = React.useState<Disclosure>()

    const [table, sortColumn] = useTable<Disclosure, keyof Disclosure>(list, {sorting: disclosureSort, initialSortColumn: "recipient"})
    const [useCss, theme] = useStyletron();

    const mapLegalBasesToFormValues = (legalBases: LegalBasis[]) => {
        return legalBases.map((lb: LegalBasis) => (
            {
                gdpr: lb.gdpr && lb.gdpr.shortName,
                nationalLaw: lb.nationalLaw && lb.nationalLaw,
                description: lb.description,
                start: lb.start && lb.start,
                end: lb.end && lb.end
            } as LegalBasisFormValues
        ))
    }

    const initialFormValues: DisclosureFormValues = {
        id: selectedDisclosure && selectedDisclosure.id,
        recipient: selectedDisclosure ? selectedDisclosure.recipient.shortName : '',
        description: selectedDisclosure ? selectedDisclosure.description : '',
        document: selectedDisclosure && selectedDisclosure.document ? selectedDisclosure.document : {informationTypes: [], name: 'autosel', description: 'autodesc'},
        legalBases: selectedDisclosure ? mapLegalBasesToFormValues(selectedDisclosure.legalBases) : [],
        start: selectedDisclosure && selectedDisclosure.start,
        end: selectedDisclosure && selectedDisclosure.end
    }

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
                        title={intl.informationTypes}
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
                            <StyledCell>{renderInformationTypesInCell(row.document?.informationTypes || [])}</StyledCell>
                            <StyledCell>{row.description}</StyledCell>
                            <StyledCell>
                                {row.legalBases && (
                                    <ListLegalBasesInTable legalBases={row.legalBases}/>
                                )}
                            </StyledCell>
                            {editable && (
                                <SmallerStyledCell>
                                    <Block width="100%" display="flex" justifyContent="flex-end">
                                        <StatefulTooltip content={intl.edit}>
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

                                        <StatefulTooltip content={intl.delete}>
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

            {editable && showEditModal && (
                <ModalThirdParty
                    title="Rediger utlevering"
                    isOpen={showEditModal}
                    isEdit={true}
                    initialValues={initialFormValues}
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