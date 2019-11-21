import { Code } from "./service/Codelist";

export interface Policy {
    id?: string | number | null;
    datasetTitle: string;
    legalbasisDescription: string | null;
}

export interface DatasetFormValues {
    title: string;
    contentType: string | null;
    pi: string | boolean | null;
    description: string | null;
    categories: string[] | null[] | null;
    provenances: string[] | null[] | null;
    keywords: string[] | null[] | null;
    policies?: any | null;
}

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

export interface InformationTypeIdName {
    id: string;
    name: string;
}

export interface InformationType {
    id: string;
    name: string;
    term?: TermIdName;
    description: string;
    sensitivity: Code;
    navMaster: Code;
    keywords: string[];
    sources: Code[];
    categories: Code[];
    toBeDeleted: boolean;
}

export interface TermIdName {
    id: string;
    name: string;
}

export interface ProcessFormValues {
    name: string;
    department: string | null | undefined;
    subDepartment: string | null | undefined;
    legalBases: Array<LegalBasis> | null | undefined;
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

// Refers to SENSITIVITY clodelist
export enum SensitivityLevel {
    ART6 = "PERSONOPPLYSNING",
    ART9 = "SÆRLIGEPERSONOPPLYSNINGER",
    ART10 = "STRAFFEDOMMEROGLOVOVERTREDELSER"
}
