import LocalizedStrings, { GlobalStrings, LocalizedStringsMethods } from "react-localization";
import * as React from "react";
import { useEffect } from "react";
import { useForceUpdate } from "../hooks";
import { en, no, ta } from "./lang";
import * as moment from "moment";
import "moment/locale/nb";
import "moment/locale/ta";

export interface IStrings {
    informationType: string;
    informationTypes: string;
    informationTypeSearch: string;
    term: string;
    purpose: string;
    sensitivity: string;
    processingActivities: string;
    process: string;
    processes: string;
    legalBasis: string;
    legalBasisShort: string;
    legalBasesShort: string;
    subjectCategories: string;
    nationalLaw: string;
    navMaster: string;
    productTeam: string;
    disclosure: string;
    thirdParty: string;
    policy: string;

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
    informationTypeExternalUse: string;
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
    descriptionWriteLegalBases: string;
    definitionWrite: string;
    subjectCategoriesNotFound: string;
    legalBasesProcess: string;
    legalBasesOwn: string;
    legalBasesUndecided: string;
    legalBasesUndecidedWarning: string;
    notAllowedMessage: string;
    confirmDeleteHeader: string;
    confirmDeletePolicyText: string;
    confirmDeleteProcessText: string;
    startIllustration: string;
    treasureIllustration: string;
    legalbasisGDPRArt9Info: string;
    legalBasisInfo: string;
    groupByPurpose: string;
    showAll: string;
    createThirdPartyModalTitle: string;

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
    all: string;
    startDate: string;
    endDate: string;
    active: string;
    inactive: string;
    preview: string;
    info: string;
    period: string;
    recipient: string;
    recipientPurpose: string;
    disclosureSelect: string;

    prevButton: string;
    nextButton: string;
    rows: string;

    maxChars: string;
    required: string;
    dateFormat: string;
    datePickStart: string;
    datePickEnd: string;
    useDates: string;
    requiredGdprArt6: string;
    requiredGdprArt9: string;
    requiredNationalLaw: string;
    requiredDescription: string;

    code: string;
    shortName: string;
    createCodeListTitle: string;
    deleteCodeListConfirmationTitle: string;
    editCodeListTitle: string;
    manageCodeListTitle: string;
    chooseCodeList: string;
    createNewCodeList: string;

    id: string;
    searchId: string;
    audit: string;
    audits: string;
    auditNr: string;
    auditNotFound: string;
    table: string;
    action: string;
    time: string;
    user: string;
}

// Remember import moment locales up top
export const langs: Langs = {
    nb: { flag: "no", name: "Norsk", langCode: "nb", texts: no },
    en: { flag: "gb", name: "English", langCode: "en", texts: en }
};

if (window.location.hostname.indexOf("local") >= 0) {
    langs["ta"] = { flag: "lk", name: "தமிழ்", langCode: "ta", texts: ta };
}

export const langsArray: Lang[] = Object.keys(langs).map(lang => langs[lang]);

// Controls starting language as well as fallback language if a text is missing in chosen language
const defaultLang = langs.nb;

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
        let momentlocale = moment.locale(lang);
        if (lang !== momentlocale) console.warn("moment locale missing", lang);
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
