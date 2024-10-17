import {Code, codelist, ListName} from './service/Codelist'
import {ColumnCompares} from './util/hooks'

export enum LegalBasesUse {
  INHERITED_FROM_PROCESS = 'INHERITED_FROM_PROCESS',
  EXCESS_INFO = 'EXCESS_INFO',
  UNRESOLVED = 'UNRESOLVED',
  DEDICATED_LEGAL_BASES = 'DEDICATED_LEGAL_BASES',
}

export enum AlertEventType {
  MISSING_LEGAL_BASIS = 'MISSING_LEGAL_BASIS',
  EXCESS_INFO = 'EXCESS_INFO',
  MISSING_ARTICLE_6 = 'MISSING_ARTICLE_6',
  MISSING_ARTICLE_9 = 'MISSING_ARTICLE_9',
  USES_ALL_INFO_TYPE = 'USES_ALL_INFO_TYPE',
}

export enum AlertEventLevel {
  INFO = 'INFO',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
}

export enum AuditAction {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
}

export enum ObjectType {
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

export enum ProcessField {
  DPIA = 'DPIA',
  DPIA_REFERENCE_MISSING = 'DPIA_REFERENCE_MISSING',
  PROFILING = 'PROFILING',
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

export type SearchType =
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

export enum ProcessState {
  YES = 'YES',
  NO = 'NO',
  UNKNOWN = 'UNKNOWN',
}

export type NavigableItem =
  | ObjectType
  | ListName.CATEGORY
  | ListName.PURPOSE
  | ListName.DEPARTMENT
  | ListName.SUB_DEPARTMENT
  | ListName.THIRD_PARTY
  | ListName.SYSTEM
  | ListName.GDPR_ARTICLE
  | ListName.NATIONAL_LAW
  | 'team'
  | 'productarea'

export enum ProcessStatusFilter {
  All = 'ALL',
  COMPLETED = 'COMPLETED',
  IN_PROGRESS = 'IN_PROGRESS',
  NEEDS_REVISION = 'NEEDS_REVISION',
}

export enum ProcessStatus {
  COMPLETED = 'COMPLETED',
  IN_PROGRESS = 'IN_PROGRESS',
  NEEDS_REVISION = 'NEEDS_REVISION',
}

export enum NoDpiaReason {
  NO_SPECIAL_CATEGORY_PI = 'NO_SPECIAL_CATEGORY_PI',
  SMALL_SCALE = 'SMALL_SCALE',
  NO_DATASET_CONSOLIDATION = 'NO_DATASET_CONSOLIDATION',
  NO_NEW_TECH = 'NO_NEW_TECH',
  NO_PROFILING_OR_AUTOMATION = 'NO_PROFILING_OR_AUTOMATION',
  OTHER = 'OTHER',
}

export const TRANSFER_GROUNDS_OUTSIDE_EU_OTHER = 'OTHER'

export interface InformationtypeFormValues {
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

export interface PolicyFormValues {
  id?: string
  purposes: string[]
  informationType?: InformationTypeShort
  process: { id: string; name: string; legalBases: LegalBasis[] }
  subjectCategories: string[]
  legalBasesUse: LegalBasesUse
  legalBases: Array<LegalBasisFormValues>
  legalBasesOpen: boolean
  documentIds: string[]
  otherPolicies: Policy[]
}

export interface ProcessFormValues {
  id?: string
  purposes: string[]
  name?: string
  description?: string
  additionalDescription?: string
  affiliation: AffiliationFormValues
  commonExternalProcessResponsible?: string
  legalBases: Array<LegalBasisFormValues>
  legalBasesOpen: boolean
  end?: string
  start?: string

  dpia: Dpia
  status?: ProcessStatus
  usesAllInformationTypes?: boolean
  automaticProcessing?: boolean
  profiling?: boolean
  dataProcessing: DataProcessingFormValues
  retention: Retention
  disclosures: Disclosure[]
}

export interface AffiliationFormValues {
  department?: string
  subDepartments: string[]
  productTeams: string[]
  products: string[]
  disclosureDispatchers: string[]
}

export interface Affiliation {
  department?: Code
  subDepartments: Code[]
  productTeams: string[]
  products: Code[]
  disclosureDispatchers: Code[]
}

export interface Dpia {
  grounds?: string
  needForDpia?: boolean
  processImplemented: boolean
  refToDpia?: string
  riskOwner?: string
  riskOwnerFunction?: string
  noDpiaReasons: string[]
}

export interface DataProcessingFormValues {
  dataProcessor?: boolean
  processors: string[]
}

export interface DataProcessing {
  dataProcessor?: boolean
  processors: string[]
}

export interface Retention {
  retentionPlan?: boolean
  retentionMonths?: number
  retentionStart?: string
  retentionDescription?: string
}

export interface AaregAvtale {
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

export interface DpRetention {
  retentionMonths?: number
  retentionStart?: string
}

export interface LegalBasisFormValues {
  gdpr?: string
  nationalLaw?: string
  description?: string
  key?: string
}

export interface Term {
  id: string
  name: string
  description: string
}

export interface LegalBasis {
  gdpr: Code
  nationalLaw?: Code
  description?: string
}

export interface InformationType {
  id: string
  name: string
  term?: string
  description?: string
  sensitivity: Code
  orgMaster?: Code
  productTeams: string[]
  keywords: string[]
  sources: Code[]
  categories: Code[]
  changeStamp: ChangeStamp
}

export interface Policy {
  id: string
  informationType: InformationTypeShort
  process: Process
  purposes: Code[]
  subjectCategories: Code[]
  legalBasesUse: LegalBasesUse
  legalBases: LegalBasis[]
  documentIds?: string[]
}



export interface ProcessRevisionRequest {
  processSelection: IRecipientType
  processId?: string
  department?: string
  productAreaId?: string
  revisionText: string
  completedOnly: boolean
}

export const policySort: ColumnCompares<Policy> = {
  purposes: (a, b) => codelist.getShortnameForCode(a.purposes[0]).localeCompare(codelist.getShortnameForCode(b.purposes[0]), 'nb'),
export const policySort: TColumnCompares<IPolicy> = {
  purposes: (a, b) =>
    codelist
      .getShortnameForCode(a.purposes[0])
      .localeCompare(codelist.getShortnameForCode(b.purposes[0]), 'nb'),
  informationType: (a, b) => a.informationType.name.localeCompare(b.informationType.name),
  process: (a, b) => (a.process?.name || '').localeCompare(b.process?.name || ''),
  subjectCategories: (a, b) => codelist.getShortnameForCode(a.subjectCategories[0]).localeCompare(codelist.getShortnameForCode(b.subjectCategories[0]), 'nb'),
  legalBases: (a, b) => a.legalBases.length - b.legalBases.length,
}

export const disclosureSort: ColumnCompares<Disclosure> = {
  name: (a, b) => (a.name || '').localeCompare(b.name || ''),
  recipient: (a, b) => a.recipient.shortName.localeCompare(b.recipient.shortName),
  recipientPurpose: (a, b) => a.recipientPurpose.localeCompare(b.recipientPurpose),
  document: (a, b) => (a.document?.name || '').localeCompare(b.document?.name || ''),
  description: (a, b) => a.description.localeCompare(b.description),
  legalBases: (a, b) => a.legalBases.length - b.legalBases.length,
}

export const informationTypeSort: ColumnCompares<InformationType> = {
  name: (a, b) => (a.name || '').localeCompare(b.name || ''),
  description: (a, b) => (a.description || '').localeCompare(b.description || ''),
  orgMaster: (a, b) => (a.orgMaster?.shortName || '').localeCompare(b.orgMaster?.shortName || ''),
  term: (a, b) => (a.term || '').localeCompare(b.term || ''),
}

export const documentSort: ColumnCompares<DocumentInfoTypeUse> = {
  informationType: (a, b) => a.informationType.name.localeCompare(b.informationType.name),
  subjectCategories: (a, b) => a.subjectCategories.length - b.subjectCategories.length,
}

export const processSort: ColumnCompares<Process> = {
  name: (a, b) => a.name.localeCompare(b.name),
  purposes: (a, b) => codelist.getShortnameForCode(a.purposes[0]).localeCompare(codelist.getShortnameForCode(b.purposes[0]), 'nb'),
  affiliation: (a, b) => (a.affiliation.department?.shortName || '').localeCompare(a.affiliation.department?.shortName || ''),
}

export const dpProcessSort: ColumnCompares<DpProcess> = {
  name: (a, b) => a.name.localeCompare(b.name),
  externalProcessResponsible: (a, b) => (a.externalProcessResponsible?.shortName || '').localeCompare(b.externalProcessResponsible?.shortName || ''),
  affiliation: (a, b) => (a.affiliation.department?.shortName || '').localeCompare(a.affiliation.department?.shortName || ''),
  description: (a, b) => (a.description || '').localeCompare(b.description || ''),
  changeStamp: (a, b) => (a.changeStamp.lastModifiedBy || '').localeCompare(b.changeStamp.lastModifiedBy || ''),
}

export interface InformationTypeShort {
  id: string
  name: string
  sensitivity: Code
}

export interface ProcessShort {
  id: string
  name: string
  number: number
  description?: string
  purposes: Code[]
  affiliation: Affiliation
  status?: ProcessStatus
  end: string
  commonExternalProcessResponsible?: Code
  changeStamp: ChangeStamp
}

export interface ProcessShortWithEmail {
  id: string
  name: string
  number: number
  description?: string
  purposes: Code[]
  affiliation: Affiliation
  status?: ProcessStatus
  commonExternalProcessResponsible?: Code
  changeStamp: ChangeStamp
  lastModifiedEmail?: string
}

export interface DpProcessShort {
  id: string
  name: string
  affiliation: Affiliation
}

export interface Process extends IDurationed {
  id: string
  name: string
  number: number
  description?: string
  additionalDescription?: string
  legalBases: LegalBasis[]
  affiliation: Affiliation
  commonExternalProcessResponsible: Code
  policies: Policy[]
  purposes: Code[]
  changeStamp: ChangeStamp
  dpia: Dpia
  status?: ProcessStatus
  usesAllInformationTypes: boolean
  automaticProcessing?: boolean
  profiling?: boolean
  dataProcessing: DataProcessing
  retention: Retention
  revisionText?: string
}

export interface DpProcess extends IDurationed {
  id: string
  name: string
  dpProcessNumber: number
  description?: string
  purposeDescription?: string
  affiliation: Affiliation
  externalProcessResponsible?: Code
  dataProcessingAgreements: string[]
  subDataProcessing: DataProcessing
  changeStamp: ChangeStamp
  art9?: boolean
  art10?: boolean
  retention: DpRetention
}

export interface DpProcessWithEmail extends IDurationed {
  id: string
  name: string
  dpProcessNumber: number
  description?: string
  purposeDescription?: string
  affiliation: Affiliation
  externalProcessResponsible?: Code
  dataProcessingAgreements: string[]
  subDataProcessing: DataProcessing
  changeStamp: ChangeStamp
  art9?: boolean
  art10?: boolean
  retention: DpRetention
  lastModifiedEmail?: string
}

export interface DpProcessFormValues {
  id?: string
  name: string
  description?: string
  purposeDescription?: string
  affiliation: AffiliationFormValues
  externalProcessResponsible?: string
  dataProcessingAgreements: string[]
  subDataProcessing: DataProcessingFormValues
  art9?: boolean
  art10?: boolean
  retention: DpRetention
  start?: string
  end?: string
}

export interface ChangeStamp {
  lastModifiedBy: string
  lastModifiedDate: string
}

export interface TeamResource {
  navIdent: string
  givenName: string
  familyName: string
  fullName: string
  email: string
  resourceType: string
}

export interface ProcessCount {
  counts: { [code: string]: number }
}

export interface UserInfo {
  loggedIn: boolean
  groups: string[]
  ident?: string
  name?: string
  givenName?: string
  familyName?: string
  email?: string
}

export interface PageResponse<T> {
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

export interface CodeListFormValues {
  list: string
  code: string
  shortName?: string
  description?: string
}

export interface Team {
  id: string
  name: string
  description: string
  productAreaId?: string
  slackChannel?: string
  tags: string[]
  members: Member[]
}

export interface ProductArea {
  id: string
  name: string
  description: string
  tags: string[]
  members: Member[]
}

export interface Member {
  name?: string
  email?: string
}

export interface CodeListFormValues {
  list: string
  code: string
  shortName?: string
  description?: string
}

export interface DisclosureFormValues {
  id?: string
  name?: string
  recipient?: string
  recipientPurpose?: string
  description?: string
  documentId?: string
  document?: DocumentFormValues
  legalBases: LegalBasisFormValues[]
  legalBasesOpen: boolean
  end?: string
  start?: string
  processes: ProcessShort[]
  informationTypes?: InformationTypeShort[]
  abroad: DisclosureAbroad
  administrationArchiveCaseNumber?: string
  thirdCountryReceiver?: boolean
  processIds: string[]
  assessedConfidentiality?: boolean
  confidentialityDescription?: string
  productTeams?: string[]
  department?: string
}

export interface DisclosureAbroad {
  abroad?: boolean
  countries: string[]
  refToAgreement?: string
  businessArea?: string
}

export interface Disclosure extends IDurationed {
  id: string
  name: string
  recipient: Code
  recipientPurpose: string
  description: string
  documentId?: string
  document?: Document
  legalBases: LegalBasis[]
  processes: ProcessShort[]
  processIds: string[]
  informationTypes?: InformationTypeShort[]
  informationTypeIds?: string[]
  abroad: DisclosureAbroad
  administrationArchiveCaseNumber?: string
  thirdCountryReceiver?: boolean
  assessedConfidentiality?: boolean
  confidentialityDescription?: string
  productTeams?: string[]
  department?: Code

  changeStamp: ChangeStamp
}

export interface DocumentFormValues {
  id?: string
  name: string
  description: string
  informationTypes: DocumentInfoTypeUse[]
  dataAccessClass?: string
}

export interface Document {
  id: string
  name: string
  description: string
  informationTypes: DocumentInfoTypeUse[]
  dataAccessClass: Code
}

export interface DocumentInfoTypeUse {
  informationTypeId: string
  informationType: InformationTypeShort
  subjectCategories: Code[]
}

export interface AddDocumentToProcessFormValues {
  document?: Document
  informationTypes: DocumentInfoTypeUse[]
  linkDocumentToPolicies: boolean
  process: CustomizedProcess
}

export interface CustomizedProcess {
  id: string
  name: string
  purposes: Code[]
}

export interface CreateDocumentFormValues {
  name: string
  description: string
  informationTypes: DocumentInformationTypes[]
  dataAccessClass?: string
}

export interface DocumentInformationTypes {
  id?: string
  informationTypeId: string
  subjectCategories: string[]
}

export interface Processor {
  id: string
  name: string
  contract?: string
  contractOwner?: string
  operationalContractManagers: string[]
  note?: string
  outsideEU?: boolean
  transferGroundsOutsideEU?: Code
  transferGroundsOutsideEUOther?: string
  countries?: string[]
  changeStamp?: ChangeStamp
}

export interface ProcessorFormValues {
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

export interface AuditItem {
  action: AuditAction
  id: string
  table: ObjectType
  tableId: string
  time: string
  user: string
  data: object
}

export type Event = Omit<AuditItem, 'user' | 'data'> & { name: string }

export interface AuditLog {
  id: string
  audits: AuditItem[]
}

export interface CodeUsage {
  listName: ListName
  code: string
  inUse: boolean
  disclosures: [Use]
  documents: [Use]
  informationTypes: [Use]
  policies: [UseWithPurpose]
  processes: [ProcessShort]
  processors: [Use]
  dpProcesses: [DpProcessShort]
}

export interface RecentEdits {
  time: string
  process: ProcessShort
}

export interface Use {
  id: string
  name: string
}

export interface UseWithPurpose {
  id: string
  processId: string
  name: string
  purposes: string[]
}

export interface CategoryUsage {
  listName: string
  codesInUse: CodeUsage[]
}

export interface Settings {
  defaultProcessDocument: string
  frontpageMessage: string
}

export interface InformationTypeAlert {
  informationTypeId: string
  processes: ProcessAlert[]
}

export interface ProcessAlert {
  processId: string
  policies: PolicyAlert[]
}

export interface PolicyAlert {
  policyId: string
  missingLegalBasis: boolean
  excessInfo: boolean
  missingArt6: boolean
  missingArt9: boolean
}

export interface DisclosureAlert {
  disclosureId: string
  missingArt6: boolean
}

export interface AlertEvent {
  id: string
  process?: ProcessShort
  informationType?: InformationTypeShort
  disclosure?: Disclosure
  type: AlertEventType
  level: AlertEventLevel
  changeStamp: ChangeStamp
}

export type RecursivePartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[] ? RecursivePartial<U>[] : T[P] extends object ? RecursivePartial<T[P]> : T[P]
}

export interface DashboardData {
  all: AllDashCount
  departments: DepartmentDashCount[]
  productAreas: ProductAreaDashCount[]
}

interface DashCount {
  processes: number
  dpProcesses: number
  processesCompleted: number
  processesInProgress: number
  processesNeedsRevision: number
  processesMissingLegalBases: number
  processesUsingAllInfoTypes: number
  processesMissingArt6: number
  processesMissingArt9: number
  dpia: Counter
  profiling: Counter
  automation: Counter
  retention: Counter
  retentionDataIncomplete: number
  dataProcessor: Counter
  dataProcessorAgreementMissing: number
  dataProcessorOutsideEU: Counter
  commonExternalProcessResponsible: number
  dpiaReferenceMissing: number
}

export interface AllDashCount extends DashCount {
  disclosures: number
  disclosuresIncomplete: number
}

export interface DepartmentDashCount extends DashCount {
  department: string
}

export interface ProductAreaDashCount extends DashCount {
  productAreaId: string
}

export interface Counter {
  yes: number
  no: number
  unknown: number
}
