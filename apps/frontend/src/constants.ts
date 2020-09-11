import {Code, codelist, ListName} from './service/Codelist'
import {ColumnCompares} from './util/hooks'
import {intl} from './util'

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
  DP_PROCESS = 'DP_PROCESS',
  DISCLOSURE = 'DISCLOSURE',
  DOCUMENT = 'DOCUMENT',
  CODELIST = 'CODELIST',
  GENERIC_STORAGE = 'GENERIC_STORAGE',
}

export enum ProcessField {
  DPIA = 'DPIA',
  PROFILING = 'PROFILING',
  AUTOMATION = 'AUTOMATION',
  RETENTION = 'RETENTION',
  RETENTION_DATA = 'RETENTION_DATA',
  DATA_PROCESSOR = 'DATA_PROCESSOR',
  DATA_PROCESSOR_OUTSIDE_EU = 'DATA_PROCESSOR_OUTSIDE_EU',
  DATA_PROCESSOR_AGREEMENT_EMPTY = 'DATA_PROCESSOR_AGREEMENT_EMPTY',
  EXCESS_INFO = 'EXCESS_INFO',
  USES_ALL_INFO_TYPE = 'USES_ALL_INFO_TYPE',
  MISSING_LEGAL_BASIS = 'MISSING_LEGAL_BASIS',
  MISSING_ARTICLE_6 = 'MISSING_ARTICLE_6',
  MISSING_ARTICLE_9 = 'MISSING_ARTICLE_9',
}

export enum ProcessState {
  YES = 'YES',
  NO = 'NO',
  UNKNOWN = 'UNKNOWN'
}

export type NavigableItem =
  ObjectType
  | ListName.CATEGORY
  | ListName.PURPOSE
  | ListName.DEPARTMENT
  | ListName.SUB_DEPARTMENT
  | ListName.THIRD_PARTY
  | ListName.SYSTEM
  | ListName.GDPR_ARTICLE
  | ListName.NATIONAL_LAW
  | 'team'
  | 'productarea';

export enum ProcessStatus {
  All = 'ALL',
  COMPLETED = 'COMPLETED',
  IN_PROGRESS = 'IN_PROGRESS'
}



export const TRANSFER_GROUNDS_OUTSIDE_EU_OTHER = 'OTHER'

export interface InformationtypeFormValues {
  id?: string;
  term?: string;
  name?: string;
  description?: string;
  orgMaster?: string;
  productTeams: string[];
  sensitivity?: string;
  categories: string[];
  sources: string[];
  keywords: string[];
}

export interface PolicyFormValues {
  id?: string;
  purposeCode: string;
  informationType?: InformationTypeShort;
  process: {id: string; name: string; legalBases: LegalBasis[]};
  subjectCategories: string[];
  legalBasesUse: LegalBasesUse;
  legalBases: Array<LegalBasisFormValues>;
  legalBasesOpen: boolean;
  documentIds: string[];
  otherPolicies: Policy[]
}

export interface ProcessFormValues {
  id?: string;
  purposeCode?: string;
  name?: string;
  description?: string;
  affiliation: AffiliationFormValues
  commonExternalProcessResponsible?: string;
  legalBases: Array<LegalBasisFormValues>;
  legalBasesOpen: boolean;
  end?: string;
  start?: string;

  dpia: Dpia;
  status?: ProcessStatus;
  usesAllInformationTypes?: boolean;
  automaticProcessing?: boolean;
  profiling?: boolean;
  dataProcessing: DataProcessingFormValues;
  retention: Retention;
}

export interface AffiliationFormValues {
  department?: string;
  subDepartments: string[];
  productTeams: string[];
  products: string[];
}

export interface Affiliation {
  department?: Code;
  subDepartments: Code[];
  productTeams: string[];
  products: Code[];
}

export interface Dpia {
  grounds: string;
  needForDpia?: boolean;
  processImplemented: boolean;
  refToDpia: string;
  riskOwner?: string;
  riskOwnerFunction?: string;
}

export interface DataProcessingFormValues {
  dataProcessor?: boolean;
  dataProcessorAgreements: string[];
  dataProcessorOutsideEU?: boolean;
  transferGroundsOutsideEU?: string;
  transferGroundsOutsideEUOther?: string;
  transferCountries: string[];
}

export interface DataProcessing {
  dataProcessor?: boolean;
  dataProcessorAgreements: string[];
  dataProcessorOutsideEU?: boolean;
  transferGroundsOutsideEU?: Code;
  transferGroundsOutsideEUOther?: string;
  transferCountries: string[];
}

export interface Retention {
  retentionPlan?: boolean;
  retentionMonths?: number;
  retentionStart?: string;
  retentionDescription?: string;
}

export interface LegalBasisFormValues {
  gdpr?: string;
  nationalLaw?: string;
  description?: string;
  key?: string;
}

export interface Term {
  id: string;
  name: string;
  description: string;
}

export interface LegalBasis {
  gdpr: Code;
  nationalLaw?: Code;
  description?: string;
}

export interface InformationType {
  id: string;
  name: string;
  term?: string;
  description?: string;
  sensitivity: Code;
  orgMaster?: Code;
  productTeams: string[];
  keywords: string[];
  sources: Code[];
  categories: Code[];
  changeStamp: ChangeStamp;
}

export interface Policy {
  id: string;
  informationType: InformationTypeShort;
  process: Process;
  purposeCode: Code;
  subjectCategories: Code[];
  legalBasesUse: LegalBasesUse;
  legalBases: LegalBasis[];
  documentIds?: string[];
}

export const policySort: ColumnCompares<Policy> = {
  purposeCode: (a, b) => codelist.getShortnameForCode(a.purposeCode).localeCompare(codelist.getShortnameForCode(b.purposeCode), intl.getLanguage()),
  informationType: (a, b) => a.informationType.name.localeCompare(b.informationType.name),
  process: (a, b) => (a.process?.name || '').localeCompare(b.process?.name || ''),
  subjectCategories: (a, b) => codelist.getShortnameForCode(a.subjectCategories[0]).localeCompare(codelist.getShortnameForCode(b.subjectCategories[0]), intl.getLanguage()),
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

export interface InformationTypeShort {
  id: string;
  name: string;
  sensitivity: Code;
}

export interface ProcessShort {
  id: string;
  name: string;
  purpose: Code;
  affiliation: Affiliation;
  status?: ProcessStatus;
}

export interface DpProcessShort {
  id: string;
  name: string;
  affiliation: Affiliation;
}

export interface Process extends IDurationed {
  id: string;
  name: string;
  description?: string;
  legalBases: LegalBasis[];
  affiliation: Affiliation;
  commonExternalProcessResponsible: Code;
  policies: Policy[];
  purpose: Code;
  changeStamp: ChangeStamp;
  dpia: Dpia;
  status?: ProcessStatus;
  usesAllInformationTypes: boolean;
  automaticProcessing?: boolean;
  profiling?: boolean;
  dataProcessing: DataProcessing;
  retention: Retention;
}

export interface DpProcess extends IDurationed {
  affiliation: Affiliation;

  art10?: boolean;
  art9?: boolean;
  changeStamp: ChangeStamp;

  dataProcessingAgreement?: boolean;
  dataProcessingAgreements: string[];

  description?: string;
  externalProcessResponsible?: Code;

  id: string;
  name: string;
  purposeDescription?: string;
  retention: Retention

  subDataProcessing: DataProcessing;
}

export interface DpProcessFormValues {
  affiliation: AffiliationFormValues

  art10?: boolean;
  art9?: boolean;

  dataProcessingAgreement?: boolean;
  dataProcessingAgreements: string[];

  description?: string;
  end: string;
  externalProcessResponsible?: string;

  id?: string;
  name?: string;
  purposeDescription?: string;
  retention: Retention

  start: string;
  subDataProcessing: DataProcessingFormValues;
}

export interface ChangeStamp {
  lastModifiedBy: string;
  lastModifiedDate: string;
}

export interface TeamResource {
  navIdent: string;
  givenName: string;
  familyName: string;
  fullName: string;
  email: string;
  resourceType: string;
}

export interface ProcessCount {
  counts: {[code: string]: number};
}

export interface UserInfo {
  loggedIn: boolean;
  groups: string[];
  ident?: string;
  name?: string;
  givenName?: string;
  familyName?: string;
  email?: string;
}

export interface PageResponse<T> {
  pageNumber: number;
  pageSize: number;
  pages: number;
  numberOfElements: number;
  totalElements: number;
  content: T[];
}

export interface IDurationed {
  active: boolean;
  start: string;
  end: string;
}

export interface CodeListFormValues {
  list: string;
  code: string;
  shortName?: string;
  description?: string;
}

export interface Team {
  id: string;
  name: string;
  description: string;
  productAreaId?: string;
  slackChannel?: string;
  tags: string[];
  members: Member[];
}

export interface ProductArea {
  id: string;
  name: string;
  description: string;
  tags: string[];
  members: Member[];
}

export interface Member {
  name?: string;
  email?: string;
}

export interface CodeListFormValues {
  list: string;
  code: string;
  shortName?: string;
  description?: string;
}

export interface DisclosureFormValues {
  id?: string;
  name?: string;
  recipient?: string;
  recipientPurpose?: string;
  description?: string;
  documentId?: string;
  document?: DocumentFormValues | undefined;
  legalBases: LegalBasisFormValues[];
  legalBasesOpen: boolean;
  end?: string;
  start?: string;
}

export interface Disclosure extends IDurationed {
  id: string;
  name: string;
  recipient: Code;
  recipientPurpose: string;
  description: string;
  documentId?: string;
  document?: Document;
  legalBases: LegalBasis[];
}

export interface DocumentFormValues {
  id?: string;
  name: string;
  description: string;
  informationTypes: DocumentInfoTypeUse[];
}

export interface Document {
  id: string;
  name: string;
  description: string;
  informationTypes: DocumentInfoTypeUse[];
}

export interface DocumentInfoTypeUse {
  informationTypeId: string;
  informationType: InformationTypeShort;
  subjectCategories: Code[];
}

export interface AddDocumentToProcessFormValues {
  document?: Document;
  informationTypes: DocumentInfoTypeUse[];
  defaultDocument: boolean;
  process: {id: string; name: string; purpose: Code};
}

export interface CreateDocumentFormValues {
  name: string;
  description: string;
  informationTypes: DocumentInformationTypes[];
}

export interface DocumentInformationTypes {
  id?: string;
  informationTypeId: string;
  subjectCategories: string[];
}

export interface AuditItem {
  action: AuditAction;
  id: string;
  table: ObjectType;
  tableId: string;
  time: string;
  user: string;
  data: object;
}

export type Event = Omit<AuditItem, 'user' | 'data'> & {name: string};

export interface AuditLog {
  id: string;
  audits: AuditItem[];
}

export interface CodeUsage {
  listName: ListName;
  code: string;
  inUse: boolean;
  disclosures: [Use];
  documents: [Use];
  informationTypes: [Use];
  policies: [UseWithPurpose];
  processes: [ProcessShort];
  dpProcesses: [DpProcessShort];
}

export interface Use {
  id: string;
  name: string;
}

export interface UseWithPurpose {
  id: string;
  processId: string;
  name: string;
  purposeCode: string;
}

export interface CategoryUsage {
  listName: string;
  codesInUse: CodeUsage[];
}

export interface Settings {
  defaultProcessDocument: string;
  frontpageMessage: string;
}

export interface InformationTypeAlert {
  informationTypeId: string;
  processes: ProcessAlert[];
}

export interface ProcessAlert {
  processId: string;
  policies: PolicyAlert[];
}

export interface PolicyAlert {
  policyId: string;
  missingLegalBasis: boolean;
  excessInfo: boolean;
  missingArt6: boolean;
  missingArt9: boolean;
}

export interface DisclosureAlert {
  disclosureId: string;
  missingArt6: boolean;
}

export interface AlertEvent {
  id: string;
  process?: ProcessShort;
  informationType?: InformationTypeShort;
  disclosure?: Disclosure;
  type: AlertEventType;
  level: AlertEventLevel;
  changeStamp: ChangeStamp;
}

export type RecursivePartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[] ? RecursivePartial<U>[] : T[P] extends object ? RecursivePartial<T[P]> : T[P];
};

export interface DashboardData {
  allProcesses: ProcessesDashCount
  departmentProcesses: DepartmentProcessDashCount[]
  productAreaProcesses: ProductAreaProcessDashCount[]
}

export interface ProcessesDashCount {
  processes: number
  processesCompleted: number
  processesInProgress: number
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
}

export interface DepartmentProcessDashCount extends ProcessesDashCount {
  department: string;
}

export interface ProductAreaProcessDashCount extends DepartmentProcessDashCount {
  productAreaId: string;
}

export interface Counter {
  yes: number;
  no: number;
  unknown: number;
}
