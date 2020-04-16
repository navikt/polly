import LocalizedStrings, {GlobalStrings, LocalizedStringsMethods} from "react-localization";
import * as React from "react";
import {useEffect} from "react";
import {useForceUpdate} from "../hooks";
import {en, no, ta} from "./lang";
import * as moment from "moment";
import "moment/locale/nb";
import "moment/locale/ta";

export interface IStrings {
  informationType: string;
  informationTypes: string;
  informationTypeSearch: string;
  search: string;
  term: string;
  termEditHeader: string;
  purpose: string;
  processPurpose: string;
  purposeOfTheProcess: string;
  purposeDescription: string;
  sensitivity: string;
  processingActivities: string;
  process: string;
  processes: string;
  legalBasis: string;
  legalBasisShort: string;
  legalBasesShort: string;
  subjectCategories: string;
  nationalLaw: string;
  navMaster: string;
  productTeam: string;
  product: string;
  products: string;
  team: string;
  riskOwner: string;
  system: string;
  disclosure: string;
  disclosures: string;
  documents: string;
  thirdParty: string;
  policy: string;
  usage: string;
  and: string;
  remove: string;
  yes: string;
  no: string;
  unclarified: string;
  notFilled: string;
  automation: string;
  status: string;
  processStatus: string;
  processStatusHelpText: string;
  isProcessImplemented: string;
  inProgress: string;
  completed: string;
  automaticProcessing: string;
  automaticProcessingExtra: string;
  profiling: string;
  profilingExtra: string;
  dataProcessor: string;
  dataProcessorYes: string;
  dataProcessorNo: string;
  dataProcessorUnclarified: string;
  dataProcessorExtra: string;
  dataProcessorAgreement: string;
  dataProcessorOutsideEU: string;
  dataProcessorOutsideEUExtra: string;
  includeDefaultDocument: string;
  inProduction: string;
  notInProduction: string;
  isDpiaRequired: string;
  dpiaReference: string;
  grounds: string;
  reference: string;
  ground: string;
  pvk: string;
  from: string;
  retained: string;
  retention: string;
  retentionPlan: string;
  retentionPlanYes: string;
  retentionPlanNo: string;
  retentionPlanUnclarified: string;
  retentionMonths: string;
  retentionStart: string;
  retentionDescription: string;
  years: string;
  months: string;
  lastEvents: string;
  disclosureName: string;
  pvkRequired: string;

  // sentence
  containsInformationType: string;
  containsProcesses: string;
  loggedInStatus: string;
  notLoggedInStatus: string;
  couldntLoad: string;
  couldntLoadTerm: string;
  noTerm: string;
  couldntLoadTeam: string;
  informationTypeCreate: string;
  informationTypeExists: string;
  documentExists: string;
  sensitivitySelect: string;
  nameWrite: string;
  categoriesWrite: string;
  sourcesWrite: string;
  keywordsWrite: string;
  navMasterSelect: string;
  purposeSelect: string;
  purposeNotFound: string;
  purposeUse: string;
  informationTypeExternalUse: string;
  usesAllInformationTypes: string;
  thirdParties: string;
  policyEdit: string;
  policyNew: string;
  policyAdd: string;
  legalBasisNotFound: string;
  processEdit: string;
  processingActivitiesNew: string;
  processingActivitiesEdit: string;
  processNew: string;
  exceptionalUsage: string;
  overallPurpose: string;
  overallPurposeHelpText: string;
  validityOfProcessHelpText: string;
  organizingHelpText: string;
  processNameHelpText: string;
  processPurposeHelpText: string;
  departmentHelpText: string;
  productTeamHelpText: string;
  subDepartmentHelpText: string;
  systemHelpText: string;
  usesAllInformationTypesHelpText: string;
  processAutomationHelpText: string;
  profilingHelpText: string;
  dataProcessorHelpText: string;
  dataProcessorAgreementHelpText: string;
  dataProcessorOutsideEUExtraHelpText: string;
  legalBasisHelpText: string;
  retentionHelpText: string;
  retentionDescriptionHelpText: string;
  legalBasisNew: string;
  legalBasisAdd: string;
  gdprSelect: string;
  nationalLawSelect: string;
  descriptionWrite: string;
  descriptionWriteLegalBasesF: string;
  descriptionWriteLegalBasesCE: string;
  includeConservationPlan: string;
  definitionWrite: string;
  subjectCategoriesNotFound: string;
  legalBasesProcess: string;
  legalBasesOwn: string;
  legalBasesUndecided: string;
  legalBasesUndecidedWarning: string;
  legalBasesArt6Warning: string;
  legalBasesArt9Warning: string;
  notAllowedMessage: string;
  confirmDeleteHeader: string;
  confirmDeletePolicyText: string;
  confirmDeleteProcessText: string;
  confirmDeleteDocumentText: string;
  cannotDeleteProcess: string;
  confirmDeleteInformationTypeText: string;
  cannotDeleteInformationTypes: string;
  informationTypeHasPolicies: string;
  informationTypeHasDocuments: string;
  startIllustration: string;
  treasureIllustration: string;
  legalbasisGDPRArt9Info: string;
  legalBasisInfo: string;
  groupByPurpose: string;
  showAll: string;
  createThirdPartyModalTitle: string;
  disclosuresToThirdParty: string;
  retrievedFromThirdParty: string;
  usageNotFound: string;
  replace: string;
  replaceAllUse: string;
  newValue: string;
  recipientPurpose: string;
  disclosureSelect: string;
  legalBasisComplete: string;
  validityOfProcess: string;
  validityOfPolicy: string;
  chooseDocument: string;
  addDocument: string;
  searchDocuments: string;
  addOneInformationType: string;
  addCollectionOfInformationTypes: string;
  emptyTable: string;
  pageNotFound: string;
  createdDocument: string;
  searchDocumentPlaceholder: string;
  eventType: string;
  disclosurePurpose: string;
  departmentSelect: string;
  subDepartmentSelect: string;
  teamSelect: string;
  informationtypesUsedInDocument: string;
  editDocument: string;
  lastModified: string;

  // groups
  POLLY_READ: string;
  POLLY_WRITE: string;
  POLLY_ADMIN: string;

  CREATE: string;
  DELETE: string;
  UPDATE: string;

  // Tables
  INFORMATION_TYPE: string;
  POLICY: string;
  PROCESS: string;
  DISCLOSURE: string;
  DOCUMENT: string;
  CODELIST: string;

  // generic
  department: string;
  subDepartmentShort: string;
  organizing: string;
  subDepartment: string;
  save: string;
  abort: string;
  login: string;
  logout: string;
  hi: string;
  addNew: string;
  createNew: string;
  name: string;
  email: string;
  copied: string;
  groups: string;
  description: string;
  additionalDescription: string;
  document: string;
  edit: string;
  update: string;
  export: string;
  sources: string;
  categories: string;
  keywords: string;
  read: string;
  write: string;
  administrate: string;
  delete: string;
  appName: string;
  beta: string;
  all: string;
  allProcesses: string;
  completedProcesses: string;
  showCompletedProcesses: string;
  inProgressProcesses: string;
  filter:string;
  startDate: string;
  endDate: string;
  active: string;
  inactive: string;
  preview: string;
  view: string;
  info: string;
  version: string;
  ghost: string;
  period: string;
  recipient: string;
  prevButton: string;
  nextButton: string;
  rows: string;
  slack: string;
  add: string;
  summarySubjectCategories: string;
  maxChars: string;
  required: string;
  dateFormat: string;
  datePickStart: string;
  datePickEnd: string;
  useDates: string;
  requiredGdprArt6: string;
  requiredGdprArt9: string;
  requiredNationalLaw: string;
  requiredDescription: string;

  code: string;
  codes: string;
  shortName: string;
  createCodeListTitle: string;
  deleteCodeListConfirmationTitle: string;
  editCodeListTitle: string;
  manageCodeListTitle: string;
  chooseCodeList: string;
  createNewCodeList: string;

  id: string;
  close: string;
  searchId: string;
  audit: string;
  audits: string;
  auditNr: string;
  auditNotFound: string;
  table: string;
  action: string;
  time: string;
  user: string;
  lastChanges: string;
  settings: string;
  defaultProcessDocument: string;
}

// Remember import moment locales up top
export const langs: Langs = {
  nb: { flag: "no", name: "Norsk", langCode: "nb", texts: no },
  en: { flag: "gb", name: "English", langCode: "en", texts: en }
};

if (window.location.hostname.indexOf("local") >= 0) {
  langs["ta"] = { flag: ["lk", "in"][Math.floor(Math.random() * 2)], name: "தமிழ்", langCode: "ta", texts: ta };
}

export const langsArray: Lang[] = Object.keys(langs).map(lang => langs[lang]);

// Controls starting language as well as fallback language if a text is missing in chosen language
const defaultLang = langs.nb;

type IIntl = LocalizedStringsMethods & IStrings;

interface LocalizedStringsFactory {
  new <T>(props: GlobalStrings<T>, options?: { customLanguageInterface: () => string }): IIntl;
}

const strings: IntlLangs = {};

Object.keys(langs).forEach(lang => (strings[lang] = langs[lang].texts));

export const intl: IIntl = new (LocalizedStrings as LocalizedStringsFactory)(strings as any, { customLanguageInterface: () => defaultLang.langCode });

interface IntlLangs {
  [lang: string]: IStrings;
}

export interface Lang {
  flag: string;
  name: string;
  langCode: string;
  texts: any;
}

interface Langs {
  [lang: string]: Lang;
}

// hooks

const localStorageAvailable = storageAvailable();

export const useLang = () => {
  const [lang, setLang] = React.useState<string>(((localStorageAvailable && localStorage.getItem("polly-lang")) as string) || defaultLang.langCode);
  const update = useForceUpdate();
  useEffect(() => {
    intl.setLanguage(lang);
    let momentlocale = moment.locale(lang);
    if (lang !== momentlocale) console.warn("moment locale missing", lang);
    localStorageAvailable && localStorage.setItem("polly-lang", lang);
    update();
  }, [lang]);

  return setLang;
};

function storageAvailable() {
  try {
    let key = "ptab";
    localStorage.setItem(key, key);
    localStorage.removeItem(key);
    return true;
  } catch (e) {
    return false;
  }
}
