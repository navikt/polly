import * as yup from "yup"
import {
  AddDocumentToProcessFormValues,
  DisclosureFormValues,
  Document,
  DocumentInfoTypeUse,
  InformationtypeFormValues,
  LegalBasesStatus,
  LegalBasisFormValues,
  PolicyFormValues,
  PolicyInformationType,
  Process,
  ProcessFormValues
} from "../../constants"
import { intl } from "../../util"
import { Code, codelist } from "../../service/Codelist"

const DATE_REGEX = /\d{4}-\d{2}-\d{2}/
const max = 150

const maxError = () => intl.formatString(intl.maxChars, max) as string


export const infoTypeSchema = () => yup.object<InformationtypeFormValues>({
    name: yup.string().required(intl.required).max(max, maxError()),
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
    description: yup.string(),
    department: yup.string(),
    subDepartment: yup.string(),
    productTeam: yup.string(),
    legalBases: yup.array(legalBasisSchema()),
    legalBasesOpen: yup.boolean().oneOf([false], intl.legalBasisComplete),
    start: yup.string().matches(DATE_REGEX, intl.dateFormat),
    end: yup.string().matches(DATE_REGEX, intl.dateFormat),
    automaticProcessing: yup.boolean(),
    profiling: yup.boolean(),
    dataProcessor: yup.boolean(),
    dataProcessorAgreement: yup.string(),
    dataProcessorOutsideEU: yup.boolean(),
})

const missingArt9LegalBasisForSensitiveInfoType = (informationType: PolicyInformationType, policy: PolicyFormValues) => {
    const ownLegalBasis = policy.legalBasesStatus !== LegalBasesStatus.UNKNOWN
    const reqArt9 = informationType && codelist.requiresArt9(informationType.sensitivity && informationType.sensitivity.code)
    const missingArt9 = !policy.legalBases.filter((lb) => codelist.isArt9(lb.gdpr)).length
    const processMissingArt9 = !policy.process.legalBases.filter(lb => codelist.isArt9(lb.gdpr.code)).length
    return ownLegalBasis && reqArt9 && missingArt9 && processMissingArt9
}

const missingArt6LegalBasisForInfoType = (policy: PolicyFormValues) => {
    const ownLegalBasis = policy.legalBasesStatus !== LegalBasesStatus.UNKNOWN
    const missingArt6 = !policy.legalBases.filter((lb) => codelist.isArt6(lb.gdpr)).length
    const processMissingArt6 = !policy.process.legalBases.filter(lb => codelist.isArt6(lb.gdpr.code)).length
    return ownLegalBasis && missingArt6 && processMissingArt6
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
        test: function () {
            const {parent} = this
            return !missingArt6LegalBasisForInfoType(parent)
        }
    }),
    subjectCategories: yup.array().of(yup.string()).min(1, intl.required),
    legalBasesStatus: yup.mixed().oneOf(Object.values(LegalBasesStatus)).required(intl.required),
    legalBases: yup.array(legalBasisSchema()),
    legalBasesOpen: yup.boolean().oneOf([false], intl.legalBasisComplete),
    process: yup.object(),
    purposeCode: yup.string(),
    id: yup.string(),
    start: yup.string().matches(DATE_REGEX, intl.dateFormat),
    end: yup.string().matches(DATE_REGEX, intl.dateFormat),
    documentIds: yup.array(yup.string())
})

export const legalBasisSchema = () => yup.object<LegalBasisFormValues>({
    gdpr: yup.string().required(intl.required),
    nationalLaw: yup.string().when('gdpr', {
        is: (gdprCode) => codelist.requiresNationalLaw(gdprCode),
        then: yup.string().required(intl.requiredNationalLaw),
        otherwise: yup.string()
    }),
    description: yup.string().when('gdpr', {
        is: (gdprCode) => codelist.requiresDescription(gdprCode),
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

export const disclosureSchema = () => yup.object<DisclosureFormValues>({
    id: yup.string(),
    recipient: yup.string(),
    description: yup.string().required(intl.required),
    legalBases: yup.array(legalBasisSchema()),
    legalBasesOpen: yup.boolean().oneOf([false], intl.legalBasisComplete),
    start: yup.string().matches(DATE_REGEX, intl.dateFormat),
    end: yup.string().matches(DATE_REGEX, intl.dateFormat)
})

export const addDocumentToProcessSchema = () => yup.object<AddDocumentToProcessFormValues>({
  document: yup.object<Document>().required(intl.required),
  informationTypes: yup.array(yup.object<DocumentInfoTypeUse>()).required(intl.required),
  process: yup.object<Process>().required(intl.required)
})
