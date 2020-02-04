import { Code, codelist, ListName } from "./service/Codelist"
import { ColumnCompares } from "./util/hooks"
import { intl } from "./util"

export interface InformationtypeFormValues {
  id?: string
  term?: string
  name?: string
  description?: string
  navMaster?: string
  sensitivity?: string
  categories: string[]
  sources: string[]
  keywords: string[]
}

export interface PolicyFormValues {
  id?: string
  purposeCode: string
  informationType?: PolicyInformationType
  process: PolicyProcess
  subjectCategories: string[]
  legalBasesStatus?: LegalBasesStatus
  legalBases: Array<LegalBasisFormValues>
  legalBasesOpen: boolean
  end?: string
  start?: string
  documentIds?: string[]
}

export enum LegalBasesStatus {
  OWN = "OWN",
  INHERITED = "INHERITED",
  UNKNOWN = "UNKNOWN"
}

export interface ProcessFormValues {
  id?: string
  purposeCode?: string
  name?: string
  description?: string
  department?: string
  subDepartment?: string
  productTeam?: string
  product?: string
  legalBases: Array<LegalBasisFormValues>
  legalBasesOpen: boolean
  end?: string
  start?: string

  automaticProcessing?: boolean
  profiling?: boolean
  dataProcessor?: boolean
  dataProcessorAgreements: string[]
  dataProcessorOutsideEU?: boolean

  includeDefaultDocument: boolean
}

export interface LegalBasisFormValues {
  gdpr?: string
  nationalLaw?: string
  description?: string
  end?: string
  start?: string
}

export interface Term {
  id: string
  name: string
  description: string
}

export interface LegalBasis extends IDurationed {
  description: string
  gdpr: Code
  nationalLaw?: Code
}

export interface InformationType {
  id: string
  name: string
  term?: string
  description: string
  sensitivity: Code
  navMaster: Code
  keywords: string[]
  sources: Code[]
  categories: Code[]
  toBeDeleted: boolean
}

export interface Policy extends IDurationed {
  id: string
  informationType: PolicyInformationType
  process: PolicyProcess
  purposeCode: Code
  subjectCategories: Code[]
  legalBasesInherited: boolean
  legalBases: LegalBasis[]
  documentIds?: string[]
}

export const policySort: ColumnCompares<Policy> = {
  purposeCode: (a, b) => codelist.getShortnameForCode(a.purposeCode).localeCompare(codelist.getShortnameForCode(b.purposeCode), intl.getLanguage()),
  informationType: (a, b) => a.informationType.name.localeCompare(b.informationType.name),
  process: (a, b) => a.process.name.localeCompare(b.process.name),
  subjectCategories: (a, b) => codelist.getShortnameForCode(a.subjectCategories[0]).localeCompare(codelist.getShortnameForCode(b.subjectCategories[0]), intl.getLanguage()),
  legalBases: (a, b) => a.legalBases.length - b.legalBases.length
}
export const disclosureSort: ColumnCompares<Disclosure> = {
  recipient: (a, b) => a.recipient.shortName.localeCompare(b.recipient.shortName),
  recipientPurpose: (a, b) => a.recipientPurpose.localeCompare(b.recipientPurpose),
  document: (a, b) => (a.document?.name || '').localeCompare(b.document?.name || ''),
  description: (a, b) => a.description.localeCompare(b.description),
  legalBases: (a, b) => a.legalBases.length - b.legalBases.length
}

export interface PolicyInformationType {
  id: string
  name: string
  sensitivity: Code
}

export interface PolicyProcess {
  id: string
  name: string
  legalBases: LegalBasis[]
}

export interface Process extends IDurationed {
  id: string
  name: string
  description?: string
  legalBases: LegalBasis[]
  department: Code
  subDepartment: Code
  productTeam: string
  product: Code
  policies: Policy[]
  purposeCode: string

  automaticProcessing?: boolean
  profiling?: boolean
  dataProcessor?: boolean
  dataProcessorAgreements?: string[]
  dataProcessorOutsideEU?: boolean
}

export interface ProcessPurposeCount {
  purposes: { [purpose: string]: number }
}

export interface UserInfo {
  loggedIn: boolean
  groups: string[]
  navIdent?: string
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
  list: string,
  code: string,
  shortName?: string,
  description?: string
}

export interface Team {
  id: string
  name: string
  members: Member[]
}

export interface Member {
  name: string
  email: string
}

export interface CodeListFormValues {
  list: string
  code: string
  shortName?: string
  description?: string
}

export interface DisclosureFormValues {
  id?: string
  recipient?: string
  description?: string
  documentId?: string
  document?: DocumentFormValues
  legalBases: LegalBasisFormValues[]
  legalBasesOpen: boolean;
  end?: string
  start?: string
}

export interface Disclosure extends IDurationed {
  id: string
  recipient: Code
  recipientPurpose: string
  description: string
  documentId?: string
  document?: Document
  legalBases: LegalBasis[]
}

export interface DocumentFormValues {
  id?: string
  name: string
  description: string
  informationTypes: PolicyInformationType[]
}

export interface Document {
  id: string
  name: string
  description: string
  informationTypes: DocumentInfoTypeUse[]
}

export interface DocumentInfoTypeUse {
  informationTypeId: string,
  informationType: PolicyInformationType,
  subjectCategories: Code[]
}

export interface AddDocumentToProcessFormValues {
  document?: Document
  informationTypes: DocumentInfoTypeUse[]
  process: Process
}

export interface CreateDocumentFormValues{
  name: string;
  description: string;
  informationTypes: DocumentInformationTypes[]
}

export interface DocumentInformationTypes{
  id?: string;
  informationTypeId: string;
  subjectCategories: string[]
}

export enum AuditAction {
  CREATE = "CREATE",
  UPDATE = "UPDATE",
  DELETE = "DELETE"
}

export enum ObjectType {
  INFORMATION_TYPE = "INFORMATION_TYPE",
  POLICY = "POLICY",
  PROCESS = "PROCESS",
  DISCLOSURE = "DISCLOSURE",
  DOCUMENT = "DOCUMENT",
  CODELIST = "CODELIST",
  GENERIC_STORAGE = "GENERIC_STORAGE"
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
  policies: [Use]
  processes: [Use]
}

export interface Use {
  id: string
  name: string
}

export interface CategoryUsage {
  listName: string
  codesInUse: CodeUsage[]
}

export interface Settings {
  defaultProcessDocument: string;
}
