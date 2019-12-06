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
import {StyledLink} from 'baseui/link'
import {LegalBasesNotClarified, ListLegalBasesInTable} from "../common/LegalBasis"
import {codelist, ListName} from "../../service/Codelist"
import {Policy, PolicyFormValues} from "../../constants"
import {Sensitivity} from "../InformationType/Sensitivity"
import {Button, KIND, SIZE as ButtonSize} from "baseui/button";
import {Block} from "baseui/block";
import ModalPolicy from "./ModalPolicy";
import {intl} from "../../util/intl/intl"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEdit, faTrash} from "@fortawesome/free-solid-svg-icons";
import {Modal, ModalBody, ModalFooter, ModalHeader} from "baseui/modal";
import {Paragraph2} from "baseui/typography";

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


const SmallerStyledCell = withStyle(StyledCell, {
    maxWidth: '15%'
})
const SmallerStyledHeadCell = withStyle(StyledHeadCell, {
    maxWidth: '15%'
})

type TablePurposeProps = {
    policies: Array<any>;
    errorOnSubmitEdit: any;
    showEditModal: boolean;
    showDeleteModal: boolean;
    isLoggedIn: boolean;
    onSubmitEdit: Function;
    setShowEditModal: Function;
    setShowDeleteModal: Function;
    onDeletePolicy: Function;
};

const TablePurpose = ({ policies, onSubmitEdit, errorOnSubmitEdit, showEditModal, showDeleteModal, setShowEditModal, setShowDeleteModal, isLoggedIn, onDeletePolicy }: TablePurposeProps) => {
    const [useCss, theme] = useStyletron();
    const [currentPolicy, setCurrentPolicy] = React.useState()
    const [titleDirection, setTitleDirection] = React.useState<any>(null);
    const [userDirection, setUserDirection] = React.useState<any>(null);
    const [legalBasisDirection, setLegalBasisDirection] = React.useState<any>(null);

    const getInitialValuesModal = (policy: Policy): PolicyFormValues => {
        let parsedLegalBases = policy.legalBases && policy.legalBases.map((legalBasis: any) => ({
            gdpr: legalBasis.gdpr && legalBasis.gdpr.code,
            nationalLaw: (legalBasis.nationalLaw && legalBasis.nationalLaw.code) || undefined,
            description: legalBasis.description || undefined,
            start: legalBasis.start || undefined,
            end: legalBasis.end || undefined
        }))

        return {
            id: policy.id,
            process: policy.process,
            purposeCode: policy.purposeCode.code,
            informationType: policy.informationType,
            subjectCategory: policy.subjectCategory ? policy.subjectCategory.code : '',
            legalBasesInherited: policy.legalBasesInherited,
            legalBases: parsedLegalBases
        }
    }

    const handleSort = (title: string, prevDirection: string) => {
        let nextDirection = null;
        if (prevDirection === "ASC") nextDirection = "DESC";

        if (prevDirection === "DESC") nextDirection = "ASC";

        if (prevDirection === null) nextDirection = "ASC";

        if (title === intl.informationType) {
            setTitleDirection(nextDirection);
            setUserDirection(null)
            setLegalBasisDirection(null);
        }

        if (title === intl.subjectCategories) {
            setTitleDirection(null);
            setUserDirection(nextDirection)
            setLegalBasisDirection(null);
        }

        if (title === intl.legalBasisShort) {
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
                        title={intl.informationType}
                        direction={titleDirection}
                        onSort={() => handleSort(intl.informationType, titleDirection)}
                        fillClickTarget
                    />
                    <SortableHeadCell
                        title={intl.subjectCategories}
                        direction={userDirection}
                        onSort={() => handleSort(intl.subjectCategories, userDirection)}
                        fillClickTarget
                    />
                    <SortableHeadCell
                        title={intl.legalBasisShort}
                        direction={legalBasisDirection}
                        onSort={() => handleSort(intl.legalBasisShort, legalBasisDirection)}
                    />
                    {isLoggedIn && <SmallerStyledHeadCell></SmallerStyledHeadCell>}

                </StyledHeader>
                <StyledBody>
                    {getSortedData().map((row: Policy, index: number) => (
                        <CustomStyledRow key={index} >
                            <StyledCell>
                                <Sensitivity sensitivity={row.informationType.sensitivity} />&nbsp;
                                <StyledLink href={`/informationtype/${row.informationType.id}`} width="25%">
                                    {row.informationType.name}
                                </StyledLink>
                            </StyledCell>

                            <StyledCell>{codelist.getShortname(ListName.SUBJECT_CATEGORY, row.subjectCategory.code)}</StyledCell>
                            <StyledCell>
                                {!row.legalBasesInherited && row.legalBases.length < 1 && (
                                    <LegalBasesNotClarified />
                                )}

                                {row.legalBases && row.legalBases.length > 0 && (
                                    <ListLegalBasesInTable legalBases={row.legalBases} />
                                )}
                            </StyledCell>
                            {isLoggedIn && (
                                <SmallerStyledCell>
                                    <Block display="flex" justifyContent="flex-end" width="100%">
                                        <Button
                                            size={ButtonSize.compact}
                                            kind={KIND.tertiary}
                                            onClick={() => {
                                                setCurrentPolicy(row)
                                                setShowEditModal(true)
                                            }}
                                        >
                                            <FontAwesomeIcon icon={faEdit} />
                                        </Button>
                                        <Button
                                            size={ButtonSize.compact}
                                            kind={KIND.tertiary}
                                            onClick={() => {
                                                setCurrentPolicy(row)
                                                setShowDeleteModal(true)
                                            }}
                                        >
                                            <FontAwesomeIcon icon={faTrash} />
                                        </Button>
                                    </Block>
                                </SmallerStyledCell>
                            )}
                        </CustomStyledRow>
                    ))}
                </StyledBody>
                {showEditModal && (
                    <ModalPolicy
                        title={intl.policyEdit}
                        initialValues={getInitialValuesModal(currentPolicy)}
                        onClose={() => { setShowEditModal(false) }}
                        isOpen={showEditModal}
                        isEdit={true}
                        submit={(values: any) => {
                            onSubmitEdit(values)
                        }}
                        errorOnCreate={errorOnSubmitEdit}
                    />
                )}

                {showDeleteModal && (
                    <Modal
                        onClose={() => setShowDeleteModal(false)}
                        isOpen={showDeleteModal}
                        animate
                        size="default"
                    >
                        <ModalHeader>{intl.confirmDeletePolicyHeader}</ModalHeader>
                        <ModalBody>
                            <Paragraph2>{intl.confirmDeletePolicyText} {currentPolicy.informationType.name}</Paragraph2>
                        </ModalBody>

                        <ModalFooter>
                            <Button
                                kind="secondary"
                                onClick={() => setShowDeleteModal(false)}
                                overrides={{ BaseButton: { style: { marginRight: '1rem' } } }}
                            >
                                {intl.abort}
                            </Button>
                            <Button onClick={() => {
                                onDeletePolicy(currentPolicy)
                            }
                            }>{intl.delete}</Button>
                        </ModalFooter>
                    </Modal>
                )}

            </StyledTable>

        </React.Fragment>
    );
};

export default TablePurpose;
