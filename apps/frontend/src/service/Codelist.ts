import { AxiosResponse } from 'axios'
import { getAllCodelists, getAllCountries, getCountriesOutsideEUEEA } from '../api'

export enum ListName {
  PURPOSE = 'PURPOSE',
  CATEGORY = 'CATEGORY',
  THIRD_PARTY = 'THIRD_PARTY',
  SENSITIVITY = 'SENSITIVITY',
  NATIONAL_LAW = 'NATIONAL_LAW',
  SUBJECT_CATEGORY = 'SUBJECT_CATEGORY',
  GDPR_ARTICLE = 'GDPR_ARTICLE',
  DEPARTMENT = 'DEPARTMENT',
  SUB_DEPARTMENT = 'SUB_DEPARTMENT',
  SYSTEM = 'SYSTEM',
  TRANSFER_GROUNDS_OUTSIDE_EU = 'TRANSFER_GROUNDS_OUTSIDE_EU',
  DATA_PROCESSOR = 'DATA_PROCESSOR',
  DATA_ACCESS_CLASS = 'DATA_ACCESS_CLASS',
}

// Refers to SENSITIVITY codelist
export enum SensitivityLevel {
  ART6 = 'POL',
  ART9 = 'SAERLIGE',
  ART10 = 'STRAFF',
}

// Refers to GDPR_ARTICLE codelist
const ARTICLE_6_PREFIX = 'ART6'
const ARTICLE_9_PREFIX = 'ART9'
export const NATIONAL_LAW_GDPR_ARTICLES = ['ART61C', 'ART61E']
export const DESCRIPTION_GDPR_ARTICLES = ['ART61C', 'ART61E', 'ART61F']

const LOVDATA_FORSKRIFT_PREFIX = 'FORSKRIFT_'
const DEPARTMENTS_WITH_SUB_DEPARTMENTS = ['OESA', 'YTA', 'ATA']

class CodelistService {
  lists?: AllCodelists
  error?: string
  promise: Promise<any>
  countries?: CountryCode[]
  countriesOutsideEUEEA?: CountryCode[]

  constructor() {
    this.promise = this.fetchData()
  }

  private fetchData = async (refresh?: boolean) => {
    const codeListPromise = getAllCodelists(refresh)
      .then(this.handleGetCodelistResponse)
      .catch((err) => (this.error = err.message))
    const allCountriesPromise = getAllCountries()
      .then((codes) => (this.countries = codes))
      .catch((err) => (this.error = err.message))
    const countriesPromise = getCountriesOutsideEUEEA()
      .then((codes) => (this.countriesOutsideEUEEA = codes))
      .catch((err) => (this.error = err.message))
    return Promise.all([codeListPromise, allCountriesPromise, countriesPromise])
  }

  handleGetCodelistResponse = (response: AxiosResponse<AllCodelists>) => {
    if (typeof response.data === 'object' && response.data !== null) {
      this.lists = response.data
    } else {
      this.error = response.data
    }
  }

  refreshCodeLists() {
    this.promise = this.fetchData(true)
    return this.promise
  }

  async wait() {
    await this.promise
  }

  isLoaded() {
    return this.lists || this.error
  }

  getAllCountryCodes() {
    return this.countries || []
  }

  getCountryCodesOutsideEu() {
    return this.countriesOutsideEUEEA || []
  }

  countryName(code: string): string {
    return this.getAllCountryCodes().find((c) => c.code === code)?.description || code
  }

  getCodes(list: ListName): Code[] {
    return this.lists && this.lists.codelist[list] ? this.lists.codelist[list].sort((c1, c2) => c1.shortName.localeCompare(c2.shortName)) : []
  }

  getCode(list: ListName, codeName: string): Code | undefined {
    return this.getCodes(list).find((c) => c.code === codeName)
  }

  valid(list: ListName, codeName?: string): boolean {
    return !!codeName && !!this.getCode(list, codeName)
  }

  getShortnameForCode(code: Code) {
    return this.getShortname(code.list, code.code)
  }

  getShortnameForCodes(codes: Code[]) {
    return codes.map((c) => this.getShortname(c.list, c.code)).join(', ')
  }

  getShortname(list: ListName, codeName: string) {
    let code = this.getCode(list, codeName)
    return code ? code.shortName : codeName
  }

  getShortnames(list: ListName, codeNames: string[]) {
    return codeNames.map((codeName) => this.getShortname(list, codeName))
  }

  getDescription(list: ListName, codeName: string) {
    let code = this.getCode(list, codeName)
    return code ? code.description : codeName
  }

  getParsedOptions(listName: ListName): { id: string; label: string }[] {
    return this.getCodes(listName).map((code: Code) => {
      return { id: code.code, label: code.shortName }
    })
  }

  getParsedOptionsForList(listName: ListName, selected: string[]): { id: string; label: string }[] {
    return selected.map((code) => ({ id: code, label: this.getShortname(listName, code) }))
  }

  getParsedOptionsFilterOutSelected(listName: ListName, currentSelected: string[]): { id: string; label: string }[] {
    let parsedOptions = this.getParsedOptions(listName)
    return !currentSelected ? parsedOptions : parsedOptions.filter((option) => (currentSelected.includes(option.id) ? null : option.id))
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

  isForskrift(nationalLawCode?: string) {
    return nationalLawCode && nationalLawCode.startsWith(LOVDATA_FORSKRIFT_PREFIX)
  }

  showSubDepartment(departmentCode?: string) {
    return departmentCode && DEPARTMENTS_WITH_SUB_DEPARTMENTS.indexOf(departmentCode) >= 0
  }

  makeIdLabelForAllCodeLists() {
    return Object.keys(ListName).map((key) => ({ id: key, label: key }))
  }
}

export const codelist = new CodelistService()

export interface AllCodelists {
  codelist: List
}

export interface List {
  [name: string]: Code[]
}

export interface Code {
  list: ListName
  code: string
  shortName: string
  description: string
  invalidCode?: boolean
}

export interface CountryCode {
  code: string
  description: string
  validFrom: string
  validTo: string
}
