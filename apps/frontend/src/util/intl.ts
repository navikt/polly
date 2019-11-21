import LocalizedStrings, { GlobalStrings, LocalizedStringsMethods } from 'react-localization'
import * as React from "react"
import { useEffect } from "react"
import { useForceUpdate } from "./customHooks"

// Controls starting language as well as fallback language if a text is missing in chosen language
const defaultLang = 'no'

export interface IStrings {

  informationType: string;
  informationTypes: string;
  informationTypeSearch: string;
  term: string;
  purpose: string;
  termDefinition: string;
  sensitivity: string;

  navMaster: string;

  // sentence
  loggedInStatus: string;
  notLoggedInStatus: string;

  // generic
  hi: string;
  login: string;
  logout: string;
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
  informationType: 'Opplysningstype',
  informationTypes: 'Opplysningstyper',
  informationTypeSearch: 'Søk opplysningstyper',
  term: 'Begrep',
  purpose: 'Formål',
  termDefinition: 'Begrepsdefinisjon',
  sensitivity: 'Type personopplysning',

  navMaster: 'Master i NAV',

  loggedInStatus: 'Du er logget inn og kan',
  notLoggedInStatus: 'Du er ikke logget inn men kan',

  login: 'Logg inn',
  logout: 'Logg ut',
  hi: 'Hei',
  createNew: 'Opprett ny',
  name: 'Navn',
  description: 'Beskrivelse',
  edit: 'Rediger',
  sources: 'Kilder',
  categories: 'Kategorier',
  keywords: 'Nøkkelord',
  read: 'Lese',
  write: 'Skrive',
  administrate: 'Administrere'
}

const strings = {
  no: no,
  en: {
    informationType: 'Information type',
    informationTypes: 'Information types',
    informationTypeSearch: 'Information type search',
    term: 'Term',
    purpose: 'Purpose',
    termDefinition: 'Term definition',
    sensitivity: 'Type of personal data',

    navMaster: 'Master in NAV',

    loggedInStatus: 'You are logged in and can',
    notLoggedInStatus: 'You are not logged in but you can still',

    login: 'Login',
    logout: 'Logout',
    hi: 'Hi',
    createNew: 'Create new',
    name: 'Name',
    description: 'Description',
    edit: 'Edit',
    sources: 'Sources',
    categories: 'Categories',
    keywords: 'Keywords',
    read: 'Read',
    write: 'Write',
    administrate: 'Administrate'
  }
}

type IIntl = LocalizedStringsMethods & IStrings
interface LocalizedStringsFactory {
  new<T>(props: GlobalStrings<T>, options?: { customLanguageInterface: () => string }): IIntl;
}

export const intl: IIntl = new (LocalizedStrings as LocalizedStringsFactory)(strings as any, {customLanguageInterface: () => defaultLang})

export const useLang = () => {
  const [lang, setLang] = React.useState(defaultLang);
  const update = useForceUpdate()
  useEffect(() => {
    intl.setLanguage(lang)
    update()
  }, [lang])

  return setLang
}