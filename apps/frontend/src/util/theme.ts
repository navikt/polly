import { createTheme, lightThemePrimitives } from 'baseui'
import { colors } from 'baseui/tokens'
import { Theme, ThemePrimitives } from 'baseui/theme'
import { RecursivePartial } from '../constants'

const primitives: ThemePrimitives = {
  ...lightThemePrimitives,
  primaryA: '#3e3832',
  primary: '#19548a',
  primary50: '#F2F8FD',
  primary100: '#eaf4fc',
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

type ThemeOverride = RecursivePartial<Theme> & { borders: Partial<Borders> }

const overrides: ThemeOverride = {
  colors: {
    linkVisited: primitives.primary400
  },
  borders: {
    buttonBorderRadius: '4px'
  }
}

export const theme = createTheme(primitives, overrides)
