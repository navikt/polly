import { createTheme, lightThemePrimitives } from 'baseui'
import { Theme, ThemePrimitives } from 'baseui/theme'
import { colors } from 'baseui/tokens'
import { TRecursivePartial } from '../constants'

export const primitives: ThemePrimitives & { primary150: string } = {
  ...lightThemePrimitives,
  primaryA: '#3e3832',
  primary: '#19548a',
  primary50: '#F2F8FD',
  primary100: '#eaf4fc',
  primary150: '#C1DBF2',
  primary200: '#99c2e8',
  primary300: '#396FA1',
  primary400: '#19548a',
  primary500: colors.blue500,
  primary600: colors.blue600,
  primary700: colors.blue700,
}

export const chartColor = {
  generalBlue: '#409FDD',
  generalRed: '#FF7983',
  generalMustard: '#FFCC40',

  lightGreen: '#C9EA95',
  orange: '#FFAB66',
  darkGreen: '#408DA0',
}

export const searchResultColor = {
  informationTypeBackground: '#E0DAE7',
  purposeBackground: '#E0F5FB',
  processBackground: '#CCEAD8',
  dpProcessBackground: '#FFCC40',
  teamBackground: '#FFE9CC',
  productAreaBackground: '#F5DBEB',
  departmentBackground: '#ECEFCC',
  subDepartmentBackground: '#D1E9EB',
  thirdPartyBackground: '#E5E5E5',
  systemBackground: '#FED2B9',
  documentBackground: '#C9EA95',
  nationalLawBackground: '#FFAB66',
  gdprBackground: '#99C2E8',
}

// Official type is wrong
interface IBorders {
  radius400: string
  buttonBorderRadius: string
  inputBorderRadius: string
  popoverBorderRadius: string
  surfaceBorderRadius: string
}

interface IColors {
  inputEnhancerFill?: string
}

type TThemeOverride = TRecursivePartial<Theme> & { borders: Partial<IBorders>; colors: IColors }

const overrides: TThemeOverride = {
  colors: {
    linkVisited: primitives.primary400,
    inputFill: primitives.primary50,
    inputFillActive: primitives.primary150,
    inputEnhancerFill: primitives.primary100,

    tabBarFill: colors.white,
  },
  borders: {
    buttonBorderRadius: '4px',
    inputBorderRadius: '8px',
  },
  typography: {
    // Increase weight 500->600 on bold texts
    font150: { fontWeight: 600 },
    font250: { fontWeight: 600 },
    font350: { fontWeight: 600 },
    font450: { fontWeight: 600 },
    font550: { fontWeight: 600 },
    font650: { fontWeight: 600 },
    font750: { fontWeight: 600 },
    font850: { fontWeight: 600 },
    font950: { fontWeight: 600 },
    font1050: { fontWeight: 600 },
    font1150: { fontWeight: 600 },
    font1250: { fontWeight: 600 },
    font1350: { fontWeight: 600 },
    font1450: { fontWeight: 600 },
  },
}

const breakpoints: any = {
  small: 980,
  medium: 1240,
  large: 1449,
  extra_large: 1450,
}

const ResponsiveTheme = Object.keys(breakpoints).reduce(
  (acc: any, key: any) => {
    acc.mediaQuery[key] = `@media screen and (min-width: ${breakpoints[key]}px)`
    return acc
  },
  {
    breakpoints,
    mediaQuery: {},
  }
)

export const theme = createTheme(primitives, { ...overrides, ...ResponsiveTheme })
