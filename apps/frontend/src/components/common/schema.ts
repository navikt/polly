import * as yup from "yup"
import { InformationtypeFormValues, LegalBasesStatus, LegalBasisFormValues, PolicyFormValues, PolicyInformationType, ProcessFormValues } from "../../constants"
import { intl } from "../../util"
import { Code, codelist } from "../../service/Codelist"

const DATE_REGEX = /\d{4}-\d{2}-\d{2}/
const max = 60

const maxError = () => intl.formatString(intl.maxChars, max) as string


export const infoTypeSchema = () => yup.object<InformationtypeFormValues>({
    name: yup.string().required(intl.required),
    term: yup.string(),
    sensitivity: yup.string().required(intl.required),
    categories: yup.array(yup.string()),
    sources: yup.array(yup.string()),
    keywords: yup.array(yup.string()),
    navMaster: yup.string(),
    description: yup.string().required(intl.required)
})

export const processSchema = () => yup.object<ProcessFormValues>({
    name: yup.string().max(max, maxError()).required(intl.required),
    department: yup.string(),
    subDepartment: yup.string(),
    legalBases: yup.array(legalBasisSchema()),
    start: yup.string().matches(DATE_REGEX, intl.dateFormat),
    end: yup.string().matches(DATE_REGEX, intl.dateFormat)
})

const missingArt9LegalBasisForSensitiveInfoType = (informationType: PolicyInformationType, policy: PolicyFormValues) => {
    const ownLegalBasis = policy.legalBasesStatus === LegalBasesStatus.OWN
    const reqArt9 = informationType && codelist.requiresArt9(informationType.sensitivity && informationType.sensitivity.code)
    const missingArt9 = !policy.legalBases.filter((lb) => codelist.isArt9(lb.gdpr)).length
    const processMissingArt9 = !policy.process.legalBases.filter(lb => codelist.isArt9(lb.gdpr.code)).length
    return ownLegalBasis && reqArt9 && missingArt9 && processMissingArt9
}

const missingArt6LegalBasisForInfoType = (policy: PolicyFormValues) => {
    const ownLegalBasis = policy.legalBasesStatus === LegalBasesStatus.OWN
    const missingArt6 = !policy.legalBases.filter((lb) => codelist.isArt6(lb.gdpr)).length
    return ownLegalBasis && missingArt6
}

export const policySchema = () => yup.object<PolicyFormValues>({
    informationType: yup.object<PolicyInformationType>().required(intl.required)
    .test({
        name: 'policyHasArt9',
        message: intl.requiredGdprArt9,
        test: function (informationType) {
            const {parent} = this
            return !missingArt9LegalBasisForSensitiveInfoType(informationType, parent)
        }
    }).test({
        name: 'policyHasArt6',
        message: intl.requiredGdprArt6,
        test: function (informationType) {
            const {parent} = this
            return !missingArt6LegalBasisForInfoType(parent)
        }
    }),
    subjectCategory: yup.string().required(intl.required),
    legalBasesStatus: yup.mixed().oneOf(Object.values(LegalBasesStatus)).required(intl.required),
    legalBases: yup.array(legalBasisSchema()),
    process: yup.object(),
    purposeCode: yup.string(),
    id: yup.string(),
    start: yup.string().matches(DATE_REGEX, intl.dateFormat),
    end: yup.string().matches(DATE_REGEX, intl.dateFormat)
})

export const legalBasisSchema = () => yup.object<LegalBasisFormValues>({
    gdpr: yup.string().required(intl.required),
    nationalLaw: yup.string().when('gdpr', {
        is: (gdprCode) => codelist.requiresNationalLaw(gdprCode),
        then: yup.string().required(intl.requiredNationalLaw),
        otherwise: yup.string()
    }),
    description: yup.string().when('gdpr', {
        is: (gdprCode) =>  codelist.requiresDescription(gdprCode),
        then: yup.string().required(intl.requiredDescription),
        otherwise: yup.string()
    }),
    start: yup.string().matches(DATE_REGEX, intl.dateFormat),
    end: yup.string().matches(DATE_REGEX, intl.dateFormat)
})

export const codeListSchema = () => yup.object<Code>({
    list: yup.mixed().required(intl.required),
    code: yup.string().required(intl.required),
    shortName: yup.string().required(intl.required),
    description: yup.string().required(intl.required),
});