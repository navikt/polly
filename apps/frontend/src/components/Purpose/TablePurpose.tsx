import * as React from "react";
import { SORT_DIRECTION, SortableHeadCell, StyledBody, StyledCell, StyledHead, StyledRow, StyledTable, StyledSortableLabel, StyledHeadCell } from "baseui/table";
import { useStyletron, withStyle } from "baseui";
import { StyledLink } from 'baseui/link'
import { LegalBasesNotClarified, ListLegalBasesInTable } from "../common/LegalBasis"
import { codelist, ListName } from "../../service/Codelist"
import { LegalBasesStatus, LegalBasis, Policy, PolicyFormValues, Process } from "../../constants"
import { Sensitivity } from "../InformationType/Sensitivity"
import { Button, SIZE as ButtonSize, KIND } from "baseui/button";
import { Block } from "baseui/block";
import ModalPolicy from "./ModalPolicy";
import { intl } from "../../util"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faPoop, faTrash } from "@fortawesome/free-solid-svg-icons";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "baseui/modal";
import { Paragraph2 } from "baseui/typography";
import axios from "axios";
import { useForceUpdate } from "../../util";

const server_polly = process.env.REACT_APP_POLLY_ENDPOINT;

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
    process: Process;
    isLoggedIn: boolean;
    updateProcess: Function;
};

const TablePurpose = ({ process, isLoggedIn, updateProcess }: TablePurposeProps) => {
    const [useCss, theme] = useStyletron();
    const [policies, setPolicies] = React.useState<Policy[]>(process.policies)
    const [currentPolicy, setCurrentPolicy] = React.useState()
    const [titleDirection, setTitleDirection] = React.useState<any>(null);
    const [userDirection, setUserDirection] = React.useState<any>(null);
    const [legalBasisDirection, setLegalBasisDirection] = React.useState<any>(null);
    const [showEditModal, setShowEditModal] = React.useState(false)
    const [errorEditModal, setErrorEditModal] = React.useState(false)
    const [showDeleteModal, setShowDeleteModal] = React.useState(false)
    const [errorDeleteModal, setErrorDeleteModal] = React.useState(false)

    const update = useForceUpdate()

    function mapPolicyFromForm(values: PolicyFormValues) {
        return {
            ...values,
            informationType: undefined,
            informationTypeName: values.informationType && values.informationType.name,
            process: values.process.name,
            legalBases: values.legalBasesStatus !== LegalBasesStatus.OWN ? [] : values.legalBases,
            legalBasesInherited: values.legalBasesStatus === LegalBasesStatus.INHERITED,
            legalBasesStatus: undefined
        }
    }

    const getInitialLegalBasesStatus = (legalBasesInherited: boolean, legalBases: LegalBasis[]) => {
        if (legalBasesInherited) return LegalBasesStatus.INHERITED
        else {
            if (!legalBases || !legalBases.length) return LegalBasesStatus.UNKNOWN
            return LegalBasesStatus.OWN
        }
    }

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
            legalBasesStatus: getInitialLegalBasesStatus(policy.legalBasesInherited, policy.legalBases),
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

    const getSortedData = (policyList: Policy[]) => {
        if (titleDirection) {
            const sorted = policyList
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
            const sorted = policyList
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
            const sorted = policyList
                .slice(0)
                .sort((a: any, b: any) => a[1] - b[1]);
            if (legalBasisDirection === SORT_DIRECTION.ASC) {
                return sorted;
            }
            if (legalBasisDirection === SORT_DIRECTION.DESC) {
                return sorted.reverse();
            }
        }

        return policyList;
    };

    const handleEditPolicy = async (values: any) => {
        let body = [mapPolicyFromForm(values)]
        await axios
            .put(`${server_polly}/policy`, body)
            .then(((res: any) => {
                setPolicies([...policies.filter((policy: Policy) => policy.id !== res.data.content[0].id), res.data.content[0]])
                setShowEditModal(false)
            }))
            .catch((err: any) => {
                setShowEditModal(true)
                setErrorEditModal(err.message)
            });
    }

    const handleDeletePolicy = async (policy: Policy) => {
        await axios
            .delete(`${server_polly}/policy/${policy.id}`)
            .then(((res: any) => {
                setPolicies(policies.filter((p: Policy) => p.id !== policy.id))
                setShowDeleteModal(false)
            }))
            .catch((err: any) => {
                setShowDeleteModal(true)
                setErrorDeleteModal(err.message)
            });
    }

    React.useEffect(() => {
        setPolicies(process ? process.policies : [])
    }, [process]);

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
                    {getSortedData(policies).map((row: Policy, index: number) => (
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
                            handleEditPolicy(values)
                        }}
                        errorOnCreate={errorEditModal}
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
                            <Block display="flex" justifyContent="flex-end">
                                <Block alignSelf="flex-end">{errorDeleteModal && <p>{errorDeleteModal}</p>}</Block>
                                <Button
                                    kind="secondary"
                                    onClick={() => setShowDeleteModal(false)}
                                    overrides={{ BaseButton: { style: { marginRight: '1rem', marginLeft: '1rem' } } }}
                                >
                                    {intl.abort}
                                </Button>
                                <Button onClick={() => {
                                    handleDeletePolicy(currentPolicy)
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

export default TablePurpose;
