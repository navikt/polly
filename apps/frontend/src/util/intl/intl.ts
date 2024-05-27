
import * as React from 'react'
import {useEffect} from 'react'
import {useForceUpdate} from '../hooks'
import {en, tekster, ta} from '../lang'

import * as moment from 'moment'
import 'moment/locale/nb'
import 'moment/locale/ta'

import Locale from 'date-fns'
import nbLocale from 'date-fns/locale/nb'
import enLocale from 'date-fns/locale/en-GB'
import taLocale from 'date-fns/locale/ta'


// Remember import moment locales up top
export const langs: Langs = {
  nb: { flag: 'no', name: 'Norsk', langCode: 'nb', texts: tekster, dateLocale: nbLocale },
  en: { flag: 'gb', name: 'English', langCode: 'en', texts: en, dateLocale: enLocale },
}

if (window.location.hostname.indexOf('local') >= 0) {
  langs['ta'] = { flag: ['lk', 'in'][Math.floor(Math.random() * 2)], name: 'தமிழ்', langCode: 'ta', texts: ta, dateLocale: taLocale }
}


// Controls starting language as well as fallback language if a text is missing in chosen language
const defaultLang = langs.nb


export interface Lang {
  flag: string
  name: string
  langCode: string
  texts: any
  dateLocale: Locale
}

interface Langs {
  [lang: string]: Lang
}

// hooks

const localStorageAvailable = storageAvailable()

export const useLang = () => {
  const [lang, setLang] = React.useState<string>(((localStorageAvailable && localStorage.getItem('polly-lang')) as string) || defaultLang.langCode)
  const update = useForceUpdate()
  useEffect(() => {
//    intl.setLanguage(lang)
    let momentlocale = moment.locale(lang)
    if (lang !== momentlocale) console.warn('moment locale missing', lang)
    localStorageAvailable && localStorage.setItem('polly-lang', lang)
    update()
  }, [lang])

  return setLang
}

function storageAvailable() {
  try {
    let key = 'ptab'
    localStorage.setItem(key, key)
    localStorage.removeItem(key)
    return true
  } catch (e: any) {
    return false
  }
}
