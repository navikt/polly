import * as yup from 'yup'
import {
  AddDocumentToProcessFormValues,
  AffiliationFormValues,
  CreateDocumentFormValues,
  CustomizedProcess,
  DataProcessingFormValues,
  Disclosure,
  DisclosureAbroad,
  DisclosureFormValues,
  DocumentInfoTypeUse,
  DpProcessFormValues,
  InformationtypeFormValues,
  InformationTypeShort,
  LegalBasesUse,
  LegalBasis,
  LegalBasisFormValues,
  Policy,
  PolicyFormValues,
  ProcessFormValues,
  ProcessorFormValues,
  ProcessStatus,
  TRANSFER_GROUNDS_OUTSIDE_EU_OTHER,
} from '../../constants'
import {intl} from '../../util'
import {Code, codelist, ListName} from '../../service/Codelist'

const DATE_REGEX = /\d{4}-\d{2}-\d{2}/
const max = 150

const maxError = () => intl.formatString(intl.maxChars, max) as string

function ignore<T>(): yup.Schema<T> {
  return yup.object() as any as yup.Schema<T>
}

export const infoTypeSchema: () => yup.ObjectSchema<InformationtypeFormValues> = () =>
  yup.object({
    id: yup.string(),
    name: yup.string().required(intl.required).max(max, maxError()),
    term: yup.string(),
    sensitivity: yup.string().required(intl.required),
    categories: yup.array().of(yup.string().required()).min(1, intl.required).required(),
    sources: yup.array().of(yup.string().required()).required(),
    productTeams: yup.array().of(yup.string().required()).required(),
    keywords: yup.array().of(yup.string().required()).required(),
    orgMaster: yup.string(),
    description: yup.string(),
  })

const dataProcessingSchema: () => yup.ObjectSchema<DataProcessingFormValues> = () =>
  yup.object({
    dataProcessor: yup.boolean(),
    processors: yup.array().of(yup.string().required()).required(),
  })

const dpDataProcessingSchema: () => yup.ObjectSchema<DataProcessingFormValues> = () =>
  yup.object({
    dataProcessor: yup.boolean(),
    processors: yup.array().of(yup.string().required()).required(),
  })

export const dataProcessorSchema: () => yup.ObjectSchema<ProcessorFormValues> = () =>
  yup.object({
    id: yup.string(),
    name: yup.string().max(max, maxError()).required(intl.required),
    contractOwner: yup.string(),
    operationalContractManagers: yup.array().of(yup.string().required()).required(),
    note: yup.string(),
    contract: yup.string(),
    outsideEU: yup.boolean(),
    transferGroundsOutsideEU: yup.string().test({
      name: 'transferGrounds',
      message: intl.required,
      test: function () {
        const { parent } = this
        return !transferGroundsOutsideEUMissing(parent)
      },
    }),
    transferGroundsOutsideEUOther: yup.string().test({
      name: 'transferGroundsOther',
      message: intl.required,
      test: function () {
        const { parent } = this
        return !transferGroundsOutsideEUOtherMissing(parent)
      },
    }),
    countries: yup
      .array()
      .of(yup.string().required())
      .required()
      .test({
        name: 'transferCountries',
        test: function () {
          const { parent } = this
          const error = transferCountriesMissing(parent)
          if (!error) return true
          return this.createError({
            path: 'countries',
            message: intl.required,
          })
        },
      }),
  })

const transferGroundsOutsideEUMissing = (values: ProcessorFormValues) => {
  return !!values.outsideEU && !values.transferGroundsOutsideEU
}

const transferCountriesMissing = (values: ProcessorFormValues) => {
  return !!values.outsideEU && !values.countries?.length
}

const transferGroundsOutsideEUOtherMissing = (values: ProcessorFormValues) => {
  return values.transferGroundsOutsideEU === TRANSFER_GROUNDS_OUTSIDE_EU_OTHER && !values.transferGroundsOutsideEUOther
}

export const processSchema: () => yup.ObjectSchema<ProcessFormValues> = () =>
  yup.object({
    id: yup.string(),
    name: yup.string().max(max, maxError()).required(intl.required),
    purposes: yup
      .array()
      .of(
        yup
          .string()
          .oneOf(
            codelist.getCodes(ListName.PURPOSE).map((p) => p.code),
            intl.required,
          )
          .required(),
      )
      .min(1, intl.required)
      .required(),
    description: yup.string(),
    additionalDescription: yup.string(),
    affiliation: yup.object({
      department: yup.string(),
      subDepartments: yup.array().of(yup.string().required()).required(),
      productTeams: yup.array().of(yup.string().required()).required(),
      products: yup.array().of(yup.string().required()).required(),
      disclosureDispatchers: yup.array().of(yup.string().required()).required(),
    }),
    commonExternalProcessResponsible: yup.string(),
    legalBases: yup.array().of(legalBasisSchema().required()).required(),
    legalBasesOpen: yup.boolean().oneOf([false], intl.legalBasisComplete).required(),
    start: yup.string().matches(DATE_REGEX, { message: intl.dateFormat }),
    end: yup.string().matches(DATE_REGEX, { message: intl.dateFormat }),
    automaticProcessing: yup.boolean(),
    usesAllInformationTypes: yup.boolean(),
    profiling: yup.boolean(),
    dataProcessing: dataProcessingSchema(),
    retention: yup.object({
      retentionPlan: yup.boolean(),
      retentionMonths: yup.number(),
      retentionStart: yup.string(),
      retentionDescription: yup.string(),
    }),
    status: yup.mixed<ProcessStatus>().oneOf(Object.values(ProcessStatus)),
    dpia: yup.object({
      grounds: yup.string(),
      needForDpia: yup.boolean(),
      processImplemented: yup.boolean().required(),
      refToDpia: yup.string(),
      riskOwner: yup.string(),
      riskOwnerFunction: yup.string(),
      noDpiaReasons: yup.array().of(yup.string().required()).required(),
    }),
    disclosures: yup.array<Disclosure>().required(),
  })

const affiliationSchema: () => yup.ObjectSchema<AffiliationFormValues> = () =>
  yup.object({
    department: yup.string(),
    subDepartments: yup.array().of(yup.string().required()).required(),
    productTeams: yup.array().of(yup.string().required()).required(),
    products: yup.array().of(yup.string().required()).required(),
    disclosureDispatchers: yup.array().of(yup.string().required()).required(),
  })

export const dpProcessSchema: () => yup.ObjectSchema<DpProcessFormValues> = () =>
  yup.object({
    affiliation: affiliationSchema().required(),

    art10: yup.boolean(),
    art9: yup.boolean(),

    dataProcessingAgreements: yup.array().of(yup.string().required()).required(),

    description: yup.string(),
    end: yup.string().matches(DATE_REGEX, { message: intl.dateFormat }),
    externalProcessResponsible: yup.string(),

    id: yup.string(),
    name: yup.string().required(intl.required),
    purposeDescription: yup.string(),
    retention: yup.object({
      retentionMonths: yup.number(),
      retentionStart: yup.string(),
    }),

    start: yup.string().matches(DATE_REGEX, { message: intl.dateFormat }),
    subDataProcessing: dpDataProcessingSchema(),
  })

export const createDocumentSchema: () => yup.ObjectSchema<CreateDocumentFormValues> = () =>
  yup.object({
    name: yup.string().required(intl.required),
    description: yup.string().required(intl.required),
    dataAccessClass: yup.string().required(intl.required),
    informationTypes: yup
      .array()
      .of(
        yup.object({
          id: yup.string(),
          informationTypeId: yup.string().required(intl.required),
          subjectCategories: yup.array().of(yup.string().required()).min(1, intl.required).required(),
        }),
      )
      .min(1, intl.required)
      .required(),
  })

const missingArt9LegalBasisForSensitiveInfoType = (informationType: InformationTypeShort, policy: PolicyFormValues) => {
  const ownLegalBasis = policy.legalBasesUse === LegalBasesUse.DEDICATED_LEGAL_BASES || policy.legalBasesUse === LegalBasesUse.INHERITED_FROM_PROCESS
  const reqArt9 = informationType && codelist.requiresArt9(informationType.sensitivity.code)
  const missingArt9 = !policy.legalBases.filter((lb) => codelist.isArt9(lb.gdpr)).length
  const processMissingArt9 = !policy.process.legalBases?.filter((lb) => codelist.isArt9(lb.gdpr.code)).length
  return ownLegalBasis && reqArt9 && missingArt9 && processMissingArt9
}

const missingArt6LegalBasisForInfoType = (policy: PolicyFormValues) => {
  const ownLegalBasis = policy.legalBasesUse === LegalBasesUse.DEDICATED_LEGAL_BASES || policy.legalBasesUse === LegalBasesUse.INHERITED_FROM_PROCESS
  const missingArt6 = !policy.legalBases.filter((lb) => codelist.isArt6(lb.gdpr)).length
  const processMissingArt6 = !policy.process.legalBases?.filter((lb) => codelist.isArt6(lb.gdpr.code)).length
  return ownLegalBasis && missingArt6 && processMissingArt6
}

const missingLegalBasisForDedicated = (policy: PolicyFormValues) => {
  return policy.legalBasesUse === LegalBasesUse.DEDICATED_LEGAL_BASES && !policy.legalBases.length
}

const subjectCategoryExists = (path: string, policy: PolicyFormValues, context: yup.TestContext<any>) => {
  return subjectCategoryExistsGen(policy.informationType!, policy.subjectCategories, path, context, policy.otherPolicies)
}

const subjectCategoryExistsBatch = (path: string, otherPolicies: Policy[], it: DocumentInfoTypeUse, context: yup.TestContext<any>) => {
  return subjectCategoryExistsGen(
    it.informationType,
    it.subjectCategories.map((sc) => sc.code),
    path,
    context,
    otherPolicies,
  )
}

const subjectCategoryExistsGen = (informationType: InformationTypeShort, subjectCategories: string[], path: string, context: yup.TestContext<any>, otherPolicies: Policy[]) => {
  const existingPolicyIdents = otherPolicies.flatMap((p) => p.subjectCategories.map((c) => p.informationType.id + '.' + c.code))
  const matchingIdents = subjectCategories.map((c) => informationType?.id + '.' + c).filter((policyIdent) => existingPolicyIdents.indexOf(policyIdent) >= 0)
  const errors = matchingIdents
    .map((ident) => codelist.getShortname(ListName.SUBJECT_CATEGORY, ident.substring(ident.indexOf('.') + 1)))
    .map((category) => intl.formatString(intl.processContainsSubjectCategory, category, informationType.name) as string)
  return errors.length ? context.createError({ path, message: errors.join(', ') }) : true
}

export const policySchema: () => yup.ObjectSchema<PolicyFormValues> = () =>
  yup.object({
    informationType: yup
      .mixed<InformationTypeShort>()
      .required(intl.required)
      .test({
        name: 'policyHasArt9',
        message: intl.requiredGdprArt9,
        test: function (informationType: InformationTypeShort) {
          const { parent } = this
          return !missingArt9LegalBasisForSensitiveInfoType(informationType, parent)
        },
      })
      .test({
        name: 'policyHasArt6',
        message: intl.requiredGdprArt6,
        test: function () {
          const { parent } = this
          return !missingArt6LegalBasisForInfoType(parent)
        },
      }),
    subjectCategories: yup
      .array()
      .of(yup.string().required())
      .required(intl.required)
      .min(1, intl.required)
      .test({
        name: 'duplicateSubjectCategory',
        message: 'placeholder',
        test: function (val, context) {
          const { parent, path } = this
          return subjectCategoryExists(path, parent, context)
        },
      }),
    legalBasesUse: yup
      .mixed<LegalBasesUse>()
      .oneOf(Object.values(LegalBasesUse))
      .required(intl.required)
      .test({
        name: 'policyHasLegalBasisIfDedicated',
        message: intl.requiredLegalBasisForDedicated,
        test: function () {
          const { parent } = this
          return !missingLegalBasisForDedicated(parent)
        },
      }),
    legalBases: yup.array().of(legalBasisSchema().required()).required(),
    legalBasesOpen: yup.boolean().oneOf([false], intl.legalBasisComplete).required(),
    process: yup.object({
      id: yup.string().required(),
      name: yup.string().required(),
      legalBases: yup.array<LegalBasis>().required(),
    }),
    purposes: yup.array().of(yup.string().required()).required(),
    id: yup.string(),
    documentIds: yup.array().of(yup.string().required()).required(),
    otherPolicies: yup.array<any>().default([]), // only used for validations
  })

export const legalBasisSchema: () => yup.ObjectSchema<LegalBasisFormValues> = () =>
  yup.object({
    gdpr: yup.string().required(intl.required),
    nationalLaw: yup.string().when('gdpr', {
      is: (gdpr?: string) => codelist.requiresNationalLaw(gdpr),
      then: () => yup.string().required(intl.requiredNationalLaw),
      otherwise: () => yup.string(),
    }),
    description: yup.string().when('gdpr', {
      is: (gdpr?: string) => codelist.requiresDescription(gdpr),
      then: () => yup.string().required(intl.requiredDescription),
      otherwise: () => yup.string(),
    }),
    key: yup.string(),
  })

export const codeListSchema: () => yup.ObjectSchema<Code> = () =>
  yup.object({
    list: yup.mixed<ListName>().required(intl.required),
    code: yup
      .string()
      .matches(/^[A-Z_]+$/, 'Der er ikke tilatt med små bokstaver, mellomrom, æ, ø og å i code.')
      .required(intl.required),
    shortName: yup.string().required(intl.required),
    description: yup.string().required(intl.required),
    invalidCode: yup.boolean(),
  })

export const disclosureAbroadSchema: () => yup.ObjectSchema<DisclosureAbroad> = () =>
  yup.object({
    abroad: yup.boolean(),
    countries: yup.array().of(yup.string().required()).required(),
    refToAgreement: yup.string(),
    businessArea: yup.string(),
  })

export const disclosureSchema: () => yup.ObjectSchema<DisclosureFormValues> = () =>
  yup.object({
    id: yup.string(),
    recipient: yup.string(),
    name: yup.string().required(intl.required),
    recipientPurpose: yup.string().required(intl.required),
    description: yup.string(),
    documentId: yup.string(),
    document: ignore().nullable(),
    legalBases: yup.array().of(legalBasisSchema().required()).required(),
    legalBasesOpen: yup.boolean().oneOf([false], intl.legalBasisComplete).required(),
    start: yup.string().matches(DATE_REGEX, { message: intl.dateFormat }),
    end: yup.string().matches(DATE_REGEX, { message: intl.dateFormat }),
    processes: yup.array<any>().required(),
    abroad: disclosureAbroadSchema().required(),
    processIds: yup.array<String>().required(),
    informationTypes: yup.array<InformationTypeShort>(),
    aaregContracts: yup.array().of(ignore().required()),
    aaregContractIds: yup.array(),
    administrationArchiveCaseNumber: yup.string(),
    thirdCountryReceiver: yup.boolean(),
    assessedConfidentiality: yup.boolean().required(intl.required),
    confidentialityDescription: yup.string().required(intl.required),
    department: yup.string(),
    productTeams: yup.array<String>()
  })

export const addDocumentToProcessSchema: () => yup.ObjectSchema<AddDocumentToProcessFormValues> = () =>
  yup.object({
    document: yup.mixed<any>().required(intl.required),
    informationTypes: yup.array<any>().required().min(1, intl.required),
    process: yup.mixed<CustomizedProcess>().required(intl.required),
    linkDocumentToPolicies: yup.boolean().required(),
  })

const addBatchInfoTypeUseSchema: () => yup.ObjectSchema<DocumentInfoTypeUse> = () =>
  yup.object({
    informationTypeId: yup.string().required(),
    informationType: yup.mixed<InformationTypeShort>().required(intl.required),
    subjectCategories: yup.array<any>().required(intl.required).min(1, intl.required),
  })

export const addBatchInfoTypesToProcessSchema: (otherPolicies: Policy[]) => yup.ObjectSchema<AddDocumentToProcessFormValues> = (otherPolicies) =>
  yup.object({
    informationTypes: yup
      .array()
      .of(
        addBatchInfoTypeUseSchema()
          .required()
          .test({
            name: 'duplicateSubjectCategory',
            message: 'placeholder',
            test: function (informationTypeUse: DocumentInfoTypeUse, context: yup.TestContext<any>) {
              const { path } = this
              return subjectCategoryExistsBatch(path, otherPolicies, informationTypeUse, context)
            },
          }),
      )
      .min(1, intl.required)
      .required(intl.required),
    linkDocumentToPolicies: yup.boolean().default(false).oneOf([false]),
    process: yup.mixed<CustomizedProcess>().required(intl.required),
    document: ignore().nullable(),
  })
