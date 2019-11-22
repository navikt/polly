import LocalizedStrings, { GlobalStrings, LocalizedStringsMethods } from "react-localization";
import * as React from "react";
import { useEffect } from "react";
import { useForceUpdate } from "./customHooks";

// Controls starting language as well as fallback language if a text is missing in chosen language
const defaultLang = "no";

interface IStrings {
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
    informationTypeUpdated: string;
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
    description: string;
    edit: string;
    sources: string;
    categories: string;
    keywords: string;
    read: string;
    write: string;
    administrate: string;
}

const no: IStrings = {
    informationType: "Opplysningstype",
    informationTypes: "Opplysningstyper",
    informationTypeSearch: "Søk opplysningstyper",
    term: "Begrepsdefinisjon",
    purpose: "Formål",
    sensitivity: "Type personopplysning",
    processingActivities: "Behandlingsoversikt",
    process: "Behandling",
    legalBasis: "Rettslig grunnlag for behandlingen",
    legalBasisShort: "Rettslig grunnlag",
    legalBasesShort: "Rettslig grunnlag",
    subjectCategories: "Kategorier av personer",
    nationalLaw: "Nasjonal lov",

    navMaster: "Master i NAV",

    loggedInStatus: "Du er logget inn og kan",
    notLoggedInStatus: "Du er ikke logget inn men kan",
    couldntLoad: "Kunne ikke laste inn siden",
    informationTypeUpdated: "Opplysningstypen er oppdatert",
    informationTypeCreate: "Opprett ny opplysningstype",
    sensitivitySelect: "Velg type personopplysning",
    nameWrite: "Skriv inn navn",
    categoriesWrite: "Skriv inn og legg til kategorier",
    sourcesWrite: "Skriv inn og legg til kilder",
    keywordsWrite: "Legg til nøkkelord",
    navMasterSelect: "Velg master",
    purposeSelect: "Velg formål",
    purposeNotFound: "Fant ingen formål",
    purposeUse: "Brukes til formål",
    policyEdit: "Rediger behandlingsgrunnlag for opplysningstype",
    policyNew: "Opprett behandling for opplysningstype",
    processEdit: "Rediger behandling for opplysningstype",
    processingActivitiesNew: "Opprett nytt behandlingsrunnlag", // Opprett behandlingsgrunnlag for opplysningstype ?
    processingActivitiesEdit: "Rediger behandlingsgrunnlag",
    processNew: "Legg til ny behandling",
    legalBasisNotFound: "Fant ingen rettslige grunnlag",
    legalBasisNew: "Nytt rettslig grunnlag",
    legalBasisAdd: "Legg til nytt rettslig grunnlag",
    gdprSelect: "Velg GDPR artikkel",
    nationalLawSelect: "Velg nasjonal lov",
    descriptionWrite: "Skriv inn beskrivelse",
    definitionWrite: "Skriv inn en definisjon",
    subjectCategoriesNotFound: "Fant ingen kategorier av personer",
    legalBasesProcess: "Bruker behandlingens rettslig grunnlag",
    legalBasesUndecided: "Uavklart",
    legalBasesOwn: "Har eget rettslig grunnlag",
    legalBasesUndecidedWarning: "Rettslig grunn er ikke avklart",

    department: "Avdeling",
    subDepartment: "Linja (Ytre etat)",
    save: "Lagre",
    abort: "Avbryt",
    login: "Logg inn",
    logout: "Logg ut",
    hi: "Hei",
    addNew: "Legg til ny",
    createNew: "Opprett ny",
    name: "Navn",
    description: "Beskrivelse",
    edit: "Rediger",
    sources: "Kilder",
    categories: "Kategorier",
    keywords: "Nøkkelord",
    read: "Lese",
    write: "Skrive",
    administrate: "Administrere"
};

let en: IStrings = {
    informationType: "Information type",
    informationTypes: "Information types",
    informationTypeSearch: "Information type search",
    term: "Term definition",
    purpose: "Purpose",
    sensitivity: "Type of personal data",
    processingActivities: "Processing activities",
    process: "Process",
    navMaster: "Master in NAV",
    legalBasis: "Legal basis for process",
    legalBasisShort: "Legal basis",
    legalBasesShort: "Legal bases",
    nationalLaw: "National law",
    subjectCategories: "Subject Categories",

    loggedInStatus: "You are logged in and can",
    notLoggedInStatus: "You are not logged in but you can still",
    couldntLoad: "Couldn't load the page",
    informationTypeUpdated: "Information type updated",
    informationTypeCreate: "Create new information type",
    sensitivitySelect: "Select type of personal data",
    nameWrite: "Enter name",
    categoriesWrite: "Enter and add categories",
    sourcesWrite: "Enter and add sources",
    keywordsWrite: "Enter and add keywords",
    navMasterSelect: "Select master",
    purposeSelect: "Select purpose",
    purposeNotFound: "Found no purposes",
    purposeUse: "Used for purposes",
    policyEdit: "Edit purpose for information type",
    policyNew: "Create new process for information type",
    processNew: "Add new process",
    legalBasisNotFound: "Found no legal bases",
    processEdit: "Edit process for information type",
    processingActivitiesNew: "Create new processing activity",
    processingActivitiesEdit: "Edit processing activity",
    legalBasisNew: "New legal basis",
    legalBasisAdd: "Add new legal basis",
    gdprSelect: "Select GDPR article",
    nationalLawSelect: "Select national law",
    descriptionWrite: "Enter description",
    definitionWrite: "Enter definition",
    subjectCategoriesNotFound: "Found no subject categories",
    legalBasesProcess: "Use legal bases from process",
    legalBasesUndecided: "Undecided",
    legalBasesOwn: "Use explicit legal bases",
    legalBasesUndecidedWarning: "Legal bases missing",

    department: "Department",
    subDepartment: "Linja (Ytre etat)",
    save: "Save",
    abort: "Cancel",
    login: "Login",
    logout: "Logout",
    hi: "Hi",
    addNew: "Add new",
    createNew: "Create new",
    name: "Name",
    description: "Description",
    edit: "Edit",
    sources: "Sources",
    categories: "Categories",
    keywords: "Keywords",
    read: "Read",
    write: "Write",
    administrate: "Administrate"
}

type IIntl = LocalizedStringsMethods & IStrings;

interface LocalizedStringsFactory {
    new<T>(
        props: GlobalStrings<T>,
        options?: { customLanguageInterface: () => string }
    ): IIntl;
}

const strings = {
    no, en
};

export const intl: IIntl = new (LocalizedStrings as LocalizedStringsFactory)(
    strings as any,
    {customLanguageInterface: () => defaultLang}
);

interface Langs {
    [lang: string]: {
        flag: string;
        name: string;
    };
}

export const langs: Langs = {
    en: {flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', name: 'English'},
    no: {flag: '🇳🇴', name: 'Norge'}
}

// hooks

const localStorageAvailable = storageAvailable();

export const useLang = () => {
    const [lang, setLang] = React.useState<string>(
        ((localStorageAvailable &&
            localStorage.getItem("polly-lang")) as string) || defaultLang
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
        localStorage.setItem("ptab", "aye");
        localStorage.removeItem("ptab");
        return true;
    } catch (e) {
        return false;
    }
}
