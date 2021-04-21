import * as yup from "yup";
import {
  AddDocumentToProcessFormValues,
  AffiliationFormValues,
  CreateDocumentFormValues,
  DataProcessingFormValues,
  DisclosureAbroad,
  DisclosureFormValues,
  DocumentInfoTypeUse,
  DpDataProcessingFormValues,
  DpProcessFormValues,
  InformationtypeFormValues,
  InformationTypeShort,
  LegalBasesUse,
  LegalBasisFormValues,
  Policy,
  PolicyFormValues,
  ProcessFormValues,
  ProcessorFormValues,
  ProcessStatus,
  TRANSFER_GROUNDS_OUTSIDE_EU_OTHER,
} from "../../constants";
import {intl} from "../../util";
import {Code, codelist, ListName} from "../../service/Codelist";

const DATE_REGEX = /\d{4}-\d{2}-\d{2}/;
const max = 150;

const maxError = () => intl.formatString(intl.maxChars, max) as string;

function ignore<T>(): yup.SchemaOf<T> {
  return yup.object() as any as yup.SchemaOf<T>
}

export const infoTypeSchema: () => yup.SchemaOf<InformationtypeFormValues> = () => yup.object({
  id: yup.string(),
  name: yup.string().required(intl.required).max(max, maxError()),
  term: yup.string(),
  sensitivity: yup.string().required(intl.required),
  categories: yup.array().of(yup.string().required()).min(1, intl.required),
  sources: yup.array().of(yup.string().required()),
  productTeams: yup.array().of(yup.string().required()),
  keywords: yup.array().of(yup.string().required()),
  orgMaster: yup.string(),
  description: yup.string()
})

const dataProcessingSchema: () => yup.SchemaOf<DataProcessingFormValues> = () => yup.object({
  dataProcessor: yup.boolean(),
  processors: yup.array().of(yup.string().required())
})

const dpDataProcessingSchema: () => yup.SchemaOf<DpDataProcessingFormValues> = () => yup.object({
  dataProcessor: yup.boolean(),
  dataProcessorAgreements: yup.array().of(yup.string().required()),
  dataProcessorOutsideEU: yup.boolean(),
  transferGroundsOutsideEU: yup.string().test({
      name: 'dataProcessOutsideEU_transferGrounds',
      message: intl.required,
      test: function () {
        const {parent} = this;
        return !dpTransferGroundsOutsideEUMissing(parent)
      }
    }
  ),
  transferGroundsOutsideEUOther: yup.string().test({
      name: 'dataProcessOutsideEU_transferGroundsOther',
      message: intl.required,
      test: function () {
        const {parent} = this;
        return !dpTransferGroundsOutsideEUOtherMissing(parent)
      }
    }
  ),
  transferCountries: yup.array().of(yup.string().required()).test({
      name: 'dataProcessOutsideEU_transferCountries',
      message: intl.required,
      test: function () {
        const {parent} = this;
        return !dpTransferCountriesMissing(parent)
      }
    }
  )
})

const dpTransferGroundsOutsideEUMissing = (values: DpDataProcessingFormValues) => {
  return !!values.dataProcessorOutsideEU && !values.transferGroundsOutsideEU
}

const dpTransferCountriesMissing = (values: DpDataProcessingFormValues) => {
  return !!values.dataProcessorOutsideEU && !values.transferCountries.length
}

const dpTransferGroundsOutsideEUOtherMissing = (values: DpDataProcessingFormValues) => {
  return values.transferGroundsOutsideEU === TRANSFER_GROUNDS_OUTSIDE_EU_OTHER && !values.transferGroundsOutsideEUOther
}

export const dataProcessorSchema: () => yup.SchemaOf<ProcessorFormValues> = () => yup.object({
    id: yup.string(),
    name: yup.string().max(max, maxError()).required(intl.required),
    contractOwner: yup.string(),
    operationalContractManagers: yup.array().of(yup.string().required()),
    note: yup.string(),
    contract: yup.string(),
    outsideEU: yup.boolean(),
    transferGroundsOutsideEU: yup.string().test({
        name: 'transferGrounds',
        message: intl.required,
        test: function () {
          const {parent} = this;
          return !transferGroundsOutsideEUMissing(parent)
        }
      }
    ),
    transferGroundsOutsideEUOther: yup.string().test({
        name: 'transferGroundsOther',
        message: intl.required,
        test: function () {
          const {parent} = this;
          return !transferGroundsOutsideEUOtherMissing(parent)
        }
      }
    ),
    countries: yup.array().of(yup.string().required()).test({
        name: 'transferCountries',
        test: function () {
          const {parent} = this;
          const error = transferCountriesMissing(parent)
          if (!error) return true
          return this.createError({
            path: 'countries',
            message: intl.required
          })
        }
      }
    )
  }
)

const transferGroundsOutsideEUMissing = (values: ProcessorFormValues) => {
  return !!values.outsideEU && !values.transferGroundsOutsideEU
}

const transferCountriesMissing = (values: ProcessorFormValues) => {
  return !!values.outsideEU && !values.countries.length
}

const transferGroundsOutsideEUOtherMissing = (values: ProcessorFormValues) => {
  return values.transferGroundsOutsideEU === TRANSFER_GROUNDS_OUTSIDE_EU_OTHER && !values.transferGroundsOutsideEUOther
}

export const processSchema: () => yup.SchemaOf<ProcessFormValues> = () => yup.object({
  id: yup.string(),
  usesAllInformationTypes: yup.boolean(),
  name: yup.string().max(max, maxError()).required(intl.required),
  purposes: yup.array().of(yup.string()
  .oneOf(
    codelist.getCodes(ListName.PURPOSE).map((p) => p.code),
    intl.required
  ).required()).min(1, intl.required),
  description: yup.string(),
  additionalDescription: yup.string(),
  affiliation: yup.object({
    department: yup.string(),
    subDepartments: yup.array().of(yup.string().required()).required(),
    productTeams: yup.array().of(yup.string().required()).required(),
    products: yup.array().of(yup.string().required()).required(),
  }),
  commonExternalProcessResponsible: yup.string(),
  legalBases: yup.array().of(legalBasisSchema().required()),
  legalBasesOpen: yup.boolean().oneOf([false], intl.legalBasisComplete).required(),
  start: yup.string().matches(DATE_REGEX, {message: intl.dateFormat}),
  end: yup.string().matches(DATE_REGEX, {message: intl.dateFormat}),
  automaticProcessing: yup.boolean(),
  profiling: yup.boolean(),
  dataProcessing: dataProcessingSchema(),
  retention: yup.object({
    retentionPlan: yup.boolean(),
    retentionMonths: yup.number(),
    retentionStart: yup.string(),
    retentionDescription: yup.string(),
  }),
  status: yup.mixed().oneOf(Object.values(ProcessStatus)),
  dpia: yup.object({
    grounds: yup.string().required(),
    needForDpia: yup.boolean(),
    processImplemented: yup.boolean().required(),
    refToDpia: yup.string().required(),
    riskOwner: yup.string(),
    riskOwnerFunction: yup.string(),
    noDpiaReasons: yup.array().of(yup.string().required()).required(),
  }),
  disclosures: yup.array().of(yup.object<any>({}).required())
})

const affiliationSchema: () => yup.SchemaOf<AffiliationFormValues> = () => yup.object({
  department: yup.string(),
  subDepartments: yup.array().of(yup.string().required()).required(),
  productTeams: yup.array().of(yup.string().required()).required(),
  products: yup.array().of(yup.string().required()).required(),
})

export const dpProcessSchema: () => yup.SchemaOf<DpProcessFormValues> = () => yup.object({
  affiliation: affiliationSchema().required(),

  art10: yup.boolean(),
  art9: yup.boolean(),

  dataProcessingAgreements: yup.array().of(yup.string().required()).required(),

  description: yup.string(),
  end: yup.string().matches(DATE_REGEX, {message: intl.dateFormat}),
  externalProcessResponsible: yup.string(),

  id: yup.string(),
  name: yup.string().required(intl.required),
  purposeDescription: yup.string(),
  retention: yup.object({
    retentionMonths: yup.number(),
    retentionStart: yup.string(),
  }),

  start: yup.string().matches(DATE_REGEX, {message: intl.dateFormat}),
  subDataProcessing: dpDataProcessingSchema()
})

export const createDocumentSchema: () => yup.SchemaOf<CreateDocumentFormValues> = () => yup.object({
  name: yup.string().required(intl.required),
  description: yup.string().required(intl.required),
  informationTypes: yup.array().of(yup.object({
    id: yup.string(),
    informationTypeId: yup.string().required(intl.required),
    subjectCategories: yup.array().of(yup.string().required()).min(1, intl.required),
  })).min(1, intl.required),
})

const missingArt9LegalBasisForSensitiveInfoType = (informationType: InformationTypeShort, policy: PolicyFormValues) => {
  const ownLegalBasis = policy.legalBasesUse === LegalBasesUse.DEDICATED_LEGAL_BASES || policy.legalBasesUse === LegalBasesUse.INHERITED_FROM_PROCESS;
  const reqArt9 = informationType && codelist.requiresArt9(informationType.sensitivity?.code);
  const missingArt9 = !policy.legalBases.filter((lb) => codelist.isArt9(lb.gdpr)).length;
  const processMissingArt9 = !policy.process.legalBases.filter((lb) => codelist.isArt9(lb.gdpr.code)).length;
  return ownLegalBasis && reqArt9 && missingArt9 && processMissingArt9;
}

const missingArt6LegalBasisForInfoType = (policy: PolicyFormValues) => {
  const ownLegalBasis = policy.legalBasesUse === LegalBasesUse.DEDICATED_LEGAL_BASES || policy.legalBasesUse === LegalBasesUse.INHERITED_FROM_PROCESS;
  const missingArt6 = !policy.legalBases.filter((lb) => codelist.isArt6(lb.gdpr)).length;
  const processMissingArt6 = !policy.process.legalBases.filter((lb) => codelist.isArt6(lb.gdpr.code)).length;
  return ownLegalBasis && missingArt6 && processMissingArt6;
}

const missingLegalBasisForDedicated = (policy: PolicyFormValues) => {
  return policy.legalBasesUse === LegalBasesUse.DEDICATED_LEGAL_BASES && !policy.legalBases.length;
}

const subjectCategoryExists = (path: string, policy: PolicyFormValues) => {
  return subjectCategoryExistsGen(policy.otherPolicies, policy.informationType!, policy.subjectCategories, path)
}

const subjectCategoryExistsBatch = (path: string, otherPolicies: Policy[], it: DocumentInfoTypeUse) => {
  return subjectCategoryExistsGen(otherPolicies, it.informationType, it.subjectCategories.map(sc => sc.code), path)
}

const subjectCategoryExistsGen = (otherPolicies: Policy[], informationType: InformationTypeShort, subjectCategories: string[], path: string) => {
  const existingPolicyIdents = otherPolicies.flatMap(p => p.subjectCategories.map(c => p.informationType.id + '.' + c.code))
  const matchingIdents = subjectCategories.map(c => informationType?.id + '.' + c).filter(policyIdent => existingPolicyIdents.indexOf(policyIdent) >= 0)
  const errors = matchingIdents
  .map(ident => codelist.getShortname(ListName.SUBJECT_CATEGORY, ident.substring(ident.indexOf('.') + 1)))
  .map(category => intl.formatString(intl.processContainsSubjectCategory, category, informationType.name) as string)
  return errors.length ? new yup.ValidationError(errors.map(e => new yup.ValidationError(e)), undefined, path) : true
}

export const policySchema: () => yup.SchemaOf<PolicyFormValues> = () => yup.object({
  informationType: yup.object().shape({}).required(intl.required)
  .test({
    name: "policyHasArt9",
    message: intl.requiredGdprArt9,
    test: function (informationType: InformationTypeShort) {
      const {parent} = this;
      return !missingArt9LegalBasisForSensitiveInfoType(informationType, parent);
    },
  })
  .test({
    name: "policyHasArt6",
    message: intl.requiredGdprArt6,
    test: function () {
      const {parent} = this;
      return !missingArt6LegalBasisForInfoType(parent);
    },
  }),
  subjectCategories: yup.array().of(yup.string().required()).required(intl.required).min(1, intl.required)
  .test({
    name: 'duplicateSubjectCategory',
    message: 'placeholder',
    test: function () {
      const {parent, path} = this
      return subjectCategoryExists(path, parent);
    }
  }),
  legalBasesUse: yup.mixed().oneOf(Object.values(LegalBasesUse)).required(intl.required)
  .test({
    name: "policyHasLegalBasisIfDedicated",
    message: intl.requiredLegalBasisForDedicated,
    test: function () {
      const {parent} = this;
      return !missingLegalBasisForDedicated(parent);
    },
  }),
  legalBases: yup.array().of(legalBasisSchema().required()).required(),
  legalBasesOpen: yup.boolean().oneOf([false], intl.legalBasisComplete).required(),
  process: yup.object<any>({}),
  purposes: yup.array().of(yup.string().required()).required(),
  id: yup.string(),
  documentIds: yup.array().of(yup.string().required()).required(),
  otherPolicies: yup.array() // only used for validations
})

export const legalBasisSchema: () => yup.SchemaOf<LegalBasisFormValues> = () => yup.object({
  gdpr: yup.string().required(intl.required),
  nationalLaw: yup.string().when("gdpr", {
    is: (gdprCode?: string) => codelist.requiresNationalLaw(gdprCode),
    then: yup.string().required(intl.requiredNationalLaw),
    otherwise: yup.string(),
  }),
  description: yup.string().when("gdpr", {
    is: (gdprCode?: string) => codelist.requiresDescription(gdprCode),
    then: yup.string().required(intl.requiredDescription),
    otherwise: yup.string(),
  }),
  key: yup.string()
})

export const codeListSchema: () => yup.SchemaOf<Code> = () => yup.object({
  list: yup.mixed().required(intl.required),
  code: yup.string().required(intl.required),
  shortName: yup.string().required(intl.required),
  description: yup.string().required(intl.required),
  invalidCode: yup.boolean()
})

export const disclosureAbroadSchema: () => yup.SchemaOf<DisclosureAbroad> = () => yup.object({
  abroad: yup.boolean(),
  countries: yup.array().of(yup.string().required()).required(),
  refToAgreement: yup.string(),
  businessArea: yup.string(),
})

export const disclosureSchema: () => yup.SchemaOf<DisclosureFormValues> = () => yup.object({
  id: yup.string(),
  recipient: yup.string(),
  name: yup.string().required(intl.required),
  recipientPurpose: yup.string().required(intl.required),
  description: yup.string(),
  document: ignore().nullable(),
  legalBases: yup.array().of(legalBasisSchema().required()),
  legalBasesOpen: yup.boolean().oneOf([false], intl.legalBasisComplete).required(),
  start: yup.string().matches(DATE_REGEX, {message: intl.dateFormat}),
  end: yup.string().matches(DATE_REGEX, {message: intl.dateFormat}),
  processes: yup.array().of(ignore().required()),
  abroad: disclosureAbroadSchema().required(),
  processIds: yup.array().of(yup.string().required()),
  documentId: yup.string(),
  informationTypes: yup.array().of(ignore().required()),
})

export const addDocumentToProcessSchema: () => yup.SchemaOf<AddDocumentToProcessFormValues> = () => yup.object({
  document: yup.object().shape<any>({}).required(intl.required),
  informationTypes: yup.array().of(yup.object().shape<any>({}).required()).min(1, intl.required),
  process: yup.object().shape<any>({}).required(intl.required),
  linkDocumentToPolicies: yup.boolean().required(),
})

const addBatchInfoTypeUseSchema: () => yup.SchemaOf<DocumentInfoTypeUse> = () => yup.object({
  informationTypeId: yup.string().required(),
  informationType: yup.object<any>({}).required(intl.required),
  subjectCategories: yup.array().of(yup.object<any>({}).required(intl.required)).min(1, intl.required)
})

export const addBatchInfoTypesToProcessSchema: (otherPolicies: Policy[]) => yup.SchemaOf<AddDocumentToProcessFormValues> = (otherPolicies) => yup.object({
  informationTypes: yup.array().of(addBatchInfoTypeUseSchema().required()
  .test({
    name: 'duplicateSubjectCategory',
    message: 'placeholder',
    test: function (informationTypeUse: DocumentInfoTypeUse) {
      const {path} = this
      return subjectCategoryExistsBatch(path, otherPolicies, informationTypeUse);
    }
  })).min(1, intl.required),
  linkDocumentToPolicies: yup.boolean().equals([false]),
  process: yup.object<any>().required(intl.required),
  document: ignore().nullable()
})
