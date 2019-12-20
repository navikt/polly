import { Code, codelist } from "./service/Codelist";
import { ColumnCompares } from "./util/hooks"
import { intl } from "./util"

export interface InformationtypeFormValues {
    id?: string;
    term?: string;
    name?: string;
    description?: string;
    navMaster?: string;
    sensitivity?: string;
    categories: string[];
    sources: string[];
    keywords: string[];
}

export interface PolicyFormValues {
    id?: string;
    purposeCode: string;
    informationType?: PolicyInformationType;
    process: PolicyProcess;
    subjectCategory?: string;
    legalBasesStatus?: LegalBasesStatus;
    legalBases: Array<LegalBasisFormValues>;
    end?: string;
    start?: string;
}

export enum LegalBasesStatus {
    OWN = "OWN",
    INHERITED = "INHERITED",
    UNKNOWN = "UNKNOWN"
}

export interface ProcessFormValues {
    id?: string;
    purposeCode?: string;
    name?: string;
    department?: string;
    subDepartment?: string;
    productTeam?: string;
    legalBases: Array<LegalBasisFormValues>;
    end?: string;
    start?: string;
}

export interface LegalBasisFormValues {
    gdpr?: string;
    nationalLaw?: string;
    description?: string;
    end?: string;
    start?: string;
}

export interface Term {
    id: string;
    name: string;
    description: string;
}

export interface LegalBasis extends IDurationed {
    description: string;
    gdpr: Code;
    nationalLaw?: Code;
}

export interface InformationType {
    id: string;
    name: string;
    term?: string;
    description: string;
    sensitivity: Code;
    navMaster: Code;
    keywords: string[];
    sources: Code[];
    categories: Code[];
    toBeDeleted: boolean;
}

export interface Policy extends IDurationed {
    id: string;
    informationType: PolicyInformationType;
    process: PolicyProcess;
    purposeCode: Code;
    subjectCategory: Code;
    legalBasesInherited: boolean;
    legalBases: LegalBasis[];
}

export const policySort : ColumnCompares<Policy> = {
    informationType: (a, b) => a.informationType.name.localeCompare(b.informationType.name),
    process: (a, b) => a.process.name.localeCompare(b.process.name),
    subjectCategory: (a, b) => codelist.getShortnameForCode(a.subjectCategory).localeCompare(codelist.getShortnameForCode(b.subjectCategory), intl.getLanguage()),
    legalBases: (a, b) => a.legalBases.length - b.legalBases.length
};

export interface PolicyInformationType {
    id: string;
    name: string;
    sensitivity: Code;
}

export interface PolicyProcess {
    id: string;
    name: string;
    legalBases: LegalBasis[];
}

export interface Process extends IDurationed {
    id: string;
    name: string;
    legalBases: LegalBasis[];
    department: Code;
    subDepartment: Code;
    productTeam: string;
    policies: Policy[];
    purposeCode: string;
}

export interface ProcessPurposeCount {
    purposes: { [purpose: string]: number }
}

export interface UserInfo {
    loggedIn: boolean;
    groups: string[];
    navIdent?: string;
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
    list: string,
    code: string,
    shortName?: string,
    description ?: string
}

export interface Team {
    id: string;
    name: string;
}

export interface legalBasis {
    gdpr?: string,
    nationalLaw?: string,
    description?: string,
    start?: string,
    end?: string
}

export interface CardLegalBasisProps {
    initValue: legalBasis;
    hideCard: Function;
    submit: (val: LegalBasisFormValues) => void;
    titleSubmitButton: string;

}