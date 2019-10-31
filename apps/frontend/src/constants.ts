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
    pii: string | boolean | null;
    name: string | null;
    context: string | null;
    sensitivity: string | null;
    categories: string[] | null[] | null;
    keywords: string[] | null[] | null;
}

export interface Codelist {
    PURPOSE: any | undefined | null;
    CATEGORY: any | undefined | null;
    PROVENANCE: any | undefined | null;
}
