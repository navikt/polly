import LocalizedStrings, {GlobalStrings, LocalizedStringsMethods} from 'react-localization'
import * as React from 'react'
import {useEffect} from 'react'
import {useForceUpdate} from '../hooks'
import {en, no, ta} from './lang'

import * as moment from 'moment'
import 'moment/locale/nb'
import 'moment/locale/ta'

import Locale from 'date-fns'
import nbLocale from 'date-fns/locale/nb'
import enLocale from 'date-fns/locale/en-GB'
import taLocale from 'date-fns/locale/ta'

export interface IStrings {
  //aareg avtale
  aaregContracts: string
  organisationNumber: string
  aaregContractNumber: string
  showAaregTable: string
  hideAaregTable: string
  createdDate: string
  accessType: string
  API: string
  extract: string
  webLookup: string
  incidents: string
  consumer: string
  contractAareg: string
  purposeForProcess: string
  authorityAndGroundsForDelivery: string
  consumerAuthorityForProcess: string
  purposeAuthorityLegalBasis: string
  available: string
  unavailable: string

  informationType: string
  informationTypes: string
  informationTypeSearch: string
  search: string
  term: string
  termEditHeader: string
  purpose: string
  processPurpose: string
  processNumber: string
  purposeOfTheProcess: string
  purposeDescription: string
  sensitivity: string
  processingActivities: string
  process: string
  dpProcess: string
  dpProcesses: string
  dpProcessPageTitle: string
  potentialPersonalCategoryUsage: string
  thirdPartyDpProcessTableTitle: string
  processes: string
  legalBasis: string
  legalBasisShort: string
  legalBasesShort: string
  subjectCategories: string
  nationalLaw: string
  gdprArticle: string
  orgMaster: string
  orgMasterInfTypeHeader: string
  productTeam: string
  productTeamFromTK: string
  productTeamFromTKHelpText: string
  product: string
  products: string
  team: string
  productArea: string
  riskOwner: string
  riskOwnerFunctionBinder: string
  riskOwnerFunction: string
  commonExternalProcessResponsible: string
  commonExternalProcessResponsibleHelpText: string
  system: string
  systems: string
  disclosure: string
  disclosures: string
  dispatcher: string
  linkDisclosurePage: string
  deleteProcessDisclosureError: string
  deleteRelationText: string
  editDisclosure: string
  documents: string
  dataAccessClass: string
  dataAccessClassSelect: string
  thirdParty: string
  policy: string
  usage: string
  and: string
  with: string
  pollyOrg: string
  or: string
  remove: string
  yes: string
  no: string
  unclarified: string
  unknown: string
  numberOfProcessesWithUnknownLegalBasis: string
  numberOfProcessesWithoutArticle6LegalBasis: string
  numberOfProcessesWithoutArticle9LegalBasis: string
  unknownLegalBasisHelpText: string
  withoutArticle6LegalBasisHelpText: string
  withoutArticle9LegalBasisHelpText: string
  processesWithUnknownLegalBasis: string
  processesWithoutArticle6LegalBasis: string
  processesWithoutArticle9LegalBasis: string
  incompleteLegalBasis: string
  notFilled: string
  filled: string
  automation: string
  isAutomationNeeded: string
  status: string
  processStatus: string
  processStatusHelpText: string
  isProcessImplemented: string
  inProgress: string
  completed: string
  incomplete: string
  automaticProcessing: string
  automaticProcessingExtra: string
  done: string
  filterPieChartsByStatus: string
  profiling: string
  isProfilingUsed: string
  profilingExtra: string
  contract: string
  contractHelpText: string
  contractOwner: string
  contractOwnerHelpText: string
  operationalContractManagers: string
  operationalContractManagersHelpText: string
  processor: string
  processors: string
  dpProcessDataProcessor: string
  processorYes: string
  dpProcessProcessorYes: string
  processorNo: string
  dpProcessDataProcessorNo: string
  processorUnclarified: string
  dpProcessDataProcessorUnclarified: string
  note: string
  noteHelpText: string
  processorExtra: string
  processorAgreement: string
  processorAgreementPlaceholder: string
  processorOutsideEU: string
  isDataProcessedOutsideEUEEAHelpText: string
  isDataProcessedOutsideEUEEAHelpTextDP: string
  transferPanelTitle: string
  isDataProcessedOutsideEUEEA: string
  isSubDataProcessedOutsideEUEEA: string
  transferGroundsOutsideEUEEA: string
  transferGroundsOutsideEUEEAHelpText: string
  transferGroundsOutsideEUEEAOther: string
  transferGroundsOutsideEUEEAOtherHelpText: string
  countries: string
  countriesHelpText: string
  includeDefaultDocument: string
  inProduction: string
  notInProduction: string
  isDpiaRequired: string
  dpiaReference: string
  dpiaReferencePlaceholder: string
  dpiaNeeded: string
  dpiaHelpText: string
  grounds: string
  reference: string
  ground: string
  pvk: string
  from: string
  retained: string
  retention: string
  retentionPlan: string
  retentionPlanYes: string
  retentionPlanNo: string
  retentionPlanUnclarified: string
  retentionMonths: string
  retentionStart: string
  retentionDescription: string
  retentionDescriptionPlaceHolder: string
  retentionPieChartTitle: string
  retentionReference: string
  processWithIncompleteRetention: string
  years: string
  months: string
  lastEvents: string
  disclosureName: string
  pvkRequired: string
  overallPurposeActivity: string
  // sentence
  containsInformationType: string
  containsProcesses: string
  loggedInStatus: string
  notLoggedInStatus: string
  couldntLoad: string
  couldntLoadTerm: string
  noTerm: string
  couldntLoadTeam: string
  informationTypeCreate: string
  informationTypeExists: string
  documentExists: string
  sensitivitySelect: string
  nameWrite: string
  categoriesWrite: string
  sourcesWrite: string
  usefulInformation: string
  keywordsWrite: string
  searchWordsWrite: string
  orgMasterSelect: string
  purposeSelect: string
  processorSelect: string
  purposeNotFound: string
  createProcessor: string
  processingActivityUse: string
  informationTypeExternalUse: string
  thirdParties: string
  alerts: string
  policyEdit: string
  policyNew: string
  policyAdd: string
  legalBasisNotFound: string
  processEdit: string
  processingActivitiesNew: string
  processingActivitiesEdit: string
  processNew: string
  processCreated: string
  doYouWantToAddPolicies: string
  addPolicies: string
  addDefaultDocument: string
  exceptionalUsage: string
  overallPurpose: string
  overallPurposeHelpText: string
  validityOfProcessHelpText: string
  organizingHelpText: string
  processNameHelpText: string
  processPurposeHelpText: string
  departmentHelpText: string
  productTeamHelpText: string
  subDepartmentHelpText: string
  systemHelpText: string
  usesAllInformationTypesHelpText: string
  processAutomationHelpText: string
  profilingHelpText: string
  isProcessorUsed: string
  isSubDataProcessorUsed: string
  processorHelpText: string
  processorAgreementHelpText: string
  processorOutsideEUExtraHelpText: string
  legalBasisHelpText: string
  retentionHelpText: string
  retentionDescriptionHelpText: string
  retentionNeedsHelpText: string
  processSideMenuHelpText: string
  informationTypeSideMenuHelpText: string
  documentSideMenuHelpText: string
  externalPartsSideMenuHelpText: string
  systemSideMenuHelpText: string
  disclosuresSideMenuHelpText: string
  processorSideMenuHelpText: string
  dashboard: string
  dashboardSideMenuHelpText: string
  processActivity: string
  legalBasisNew: string
  legalBasisAdd: string
  addArticle6: string
  addArticle9: string
  article6HelpText: string
  article9HelpText: string
  cardHeaderArticle6: string
  cardHeaderArticle9: string
  placeHolderArticle6: string
  placeHolderArticle9: string
  gdprSelect: string
  nationalLawSelect: string
  descriptionWrite: string
  descriptionWriteLegalBasesF: string
  descriptionWriteLegalBasesCE: string
  includeConservationPlan: string
  definitionWrite: string
  subjectCategoriesNotFound: string
  legalBasesProcess: string
  legalBasesOwn: string
  legalBasesUndecided: string
  notAllowedMessage: string
  confirmDeleteHeader: string
  confirmDeletePolicyText: string
  deleteProcessText: string
  deleteProcessorText: string
  confirmDeleteProcessText: string
  confirmDeleteProcessorText: string
  notFoundProcessor: string
  notFoundDisclosure: string
  processorName: string
  processorNameHelpText: string
  confirmDeleteDocumentText: string
  confirmDeleteDpProcess: string
  cannotDeleteProcess: string
  confirmDeleteInformationTypeText: string
  cannotDeleteInformationTypes: string
  informationTypeHasPolicies: string
  informationTypeHasDocuments: string
  startIllustration: string
  treasureIllustration: string
  legalbasisGDPRArt9Info: string
  legalBasisInfo: string
  groupByProcessingActivities: string
  showAll: string
  createThirdPartyModalTitle: string
  disclosuresToThirdParty: string
  retrievedFromThirdParty: string
  usageNotFound: string
  replace: string
  replaceAllUse: string
  newValue: string
  recipientPurpose: string
  disclosureSelect: string
  legalBasisComplete: string
  validityOfProcess: string
  validityOfPolicy: string
  chooseDocument: string
  addDocument: string
  searchDocuments: string
  searchProcess: string
  addOneInformationType: string
  addCollectionOfInformationTypes: string
  emptyTable: string
  emptyMessage: string
  pageNotFound: string
  createDocument: string
  searchDocumentPlaceholder: string
  eventType: string
  disclosurePurpose: string
  departmentSelect: string
  subDepartmentSelect: string
  teamSelect: string
  informationtypesUsedInDocument: string
  editDocument: string
  lastModified: string
  excessInfoHelpText: string
  completeness: string
  overview: string
  seeExternalLink: string
  dpProcessTitle: string
  article9: string
  article10: string
  createDpProcess: string
  dpProcessDuplicatedError: string
  externalProcessResponsible: string
  subDataProcessor: string
  relatedProcesses: string
  frontPageStartMessage: string
  disclosureNameTooltip: string
  disclosurePurposeTooltip: string
  disclosureDescriptionTooltip: string
  disclosureDocumentTooltip: string
  shortcutSubtitleProcess: string
  shortcutSubtitleInformationtype: string
  shortcutSubtitleThirdParty: string
  shortcutSubtitleDashboard: string
  canNotDeleteProcessorParagraph1: string
  canNotDeleteProcessorParagraph2: string
  moreInfo: string
  here: string

  // groups
  READ: string
  WRITE: string
  SUPER: string
  ADMIN: string

  CREATE: string
  DELETE: string
  UPDATE: string

  // Tables
  INFORMATION_TYPE: string
  POLICY: string
  PROCESS: string
  DISCLOSURE: string
  DOCUMENT: string
  CODELIST: string

  INFO: string
  WARNING: string
  ERROR: string

  // Alert events
  MISSING_LEGAL_BASIS: string
  EXCESS_INFO: string
  MISSING_ARTICLE_6: string
  MISSING_ARTICLE_9: string
  USES_ALL_INFO_TYPE: string

  // generic
  department: string
  subDepartmentShort: string
  organizing: string
  subDepartment: string
  save: string
  abort: string
  login: string
  logout: string
  hi: string
  addNew: string
  createNew: string
  name: string
  email: string
  copied: string
  groups: string
  description: string
  additionalDescription: string
  additionalDescriptionHelpText: string
  document: string
  edit: string
  editInformationTypes: string
  update: string
  export: string
  exportInternal: string
  exportExternal: string
  exportHeader: string
  sources: string
  categories: string
  keywords: string
  searchWords: string
  read: string
  write: string
  administrate: string
  delete: string
  appName: string
  beta: string
  all: string
  added: string
  addManyFromSystem: string
  level: string
  type: string
  help: string
  helpTooltip: string
  allProcesses: string
  navResponsible: string
  completedProcesses: string
  showCompletedProcesses: string
  inProgressProcesses: string
  filter: string
  startDate: string
  endDate: string
  active: string
  inactive: string
  preview: string
  view: string
  info: string
  version: string
  ghost: string
  period: string
  recipient: string
  prevButton: string
  nextButton: string
  of: string
  rows: string
  slack: string
  add: string
  summarySubjectCategories: string
  processContainsSubjectCategory: string
  maxChars: string
  required: string
  dateFormat: string
  datePickStart: string
  datePickEnd: string
  useDates: string
  requiredGdprArt6: string
  requiredGdprArt9: string
  requiredLegalBasisForDedicated: string
  requiredNationalLaw: string
  requiredDescription: string
  aboutUs: string
  fomDateHelpText: string
  tomDateHelpText: string
  mailLog: string
  deliverAbroad: string
  socialSecurityAgreement: string
  socialSecurityArea: string

  code: string
  codes: string
  shortName: string
  createCodeListTitle: string
  deleteCodeListConfirmationTitle: string
  editCodeListTitle: string
  manageCodeListTitle: string
  chooseCodeList: string
  createNewCodeList: string

  id: string
  close: string
  searchId: string
  audit: string
  audits: string
  auditNr: string
  auditNotFound: string
  table: string
  action: string
  time: string
  user: string
  lastChanges: string
  userLastChanges: string
  settings: string
  revision: string
  needsRevision: string
  revisionCreated: string
  newRevision: string
  revisionText: string
  completedOnly: string
  back: string
  one: string
  defaultProcessDocument: string
  goToSite: string
  categoryNotInUse: string
  mainPageMessage: string
  mainPageEventsMessage: string

  no_dpia_no_special_category_pi: string
  no_dpia_small_scale: string
  no_dpia_no_dataset_consolidation: string
  no_dpia_no_new_tech: string
  no_dpia_no_profiling_or_automation: string
  no_dpia_other: string

  specifyOther: string
  chooseGrounds: string

  //dp-process HelpText
  nameDpProcessHelpText: string
  externalProcessResponsibleDpProcessHelpText: string
  descriptionDpProcessHelpText: string
  purposeDpProcessHelpText: string
  article9DpProcessHelpText: string
  isSubDataProcessorUsedDpProcessHelpText: string
  retentionMonthsDpProcessHelpText: string
  missingPVK: string

  noInformationTypesAvailableInTable: string
  noCodesAvailableInTable: string
  noProcessesAvailableInTable: string
  noUsageAvailableInTable: string
  noDocumentsAvailableInTable: string
  noPotentialPersonalCategoryUsageInTable: string
  usesAllInformationTypes: string
  noAuditsAvailableInTable: string
  noDisclosuresToThirdPartyAvailableInTable: string
  noRetrievedFromThirdPartyAvailableInTable: string
  noAlertsAvailableInTable: string
  noAaregContractsAvailableInTable: string
  administrationArchiveCaseNumber: string
  supervisor: string
  omBehandlingskatalog: string
  confidentialityAssessment: string
  confidentialityDescriptionYes: string
  confidentialityDescriptionNo: string
}

// Remember import moment locales up top
export const langs: Langs = {
  nb: { flag: 'no', name: 'Norsk', langCode: 'nb', texts: no, dateLocale: nbLocale },
  en: { flag: 'gb', name: 'English', langCode: 'en', texts: en, dateLocale: enLocale },
}

if (window.location.hostname.indexOf('local') >= 0) {
  langs['ta'] = { flag: ['lk', 'in'][Math.floor(Math.random() * 2)], name: 'தமிழ்', langCode: 'ta', texts: ta, dateLocale: taLocale }
}

export const langsArray: Lang[] = Object.keys(langs).map((lang) => langs[lang])

// Controls starting language as well as fallback language if a text is missing in chosen language
const defaultLang = langs.nb

type IIntl = LocalizedStringsMethods & IStrings

interface LocalizedStringsFactory {
  new <T>(props: GlobalStrings<T>, options?: { customLanguageInterface: () => string }): IIntl
}

const strings: IntlLangs = {}

Object.keys(langs).forEach((lang) => (strings[lang] = langs[lang].texts))

export const intl: IIntl = new (LocalizedStrings as LocalizedStringsFactory)(strings as any, { customLanguageInterface: () => defaultLang.langCode })
export const currentLang = () => langs[intl.getLanguage()]

interface IntlLangs {
  [lang: string]: IStrings
}

export interface Lang {
  flag: string
  name: string
  langCode: string
  texts: any
  dateLocale: Locale
}

interface Langs {
  [lang: string]: Lang
}

// hooks

const localStorageAvailable = storageAvailable()

export const useLang = () => {
  const [lang, setLang] = React.useState<string>(((localStorageAvailable && localStorage.getItem('polly-lang')) as string) || defaultLang.langCode)
  const update = useForceUpdate()
  useEffect(() => {
    intl.setLanguage(lang)
    let momentlocale = moment.locale(lang)
    if (lang !== momentlocale) console.warn('moment locale missing', lang)
    localStorageAvailable && localStorage.setItem('polly-lang', lang)
    update()
  }, [lang])

  return setLang
}

function storageAvailable() {
  try {
    let key = 'ptab'
    localStorage.setItem(key, key)
    localStorage.removeItem(key)
    return true
  } catch (e: any) {
    return false
  }
}
