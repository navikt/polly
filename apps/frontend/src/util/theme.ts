import { createTheme, lightThemePrimitives } from 'baseui'
import { colors } from 'baseui/tokens'
import { Theme, ThemePrimitives } from 'baseui/theme'
import { RecursivePartial } from '../constants'

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

// Official type is wrong
interface Borders {
  radius400: string
  buttonBorderRadius: string
  inputBorderRadius: string
  popoverBorderRadius: string
  surfaceBorderRadius: string
}

interface Colors {
  inputEnhancerFill?: string
}

type ThemeOverride = RecursivePartial<Theme> & { borders: Partial<Borders>, colors: Colors }

const overrides: ThemeOverride = {
  colors: {
    linkVisited: primitives.primary400,
    inputFill: primitives.primary50,
    inputFillActive: primitives.primary150,
    inputEnhancerFill: primitives.primary100,
    borderFocus: primitives.primary150, // same as inputFillActive to hide

    tabBarFill: colors.white
  },
  borders: {
    buttonBorderRadius: '4px',
    inputBorderRadius: '8px'
  },
  typography: {
    // Increase weight 500->600 on bold texts
    font150: {fontWeight: 600},
    font250: {fontWeight: 600},
    font350: {fontWeight: 600},
    font450: {fontWeight: 600},
    font550: {fontWeight: 600},
    font650: {fontWeight: 600},
    font750: {fontWeight: 600},
    font850: {fontWeight: 600},
    font950: {fontWeight: 600},
    font1050: {fontWeight: 600},
    font1150: {fontWeight: 600},
    font1250: {fontWeight: 600},
    font1350: {fontWeight: 600},
    font1450: {fontWeight: 600}
  }
}

export const theme = createTheme(primitives, overrides)
