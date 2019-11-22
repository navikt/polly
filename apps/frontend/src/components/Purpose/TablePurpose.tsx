import * as React from "react";
import { SORT_DIRECTION, SortableHeadCell, StyledBody, StyledCell, StyledHead, StyledRow, StyledTable, StyledSortableLabel, StyledHeadCell } from "baseui/table";
import { useStyletron, withStyle } from "baseui";
import { StyledLink } from 'baseui/link'
import { renderLegalBasis, LegalBasesNotClarified } from "../../util/LegalBasis"
import { codelist, ListName } from "../../service/Codelist"
import { Policy } from "../../constants"
import { Sensitivity } from "../InformationType/Sensitivity"
import { Button, SIZE as ButtonSize, KIND } from "baseui/button";
import { Block } from "baseui/block";
import ModalPolicy, { PolicyFormValues } from "./ModalPolicy";
import { intl } from "../../util/intl"

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
    onSubmitEdit: Function;
    errorOnSubmitEdit: any;
    showEditModal: boolean;
    setShowEditModal: Function;
};



const TablePurpose = ({ policies, onSubmitEdit, errorOnSubmitEdit, showEditModal, setShowEditModal }: TablePurposeProps) => {
    const [useCss, theme] = useStyletron();
    const [currentPolicy, setCurrentPolicy] = React.useState()
    const [titleDirection, setTitleDirection] = React.useState<any>(null);
    const [userDirection, setUserDirection] = React.useState<any>(null);
    const [legalBasisDirection, setLegalBasisDirection] = React.useState<any>(null);

    const getInitialValuesModal = (policy: any): PolicyFormValues => {
        let parsedLegalBases = policy.legalBases && policy.legalBases.map((legalBasis: any) => ({
            gdpr: legalBasis.gdpr && legalBasis.gdpr.code,
            nationalLaw: legalBasis.nationalLaw && legalBasis.nationalLaw.code,
            description: legalBasis.description
        }))

        return {
            id: policy.id,
            process: policy.process.name,
            purposeCode: policy.purposeCode.code,
            informationTypeName: policy.informationType.name,
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

        if (title === "Opplysningstype") {
            setTitleDirection(nextDirection);
            setUserDirection(null)
            setLegalBasisDirection(null);
        }

        if (title === "Personkategori") {
            setTitleDirection(null);
            setUserDirection(nextDirection)
            setLegalBasisDirection(null);
        }

        if (title === "Rettslig Grunnlag") {
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
                        onSort={() => handleSort('Opplysningstype', titleDirection)}
                        fillClickTarget
                    />
                    <SortableHeadCell
                        title={intl.subjectCategories}
                        direction={userDirection}
                        onSort={() => handleSort('Personkategori', userDirection)}
                        fillClickTarget
                    />
                    <SortableHeadCell
                        title={intl.legalBasisShort}
                        direction={legalBasisDirection}
                        onSort={() => handleSort('Rettslig Grunnlag', legalBasisDirection)}
                    />
                    <SmallerStyledHeadCell></SmallerStyledHeadCell>
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
                                    <Block display="flex" color={theme.colors.warning400}>
                                        <LegalBasesNotClarified />&nbsp;
                                        Rettslig grunnlag er ikke avklart
                                    </Block>
                                )}

                                {row.legalBases && row.legalBases.length > 0 && (
                                    <Block>
                                        {
                                            row.legalBases.map((legalBasis: any, i: number) => (
                                                <li key={i}> {renderLegalBasis(legalBasis)}</li>
                                            ))
                                        }
                                    </Block>

                                )}
                            </StyledCell>
                            <SmallerStyledCell>
                                <Block display="flex" justifyContent="flex-end" width="100%">
                                    <Button
                                        size={ButtonSize.compact}
                                        kind={KIND.secondary}
                                        onClick={() => {
                                            setCurrentPolicy(row)
                                            setShowEditModal(true)
                                        }}
                                    >
                                        {intl.edit}
                                    </Button>
                                </Block>
                            </SmallerStyledCell>
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

            </StyledTable>

        </React.Fragment>
    );
};

export default TablePurpose;
