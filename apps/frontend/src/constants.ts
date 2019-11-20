import { Code } from "./codelist";

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
    term: string;
    name: string | null;
    navMaster: string | null;
    sensitivity: string | object | null;
    categories: string[] | null[] | null;
    sources: string[] | null[] | null;
    keywords: string[] | null[] | null;
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
export interface ProcessFormValues {
    name: string;
    department: string | null | undefined;
    subDepartment: string | null | undefined;
    legalBases: Array<LegalBasis> | null | undefined;
}

export interface UserInfo {
    loggedIn: boolean;
    navIdent: String;
    name: String;
    givenName: String;
    familyName: String;
    email: String;
    groups: [String];
}

export interface PageResponse<T> {
    pageNumber: number;
    pageSize: number;
    pages: number;
    numberOfElements: number;
    totalElements: number;
    content: T[];
}
