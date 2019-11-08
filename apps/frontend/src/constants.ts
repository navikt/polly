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
    pii: boolean | null | undefined;
    name: string | null;
    sensitivity: string | object | null;
    categories: string[] | null[] | null;
    sources: string[] | null[] | null;
    keywords: string[] | null[] | null;
}

export interface Codelist {
    PURPOSE: any | undefined | null;
    CATEGORY: any | undefined | null;
    SOURCE: any | undefined | null;
    NATIONAL_LAW: any | undefined | null;
    SUBJECT_CATEGORY: any | undefined | null;
    GDPR_ARTICLE: any | undefined | null;
    DEPARTMENT: any | undefined | null;
    SUB_DEPARTMENT: any | undefined | null;
}
