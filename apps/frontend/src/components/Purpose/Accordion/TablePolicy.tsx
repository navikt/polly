import * as React from "react";
import { SortableHeadCell, StyledBody, StyledCell, StyledHead, StyledHeadCell, StyledRow, StyledTable } from "baseui/table";
import { useStyletron, withStyle } from "baseui";
import { Button, KIND, SIZE as ButtonSize } from "baseui/button";
import { Block } from "baseui/block";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faInfo, faInfoCircle, faTrash } from "@fortawesome/free-solid-svg-icons";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "baseui/modal";
import { Paragraph2 } from "baseui/typography";
import {PLACEMENT, StatefulTooltip} from "baseui/tooltip"

import { codelist, ListName } from "../../../service/Codelist"
import { Sensitivity } from "../../InformationType/Sensitivity"
import ModalPolicy from "./ModalPolicy";
import { LegalBasesNotClarified, ListLegalBasesInTable } from "../../common/LegalBasis"
import { Policy, policySort, Process } from "../../../constants"
import { intl, theme } from "../../../util"
import { convertPolicyToFormValues } from "../../../api"
import { useTable } from "../../../util/hooks"
import RouteLink from "../../common/RouteLink"
import { ActiveIndicator } from "../../common/Durations"
import { AuditButton } from "../../audit/AuditButton"


const StyledHeader = withStyle(StyledHead, {
    backgroundColor: "transparent",
    boxShadow: "none",
    borderBottom: "2px solid #E9E7E7"
});

type RowProps = {
    inactiveRow?: boolean,
    selectedRow?: boolean,
    infoRow?: boolean,
    children?: any
}

const CustomStyledRow = (props: RowProps) => {
    const styleProps = {
        borderLeft: "0px solid #E9E7E7",
        borderBottom: "1px solid #E9E7E7",
        padding: "8px",
        fontSize: "24px",
        opacity: props.inactiveRow ? '.5' : undefined,
        backgroundColor: props.infoRow ? theme.colors.accent50 : undefined,
        borderLeftWidth: props.infoRow || props.selectedRow ? theme.sizing.scale300 : undefined,
    }
    const Row = withStyle(StyledRow, styleProps)
    return <Row>{props.children}</Row>
}

const SmallerStyledCell = withStyle(StyledCell, {
    maxWidth: '15%'
})
const SmallerStyledHeadCell = withStyle(StyledHeadCell, {
    maxWidth: '15%'
})

type TablePurposeProps = {
    process: Process;
    hasAccess: boolean;
    errorPolicyModal: string | null;
    errorDeleteModal: string | null;
    submitEditPolicy: Function;
    submitDeletePolicy: Function;
};

const TablePolicy = ({process, hasAccess, errorPolicyModal, errorDeleteModal, submitEditPolicy, submitDeletePolicy}: TablePurposeProps) => {
    const [useCss, theme] = useStyletron();
    const [policies, setPolicies] = React.useState<Policy[]>(process.policies)
    const [currentPolicy, setCurrentPolicy] = React.useState<Policy>()
    const [showEditModal, setShowEditModal] = React.useState(false)
    const [showPolicyInfo, setShowPolicyInfo] = React.useState(false)
    const [showDeleteModal, setShowDeleteModal] = React.useState(false)
    const [table, sortColumn] = useTable<Policy, keyof Policy>(policies, {sorting: policySort, initialSortColumn: "informationType", showLast: (p) => !p.active})

    React.useEffect(() => {
        setPolicies(process ? process.policies : [])
    }, [process]);

    return (
        <React.Fragment>
            <StyledTable className={useCss({overflow: "hidden !important"})}>
                <StyledHeader>
                    <SortableHeadCell
                        title={intl.informationType}
                        direction={table.direction.informationType}
                        onSort={() => sortColumn('informationType')}
                        fillClickTarget
                    />
                    <SortableHeadCell
                        title={intl.subjectCategories}
                        direction={table.direction.subjectCategory}
                        onSort={() => sortColumn('subjectCategory')}
                        fillClickTarget
                    />
                    <SortableHeadCell
                        title={intl.legalBasisShort}
                        direction={table.direction.legalBases}
                        onSort={() => sortColumn('legalBases')}
                    />
                    <SmallerStyledHeadCell/>

                </StyledHeader>
                <StyledBody>
                    {table.data.map((row: Policy, index: number) => {
                        const selectedRow = row.id === currentPolicy?.id
                        return (
                            <React.Fragment key={index}>
                                <CustomStyledRow inactiveRow={!row.active} selectedRow={showPolicyInfo && selectedRow}>
                                    <StyledCell>
                                        <Sensitivity sensitivity={row.informationType.sensitivity}/>&nbsp;
                                        <RouteLink href={`/informationtype/${row.informationType.id}`} width="25%">
                                            {row.informationType.name}
                                        </RouteLink>
                                    </StyledCell>

                                    <StyledCell>{codelist.getShortname(ListName.SUBJECT_CATEGORY, row.subjectCategory.code)}</StyledCell>
                                    <StyledCell>
                                        {!row.legalBasesInherited && row.legalBases.length < 1 && (
                                            <LegalBasesNotClarified/>
                                        )}

                                        {row.legalBases && row.legalBases.length > 0 && (
                                            <ListLegalBasesInTable legalBases={row.legalBases}/>
                                        )}
                                    </StyledCell>
                                    <SmallerStyledCell>
                                        <Block display="flex" justifyContent="flex-end" width="100%">
                                            <StatefulTooltip content={intl.info} placement={PLACEMENT.top}>
                                                <Button
                                                    size={ButtonSize.compact}
                                                    kind={KIND.tertiary}
                                                    onClick={() => {
                                                        setCurrentPolicy(row)
                                                        setShowPolicyInfo(!selectedRow || !showPolicyInfo)
                                                    }}
                                                >
                                                    <FontAwesomeIcon icon={showPolicyInfo && selectedRow ? faInfoCircle : faInfo}/>
                                                </Button>
                                            </StatefulTooltip>
                                            {hasAccess && (
                                                <>
                                                    <StatefulTooltip content={intl.edit} placement={PLACEMENT.top}>
                                                        <Button
                                                            size={ButtonSize.compact}
                                                            kind={KIND.tertiary}
                                                            onClick={() => {
                                                                setCurrentPolicy(row)
                                                                setShowEditModal(true)
                                                            }}
                                                        >
                                                            <FontAwesomeIcon icon={faEdit}/>
                                                        </Button>
                                                    </StatefulTooltip>
                                                    <StatefulTooltip content={intl.delete} placement={PLACEMENT.top}>
                                                        <Button
                                                            size={ButtonSize.compact}
                                                            kind={KIND.tertiary}
                                                            onClick={() => {
                                                                setCurrentPolicy(row)
                                                                setShowDeleteModal(true)
                                                            }}
                                                        >
                                                            <FontAwesomeIcon icon={faTrash}/>
                                                        </Button>
                                                    </StatefulTooltip>
                                                </>
                                            )}
                                        </Block>
                                    </SmallerStyledCell>
                                </CustomStyledRow>
                                {showPolicyInfo && selectedRow &&
                                <CustomStyledRow infoRow={true}>
                                  <StyledCell>
                                    <Block display="flex" justifyContent="space-between" width="100%">
                                      <Block><ActiveIndicator {...row} alwaysShow={true} preText={intl.validityOfPolicy} showDates /></Block>
                                      <AuditButton id={row.id}/>
                                    </Block>
                                  </StyledCell>
                                </CustomStyledRow>
                                }
                            </React.Fragment>
                        )
                    })}
                </StyledBody>
                {showEditModal && currentPolicy && (
                    <ModalPolicy
                        title={intl.policyEdit}
                        initialValues={convertPolicyToFormValues(currentPolicy)}
                        onClose={() => {
                            setShowEditModal(false)
                        }}
                        isOpen={showEditModal}
                        isEdit={true}
                        submit={(values) => {
                            submitEditPolicy(values)
                        }}
                        errorOnCreate={errorPolicyModal}
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
                            <Paragraph2>{intl.confirmDeletePolicyText} {currentPolicy && currentPolicy.informationType.name}</Paragraph2>
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
                                    submitDeletePolicy(currentPolicy) ? setShowDeleteModal(false) : setShowDeleteModal(true)
                                }
                                }>{intl.delete}</Button>
                            </Block>
                        </ModalFooter>
                    </Modal>
                )}

            </StyledTable>

        </React.Fragment>
    );
};

export default TablePolicy;
