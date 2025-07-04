import * as yup from 'yup'
import {
  ELegalBasesUse,
  EProcessStatus,
  IAddDocumentToProcessFormValues,
  IAffiliationFormValues,
  ICreateDocumentFormValues,
  ICustomizedProcess,
  IDataProcessingFormValues,
  IDisclosure,
  IDisclosureAbroad,
  IDisclosureFormValues,
  IDocumentInfoTypeUse,
  IDpProcessFormValues,
  IInformationTypeShort,
  IInformationtypeFormValues,
  ILegalBasis,
  ILegalBasisFormValues,
  IPolicy,
  IPolicyFormValues,
  IProcessFormValues,
  IProcessorFormValues,
  TRANSFER_GROUNDS_OUTSIDE_EU_OTHER,
} from '../../constants'
import {
  ARTICLE_6_PREFIX,
  ARTICLE_9_PREFIX,
  DESCRIPTION_GDPR_ARTICLES,
  EListName,
  ESensitivityLevel,
  ICode,
  NATIONAL_LAW_GDPR_ARTICLES,
} from '../../service/Codelist'
import { subjectCategoryExistsGen } from './schema'

const DATE_REGEX = /\d{4}-\d{2}-\d{2}/
const max = 150

const maxError = () => `Maks ${max} tegn`
const requiredMessage = 'Feltet er påkrevd'
const incorrectDateMessage = 'Feil dato format, eksempel: 2018-08-22'
const legalBasesOpenMessage = 'Lukk behandlingsgrunnlag redigering før lagring'

const transferGroundsOutsideEUMissing = (values: IProcessorFormValues) => {
  return !!values.outsideEU && !values.transferGroundsOutsideEU
}

const transferCountriesMissing = (values: IProcessorFormValues) => {
  return !!values.outsideEU && !values.countries?.length
}

const transferGroundsOutsideEUOtherMissing = (values: IProcessorFormValues) => {
  return (
    values.transferGroundsOutsideEU === TRANSFER_GROUNDS_OUTSIDE_EU_OTHER &&
    !values.transferGroundsOutsideEUOther
  )
}

function ignore<T>(): yup.Schema<T> {
  return yup.object() as any as yup.Schema<T>
}

export const infoTypeSchema: () => yup.ObjectSchema<IInformationtypeFormValues> = () =>
  yup.object({
    id: yup.string(),
    name: yup.string().required(requiredMessage).max(max, maxError()),
    term: yup.string(),
    sensitivity: yup.string().required(requiredMessage),
    categories: yup.array().of(yup.string().required()).min(1, requiredMessage).required(),
    sources: yup.array().of(yup.string().required()).required(),
    productTeams: yup.array().of(yup.string().required()).required(),
    keywords: yup.array().of(yup.string().required()).required(),
    orgMaster: yup.string(),
    description: yup.string(),
  })

const dpDataProcessingSchema: () => yup.ObjectSchema<IDataProcessingFormValues> = () =>
  yup.object({
    dataProcessor: yup.boolean(),
    processors: yup.array().of(yup.string().required()).required(),
  })

export const dataProcessorSchema: () => yup.ObjectSchema<IProcessorFormValues> = () =>
  yup.object({
    id: yup.string(),
    name: yup.string().max(max, maxError()).required('Databehandler må ha et navn'),
    contractOwner: yup.string(),
    operationalContractManagers: yup.array().of(yup.string().required()).required(),
    note: yup.string(),
    contract: yup.string(),
    outsideEU: yup.boolean(),
    transferGroundsOutsideEU: yup.string().test({
      name: 'transferGrounds',
      message: 'Du må velge et behandlingsgrunnlag',
      test: function () {
        const { parent } = this
        return !transferGroundsOutsideEUMissing(parent)
      },
    }),
    transferGroundsOutsideEUOther: yup.string().test({
      name: 'transferGroundsOther',
      message: 'Du må spesifisere overføringsgrunnlaget',
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
          const error: boolean = transferCountriesMissing(parent)
          if (!error) return true
          return this.createError({
            path: 'countries',
            message: 'Du må angi hvilke(t) land',
          })
        },
      }),
  })

const dataProcessingSchema: () => yup.ObjectSchema<IDataProcessingFormValues> = () =>
  yup.object({
    dataProcessor: yup.boolean(),
    processors: yup.array().of(yup.string().required()).required(),
  })

const missingArt9LegalBasisForSensitiveInfoType = (
  informationType: IInformationTypeShort,
  policy: IPolicyFormValues
) => {
  const ownLegalBasis: boolean =
    policy.legalBasesUse === ELegalBasesUse.DEDICATED_LEGAL_BASES ||
    policy.legalBasesUse === ELegalBasesUse.INHERITED_FROM_PROCESS
  const reqArt9: boolean =
    informationType && informationType.sensitivity.code === ESensitivityLevel.ART9
  const missingArt9 = !policy.legalBases.filter((legalBase: ILegalBasisFormValues) =>
    legalBase && legalBase.gdpr ? legalBase.gdpr.startsWith(ARTICLE_9_PREFIX) : undefined
  ).length
  const processMissingArt9 = !policy.process.legalBases?.filter((legalBase: ILegalBasis) =>
    legalBase.gdpr.code ? legalBase.gdpr.code.startsWith(ARTICLE_9_PREFIX) : undefined
  ).length
  return ownLegalBasis && reqArt9 && missingArt9 && processMissingArt9
}

const missingLegalBasisForDedicated = (policy: IPolicyFormValues) => {
  return policy.legalBasesUse === ELegalBasesUse.DEDICATED_LEGAL_BASES && !policy.legalBases.length
}

const missingArt6LegalBasisForInfoType = (policy: IPolicyFormValues) => {
  const ownLegalBasis: boolean =
    policy.legalBasesUse === ELegalBasesUse.DEDICATED_LEGAL_BASES ||
    policy.legalBasesUse === ELegalBasesUse.INHERITED_FROM_PROCESS
  const missingArt6 = !policy.legalBases.filter((legalBase: ILegalBasisFormValues) =>
    legalBase && legalBase.gdpr ? legalBase.gdpr.startsWith(ARTICLE_6_PREFIX) : undefined
  ).length
  const processMissingArt6 = !policy.process.legalBases?.filter((legalBase: ILegalBasis) =>
    legalBase.gdpr.code ? legalBase.gdpr.code.startsWith(ARTICLE_6_PREFIX) : undefined
  ).length
  return ownLegalBasis && missingArt6 && processMissingArt6
}

const subjectCategoryExists = (
  path: string,
  policy: IPolicyFormValues,
  context: yup.TestContext<any>,
  subjectCategoryList: ICode[]
) => {
  return subjectCategoryExistsGen(
    policy.informationType as IInformationTypeShort,
    policy.subjectCategories,
    path,
    context,
    policy.otherPolicies,
    subjectCategoryList
  )
}

const subjectCategoryExistsBatch = (
  path: string,
  otherPolicies: IPolicy[],
  it: IDocumentInfoTypeUse,
  context: yup.TestContext<any>,
  subjectCategoryList: ICode[]
) => {
  return subjectCategoryExistsGen(
    it.informationType,
    it.subjectCategories.map((subjectCategory) => subjectCategory.code),
    path,
    context,
    otherPolicies,
    subjectCategoryList
  )
}

const affiliationSchema: () => yup.ObjectSchema<IAffiliationFormValues> = () =>
  yup.object({
    department: yup.string(),
    nomDepartmentId: yup.string(),
    nomDepartmentName: yup.string(),
    subDepartments: yup.array().of(yup.string().required()).required(),
    productTeams: yup.array().of(yup.string().required()).required(),
    products: yup.array().of(yup.string().required()).required(),
    disclosureDispatchers: yup.array().of(yup.string().required()).required(),
  })

export const dpProcessSchema: () => yup.ObjectSchema<IDpProcessFormValues> = () =>
  yup.object({
    affiliation: affiliationSchema().required(),
    art10: yup.boolean(),
    art9: yup.boolean(),
    dataProcessingAgreements: yup.array().of(yup.string().required()).required(),
    description: yup.string(),
    end: yup.string().matches(DATE_REGEX, { message: incorrectDateMessage }),
    externalProcessResponsible: yup.string(),
    id: yup.string(),
    name: yup.string().required(requiredMessage),
    purposeDescription: yup.string(),
    retention: yup.object({
      retentionMonths: yup.number(),
      retentionStart: yup.string(),
    }),
    start: yup.string().matches(DATE_REGEX, { message: incorrectDateMessage }),
    subDataProcessing: dpDataProcessingSchema(),
  })

export const createDocumentSchema: () => yup.ObjectSchema<ICreateDocumentFormValues> = () =>
  yup.object({
    name: yup.string().required(requiredMessage),
    description: yup.string().required(requiredMessage),
    dataAccessClass: yup.string().required(requiredMessage),
    informationTypes: yup
      .array()
      .of(
        yup.object({
          id: yup.string(),
          informationTypeId: yup.string().required(requiredMessage),
          subjectCategories: yup
            .array()
            .of(yup.string().required())
            .min(1, requiredMessage)
            .required(),
        })
      )
      .min(1, requiredMessage)
      .required(),
  })

export const legalBasisSchema: () => yup.ObjectSchema<ILegalBasisFormValues> = () =>
  yup.object({
    gdpr: yup.string().required(requiredMessage),
    nationalLaw: yup.string().when('gdpr', {
      is: (gdpr?: string) => NATIONAL_LAW_GDPR_ARTICLES.indexOf(gdpr || '') >= 0,
      then: () => yup.string().required('Artikkelen krever nasjonal lov'),
      otherwise: () => yup.string(),
    }),
    description: yup.string().when('gdpr', {
      is: (gdpr?: string) => DESCRIPTION_GDPR_ARTICLES.indexOf(gdpr || '') >= 0,
      then: () => yup.string().required('Artikkelen krever ytterligere beskrivelse'),
      otherwise: () => yup.string(),
    }),
    key: yup.string(),
  })

export const codeListSchema: () => yup.ObjectSchema<ICode> = () =>
  yup.object({
    list: yup.mixed<EListName>().required(requiredMessage),
    code: yup
      .string()
      .matches(/^[A-Z_]+$/, 'Der er ikke tilatt med små bokstaver, mellomrom, æ, ø og å i code.')
      .required(requiredMessage),
    shortName: yup.string().required(requiredMessage),
    description: yup.string().required(requiredMessage),
    invalidCode: yup.boolean(),
  })

export const disclosureAbroadSchema: () => yup.ObjectSchema<IDisclosureAbroad> = () =>
  yup.object({
    abroad: yup.boolean(),
    countries: yup.array().of(yup.string().required()).required(),
    refToAgreement: yup.string(),
    businessArea: yup.string(),
  })

export const disclosureSchema: () => yup.ObjectSchema<IDisclosureFormValues> = () =>
  yup.object({
    id: yup.string(),
    recipient: yup.string(),
    name: yup.string().required(requiredMessage),
    recipientPurpose: yup.string().required(requiredMessage),
    description: yup.string(),
    documentId: yup.string(),
    document: ignore().nullable(),
    legalBases: yup.array().of(legalBasisSchema().required()).required(),
    legalBasesOpen: yup.boolean().oneOf([false], legalBasesOpenMessage).required(),
    start: yup.string().matches(DATE_REGEX, { message: incorrectDateMessage }),
    end: yup.string().matches(DATE_REGEX, { message: incorrectDateMessage }),
    processes: yup.array<any>().required(),
    abroad: disclosureAbroadSchema().required(),
    processIds: yup.array<any>().required(),
    informationTypes: yup.array<IInformationTypeShort>(),
    aaregContracts: yup.array().of(ignore().required()),
    aaregContractIds: yup.array(),
    administrationArchiveCaseNumber: yup.string(),
    thirdCountryReceiver: yup.boolean(),
    assessedConfidentiality: yup.boolean().required(requiredMessage),
    confidentialityDescription: yup.string().required(requiredMessage),
    department: yup.string(),
    nomDepartmentId: yup.string(),
    nomDepartmentName: yup.string(),
    productTeams: yup.array<any>(),
  })

export const addDocumentToProcessSchema: () => yup.ObjectSchema<IAddDocumentToProcessFormValues> =
  () =>
    yup.object({
      document: yup.mixed<any>().required(requiredMessage),
      informationTypes: yup.array<any>().required().min(1, requiredMessage),
      process: yup.mixed<ICustomizedProcess>().required(requiredMessage),
      linkDocumentToPolicies: yup.boolean().required(),
    })

const addBatchInfoTypeUseSchema: () => yup.ObjectSchema<IDocumentInfoTypeUse> = () =>
  yup.object({
    informationTypeId: yup.string().required(),
    informationType: yup.mixed<IInformationTypeShort>().required(requiredMessage),
    subjectCategories: yup.array<any>().required(requiredMessage).min(1, requiredMessage),
  })

export const processSchema: (purposeList: ICode[]) => yup.ObjectSchema<IProcessFormValues> = (
  purposeList: ICode[]
) =>
  yup.object({
    id: yup.string(),
    name: yup.string().max(max, maxError()).required(requiredMessage),
    purposes: yup
      .array()
      .of(
        yup
          .string()
          .oneOf(
            purposeList.map((p) => p.code),
            requiredMessage
          )
          .required()
      )
      .min(1, requiredMessage)
      .required(),
    description: yup.string(),
    additionalDescription: yup.string(),
    affiliation: yup.object({
      department: yup.string(),
      nomDepartmentId: yup.string(),
      nomDepartmentName: yup.string(),
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
    status: yup.mixed<EProcessStatus>().oneOf(Object.values(EProcessStatus)),
    dpia: yup.object({
      grounds: yup.string(),
      needForDpia: yup.boolean(),
      processImplemented: yup.boolean().required(),
      refToDpia: yup.string(),
      riskOwner: yup.string(),
      riskOwnerFunction: yup.string(),
      noDpiaReasons: yup.array().of(yup.string().required()).required(),
    }),
    disclosures: yup.array<IDisclosure>().required(),
  })

export const policySchema: (subjectCategoryList: ICode[]) => yup.ObjectSchema<IPolicyFormValues> = (
  subjectCategoryList
) =>
  yup.object({
    informationType: yup
      .mixed<IInformationTypeShort>()
      .required(requiredMessage)
      .test({
        name: 'policyHasArt9',
        message: 'Opplysningstypen krever et behandlingsgrunnlag med artikkel 9',
        test: function (informationType: IInformationTypeShort) {
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
      .required(requiredMessage)
      .min(1, requiredMessage)
      .test({
        name: 'duplicateSubjectCategory',
        message: 'placeholder',
        test: function (_val: string[], context: yup.TestContext<yup.AnyObject>) {
          const { parent, path } = this
          return subjectCategoryExists(path, parent, context, subjectCategoryList)
        },
      }),
    legalBasesUse: yup
      .mixed<ELegalBasesUse>()
      .oneOf(Object.values(ELegalBasesUse))
      .required(requiredMessage)
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
      legalBases: yup.array<ILegalBasis>().required(),
    }),
    purposes: yup.array().of(yup.string().required()).required(),
    id: yup.string(),
    documentIds: yup.array().of(yup.string().required()).required(),
    otherPolicies: yup.array<any>().default([]), // only used for validations
  })

export const addBatchInfoTypesToProcessSchema: (
  otherPolicies: IPolicy[],
  subjectCategoryList: ICode[]
) => yup.ObjectSchema<IAddDocumentToProcessFormValues> = (otherPolicies, subjectCategoryList) =>
  yup.object({
    informationTypes: yup
      .array()
      .of(
        addBatchInfoTypeUseSchema()
          .required()
          .test({
            name: 'duplicateSubjectCategory',
            message: 'placeholder',
            test: function (
              informationTypeUse: IDocumentInfoTypeUse,
              context: yup.TestContext<any>
            ) {
              const { path } = this
              return subjectCategoryExistsBatch(
                path,
                otherPolicies,
                informationTypeUse,
                context,
                subjectCategoryList
              )
            },
          })
      )
      .min(1, requiredMessage)
      .required(requiredMessage),
    linkDocumentToPolicies: yup.boolean().default(false).oneOf([false]),
    process: yup.mixed<ICustomizedProcess>().required(requiredMessage),
    document: ignore().nullable(),
  })
