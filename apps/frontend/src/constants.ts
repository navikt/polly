import { Code } from "./service/Codelist";

export interface InformationtypeFormValues {
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
    process?: string;
    purposeCode?: string;
    informationTypeName?: string;
    subjectCategory?: string;
    legalBasesInherited?: boolean;
    legalBases: Array<LegalBasisFormValues>;
}

export interface ProcessFormValues {
    name: string;
    department: string | null | undefined;
    subDepartment: string | null | undefined;
    legalBases: Array<LegalBasis> | null | undefined;
}

export interface LegalBasisFormValues {
    gdpr?: string;
    nationalLaw?: string;
    description?: string;
    end?: Date;
    start?: Date;
}

export interface Term {
    id: string;
    name: string;
    description: string;
}
export interface LegalBasis {
    active?: boolean;
    description: string;
    start?: Date;
    end?: Date;
    gdpr: Code;
    nationalLaw?: Code;
}

export interface InformationType {
    id: string;
    name: string;
    term?: Term;
    description: string;
    sensitivity: Code;
    navMaster: Code;
    keywords: string[];
    sources: Code[];
    categories: Code[];
    toBeDeleted: boolean;
}

export interface Policy {
    id: string;
    informationType: PolicyInformationType;
    process: PolicyProcess;
    purposeCode: Code;
    subjectCategory: Code;
    legalBasesInherited: boolean;
    legalBases: LegalBasis[];
    active: boolean;
    start: Date;
    end: Date;
}

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

export interface Process {
    id: string;
    name: string;
    legalBases: LegalBasis[];
    active: boolean;
    start: Date;
    end: Date;
    department: Code;
    subDepartment: Code;
    policies: Policy[];
    purposeCode: string;
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

// Refers to SENSITIVITY codelist
export enum SensitivityLevel {
    ART6 = "PERSONOPPLYSNING",
    ART9 = "SÆRLIGEPERSONOPPLYSNINGER",
    ART10 = "STRAFFEDOMMEROGLOVOVERTREDELSER"
}
