import _ from 'lodash'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
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
export const ARTICLE_6_PREFIX = 'ART6'
export const ARTICLE_9_PREFIX = 'ART9'
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
  const [lists, setLists] = useState<IAllCodelists>({ codelist: {} })
  const [error, setError] = useState<string | undefined>()
  const [countries, setCountries] = useState<ICountryCode[]>([])
  const [countriesOutsideEUEEA, setCountriesOutsideEUEEA] = useState<ICountryCode[]>([])

  useEffect(() => {
    ;(async () => {
      await fetchData()
    })()
  }, [])

  const fetchData = async (refresh?: boolean): Promise<void> => {
    if (
      (_.isEmpty(lists.codelist) && countries.length === 0 && countriesOutsideEUEEA.length === 0) ||
      refresh
    ) {
      const codeListPromise = await getAllCodelists(refresh)
        .then(handleGetCodelistResponse)
        .catch((error: any) => setError(error.message))
      const allCountriesPromise = await getAllCountries()
        .then((codes: ICountryCode[]) => setCountries(codes))
        .catch((error: any) => setError(error.message))
      const countriesPromise = await getCountriesOutsideEUEEA()
        .then((codes: ICountryCode[]) => setCountriesOutsideEUEEA(codes))
        .catch((error: any) => setError(error.message))

      await Promise.all([codeListPromise, allCountriesPromise, countriesPromise])
    }
  }

  const handleGetCodelistResponse = (response: IAllCodelists): void => {
    if (typeof response === 'object' && response !== null) {
      setLists(response)
    } else {
      setError(response)
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

  return [utils, lists, setLists] as [
    ICodelistProps,
    IAllCodelists | undefined,
    Dispatch<SetStateAction<IAllCodelists | undefined>>,
  ]
}

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
