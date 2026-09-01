import { getAllCodelists, getAllCountries, getCountriesOutsideEUEEA } from '@/api/CodelistApi'
import {
  ICountryCode,
  IGetParsedOptionsFilterOutSelectedProps,
  IGetParsedOptionsForListProps,
  IMakeIdLabelForAllCodeListsProps,
} from '@/constants'
import {
  ARTICLE_6_PREFIX,
  ARTICLE_9_PREFIX,
  DESCRIPTION_GDPR_ARTICLES,
  EListName,
  ESensitivityLevel,
  IAllCodelists,
  ICode,
  IGetParsedOptionsProps,
  NATIONAL_LAW_GDPR_ARTICLES,
} from '@/service/Codelist'
import {
  Dispatch,
  FunctionComponent,
  SetStateAction,
  createContext,
  useEffect,
  useState,
} from 'react'

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

const LOVDATA_FORSKRIFT_PREFIX = 'FORSKRIFT'
const DEPARTMENTS_WITH_SUB_DEPARTMENTS = ['OESA', 'YTA', 'ATA']

export const CodelistContext = createContext<{
  utils: ICodelistProps
  lists: IAllCodelists
  setLists: Dispatch<SetStateAction<IAllCodelists>>
}>({
  utils: {
    fetchData: async () => {},
    isLoaded: () => '',
    getCodes: () => [],
    getCode: () => {
      return {} as ICode
    },
    valid: () => false,
    getShortnameForCode: () => '',
    getShortnameForCodes: () => '',
    getShortname: () => '',
    getShortnames: () => [],
    getDescription: () => '',
    getParsedOptions: () => [],
    getParsedOptionsForList: () => [],
    getParsedOptionsFilterOutSelected: () => [],
    isForskrift: () => false,
    countryName: () => '',
    getCountryCodesOutsideEu: () => [],
    requiresNationalLaw: () => undefined,
    requiresDescription: () => undefined,
    requiresArt9: () => false,
    isArt6: () => undefined,
    isArt9: () => undefined,
    showSubDepartment: () => undefined,
    makeIdLabelForAllCodeLists: () => [],
  },
  lists: {} as IAllCodelists,
  setLists: () => undefined,
})

type TProps = {
  children: React.ReactNode
}

export const CodelistProvider: FunctionComponent<TProps> = ({ children }) => {
  const [lists, setLists] = useState<IAllCodelists>({ codelist: {} } as IAllCodelists)
  const [error, setError] = useState<string | undefined>(undefined)
  const [countries, setCountries] = useState<ICountryCode[]>()
  const [countriesOutsideEUEEA, setCountriesOutsideEUEEA] = useState<ICountryCode[]>()

  const handleGetCodelistResponse = (response: IAllCodelists): void => {
    if (typeof response === 'object' && response !== null) {
      setLists(response)
    } else {
      setError(response)
    }
  }

  const fetchData = async (refresh?: boolean): Promise<void> => {
    if (
      (lists === undefined && countries === undefined && countriesOutsideEUEEA === undefined) ||
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
    return nationalLawCode && nationalLawCode.includes(LOVDATA_FORSKRIFT_PREFIX)
  }

  const showSubDepartment = (departmentCode?: string): boolean | '' | undefined => {
    return departmentCode && DEPARTMENTS_WITH_SUB_DEPARTMENTS.indexOf(departmentCode) >= 0
  }

  const makeIdLabelForAllCodeLists = (): IMakeIdLabelForAllCodeListsProps[] => {
    return Object.keys(EListName).map((key: string) => ({ id: key, label: key }))
  }

  useEffect(() => {
    ;(async () => await fetchData())()
  }, [])

  return (
    <CodelistContext.Provider
      value={{
        utils: {
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
        },
        lists: lists,
        setLists: setLists,
      }}
    >
      {children}
    </CodelistContext.Provider>
  )
}
