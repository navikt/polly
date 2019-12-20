import * as React from "react"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faEdit, faExclamation, faTrash} from "@fortawesome/free-solid-svg-icons"
import {ARTWORK_SIZES, ListItem, ListItemLabel} from "baseui/list";
import {Block} from 'baseui/block'
import {Button} from "baseui/button"

import {LegalBasis, LegalBasisFormValues} from "../../constants"
import {codelist, ListName} from "../../service/Codelist"
import {processString} from "../../util/string-processor"
import {intl, theme} from "../../util"
import {ActiveIndicator} from "./Durations"
import {StyledLink} from "baseui/link"

const lovdata_base = process.env.REACT_APP_LOVDATA_BASE_URL;

export const LegalBasisView = (props: { legalBasis?: LegalBasis, legalBasisForm?: LegalBasisFormValues }) => {
    const input = props.legalBasis ? props.legalBasis : props.legalBasisForm;
    if (!input) return null;
    const {start, end, description} = input;
    const gdpr = props.legalBasis ? props.legalBasis.gdpr.code : props.legalBasisForm!.gdpr;
    const nationalLaw = props.legalBasis ? props.legalBasis?.nationalLaw?.code : props.legalBasisForm!.nationalLaw;

    let gdprDisplay = gdpr && codelist.getShortname(ListName.GDPR_ARTICLE, gdpr);
    let nationalLawDisplay = nationalLaw && codelist.getShortname(ListName.NATIONAL_LAW, nationalLaw);
    let nationalLawId = nationalLaw && codelist.valid(ListName.NATIONAL_LAW, nationalLaw) && codelist.getDescription(ListName.NATIONAL_LAW, nationalLaw);

    let descriptionText = nationalLawId ? legalBasisLinkProcessor(nationalLawId, description) : description;

    return (
        <span><ActiveIndicator start={start} end={end}/> {gdprDisplay}{(nationalLawDisplay || descriptionText) && ', '} {nationalLawDisplay && nationalLawDisplay} {descriptionText}</span>
    )
};

const legalBasisLinkProcessor = (law: string, text?: string) => processString([
    {
        regex: /(§+)\s?(\d+(-\d+)?)/g,
        fn: (key: string, result: string[]) =>
            <StyledLink key={key} href={`${lovdata_base + codelist.getDescription(ListName.NATIONAL_LAW, law)}/§${result[2]}`} target="_blank" rel="noopener noreferrer">
                {result[1]} {result[2]}
            </StyledLink>
    }, {
        regex: /kap(ittel)?\s?(\d+)/gi,
        fn: (key: string, result: string[]) =>
            <StyledLink key={key} href={`${lovdata_base + codelist.getDescription(ListName.NATIONAL_LAW, law)}/KAPITTEL_${result[2]}`} target="_blank" rel="noopener noreferrer">
                Kapittel {result[2]}
            </StyledLink>
    }
])(text);

export const LegalBasesNotClarified = () => {
    return (
        <Block display="flex" color={theme.colors.warning400}>
            <span><FontAwesomeIcon icon={faExclamation} color={theme.colors.warning400}/>&nbsp;</span>
            {intl.legalBasesUndecidedWarning}
        </Block>

    )
};

export const ListLegalBases = (
    props: {
        legalBases?: LegalBasisFormValues[],
        onRemove: (index: number) => void,
        onEdit:(index:number) => void},) => {
    const {legalBases, onRemove, onEdit} = props;
    if (!legalBases) return null;
    return (
        <React.Fragment>
            {legalBases.map((legalBasis: LegalBasisFormValues, i: number) => (
                <ListItem
                    artworkSize={ARTWORK_SIZES.SMALL}
                    endEnhancer={
                        () =>
                            <Block>
                                <Button
                                    type="button"
                                    kind="minimal"
                                    size="compact"
                                    onClick={() => {
                                        onEdit(i);
                                    }}
                                >
                                    <FontAwesomeIcon icon={faEdit}/>
                                </Button>
                                <Button
                                    type="button"
                                    kind="minimal"
                                    size="compact"
                                    onClick={() => onRemove(i)}
                                >
                                    <FontAwesomeIcon icon={faTrash}/>
                                </Button>
                            </Block>
                    }
                    sublist
                    key={i}
                >
                    <ListItemLabel sublist>
                        <LegalBasisView legalBasisForm={legalBasis}/>
                    </ListItemLabel>
                </ListItem>
            ))}
        </React.Fragment>
    )
};

export const ListLegalBasesInTable = (props: { legalBases: LegalBasis[] }) => {
    const {legalBases} = props;
    return (
        <Block>
            <ul style={{listStyle: "none", paddingInlineStart: 0}}>
                {legalBases.map((legalBasis, i) => (
                    <Block marginBottom="8px" key={i}>
                        <li><LegalBasisView legalBasis={legalBasis}/></li>
                    </Block>
                ))}
            </ul>
        </Block>
    )
};