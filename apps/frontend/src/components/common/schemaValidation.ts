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
import { CodelistService, EListName, ICode, ICodelistProps } from '../../service/Codelist'
import { subjectCategoryExistsGen } from './schema'

const DATE_REGEX = /\d{4}-\d{2}-\d{2}/
const max = 150

const maxError = () => `Maks ${max} tegn`
const requredMessage = 'Feltet er påkrevd'
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

const dpDataProcessingSchema: () => yup.ObjectSchema<IDataProcessingFormValues> = () =>
  yup.object({
    dataProcessor: yup.boolean(),
    processors: yup.array().of(yup.string().required()).required(),
  })

export const dataProcessorSchema: () => yup.ObjectSchema<IProcessorFormValues> = () =>
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
          const error: boolean = transferCountriesMissing(parent)
          if (!error) return true
          return this.createError({
            path: 'countries',
            message: requredMessage,
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
  const [codelistUtils] = CodelistService()
  const ownLegalBasis: boolean =
    policy.legalBasesUse === ELegalBasesUse.DEDICATED_LEGAL_BASES ||
    policy.legalBasesUse === ELegalBasesUse.INHERITED_FROM_PROCESS
  const reqArt9: boolean =
    informationType && codelistUtils.requiresArt9(informationType.sensitivity.code)
  const missingArt9 = !policy.legalBases.filter((legalBase: ILegalBasisFormValues) =>
    codelistUtils.isArt9(legalBase.gdpr)
  ).length
  const processMissingArt9 = !policy.process.legalBases?.filter((legalBase: ILegalBasis) =>
    codelistUtils.isArt9(legalBase.gdpr.code)
  ).length
  return ownLegalBasis && reqArt9 && missingArt9 && processMissingArt9
}

const missingLegalBasisForDedicated = (policy: IPolicyFormValues) => {
  return policy.legalBasesUse === ELegalBasesUse.DEDICATED_LEGAL_BASES && !policy.legalBases.length
}

const missingArt6LegalBasisForInfoType = (policy: IPolicyFormValues) => {
  const [codelistUtils] = CodelistService()
  const ownLegalBasis: boolean =
    policy.legalBasesUse === ELegalBasesUse.DEDICATED_LEGAL_BASES ||
    policy.legalBasesUse === ELegalBasesUse.INHERITED_FROM_PROCESS
  const missingArt6 = !policy.legalBases.filter((legalBase: ILegalBasisFormValues) =>
    codelistUtils.isArt6(legalBase.gdpr)
  ).length
  const processMissingArt6 = !policy.process.legalBases?.filter((legalBase: ILegalBasis) =>
    codelistUtils.isArt6(legalBase.gdpr.code)
  ).length
  return ownLegalBasis && missingArt6 && processMissingArt6
}

const subjectCategoryExists = (
  path: string,
  policy: IPolicyFormValues,
  context: yup.TestContext<any>
) => {
  return subjectCategoryExistsGen(
    policy.informationType as IInformationTypeShort,
    policy.subjectCategories,
    path,
    context,
    policy.otherPolicies
  )
}

const subjectCategoryExistsBatch = (
  path: string,
  otherPolicies: IPolicy[],
  it: IDocumentInfoTypeUse,
  context: yup.TestContext<any>
) => {
  return subjectCategoryExistsGen(
    it.informationType,
    it.subjectCategories.map((subjectCategory) => subjectCategory.code),
    path,
    context,
    otherPolicies
  )
}

const affiliationSchema: () => yup.ObjectSchema<IAffiliationFormValues> = () =>
  yup.object({
    department: yup.string(),
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
    name: yup.string().required(requredMessage),
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
    name: yup.string().required(requredMessage),
    description: yup.string().required(requredMessage),
    dataAccessClass: yup.string().required(requredMessage),
    informationTypes: yup
      .array()
      .of(
        yup.object({
          id: yup.string(),
          informationTypeId: yup.string().required(requredMessage),
          subjectCategories: yup
            .array()
            .of(yup.string().required())
            .min(1, requredMessage)
            .required(),
        })
      )
      .min(1, requredMessage)
      .required(),
  })

export const legalBasisSchema: (
  codelistUtils: ICodelistProps
) => yup.ObjectSchema<ILegalBasisFormValues> = (codelistUtils: ICodelistProps) =>
  yup.object({
    gdpr: yup.string().required(requredMessage),
    nationalLaw: yup.string().when('gdpr', {
      is: (gdpr?: string) => codelistUtils.requiresNationalLaw(gdpr),
      then: () => yup.string().required('Artikkelen krever nasjonal lov'),
      otherwise: () => yup.string(),
    }),
    description: yup.string().when('gdpr', {
      is: (gdpr?: string) => codelistUtils.requiresDescription(gdpr),
      then: () => yup.string().required('Artikkelen krever ytterligere beskrivelse'),
      otherwise: () => yup.string(),
    }),
    key: yup.string(),
  })

export const codeListSchema: () => yup.ObjectSchema<ICode> = () =>
  yup.object({
    list: yup.mixed<EListName>().required(requredMessage),
    code: yup
      .string()
      .matches(/^[A-Z_]+$/, 'Der er ikke tilatt med små bokstaver, mellomrom, æ, ø og å i code.')
      .required(requredMessage),
    shortName: yup.string().required(requredMessage),
    description: yup.string().required(requredMessage),
    invalidCode: yup.boolean(),
  })

export const disclosureAbroadSchema: () => yup.ObjectSchema<IDisclosureAbroad> = () =>
  yup.object({
    abroad: yup.boolean(),
    countries: yup.array().of(yup.string().required()).required(),
    refToAgreement: yup.string(),
    businessArea: yup.string(),
  })

export const disclosureSchema: (
  codelistUtils: ICodelistProps
) => yup.ObjectSchema<IDisclosureFormValues> = (codelistUtils: ICodelistProps) =>
  yup.object({
    id: yup.string(),
    recipient: yup.string(),
    name: yup.string().required(requredMessage),
    recipientPurpose: yup.string().required(requredMessage),
    description: yup.string(),
    documentId: yup.string(),
    document: ignore().nullable(),
    legalBases: yup.array().of(legalBasisSchema(codelistUtils).required()).required(),
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
    assessedConfidentiality: yup.boolean().required(requredMessage),
    confidentialityDescription: yup.string().required(requredMessage),
    department: yup.string(),
    productTeams: yup.array<any>(),
  })

export const addDocumentToProcessSchema: () => yup.ObjectSchema<IAddDocumentToProcessFormValues> =
  () =>
    yup.object({
      document: yup.mixed<any>().required(requredMessage),
      informationTypes: yup.array<any>().required().min(1, requredMessage),
      process: yup.mixed<ICustomizedProcess>().required(requredMessage),
      linkDocumentToPolicies: yup.boolean().required(),
    })

const addBatchInfoTypeUseSchema: () => yup.ObjectSchema<IDocumentInfoTypeUse> = () =>
  yup.object({
    informationTypeId: yup.string().required(),
    informationType: yup.mixed<IInformationTypeShort>().required(requredMessage),
    subjectCategories: yup.array<any>().required(requredMessage).min(1, requredMessage),
  })

export const processSchema: (
  codelistUtils: ICodelistProps
) => yup.ObjectSchema<IProcessFormValues> = (codelistUtils: ICodelistProps) =>
  yup.object({
    id: yup.string(),
    name: yup.string().max(max, maxError()).required(requredMessage),
    purposes: yup
      .array()
      .of(
        yup
          .string()
          .oneOf(
            codelistUtils.getCodes(EListName.PURPOSE).map((p) => p.code),
            requredMessage
          )
          .required()
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
    legalBases: yup.array().of(legalBasisSchema(codelistUtils).required()).required(),
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

export const policySchema: (
  codelistUtils: ICodelistProps
) => yup.ObjectSchema<IPolicyFormValues> = (codelistUtils: ICodelistProps) =>
  yup.object({
    informationType: yup
      .mixed<IInformationTypeShort>()
      .required(requredMessage)
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
      .required(requredMessage)
      .min(1, requredMessage)
      .test({
        name: 'duplicateSubjectCategory',
        message: 'placeholder',
        test: function (_val: string[], context: yup.TestContext<yup.AnyObject>) {
          const { parent, path } = this
          return subjectCategoryExists(path, parent, context)
        },
      }),
    legalBasesUse: yup
      .mixed<ELegalBasesUse>()
      .oneOf(Object.values(ELegalBasesUse))
      .required(requredMessage)
      .test({
        name: 'policyHasLegalBasisIfDedicated',
        message: 'Ingen behandlingsgrunnlag valgt',
        test: function () {
          const { parent } = this
          return !missingLegalBasisForDedicated(parent)
        },
      }),
    legalBases: yup.array().of(legalBasisSchema(codelistUtils).required()).required(),
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
  otherPolicies: IPolicy[]
) => yup.ObjectSchema<IAddDocumentToProcessFormValues> = (otherPolicies) =>
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
              return subjectCategoryExistsBatch(path, otherPolicies, informationTypeUse, context)
            },
          })
      )
      .min(1, requredMessage)
      .required(requredMessage),
    linkDocumentToPolicies: yup.boolean().default(false).oneOf([false]),
    process: yup.mixed<ICustomizedProcess>().required(requredMessage),
    document: ignore().nullable(),
  })
