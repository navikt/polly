import axios from "axios";

const server_polly = process.env.REACT_APP_POLLY_ENDPOINT;

export enum ListName {
    PURPOSE = "PURPOSE",
    CATEGORY = "CATEGORY",
    SOURCE = "SOURCE",
    SENSITIVITY = "SENSITIVITY",
    NATIONAL_LAW = "NATIONAL_LAW",
    SUBJECT_CATEGORY = "SUBJECT_CATEGORY",
    GDPR_ARTICLE = "GDPR_ARTICLE",
    DEPARTMENT = "DEPARTMENT",
    SUB_DEPARTMENT = "SUB_DEPARTMENT",
    SYSTEM = "SYSTEM"
}

// Refers to SENSITIVITY codelist
export enum SensitivityLevel {
    ART6 = "POL",
    ART9 = "SAERLIGE",
    ART10 = "STRAFF"
}

const ARTICLE_6_PREFIX = 'ART6'
const ARTICLE_9_PREFIX = 'ART9'
export const NATIONAL_LAW_GDPR_ARTICLES = ['ART61C', 'ART61E']
export const DESCRIPTION_GDPR_ARTICLES = ['ART61C', 'ART61E', 'ART61F']


// TODO show error
class CodelistService {
    lists?: AllCodelists;
    error?: string;
    promise: Promise<any>;

    constructor() {
        this.promise = this.fetchData();
    }

    private fetchData = async () => {
        return axios
        .get(`${server_polly}/codelist`)
        .then(this.handleGetCodelistResponse)
        .catch(err => (this.error = err.message));
    };

    handleGetCodelistResponse = (response: any) => {
        if (typeof response.data === "object" && response.data !== null) {
            this.lists = response.data;
        } else {
            this.error = response.data;
        }
    };

    refreshCodeLists(){
        this.promise = this.fetchData();
    }

    async wait() {
        await this.promise;
    }

    isLoaded() {
        return this.lists || this.error;
    }

    getCodes(list: ListName): Code[] {
        return this.lists && this.lists.codelist[list] ? this.lists.codelist[list].sort((c1, c2) => c1.shortName.localeCompare(c2.shortName)) : [];
    }

    getCode(list: ListName, codeName: string): Code | undefined {
        return this.getCodes(list).find(c => c.code === codeName);
    }

    getShortname(list: ListName, codeName: string) {
        let code = this.getCode(list, codeName);
        return code ? code.shortName : codeName;
    }

    getShortnames(list: ListName, codeNames: string[]) {
        return codeNames.map(codeName => this.getShortname(list, codeName))
    }

    getDescription(list: ListName, codeName: string) {
        let code = this.getCode(list, codeName);
        return code ? code.description : codeName;
    }

    getParsedOptions(listName: ListName): { id: string, label: string }[] {
        return this.getCodes(listName).map((code: Code) => {
            return {id: code.code, label: code.shortName};
        });
    }

    requiresNationalLaw(gdprCode?: string) {
        return gdprCode && NATIONAL_LAW_GDPR_ARTICLES.indexOf(gdprCode) >= 0
    }

    requiresDescription(gdprCode?: string) {
        return gdprCode && DESCRIPTION_GDPR_ARTICLES.indexOf(gdprCode) >= 0
    }

    requiresArt9(sensitivityCode?: string) {
        return sensitivityCode === SensitivityLevel.ART9
    }

    isArt6(gdprCode?: string) {
        return gdprCode && gdprCode.startsWith(ARTICLE_6_PREFIX)
    }

    isArt9(gdprCode?: string) {
        return gdprCode && gdprCode.startsWith(ARTICLE_9_PREFIX)
    }

    makeIdLabelForAllCodeLists() {
        if (!this.lists) return [];
        const { codelist } = this.lists;
        return Object
            .keys(codelist)
            .map((key) => ({
                id: key as string,
                label: key as string}));
    }

}

export const codelist = new CodelistService();

// new objects from /codelist

export interface AllCodelists {
    codelist: List;
}

export interface List {
    [name: string]: Code[];
}

export interface Code {
    list: ListName;
    code: string;
    shortName: string;
    description: string;
    invalidCode?: boolean;
}
