import * as yup from "yup";
import {
  AddDocumentToProcessFormValues,
  AffiliationFormValues,
  CreateDocumentFormValues,
  DataProcessingFormValues,
  DisclosureFormValues,
  Document,
  DocumentInformationTypes,
  DocumentInfoTypeUse,
  Dpia,
  DpProcessFormValues,
  DpRetention,
  InformationtypeFormValues,
  InformationTypeShort,
  LegalBasesUse,
  LegalBasisFormValues,
  Policy,
  PolicyFormValues,
  Process,
  ProcessFormValues,
  ProcessStatus,
  Retention,
  TRANSFER_GROUNDS_OUTSIDE_EU_OTHER,
} from "../../constants";
import {intl} from "../../util";
import {Code, codelist, ListName} from "../../service/Codelist";

const DATE_REGEX = /\d{4}-\d{2}-\d{2}/;
const max = 150;

const maxError = () => intl.formatString(intl.maxChars, max) as string;

export const infoTypeSchema = () =>
  yup.object<InformationtypeFormValues>({
    name: yup.string().required(intl.required).max(max, maxError()),
    term: yup.string(),
    sensitivity: yup.string().required(intl.required),
    categories: yup.array().of(yup.string()).required(intl.required),
    sources: yup.array().of(yup.string()),
    productTeams: yup.array().of(yup.string()),
    keywords: yup.array().of(yup.string()),
    orgMaster: yup.string(),
    description: yup.string(),
  });

const dataProcessingSchema = () =>
  yup.object<DataProcessingFormValues>({
    dataProcessor: yup.boolean(),
    dataProcessorAgreements: yup.array().of(yup.string()),
    dataProcessorOutsideEU: yup.boolean(),
    transferGroundsOutsideEU: yup.string().test({
        name: 'dataProcessOutsideEU_transferGrounds',
        message: intl.required,
        test: function () {
          const {parent} = this;
          return !transferGroundsOutsideEUMissing(parent)
        }
      }
    ),
    transferGroundsOutsideEUOther: yup.string().test({
        name: 'dataProcessOutsideEU_transferGroundsOther',
        message: intl.required,
        test: function () {
          const {parent} = this;
          return !transferGroundsOutsideEUOtherMissing(parent)
        }
      }
    ),
    transferCountries: yup.array().of(yup.string()).test({
        name: 'dataProcessOutsideEU_transferCountries',
        message: intl.required,
        test: function () {
          const {parent} = this;
          return !transferCountriesMissing(parent)
        }
      }
    )
  })

const transferGroundsOutsideEUMissing = (values: DataProcessingFormValues) => {
  return !!values.dataProcessorOutsideEU && !values.transferGroundsOutsideEU
}

const transferCountriesMissing = (values: DataProcessingFormValues) => {
  return !!values.dataProcessorOutsideEU && !values.transferCountries.length
}

const transferGroundsOutsideEUOtherMissing = (values: DataProcessingFormValues) => {
  return values.transferGroundsOutsideEU === TRANSFER_GROUNDS_OUTSIDE_EU_OTHER && !values.transferGroundsOutsideEUOther
}

export const processSchema = () =>
  yup.object<ProcessFormValues>({
    name: yup.string().max(max, maxError()).required(intl.required),
    purposes: yup.array().of(yup
    .string()
    .oneOf(
      codelist.getCodes(ListName.PURPOSE).map((p) => p.code),
      intl.required
    ))
    .required(intl.required),
    description: yup.string(),
    additionalDescription: yup.string(),
    affiliation: yup.object<AffiliationFormValues>({
      department: yup.string(),
      subDepartments: yup.array().of(yup.string()),
      productTeams: yup.array().of(yup.string()),
      products: yup.array().of(yup.string()),
    }),
    commonExternalProcessResponsible: yup.string(),
    legalBases: yup.array().of(legalBasisSchema()),
    legalBasesOpen: yup.boolean().oneOf([false], intl.legalBasisComplete),
    start: yup.string().matches(DATE_REGEX, {message: intl.dateFormat}),
    end: yup.string().matches(DATE_REGEX, {message: intl.dateFormat}),
    automaticProcessing: yup.boolean(),
    profiling: yup.boolean(),
    dataProcessing: dataProcessingSchema(),
    retention: yup.object<Retention>({
      retentionPlan: yup.boolean(),
      retentionMonths: yup.number(),
      retentionStart: yup.string(),
      retentionDescription: yup.string(),
    }),
    status: yup.mixed().oneOf(Object.values(ProcessStatus)),
    dpia: yup.object<Dpia>({
      grounds: yup.string(),
      needForDpia: yup.boolean(),
      processImplemented: yup.boolean(),
      refToDpia: yup.string(),
      riskOwner: yup.string(),
      riskOwnerFunction: yup.string(),
    }),
  });

export const dpProcessSchema =
  yup.object<DpProcessFormValues>({
    affiliation: yup.object<AffiliationFormValues>({
      department: yup.string(),
      subDepartments: yup.array().of(yup.string()),
      productTeams: yup.array().of(yup.string()),
      products: yup.array().of(yup.string()),
    }),

    art10: yup.boolean(),
    art9: yup.boolean(),

    dataProcessingAgreements: yup.array().of(yup.string()),

    description: yup.string(),
    end: yup.string().matches(DATE_REGEX, {message: intl.dateFormat}),
    externalProcessResponsible: yup.string(),

    id: yup.string(),
    name: yup.string().required(intl.required),
    purposeDescription: yup.string(),
    retention: yup.object<DpRetention>({
      retentionMonths: yup.number(),
      retentionStart: yup.string(),
    }),

    start: yup.string().matches(DATE_REGEX, {message: intl.dateFormat}),
    subDataProcessing: dataProcessingSchema()
  })

export const createDocumentValidation = () =>
  yup.object<CreateDocumentFormValues>({
    name: yup.string().required(intl.required),
    description: yup.string().required(intl.required),
    informationTypes: yup
    .array(
      yup.object().shape<DocumentInformationTypes>({
        subjectCategories: yup.array().of(yup.string()).min(1, intl.required),
        informationTypeId: yup.string().required(intl.required),
      })
    )
    .min(1, intl.required),
  });

const missingArt9LegalBasisForSensitiveInfoType = (informationType: InformationTypeShort, policy: PolicyFormValues) => {
  const ownLegalBasis = policy.legalBasesUse === LegalBasesUse.DEDICATED_LEGAL_BASES || policy.legalBasesUse === LegalBasesUse.INHERITED_FROM_PROCESS;
  const reqArt9 = informationType && codelist.requiresArt9(informationType.sensitivity && informationType.sensitivity.code);
  const missingArt9 = !policy.legalBases.filter((lb) => codelist.isArt9(lb.gdpr)).length;
  const processMissingArt9 = !policy.process.legalBases.filter((lb) => codelist.isArt9(lb.gdpr.code)).length;
  return ownLegalBasis && reqArt9 && missingArt9 && processMissingArt9;
};

const missingArt6LegalBasisForInfoType = (policy: PolicyFormValues) => {
  const ownLegalBasis = policy.legalBasesUse === LegalBasesUse.DEDICATED_LEGAL_BASES || policy.legalBasesUse === LegalBasesUse.INHERITED_FROM_PROCESS;
  const missingArt6 = !policy.legalBases.filter((lb) => codelist.isArt6(lb.gdpr)).length;
  const processMissingArt6 = !policy.process.legalBases.filter((lb) => codelist.isArt6(lb.gdpr.code)).length;
  return ownLegalBasis && missingArt6 && processMissingArt6;
};

const missingLegalBasisForDedicated = (policy: PolicyFormValues) => {
  return policy.legalBasesUse === LegalBasesUse.DEDICATED_LEGAL_BASES && !policy.legalBases.length;
};

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
  return errors.length ? new yup.ValidationError(errors, undefined, path) : true
}

export const policySchema = () =>
  yup.object<PolicyFormValues>({
    informationType: yup
    .object<InformationTypeShort>()
    .required(intl.required)
    .test({
      name: "policyHasArt9",
      message: intl.requiredGdprArt9,
      test: function (informationType) {
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
    subjectCategories: yup.array().of(yup.string()).min(1, intl.required)
    .test({
      name: 'duplicateSubjectCategory',
      message: 'placeholder',
      test: function () {
        const {parent, path} = this
        return subjectCategoryExists(path, parent);
      }
    }),
    legalBasesUse: yup
    .mixed()
    .oneOf(Object.values(LegalBasesUse))
    .required(intl.required)
    .test({
      name: "policyHasLegalBasisIfDedicated",
      message: intl.requiredLegalBasisForDedicated,
      test: function () {
        const {parent} = this;
        return !missingLegalBasisForDedicated(parent);
      },
    }),
    legalBases: yup.array().of(legalBasisSchema()),
    legalBasesOpen: yup.boolean().oneOf([false], intl.legalBasisComplete),
    process: yup.object(),
    purposes: yup.array().of(yup.string()),
    id: yup.string(),
    documentIds: yup.array().of(yup.string()),
    otherPolicies: yup.array() // only used for validations
  });

export const legalBasisSchema = () =>
  yup.object<LegalBasisFormValues>({
    gdpr: yup.string().required(intl.required),
    nationalLaw: yup.string().when("gdpr", {
      is: (gdprCode) => codelist.requiresNationalLaw(gdprCode),
      then: yup.string().required(intl.requiredNationalLaw),
      otherwise: yup.string(),
    }),
    description: yup.string().when("gdpr", {
      is: (gdprCode) => codelist.requiresDescription(gdprCode),
      then: yup.string().required(intl.requiredDescription),
      otherwise: yup.string(),
    }),
  });

export const codeListSchema = () =>
  yup.object<Code>({
    list: yup.mixed().required(intl.required),
    code: yup.string().required(intl.required),
    shortName: yup.string().required(intl.required),
    description: yup.string().required(intl.required),
  });

export const disclosureSchema = () =>
  yup.object<DisclosureFormValues>({
    id: yup.string(),
    recipient: yup.string(),
    name: yup.string().required(intl.required),
    recipientPurpose: yup.string().required(intl.required),
    description: yup.string().required(intl.required),
    document: yup.mixed(),
    legalBases: yup.array().of(legalBasisSchema()),
    legalBasesOpen: yup.boolean().oneOf([false], intl.legalBasisComplete),
    start: yup.string().matches(DATE_REGEX, {message: intl.dateFormat}),
    end: yup.string().matches(DATE_REGEX, {message: intl.dateFormat}),
  });

export const addDocumentToProcessSchema = () =>
  yup.object<AddDocumentToProcessFormValues>({
    document: yup.object<Document>().required(intl.required),
    informationTypes: yup.array().of(yup.object<DocumentInfoTypeUse>()).required(intl.required),
    process: yup.object<Process>().required(intl.required),
    linkDocumentToPolicies: yup.boolean(),
  });

export const addBatchInfoTypesToProcessSchema = (otherPolicies: Policy[]) =>
  yup.object<AddDocumentToProcessFormValues>({
    informationTypes: yup.array().of(yup.object<DocumentInfoTypeUse>({
        informationTypeId: yup.string(),
        informationType: yup.object<InformationTypeShort>().required(intl.required),
        subjectCategories: yup.array().of(yup.object<Code>().required(intl.required)).min(1, intl.required)
      }).test({
        name: 'duplicateSubjectCategory',
        message: 'placeholder',
        test: function (informationTypeUse) {
          const {path} = this
          return subjectCategoryExistsBatch(path, otherPolicies, informationTypeUse);
        }
      })
    ).required(intl.required),
    process: yup.object<Process>().required(intl.required),
    linkDocumentToPolicies: yup.boolean().equals([false])
  });
