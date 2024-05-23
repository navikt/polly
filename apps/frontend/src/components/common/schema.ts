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
import {Code, codelist, ListName} from '../../service/Codelist'

const DATE_REGEX = /\d{4}-\d{2}-\d{2}/
const max = 150

const maxError = () => `Maks ${max} tegn`
const requredMessage : string = 'Feltet er påkrevd'
const incorrectDateMessage : string = 'Feil dato format, eksempel: 2018-08-22'
const legalBasesOpenMessage : string = 'Lukk behandlingsgrunnlag redigering før lagring'

function ignore<T>(): yup.Schema<T> {
  return yup.object() as any as yup.Schema<T>
}

export const infoTypeSchema: () => yup.ObjectSchema<InformationtypeFormValues> = () =>
  yup.object({
    id: yup.string(),
    name: yup.string().required(requredMessage).max(max, maxError()),
    term: yup.string(),
    sensitivity: yup.string().required(requredMessage),
    categories: yup.array().of(yup.string().required()).min(1, requredMessage).required(),
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
    name: yup.string().max(max, maxError()).required(requredMessage),
    contractOwner: yup.string(),
    operationalContractManagers: yup.array().of(yup.string().required()).required(),
    note: yup.string(),
    contract: yup.string(),
    outsideEU: yup.boolean(),
    transferGroundsOutsideEU: yup.string().test({
      name: 'transferGrounds',
      message: requredMessage,
      test: function () {
        const { parent } = this
        return !transferGroundsOutsideEUMissing(parent)
      },
    }),
    transferGroundsOutsideEUOther: yup.string().test({
      name: 'transferGroundsOther',
      message: requredMessage,
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
            message: requredMessage,
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
    name: yup.string().max(max, maxError()).required(requredMessage),
    purposes: yup
      .array()
      .of(
        yup
          .string()
          .oneOf(
            codelist.getCodes(ListName.PURPOSE).map((p) => p.code),
            requredMessage,
          )
          .required(),
      )
      .min(1, requredMessage)
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
    legalBasesOpen: yup.boolean().oneOf([false], legalBasesOpenMessage).required(),
    start: yup.string().matches(DATE_REGEX, { message: incorrectDateMessage }),
    end: yup.string().matches(DATE_REGEX, { message: incorrectDateMessage }),
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
    end: yup.string().matches(DATE_REGEX, { message: incorrectDateMessage }),
    externalProcessResponsible: yup.string(),

    id: yup.string(),
    name: yup.string().required(requredMessage),
    purposeDescription: yup.string(),
    retention: yup.object({
      retentionMonths: yup.number(),
      retentionStart: yup.string(),
    }),

    start: yup.string().matches(DATE_REGEX, { message: incorrectDateMessage }),
    subDataProcessing: dpDataProcessingSchema(),
  })

export const createDocumentSchema: () => yup.ObjectSchema<CreateDocumentFormValues> = () =>
  yup.object({
    name: yup.string().required(requredMessage),
    description: yup.string().required(requredMessage),
    dataAccessClass: yup.string().required(requredMessage),
    informationTypes: yup
      .array()
      .of(
        yup.object({
          id: yup.string(),
          informationTypeId: yup.string().required(requredMessage),
          subjectCategories: yup.array().of(yup.string().required()).min(1, requredMessage).required(),
        }),
      )
      .min(1, requredMessage)
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
    .map((category) => `Behandlingen inneholder allerede personkategorien ${category} for opplysningstype ${informationType.name}`)
  return errors.length ? context.createError({ path, message: errors.join(', ') }) : true
}

export const policySchema: () => yup.ObjectSchema<PolicyFormValues> = () =>
  yup.object({
    informationType: yup
      .mixed<InformationTypeShort>()
      .required(requredMessage)
      .test({
        name: 'policyHasArt9',
        message: 'Opplysningstypen krever et behandlingsgrunnlag med artikkel 9',
        test: function (informationType: InformationTypeShort) {
          const { parent } = this
          return !missingArt9LegalBasisForSensitiveInfoType(informationType, parent)
        },
      })
      .test({
        name: 'policyHasArt6',
        message: 'Opplysningstypen krever et behandlingsgrunnlag med artikkel 6',
        test: function () {
          const { parent } = this
          return !missingArt6LegalBasisForInfoType(parent)
        },
      }),
    subjectCategories: yup
      .array()
      .of(yup.string().required())
      .required(requredMessage)
      .min(1, requredMessage)
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
      .required(requredMessage)
      .test({
        name: 'policyHasLegalBasisIfDedicated',
        message: 'Ingen behandlingsgrunnlag valgt',
        test: function () {
          const { parent } = this
          return !missingLegalBasisForDedicated(parent)
        },
      }),
    legalBases: yup.array().of(legalBasisSchema().required()).required(),
    legalBasesOpen: yup.boolean().oneOf([false], legalBasesOpenMessage).required(),
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
    gdpr: yup.string().required(requredMessage),
    nationalLaw: yup.string().when('gdpr', {
      is: (gdpr?: string) => codelist.requiresNationalLaw(gdpr),
      then: () => yup.string().required('Artikkelen krever nasjonal lov'),
      otherwise: () => yup.string(),
    }),
    description: yup.string().when('gdpr', {
      is: (gdpr?: string) => codelist.requiresDescription(gdpr),
      then: () => yup.string().required('Artikkelen krever ytterligere beskrivelse'),
      otherwise: () => yup.string(),
    }),
    key: yup.string(),
  })

export const codeListSchema: () => yup.ObjectSchema<Code> = () =>
  yup.object({
    list: yup.mixed<ListName>().required(requredMessage),
    code: yup
      .string()
      .matches(/^[A-Z_]+$/, 'Der er ikke tilatt med små bokstaver, mellomrom, æ, ø og å i code.')
      .required(requredMessage),
    shortName: yup.string().required(requredMessage),
    description: yup.string().required(requredMessage),
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
    name: yup.string().required(requredMessage),
    recipientPurpose: yup.string().required(requredMessage),
    description: yup.string(),
    documentId: yup.string(),
    document: ignore().nullable(),
    legalBases: yup.array().of(legalBasisSchema().required()).required(),
    legalBasesOpen: yup.boolean().oneOf([false], legalBasesOpenMessage).required(),
    start: yup.string().matches(DATE_REGEX, { message: incorrectDateMessage }),
    end: yup.string().matches(DATE_REGEX, { message: incorrectDateMessage }),
    processes: yup.array<any>().required(),
    abroad: disclosureAbroadSchema().required(),
    processIds: yup.array<String>().required(),
    informationTypes: yup.array<InformationTypeShort>(),
    aaregContracts: yup.array().of(ignore().required()),
    aaregContractIds: yup.array(),
    administrationArchiveCaseNumber: yup.string(),
    thirdCountryReceiver: yup.boolean(),
    assessedConfidentiality: yup.boolean().required(requredMessage),
    confidentialityDescription: yup.string().required(requredMessage),
    department: yup.string(),
    productTeams: yup.array<String>()
  })

export const addDocumentToProcessSchema: () => yup.ObjectSchema<AddDocumentToProcessFormValues> = () =>
  yup.object({
    document: yup.mixed<any>().required(requredMessage),
    informationTypes: yup.array<any>().required().min(1, requredMessage),
    process: yup.mixed<CustomizedProcess>().required(requredMessage),
    linkDocumentToPolicies: yup.boolean().required(),
  })

const addBatchInfoTypeUseSchema: () => yup.ObjectSchema<DocumentInfoTypeUse> = () =>
  yup.object({
    informationTypeId: yup.string().required(),
    informationType: yup.mixed<InformationTypeShort>().required(requredMessage),
    subjectCategories: yup.array<any>().required(requredMessage).min(1, requredMessage),
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
      .min(1, requredMessage)
      .required(requredMessage),
    linkDocumentToPolicies: yup.boolean().default(false).oneOf([false]),
    process: yup.mixed<CustomizedProcess>().required(requredMessage),
    document: ignore().nullable(),
  })
