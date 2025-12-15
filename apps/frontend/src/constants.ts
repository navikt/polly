import { EListName, ICode, ICodelistProps } from './service/Codelist'
import { TColumnCompares } from './util/hooks'

export enum ELegalBasesUse {
  INHERITED_FROM_PROCESS = 'INHERITED_FROM_PROCESS',
  EXCESS_INFO = 'EXCESS_INFO',
  UNRESOLVED = 'UNRESOLVED',
  DEDICATED_LEGAL_BASES = 'DEDICATED_LEGAL_BASES',
}

export enum EAlertEventType {
  MISSING_LEGAL_BASIS = 'MISSING_LEGAL_BASIS',
  EXCESS_INFO = 'EXCESS_INFO',
  MISSING_ARTICLE_6 = 'MISSING_ARTICLE_6',
  MISSING_ARTICLE_9 = 'MISSING_ARTICLE_9',
  USES_ALL_INFO_TYPE = 'USES_ALL_INFO_TYPE',
}

export enum EAlertEventLevel {
  INFO = 'INFO',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
}

export enum EAuditAction {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
}

export enum EObjectType {
  INFORMATION_TYPE = 'INFORMATION_TYPE',
  POLICY = 'POLICY',
  PROCESS = 'PROCESS',
  PROCESSOR = 'PROCESSOR',
  DP_PROCESS = 'DP_PROCESS',
  DISCLOSURE = 'DISCLOSURE',
  DOCUMENT = 'DOCUMENT',
  CODELIST = 'CODELIST',
  GENERIC_STORAGE = 'GENERIC_STORAGE',
}

export enum EProcessField {
  DPIA = 'DPIA',
  DPIA_REFERENCE_MISSING = 'DPIA_REFERENCE_MISSING',
  PROFILING = 'PROFILING',
  AIUSAGE = 'AIUSAGE',
  AUTOMATION = 'AUTOMATION',
  RETENTION = 'RETENTION',
  RETENTION_DATA = 'RETENTION_DATA',
  DATA_PROCESSOR = 'DATA_PROCESSOR',
  EXCESS_INFO = 'EXCESS_INFO',
  USES_ALL_INFO_TYPE = 'USES_ALL_INFO_TYPE',
  MISSING_LEGAL_BASIS = 'MISSING_LEGAL_BASIS',
  MISSING_ARTICLE_6 = 'MISSING_ARTICLE_6',
  MISSING_ARTICLE_9 = 'MISSING_ARTICLE_9',
  COMMON_EXTERNAL_PROCESSOR = 'COMMON_EXTERNAL_PROCESSOR',
}

export type TSearchType =
  | 'all'
  | 'purpose'
  | 'process'
  | 'dpprocess'
  | 'team'
  | 'productarea'
  | 'department'
  | 'subDepartment'
  | 'nationalLaw'
  | 'gdprArticle'
  | 'informationType'
  | 'thirdParty'
  | 'system'
  | 'document'

export enum EProcessState {
  YES = 'YES',
  NO = 'NO',
  UNKNOWN = 'UNKNOWN',
}

export type TNavigableItem =
  | EObjectType
  | EListName.CATEGORY
  | EListName.PURPOSE
  | EListName.DEPARTMENT
  | EListName.SUB_DEPARTMENT
  | EListName.THIRD_PARTY
  | EListName.SYSTEM
  | EListName.GDPR_ARTICLE
  | EListName.NATIONAL_LAW
  | 'team'
  | 'productarea'

export enum EProcessStatusFilter {
  All = 'ALL',
  COMPLETED = 'COMPLETED',
  IN_PROGRESS = 'IN_PROGRESS',
  NEEDS_REVISION = 'NEEDS_REVISION',
}

export enum EProcessStatus {
  COMPLETED = 'COMPLETED',
  IN_PROGRESS = 'IN_PROGRESS',
  NEEDS_REVISION = 'NEEDS_REVISION',
}

export enum ENoDpiaReason {
  NO_SPECIAL_CATEGORY_PI = 'NO_SPECIAL_CATEGORY_PI',
  SMALL_SCALE = 'SMALL_SCALE',
  NO_DATASET_CONSOLIDATION = 'NO_DATASET_CONSOLIDATION',
  NO_NEW_TECH = 'NO_NEW_TECH',
  NO_PROFILING_OR_AUTOMATION = 'NO_PROFILING_OR_AUTOMATION',
  OTHER = 'OTHER',
}
export enum EProcessSelection {
  ONE = 'ONE',
  ALL = 'ALL',
  DEPARTMENT = 'DEPARTMENT',
  PRODUCT_AREA = 'PRODUCT_AREA',
}

export interface IProcessRevisionRequest {
  processSelection: EProcessSelection
  processId?: string
  department?: string
  productAreaId?: string
  revisionText: string
  completedOnly: boolean
}

export const TRANSFER_GROUNDS_OUTSIDE_EU_OTHER = 'OTHER'

export interface IInformationtypeFormValues {
  id?: string
  term?: string
  name?: string
  description?: string
  orgMaster?: string
  productTeams: string[]
  sensitivity?: string
  categories: string[]
  sources: string[]
  keywords: string[]
}

export interface IPolicyFormValues {
  id?: string
  purposes: string[]
  informationType?: IInformationTypeShort
  process: { id: string; name: string; legalBases: ILegalBasis[] }
  subjectCategories: string[]
  legalBasesUse: ELegalBasesUse
  legalBases: Array<ILegalBasisFormValues>
  legalBasesOpen: boolean
  documentIds: string[]
  otherPolicies: IPolicy[]
}

export interface IProcessFormValues {
  id?: string
  purposes: string[]
  name?: string
  description?: string
  additionalDescription?: string
  affiliation: IAffiliationFormValues
  commonExternalProcessResponsible?: string
  legalBases: Array<ILegalBasisFormValues>
  legalBasesOpen: boolean
  end?: string
  start?: string
  dpia: IDpia
  status?: EProcessStatus
  usesAllInformationTypes?: boolean
  automaticProcessing?: boolean
  aiUsageDescription: IAiUsageDescription
  profiling?: boolean
  dataProcessing: IDataProcessingFormValues
  retention: IRetention
  disclosures: IDisclosure[]
}

export interface IAffiliationFormValues {
  department?: string
  nomDepartmentId?: string
  nomDepartmentName?: string
  seksjoner: INomSeksjon[]
  fylker: INomData[]
  navKontorer: INomData[]
  subDepartments: string[]
  productTeams: string[]
  products: string[]
  disclosureDispatchers: string[]
}

export interface INomData {
  nomId: string
  nomName: string
}

export interface INomSeksjon {
  nomSeksjonId: string
  nomSeksjonName: string
}

export interface IAffiliation {
  department?: ICode
  nomDepartmentId?: string
  nomDepartmentName?: string
  seksjoner: INomSeksjon[]
  fylker: INomData[]
  navKontorer: INomData[]
  subDepartments: ICode[]
  productTeams: string[]
  products: ICode[]
  disclosureDispatchers: ICode[]
}

export interface IDpia {
  grounds?: string
  needForDpia?: boolean
  processImplemented: boolean
  refToDpia?: string
  riskOwner?: string
  riskOwnerFunction?: string
  noDpiaReasons: string[]
}

export interface IDataProcessingFormValues {
  dataProcessor?: boolean
  processors: string[]
}

export interface IDataProcessing {
  dataProcessor?: boolean
  processors: string[]
}

export interface IRetention {
  retentionPlan?: boolean
  retentionMonths?: number
  retentionStart?: string
  retentionDescription?: string
}

export interface IAaregAvtale {
  avtalenummer: string
  organisasjonsnummer: string
  virksomhet: string
  integrert_oppslag_api: boolean
  uttrekk: boolean
  web_oppslag: boolean
  opprettet: string
  status: string
  databehandler_navn: string
  databehandler_organisasjonsnummer: string
  virksomhetskategori: string
  hjemmel_behandlingsgrunnlag_formal: string
  hendelser: boolean
}

export interface IDpRetention {
  retentionMonths?: number
  retentionStart?: string
}

export interface ILegalBasisFormValues {
  gdpr?: string
  nationalLaw?: string
  description?: string
  key?: string
}

export interface ITerm {
  id: string
  name: string
  description: string
}

export interface ILegalBasis {
  gdpr: ICode
  nationalLaw?: ICode
  description?: string
}

export interface IInformationType {
  id: string
  name: string
  term?: string
  description?: string
  sensitivity: ICode
  orgMaster?: ICode
  productTeams: string[]
  keywords: string[]
  sources: ICode[]
  categories: ICode[]
  changeStamp: IChangeStamp
}

export interface IPolicy {
  id: string
  informationType: IInformationTypeShort
  process: IProcess
  purposes: ICode[]
  subjectCategories: ICode[]
  legalBasesUse: ELegalBasesUse
  legalBases: ILegalBasis[]
  documentIds?: string[]
}

export const getPolicySort = (codelistUtils: ICodelistProps): TColumnCompares<IPolicy> => {
  return {
    purposes: (a, b) =>
      codelistUtils &&
      codelistUtils
        .getShortnameForCode(a.purposes[0])
        .localeCompare(codelistUtils.getShortnameForCode(b.purposes[0]), 'nb'),
    informationType: (a, b) => a.informationType.name.localeCompare(b.informationType.name),
    process: (a, b) => (a.process?.name || '').localeCompare(b.process?.name || ''),
    subjectCategories: (a, b) =>
      codelistUtils &&
      codelistUtils
        .getShortnameForCode(a.subjectCategories[0])
        .localeCompare(codelistUtils.getShortnameForCode(b.subjectCategories[0]), 'nb'),
    legalBases: (a, b) => a.legalBases.length - b.legalBases.length,
  }
}

export const disclosureSort: TColumnCompares<IDisclosure> = {
  name: (a, b) => (a.name || '').localeCompare(b.name || ''),
  recipient: (a, b) => a.recipient.shortName.localeCompare(b.recipient.shortName),
  recipientPurpose: (a, b) => a.recipientPurpose.localeCompare(b.recipientPurpose),
  document: (a, b) => (a.document?.name || '').localeCompare(b.document?.name || ''),
  description: (a, b) => a.description.localeCompare(b.description),
  legalBases: (a, b) => a.legalBases.length - b.legalBases.length,
}

export const informationTypeSort: TColumnCompares<IInformationType> = {
  name: (a, b) => (a.name || '').localeCompare(b.name || ''),
  description: (a, b) => (a.description || '').localeCompare(b.description || ''),
  orgMaster: (a, b) => (a.orgMaster?.shortName || '').localeCompare(b.orgMaster?.shortName || ''),
  term: (a, b) => (a.term || '').localeCompare(b.term || ''),
}

export const documentSort: TColumnCompares<IDocumentInfoTypeUse> = {
  informationType: (a, b) => a.informationType.name.localeCompare(b.informationType.name),
  subjectCategories: (a, b) => a.subjectCategories.length - b.subjectCategories.length,
}

export const getProcessSort = (codelistUtils: ICodelistProps): TColumnCompares<IProcess> => {
  return {
    name: (a, b) => a.name.localeCompare(b.name),
    purposes: (a, b) =>
      codelistUtils
        .getShortnameForCode(a.purposes[0])
        .localeCompare(codelistUtils.getShortnameForCode(b.purposes[0]), 'nb'),
    affiliation: (a) =>
      (a.affiliation.department?.shortName || '').localeCompare(
        a.affiliation.department?.shortName || ''
      ),
  }
}

export const dpProcessSort: TColumnCompares<IDpProcess> = {
  name: (a, b) => a.name.localeCompare(b.name),
  externalProcessResponsible: (a, b) =>
    (a.externalProcessResponsible?.shortName || '').localeCompare(
      b.externalProcessResponsible?.shortName || ''
    ),
  affiliation: (a) =>
    (a.affiliation.department?.shortName || '').localeCompare(
      a.affiliation.department?.shortName || ''
    ),
  description: (a, b) => (a.description || '').localeCompare(b.description || ''),
  changeStamp: (a, b) =>
    (a.changeStamp.lastModifiedBy || '').localeCompare(b.changeStamp.lastModifiedBy || ''),
}

export interface IInformationTypeShort {
  id: string
  name: string
  sensitivity: ICode
}

export interface IProcessShort {
  id: string
  name: string
  number: number
  description?: string
  purposes: ICode[]
  affiliation: IAffiliation
  status?: EProcessStatus
  end: string
  commonExternalProcessResponsible?: ICode
  changeStamp: IChangeStamp
}

export interface IProcessShortWithEmail {
  id: string
  name: string
  number: number
  description?: string
  purposes: ICode[]
  affiliation: IAffiliation
  status?: EProcessStatus
  commonExternalProcessResponsible?: ICode
  changeStamp: IChangeStamp
  lastModifiedEmail?: string
}

export interface IDpProcessShort {
  id: string
  name: string
  affiliation: IAffiliation
}

export interface IProcess extends IDurationed {
  id: string
  name: string
  number: number
  description?: string
  additionalDescription?: string
  legalBases: ILegalBasis[]
  affiliation: IAffiliation
  commonExternalProcessResponsible: ICode
  policies: IPolicy[]
  purposes: ICode[]
  changeStamp: IChangeStamp
  dpia: IDpia
  status?: EProcessStatus
  usesAllInformationTypes: boolean
  automaticProcessing?: boolean
  profiling?: boolean
  aiUsageDescription: IAiUsageDescription
  dataProcessing: IDataProcessing
  retention: IRetention
  revisionText?: string
}

export interface IAiUsageDescription {
  aiUsage?: boolean
  description?: string
  reusingPersonalInformation?: boolean
  startDate?: string
  endDate?: string
  registryNumber?: string
}

export interface IDpProcess extends IDurationed {
  id: string
  name: string
  dpProcessNumber: number
  description?: string
  purposeDescription?: string
  affiliation: IAffiliation
  externalProcessResponsible?: ICode
  dataProcessingAgreements: string[]
  subDataProcessing: IDataProcessing
  changeStamp: IChangeStamp
  art9?: boolean
  art10?: boolean
  retention: IDpRetention
}

export interface IDpProcessWithEmail extends IDurationed {
  id: string
  name: string
  dpProcessNumber: number
  description?: string
  purposeDescription?: string
  affiliation: IAffiliation
  externalProcessResponsible?: ICode
  dataProcessingAgreements: string[]
  subDataProcessing: IDataProcessing
  changeStamp: IChangeStamp
  art9?: boolean
  art10?: boolean
  retention: IDpRetention
  lastModifiedEmail?: string
}

export interface IDpProcessFormValues {
  id?: string
  name: string
  description?: string
  purposeDescription?: string
  affiliation: IAffiliationFormValues
  externalProcessResponsible?: string
  dataProcessingAgreements: string[]
  subDataProcessing: IDataProcessingFormValues
  art9?: boolean
  art10?: boolean
  retention: IDpRetention
  start?: string
  end?: string
}

export interface IChangeStamp {
  lastModifiedBy: string
  lastModifiedDate: string
}

export interface ITeamResource {
  navIdent: string
  givenName: string
  familyName: string
  fullName: string
  email: string
  resourceType: string
}

export interface IProcessCount {
  counts: { [code: string]: number }
}

export interface IUserInfo {
  loggedIn: boolean
  groups: string[]
  ident?: string
  name?: string
  givenName?: string
  familyName?: string
  email?: string
}

export interface IPageResponse<T> {
  pageNumber: number
  pageSize: number
  pages: number
  numberOfElements: number
  totalElements: number
  content: T[]
}

export interface IDurationed {
  active: boolean
  start: string
  end: string
}

export interface ICodeListFormValues {
  list: string
  code: string
  shortName?: string
  description?: string
}

export interface ITeam {
  id: string
  name: string
  description: string
  productAreaId?: string
  slackChannel?: string
  tags: string[]
  members: IMember[]
}

export interface IProductArea {
  id: string
  name: string
  description: string
  tags: string[]
  members: IMember[]
}

export interface IMember {
  name?: string
  email?: string
}

export interface ICodeListFormValues {
  list: string
  code: string
  shortName?: string
  description?: string
}

export interface IDisclosureFormValues {
  id?: string
  name?: string
  recipient?: string
  recipientPurpose?: string
  description?: string
  documentId?: string
  document?: IDocumentFormValues
  legalBases: ILegalBasisFormValues[]
  legalBasesOpen: boolean
  end?: string
  start?: string
  processes: IProcessShort[]
  informationTypes?: IInformationTypeShort[]
  abroad: IDisclosureAbroad
  administrationArchiveCaseNumber?: string
  thirdCountryReceiver?: boolean
  processIds: string[]
  assessedConfidentiality?: boolean
  confidentialityDescription?: string
  productTeams?: string[]
  department?: string
  nomDepartmentId?: string
  nomDepartmentName?: string
}

export interface IDisclosureAbroad {
  abroad?: boolean
  countries: string[]
  refToAgreement?: string
  businessArea?: string
}

export interface IDisclosure extends IDurationed {
  id: string
  name: string
  recipient: ICode
  recipientPurpose: string
  description: string
  documentId?: string
  document?: IDocument
  legalBases: ILegalBasis[]
  processes: IProcessShort[]
  processIds: string[]
  informationTypes?: IInformationTypeShort[]
  informationTypeIds?: string[]
  abroad: IDisclosureAbroad
  administrationArchiveCaseNumber?: string
  thirdCountryReceiver?: boolean
  assessedConfidentiality?: boolean
  confidentialityDescription?: string
  productTeams?: string[]
  department?: ICode
  nomDepartmentId?: string
  nomDepartmentName?: string

  changeStamp: IChangeStamp
}

export interface IDocumentFormValues {
  id?: string
  name: string
  description: string
  informationTypes: IDocumentInfoTypeUse[]
  dataAccessClass?: string
}

export interface IDocument {
  id: string
  name: string
  description: string
  informationTypes: IDocumentInfoTypeUse[]
  dataAccessClass: ICode
}

export interface IDocumentInfoTypeUse {
  informationTypeId: string
  informationType: IInformationTypeShort
  subjectCategories: ICode[]
}

export interface IAddDocumentToProcessFormValues {
  document?: IDocument
  informationTypes: IDocumentInfoTypeUse[]
  linkDocumentToPolicies: boolean
  process: ICustomizedProcess
}

export interface ICustomizedProcess {
  id: string
  name: string
  purposes: ICode[]
}

export interface ICreateDocumentFormValues {
  name: string
  description: string
  informationTypes: IDocumentInformationTypes[]
  dataAccessClass?: string
}

export interface IDocumentInformationTypes {
  id?: string
  informationTypeId: string
  subjectCategories: string[]
}

export interface IProcessor {
  id: string
  name: string
  contract?: string
  contractOwner?: string
  operationalContractManagers: string[]
  note?: string
  outsideEU?: boolean
  transferGroundsOutsideEU?: ICode
  transferGroundsOutsideEUOther?: string
  countries?: string[]
  changeStamp?: IChangeStamp
}

export interface IProcessorFormValues {
  id?: string
  name: string
  contract?: string
  contractOwner?: string
  operationalContractManagers: string[]
  note?: string
  outsideEU?: boolean
  transferGroundsOutsideEU?: string
  transferGroundsOutsideEUOther?: string
  countries: string[]
}

export interface IAuditItem {
  action: EAuditAction
  id: string
  table: EObjectType
  tableId: string
  time: string
  user: string
  data: object
}

export type TEvent = Omit<IAuditItem, 'user' | 'data'> & { name: string }

export interface IAuditLog {
  id: string
  audits: IAuditItem[]
}

export interface ICodeUsage {
  listName: EListName
  code: string
  inUse: boolean
  disclosures: [IUse]
  documents: [IUse]
  informationTypes: [IUse]
  policies: [IUseWithPurpose]
  processes: [IProcessShort]
  processors: [IUse]
  dpProcesses: [IDpProcessShort]
}

export interface IRecentEdits {
  time: string
  process: IProcessShort
}

export interface IUse {
  id: string
  name: string
}

export interface IUseWithPurpose {
  id: string
  processId: string
  name: string
  purposes: string[]
}

export interface ICategoryUsage {
  listName: string
  codesInUse: ICodeUsage[]
}

export interface ISettings {
  defaultProcessDocument: string
  frontpageMessage: string
}

export interface IInformationTypeAlert {
  informationTypeId: string
  processes: IProcessAlert[]
}

export interface IProcessAlert {
  processId: string
  policies: IPolicyAlert[]
}

export interface IPolicyAlert {
  policyId: string
  missingLegalBasis: boolean
  excessInfo: boolean
  missingArt6: boolean
  missingArt9: boolean
}

export interface IDisclosureAlert {
  disclosureId: string
  missingArt6: boolean
}

export interface IAlertEvent {
  id: string
  process?: IProcessShort
  informationType?: IInformationTypeShort
  disclosure?: IDisclosure
  type: EAlertEventType
  level: EAlertEventLevel
  changeStamp: IChangeStamp
}

export type TRecursivePartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[]
    ? TRecursivePartial<U>[]
    : T[P] extends object
      ? TRecursivePartial<T[P]>
      : T[P]
}

export interface IDashboardData {
  all: IAllDashCount
  departments: IDepartmentDashCount[]
  productAreas: IProductAreaDashCount[]
}

interface IDashCount {
  processes: number
  dpProcesses: number
  processesCompleted: number
  processesInProgress: number
  processesNeedsRevision: number
  processesMissingLegalBases: number
  processesUsingAllInfoTypes: number
  processesMissingArt6: number
  processesMissingArt9: number
  dpia: ICounter
  aiUsage: ICounter
  profiling: ICounter
  automation: ICounter
  retention: ICounter
  retentionDataIncomplete: number
  dataProcessor: ICounter
  dataProcessorAgreementMissing: number
  dataProcessorOutsideEU: ICounter
  commonExternalProcessResponsible: number
  dpiaReferenceMissing: number
}

export interface IAllDashCount extends IDashCount {
  disclosures: number
  disclosuresIncomplete: number
}

export interface IDepartmentDashCount extends IDashCount {
  department: string
}

export interface IProductAreaDashCount extends IDashCount {
  productAreaId: string
}

export interface ICounter {
  yes: number
  no: number
  unknown: number
}

export interface IOrgEnhet {
  id: string
  navn: string
  orgEnhetsType: EOrgEnhetsType
  nomNivaa: ENomNivaa
}

export enum EOrgEnhetsType {
  ARBEIDSLIVSSENTER = 'ARBEIDSLIVSSENTER',
  NAV_ARBEID_OG_YTELSER = 'NAV_ARBEID_OG_YTELSER',
  ARBEIDSRAADGIVNING = 'ARBEIDSRAADGIVNING',
  DIREKTORAT = 'DIREKTORAT',
  DIR = 'DIR',
  FYLKE = 'FYLKE',
  NAV_FAMILIE_OG_PENSJONSYTELSER = 'NAV_FAMILIE_OG_PENSJONSYTELSER',
  HJELPEMIDLER_OG_TILRETTELEGGING = 'HJELPEMIDLER_OG_TILRETTELEGGING',
  KLAGEINSTANS = 'KLAGEINSTANS',
  NAV_KONTAKTSENTER = 'NAV_KONTAKTSENTER',
  KONTROLL_KONTROLLENHET = 'KONTROLL_KONTROLLENHET',
  NAV_KONTOR = 'NAV_KONTOR',
  TILTAK = 'TILTAK',
  NAV_OKONOMITJENESTE = 'NAV_OKONOMITJENESTE',
}

export enum ENomNivaa {
  LINJEENHET = 'LINJEENHET',
  DRIFTSENHET = 'DRIFTSENHET',
  ARBEIDSOMRAADE = 'ARBEIDSOMRAADE',
}

export type TOption = Readonly<{
  value?: string | number
  label?: React.ReactNode
  index?: number
}>

export type TSearchItem = {
  id: string
  sortKey: string
  typeName: string
  tagColor?: string
  label: string
  type: TNavigableItem
  number?: number
}
