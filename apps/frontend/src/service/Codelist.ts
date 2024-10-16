import { AxiosResponse } from 'axios'
import { getAllCodelists, getAllCountries, getCountriesOutsideEUEEA } from '../api/GetAllApi'

export enum EListName {
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
export enum ESensitivityLevel {
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
  lists?: IAllCodelists
  error?: string
  promise: Promise<any>
  countries?: ICountryCode[]
  countriesOutsideEUEEA?: ICountryCode[]

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

  handleGetCodelistResponse = (response: AxiosResponse<IAllCodelists>) => {
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

  getCodes(list: EListName): ICode[] {
    return this.lists && this.lists.codelist[list]
      ? this.lists.codelist[list].sort((c1, c2) => c1.shortName.localeCompare(c2.shortName))
      : []
  }

  getCode(list: EListName, codeName: string): ICode | undefined {
    return this.getCodes(list).find((c) => c.code === codeName)
  }

  valid(list: EListName, codeName?: string): boolean {
    return !!codeName && !!this.getCode(list, codeName)
  }

  getShortnameForCode(code: ICode) {
    return this.getShortname(code.list, code.code)
  }

  getShortnameForCodes(codes: ICode[]) {
    return codes.map((c) => this.getShortname(c.list, c.code)).join(', ')
  }

  getShortname(list: EListName, codeName: string) {
    const code = this.getCode(list, codeName)
    return code ? code.shortName : codeName
  }

  getShortnames(list: EListName, codeNames: string[]) {
    return codeNames.map((codeName) => this.getShortname(list, codeName))
  }

  getDescription(list: EListName, codeName: string) {
    const code = this.getCode(list, codeName)
    return code ? code.description : codeName
  }

  getParsedOptions(listName: EListName): { id: string; label: string }[] {
    return this.getCodes(listName).map((code: ICode) => {
      return { id: code.code, label: code.shortName }
    })
  }

  getParsedOptionsForList(
    listName: EListName,
    selected: string[]
  ): { id: string; label: string }[] {
    return selected.map((code) => ({ id: code, label: this.getShortname(listName, code) }))
  }

  getParsedOptionsFilterOutSelected(
    listName: EListName,
    currentSelected: string[]
  ): { id: string; label: string }[] {
    const parsedOptions = this.getParsedOptions(listName)
    return !currentSelected
      ? parsedOptions
      : parsedOptions.filter((option) => (currentSelected.includes(option.id) ? null : option.id))
  }

  requiresNationalLaw(gdprCode?: string) {
    return gdprCode && NATIONAL_LAW_GDPR_ARTICLES.indexOf(gdprCode) >= 0
  }

  requiresDescription(gdprCode?: string) {
    return gdprCode && DESCRIPTION_GDPR_ARTICLES.indexOf(gdprCode) >= 0
  }

  requiresArt9(sensitivityCode?: string) {
    return sensitivityCode === ESensitivityLevel.ART9
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
    return Object.keys(EListName).map((key) => ({ id: key, label: key }))
  }
}

export const codelist = new CodelistService()

export interface IAllCodelists {
  codelist: IList
}

export interface IList {
  [name: string]: ICode[]
}

export interface ICode {
  list: EListName
  code: string
  shortName: string
  description: string
  invalidCode?: boolean
}

export interface ICountryCode {
  code: string
  description: string
  validFrom: string
  validTo: string
}
