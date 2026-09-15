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

export interface IAllCodelists {
  codelist: IList
}

interface IList {
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

export interface IGetParsedOptionsProps {
  id: string
  label: string
}

export interface IMakeIdLabelForAllCodeListsProps {
  id: string
  label: string
}
