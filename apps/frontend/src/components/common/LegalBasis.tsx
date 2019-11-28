import * as React from "react"
import { LegalBasis, LegalBasisFormValues } from "../../constants"
import { codelist, ListName } from "../../service/Codelist"
import { processString } from "../../util/string-processor"
import { theme } from "../../util/theme"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faExclamation, faTrash } from "@fortawesome/free-solid-svg-icons"
import { Block } from 'baseui/block'
import { intl } from '../../util/intl/intl'
import { ARTWORK_SIZES, ListItem, ListItemLabel } from "baseui/list";
import * as yup from "yup"
import { Button } from "baseui/button"

const lovdata_base = process.env.REACT_APP_LOVDATA_BASE_URL;

export const renderLegalBasis = (legalBasis: LegalBasis) => {
    let gdpr = codelist.getShortname(ListName.GDPR_ARTICLE, legalBasis.gdpr.code)
    let nationalLaw = legalBasis.nationalLaw && codelist.getShortname(ListName.NATIONAL_LAW, legalBasis.nationalLaw.code)
    let nationalLawId = legalBasis.nationalLaw && !legalBasis.nationalLaw.invalidCode && codelist.getDescription(ListName.NATIONAL_LAW, legalBasis.nationalLaw.code)

    let description = nationalLawId ? legalBasisLinkProcessor(nationalLawId, legalBasis.description) : legalBasis.description

    return (
        <span> {gdpr + ', '} {nationalLaw && nationalLaw} {description}</span>
    )
}

const legalBasisLinkProcessor = (law: string, text: string) => processString([
    {
        regex: /(§+).?(\d+(-\d+)?)/g,
        fn: (key: string, result: string[]) =>
            <a key={key} href={`${lovdata_base + codelist.getDescription(ListName.NATIONAL_LAW, law)}/§${result[2]}`} target="_blank" rel="noopener noreferrer">
                {result[1]} {result[2]}
            </a>
    }, {
        regex: /kap(ittel)?.?(\d+)/gi,
        fn: (key: string, result: string[]) =>
            <a key={key} href={`${lovdata_base + codelist.getDescription(ListName.NATIONAL_LAW, law)}/KAPITTEL_${result[2]}`} target="_blank" rel="noopener noreferrer">
                Kapittel {result[2]}
            </a>
    }
])(text)

export const LegalBasesNotClarified = () => {
    return (
        <Block display="flex" color={theme.colors.warning400}>
            <span><FontAwesomeIcon icon={faExclamation} color={theme.colors.warning400}/>&nbsp;</span>
            {intl.legalBasesUndecidedWarning}
        </Block>

    )
}

export const ListLegalBases = (props: { legalBases?: LegalBasisFormValues[], onRemove: Function }) => {
    const {legalBases, onRemove} = props
    if (!legalBases) return null
    return (
        <React.Fragment>
            {legalBases.map((legalBase: any, i: number) => (
                <ListItem
                    artworkSize={ARTWORK_SIZES.SMALL}
                    endEnhancer={() => <Button type="button" kind="minimal" size="compact" onClick={() => onRemove(i)}><FontAwesomeIcon icon={faTrash}/></Button>}
                    sublist
                >
                    <ListItemLabel sublist>
                        {legalBase.gdpr && codelist.getShortname(ListName.GDPR_ARTICLE, legalBase.gdpr) + ": "}
                        {legalBase.nationalLaw && codelist.getShortname(ListName.NATIONAL_LAW, legalBase.nationalLaw) + ' '}
                        {legalBase.description}
                    </ListItemLabel>
                </ListItem>
            ))}
        </React.Fragment>
    )
}


export const ListLegalBasesInTable = (props: { legalBases: LegalBasis[] }) => {
    const {legalBases} = props
    return (
        <Block>
            {legalBases.map((legalBasis: any, i: number) => (
                <Block marginBottom="8px">
                    <li key={i}> {renderLegalBasis(legalBasis)}</li>
                </Block>
            ))}
        </Block>

    )
}

export const legalBasisSchema = () => yup.object({
    gdpr: yup.string().required(intl.required),
    nationalLaw: yup.string(),
    description: yup.string().required(intl.required),
})