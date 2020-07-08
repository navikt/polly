import * as yup from "yup";
import {
  AddDocumentToProcessFormValues,
  CreateDocumentFormValues,
  DataProcessing,
  DisclosureFormValues,
  Document,
  DocumentInformationTypes,
  DocumentInfoTypeUse,
  Dpia,
  InformationtypeFormValues,
  InformationTypeShort,
  LegalBasesUse,
  LegalBasisFormValues,
  PolicyFormValues,
  Process,
  ProcessFormValues,
  ProcessStatus,
  Retention,
} from "../../constants";
import { intl } from "../../util";
import { Code, codelist, ListName } from "../../service/Codelist";

const DATE_REGEX = /\d{4}-\d{2}-\d{2}/;
const max = 150;

const maxError = () => intl.formatString(intl.maxChars, max) as string;

export const infoTypeSchema = () =>
  yup.object<InformationtypeFormValues>({
    name: yup.string().required(intl.required).max(max, maxError()),
    term: yup.string(),
    sensitivity: yup.string().required(intl.required),
    categories: yup.array(yup.string()).required(intl.required),
    sources: yup.array(yup.string()),
    productTeams: yup.array(yup.string()),
    keywords: yup.array(yup.string()),
    orgMaster: yup.string(),
    description: yup.string(),
  });

export const processSchema = () =>
  yup.object<ProcessFormValues>({
    name: yup.string().max(max, maxError()).required(intl.required),
    purposeCode: yup
      .string()
      .oneOf(
        codelist.getCodes(ListName.PURPOSE).map((p) => p.code),
        intl.required
      )
      .required(intl.required),
    description: yup.string(),
    department: yup.string(),
    commonExternalProcessResponsible: yup.string(),
    subDepartments: yup.array(yup.string()),
    productTeams: yup.array(yup.string()),
    products: yup.array(yup.string()),
    legalBases: yup.array(legalBasisSchema()),
    legalBasesOpen: yup.boolean(),
    start: yup.string().matches(DATE_REGEX, { message: intl.dateFormat }),
    end: yup.string().matches(DATE_REGEX, { message: intl.dateFormat }),
    automaticProcessing: yup.boolean(),
    profiling: yup.boolean(),
    dataProcessing: yup.object<DataProcessing>({
      dataProcessor: yup.boolean(),
      dataProcessorAgreements: yup.array(yup.string()),
      dataProcessorOutsideEU: yup.boolean(),
    }),
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

export const createDocumentValidation = () =>
  yup.object<CreateDocumentFormValues>({
    name: yup.string().required(intl.required),
    description: yup.string().required(intl.required),
    informationTypes: yup
      .array(
        yup.object().shape<DocumentInformationTypes>({
          subjectCategories: yup.array(yup.string()).min(1, intl.required),
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

export const policySchema = () =>
  yup.object<PolicyFormValues>({
    informationType: yup
      .object<InformationTypeShort>()
      .required(intl.required)
      .test({
        name: "policyHasArt9",
        message: intl.requiredGdprArt9,
        test: function (informationType) {
          const { parent } = this;
          return !missingArt9LegalBasisForSensitiveInfoType(informationType, parent);
        },
      })
      .test({
        name: "policyHasArt6",
        message: intl.requiredGdprArt6,
        test: function () {
          const { parent } = this;
          return !missingArt6LegalBasisForInfoType(parent);
        },
      }),
    subjectCategories: yup.array().of(yup.string()).min(1, intl.required),
    legalBasesUse: yup
      .mixed()
      .oneOf(Object.values(LegalBasesUse))
      .required(intl.required)
      .test({
        name: "policyHasLegalBasisIfDedicated",
        message: intl.requiredLegalBasisForDedicated,
        test: function () {
          const { parent } = this;
          return !missingLegalBasisForDedicated(parent);
        },
      }),
    legalBases: yup.array(legalBasisSchema()),
    legalBasesOpen: yup.boolean().oneOf([false], intl.legalBasisComplete),
    process: yup.object(),
    purposeCode: yup.string(),
    id: yup.string(),
    documentIds: yup.array(yup.string()),
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
    legalBases: yup.array(legalBasisSchema()),
    legalBasesOpen: yup.boolean().oneOf([false], intl.legalBasisComplete),
    start: yup.string().matches(DATE_REGEX, { message: intl.dateFormat }),
    end: yup.string().matches(DATE_REGEX, { message: intl.dateFormat }),
  });

export const addDocumentToProcessSchema = () =>
  yup.object<AddDocumentToProcessFormValues>({
    document: yup.object<Document>().required(intl.required),
    informationTypes: yup.array(yup.object<DocumentInfoTypeUse>()).required(intl.required),
    process: yup.object<Process>().required(intl.required),
    defaultDocument: yup.boolean(),
  });
