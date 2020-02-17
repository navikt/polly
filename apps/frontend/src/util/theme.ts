import { createTheme, lightThemePrimitives } from 'baseui'
import { colors } from "baseui/tokens"
import { ThemePrimitives } from 'baseui/theme'

const primitives: ThemePrimitives = {
  ...lightThemePrimitives,
  primary: "#19548a",
  primary50: "#eaf4fc",
  primary100: "#B5CCDF",
  primary200: "#99c2e8",
  primary300: "#396FA1",
  primary400: "#19548a",
  primary500: colors.blue500,
  primary600: colors.blue600,
  primary700: colors.blue700,
}

const overrides = {
  colors: {
    buttonSecondaryFill: primitives.primary50,
    // buttonSecondaryText: primitives.mono900,

    linkVisited: primitives.primary400,
  },
}

export const theme = createTheme(primitives, overrides)
