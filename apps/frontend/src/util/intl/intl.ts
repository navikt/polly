import LocalizedStrings, {
    GlobalStrings,
    LocalizedStringsMethods
} from "react-localization";
import * as React from "react";
import { useEffect } from "react";
import { useForceUpdate } from "../customHooks";
import { en, no, ta } from "./lang";

export interface IStrings {
    informationType: string;
    informationTypes: string;
    informationTypeSearch: string;
    term: string;
    purpose: string;
    sensitivity: string;
    processingActivities: string;
    process: string;
    legalBasis: string;
    legalBasisShort: string;
    legalBasesShort: string;
    subjectCategories: string;
    nationalLaw: string;
    navMaster: string;

    // sentence
    loggedInStatus: string;
    notLoggedInStatus: string;
    couldntLoad: string;
    informationTypeCreate: string;
    sensitivitySelect: string;
    nameWrite: string;
    categoriesWrite: string;
    sourcesWrite: string;
    keywordsWrite: string;
    navMasterSelect: string;
    purposeSelect: string;
    purposeNotFound: string;
    purposeUse: string;
    policyEdit: string;
    policyNew: string;
    legalBasisNotFound: string;
    processEdit: string;
    processingActivitiesNew: string;
    processingActivitiesEdit: string;
    processNew: string;
    legalBasisNew: string;
    legalBasisAdd: string;
    gdprSelect: string;
    nationalLawSelect: string;
    descriptionWrite: string;
    definitionWrite: string;
    subjectCategoriesNotFound: string;
    legalBasesProcess: string;
    legalBasesOwn: string;
    legalBasesUndecided: string;
    legalBasesUndecidedWarning: string;
    notAllowedMessage: string;
    confirmDeletePolicyHeader: string;
    confirmDeletePolicyText: string;

    // groups
    POLLY_READ: string;
    POLLY_WRITE: string;
    POLLY_ADMIN: string;

    // generic
    department: string;
    subDepartment: string;
    save: string;
    abort: string;
    login: string;
    logout: string;
    hi: string;
    addNew: string;
    createNew: string;
    name: string;
    email: string;
    groups: string;
    description: string;
    edit: string;
    sources: string;
    categories: string;
    keywords: string;
    read: string;
    write: string;
    administrate: string;
    delete: string;
    appName: string;
    beta: string;

    prevButton: string;
    nextButton: string;
    rows: string;

    maxChars: string;
    required: string;
}

export const langs: Langs = {
    no: { flag: "🇳🇴", name: "Norsk", langCode: "no", texts: no },
    en: { flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", name: "English", langCode: "en", texts: en },
    ta: { flag: "🇱🇰", name: "தமிழ்", langCode: "ta", texts: ta }
};

export const langsArray: Lang[] = Object.keys(langs).map(lang => langs[lang]);

// Controls starting language as well as fallback language if a text is missing in chosen language
const defaultLang = langs.no;

type IIntl = LocalizedStringsMethods & IStrings;

interface LocalizedStringsFactory {
    new <T>(
        props: GlobalStrings<T>,
        options?: { customLanguageInterface: () => string }
    ): IIntl;
}

const strings: IntlLangs = {};

Object.keys(langs).forEach(lang => (strings[lang] = langs[lang].texts));

export const intl: IIntl = new (LocalizedStrings as LocalizedStringsFactory)(
    strings as any,
    { customLanguageInterface: () => defaultLang.langCode }
);

interface IntlLangs {
    [lang: string]: IStrings;
}

export interface Lang {
    flag: string;
    name: string;
    langCode: string;
    texts: any;
}

interface Langs {
    [lang: string]: Lang;
}

// hooks

const localStorageAvailable = storageAvailable();

export const useLang = () => {
    const [lang, setLang] = React.useState<string>(
        ((localStorageAvailable &&
            localStorage.getItem("polly-lang")) as string) ||
            defaultLang.langCode
    );
    const update = useForceUpdate();
    useEffect(() => {
        intl.setLanguage(lang);
        localStorageAvailable && localStorage.setItem("polly-lang", lang);
        update();
    }, [lang]);

    return setLang;
};

function storageAvailable() {
    try {
        let key = "ptab";
        localStorage.setItem(key, key);
        localStorage.removeItem(key);
        return true;
    } catch (e) {
        return false;
    }
}
