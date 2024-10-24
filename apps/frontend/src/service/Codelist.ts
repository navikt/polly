import { AxiosResponse } from 'axios'
import { useEffect, useState } from 'react'
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

export interface ICodelistProps {
  fetchData: (refresh?: boolean) => Promise<any>
  isLoaded: () => string | IAllCodelists | undefined
  getCodes: (list: EListName) => ICode[]
  getCode: (list: EListName, codeName: string) => ICode | undefined
  valid: (list: EListName, codeName?: string) => boolean
  getShortnameForCode: (code: ICode) => string
  getShortnameForCodes: (codes: ICode[]) => string
  getShortname: (list: EListName, codeName: string) => string
  getShortnames: (list: EListName, codeNames: string[]) => string[]
  getDescription: (list: EListName, codeName: string) => string
  getParsedOptions: (listName: EListName) => IGetParsedOptionsProps[]
  getParsedOptionsForList: (
    listName: EListName,
    selected: string[]
  ) => IGetParsedOptionsForListProps[]
  getParsedOptionsFilterOutSelected: (
    listName: EListName,
    currentSelected: string[]
  ) => IGetParsedOptionsFilterOutSelectedProps[]
  isForskrift: (nationalLawCode?: string) => boolean | '' | undefined
  countryName: (code: string) => string
  getCountryCodesOutsideEu: () => ICountryCode[] | []
  requiresNationalLaw: (gdprCode?: string) => boolean | '' | undefined
  requiresDescription: (gdprCode?: string) => boolean | '' | undefined
  requiresArt9: (sensitivityCode?: string) => boolean
  isArt6: (gdprCode?: string) => string | boolean | undefined
  isArt9: (gdprCode?: string) => string | boolean | undefined
  showSubDepartment: (departmentCode?: string) => boolean | '' | undefined
  makeIdLabelForAllCodeLists: () => IMakeIdLabelForAllCodeListsProps[]
}

export interface IGetParsedOptionsProps {
  id: string
  label: string
}

interface IGetParsedOptionsForListProps {
  id: string
  label: string
}

interface IGetParsedOptionsFilterOutSelectedProps {
  id: string
  label: string
}

export interface IMakeIdLabelForAllCodeListsProps {
  id: string
  label: string
}

export const CodelistService = () => {
  const [lists, setLists] = useState<IAllCodelists | undefined>()
  const [error, setError] = useState<string | undefined>()
  const [countries, setCountries] = useState<ICountryCode[] | undefined>()
  const [countriesOutsideEUEEA, setCountriesOutsideEUEEA] = useState<ICountryCode[] | undefined>()

  useEffect(() => {
    ;(async () => {
      await fetchData()
    })()
  }, [])

  const fetchData = async (refresh?: boolean): Promise<void> => {
    const codeListPromise = getAllCodelists(refresh)
      .then(handleGetCodelistResponse)
      .catch((error: any) => setError(error.message))
    const allCountriesPromise = getAllCountries()
      .then((codes: ICountryCode[]) => setCountries(codes))
      .catch((error: any) => setError(error.message))
    const countriesPromise = getCountriesOutsideEUEEA()
      .then((codes: ICountryCode[]) => setCountriesOutsideEUEEA(codes))
      .catch((error: any) => setError(error.message))

    if (lists === undefined || refresh) {
      Promise.all([codeListPromise, allCountriesPromise, countriesPromise])
    }
  }

  const handleGetCodelistResponse = (response: AxiosResponse<IAllCodelists>): void => {
    if (typeof response.data === 'object' && response.data !== null) {
      setLists(response.data)
    } else {
      setError(response.data)
    }
  }

  const isLoaded = (): string | IAllCodelists | undefined => {
    return lists || error
  }

  const getAllCountryCodes = (): ICountryCode[] | [] => {
    return countries || []
  }

  const getCountryCodesOutsideEu = (): ICountryCode[] | [] => {
    return countriesOutsideEUEEA || []
  }

  const countryName = (code: string): string => {
    return (
      getAllCountryCodes().find((country: ICountryCode) => country.code === code)?.description ||
      code
    )
  }

  const getCodes = (list: EListName): ICode[] => {
    return lists && lists.codelist[list]
      ? lists.codelist[list].sort((c1: ICode, c2: ICode) =>
          c1.shortName.localeCompare(c2.shortName)
        )
      : []
  }

  const getCode = (list: EListName, codeName: string): ICode | undefined => {
    return getCodes(list).find((code: ICode) => code.code === codeName)
  }

  const valid = (list: EListName, codeName?: string): boolean => {
    return !!codeName && !!getCode(list, codeName)
  }

  const getShortnameForCode = (code: ICode): string => {
    return getShortname(code.list, code.code)
  }

  const getShortnameForCodes = (codes: ICode[]): string => {
    return codes.map((code: ICode) => getShortname(code.list, code.code)).join(', ')
  }

  const getShortname = (list: EListName, codeName: string): string => {
    const code: ICode | undefined = getCode(list, codeName)
    return code ? code.shortName : codeName
  }

  const getShortnames = (list: EListName, codeNames: string[]): string[] => {
    return codeNames.map((codeName: string) => getShortname(list, codeName))
  }

  const getDescription = (list: EListName, codeName: string): string => {
    const code: ICode | undefined = getCode(list, codeName)
    return code ? code.description : codeName
  }

  const getParsedOptions = (listName: EListName): IGetParsedOptionsProps[] => {
    return getCodes(listName).map((code: ICode) => {
      return { id: code.code, label: code.shortName }
    })
  }

  const getParsedOptionsForList = (
    listName: EListName,
    selected: string[]
  ): IGetParsedOptionsForListProps[] => {
    return selected.map((code: string) => ({ id: code, label: getShortname(listName, code) }))
  }

  const getParsedOptionsFilterOutSelected = (
    listName: EListName,
    currentSelected: string[]
  ): IGetParsedOptionsFilterOutSelectedProps[] => {
    const parsedOptions = getParsedOptions(listName)
    return !currentSelected
      ? parsedOptions
      : parsedOptions.filter((option: { id: string; label: string }) =>
          currentSelected.includes(option.id) ? null : option.id
        )
  }

  const requiresNationalLaw = (gdprCode?: string): boolean | '' | undefined => {
    return gdprCode && NATIONAL_LAW_GDPR_ARTICLES.indexOf(gdprCode) >= 0
  }

  const requiresDescription = (gdprCode?: string): boolean | '' | undefined => {
    return gdprCode && DESCRIPTION_GDPR_ARTICLES.indexOf(gdprCode) >= 0
  }

  const requiresArt9 = (sensitivityCode?: string): boolean => {
    return sensitivityCode === ESensitivityLevel.ART9
  }

  const isArt6 = (gdprCode?: string): string | boolean | undefined => {
    return gdprCode && gdprCode.startsWith(ARTICLE_6_PREFIX)
  }

  const isArt9 = (gdprCode?: string): string | boolean | undefined => {
    return gdprCode && gdprCode.startsWith(ARTICLE_9_PREFIX)
  }

  const isForskrift = (nationalLawCode?: string): boolean | '' | undefined => {
    return nationalLawCode && nationalLawCode.startsWith(LOVDATA_FORSKRIFT_PREFIX)
  }

  const showSubDepartment = (departmentCode?: string): boolean | '' | undefined => {
    return departmentCode && DEPARTMENTS_WITH_SUB_DEPARTMENTS.indexOf(departmentCode) >= 0
  }

  const makeIdLabelForAllCodeLists = (): IMakeIdLabelForAllCodeListsProps[] => {
    return Object.keys(EListName).map((key: string) => ({ id: key, label: key }))
  }

  const utils: ICodelistProps = {
    fetchData,
    isLoaded,
    getCodes,
    getCode,
    valid,
    getShortnameForCode,
    getShortnameForCodes,
    getShortnames,
    getShortname,
    getDescription,
    getParsedOptions,
    getParsedOptionsForList,
    getParsedOptionsFilterOutSelected,
    isForskrift,
    countryName,
    getCountryCodesOutsideEu,
    requiresNationalLaw,
    requiresDescription,
    requiresArt9,
    isArt6,
    isArt9,
    showSubDepartment,
    makeIdLabelForAllCodeLists,
  }

  return [utils, lists] as [ICodelistProps, IAllCodelists | undefined]
}

// class CodelistService {
//   // lagt inn
//   lists?: IAllCodelists
//   error?: string

//   promise: Promise<any>

//   // lagt inn
//   countries?: ICountryCode[]
//   countriesOutsideEUEEA?: ICountryCode[]

//   constructor() {
//     this.promise = this.fetchData()
//   }

//   // Lagt inn
//   private fetchData = async (refresh?: boolean) => {
//     const codeListPromise = getAllCodelists(refresh)
//       .then(this.handleGetCodelistResponse)
//       .catch((err) => (this.error = err.message))
//     const allCountriesPromise = getAllCountries()
//       .then((codes) => (this.countries = codes))
//       .catch((err) => (this.error = err.message))
//     const countriesPromise = getCountriesOutsideEUEEA()
//       .then((codes) => (this.countriesOutsideEUEEA = codes))
//       .catch((err) => (this.error = err.message))
//     return Promise.all([codeListPromise, allCountriesPromise, countriesPromise])
//   }

//   // Lagt inn
//   handleGetCodelistResponse = (response: AxiosResponse<IAllCodelists>) => {
//     if (typeof response.data === 'object' && response.data !== null) {
//       this.lists = response.data
//     } else {
//       this.error = response.data
//     }
//   }

//   refreshCodeLists() {
//     this.promise = this.fetchData(true)
//     return this.promise
//   }

//   async wait() {
//     await this.promise
//   }

//   // lagt inn
//   isLoaded() {
//     return this.lists || this.error
//   }

//   // lagt inn
//   getAllCountryCodes() {
//     return this.countries || []
//   }

//   // Lagt inn
//   getCountryCodesOutsideEu() {
//     return this.countriesOutsideEUEEA || []
//   }

//   // lagt
//   countryName(code: string): string {
//     return this.getAllCountryCodes().find((c) => c.code === code)?.description || code
//   }

//   // lagt inn
//   getCodes(list: EListName): ICode[] {
//     return this.lists && this.lists.codelist[list]
//       ? this.lists.codelist[list].sort((c1, c2) => c1.shortName.localeCompare(c2.shortName))
//       : []
//   }

//   // lagt inn
//   getCode(list: EListName, codeName: string): ICode | undefined {
//     return this.getCodes(list).find((c) => c.code === codeName)
//   }

//   // Lagt inn
//   valid(list: EListName, codeName?: string): boolean {
//     return !!codeName && !!this.getCode(list, codeName)
//   }

//   // Lagt inn
//   getShortnameForCode(code: ICode) {
//     return this.getShortname(code.list, code.code)
//   }

//   // Lagt inn
//   getShortnameForCodes(codes: ICode[]) {
//     return codes.map((c) => this.getShortname(c.list, c.code)).join(', ')
//   }

//   // Lagt inn
//   getShortname(list: EListName, codeName: string) {
//     const code = this.getCode(list, codeName)
//     return code ? code.shortName : codeName
//   }

//   // Lagt inn
//   getShortnames(list: EListName, codeNames: string[]) {
//     return codeNames.map((codeName) => this.getShortname(list, codeName))
//   }

//   // Lagt inn
//   getDescription(list: EListName, codeName: string) {
//     const code = this.getCode(list, codeName)
//     return code ? code.description : codeName
//   }

//   // Lagt inn
//   getParsedOptions(listName: EListName): { id: string; label: string }[] {
//     return this.getCodes(listName).map((code: ICode) => {
//       return { id: code.code, label: code.shortName }
//     })
//   }

//   // Lagt inn
//   getParsedOptionsForList(
//     listName: EListName,
//     selected: string[]
//   ): { id: string; label: string }[] {
//     return selected.map((code) => ({ id: code, label: this.getShortname(listName, code) }))
//   }

//   // Lagt inn
//   getParsedOptionsFilterOutSelected(
//     listName: EListName,
//     currentSelected: string[]
//   ): { id: string; label: string }[] {
//     const parsedOptions = this.getParsedOptions(listName)
//     return !currentSelected
//       ? parsedOptions
//       : parsedOptions.filter((option) => (currentSelected.includes(option.id) ? null : option.id))
//   }

//   // Lagt inn
//   requiresNationalLaw(gdprCode?: string) {
//     return gdprCode && NATIONAL_LAW_GDPR_ARTICLES.indexOf(gdprCode) >= 0
//   }

//   // Lagt inn
//   requiresDescription(gdprCode?: string) {
//     return gdprCode && DESCRIPTION_GDPR_ARTICLES.indexOf(gdprCode) >= 0
//   }

//   // Lagt inn
//   requiresArt9(sensitivityCode?: string) {
//     return sensitivityCode === ESensitivityLevel.ART9
//   }

//   // Lagt inn
//   isArt6(gdprCode?: string) {
//     return gdprCode && gdprCode.startsWith(ARTICLE_6_PREFIX)
//   }

//   // Lagt inn
//   isArt9(gdprCode?: string) {
//     return gdprCode && gdprCode.startsWith(ARTICLE_9_PREFIX)
//   }

//   // Lagt inn
//   isForskrift(nationalLawCode?: string) {
//     return nationalLawCode && nationalLawCode.startsWith(LOVDATA_FORSKRIFT_PREFIX)
//   }

//   // Lagt inn
//   showSubDepartment(departmentCode?: string) {
//     return departmentCode && DEPARTMENTS_WITH_SUB_DEPARTMENTS.indexOf(departmentCode) >= 0
//   }

//   // Lagt inn
//   makeIdLabelForAllCodeLists() {
//     return Object.keys(EListName).map((key) => ({ id: key, label: key }))
//   }
// }

// export const codelist = new CodelistService()

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
