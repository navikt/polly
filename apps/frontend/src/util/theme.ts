import { createTheme, lightThemePrimitives } from 'baseui'
import { colors } from "baseui/tokens"
import { ThemePrimitives } from 'baseui/theme'

const primitives: ThemePrimitives = {
  ...lightThemePrimitives,
  primary: colors.blue400,
  primary50: colors.blue50,
  primary100: colors.blue100,
  primary200: colors.blue200,
  primary300: colors.blue300,
  primary400: colors.blue400,
  primary500: colors.blue500,
  primary600: colors.blue600,
  primary700: colors.blue700,

  accent: '#F127E4', // hot pink
  accent50: '#FDEDFC',
  accent100: '#FCD3F9',
  accent200: '#F89FF3',
  accent300: '#F45AEA',
  accent400: '#F127E4',
  accent500: '#B71DAD',
  accent600: '#901788',
  accent700: '#600F5B',
}

const overrides = {
  colors: {
    buttonSecondaryFill: primitives.accent100,
    buttonSecondaryText: primitives.accent,
    buttonSecondaryHover: primitives.accent200,
    buttonSecondaryActive: primitives.accent300,
    buttonSecondarySelectedFill: primitives.accent200,
    buttonSecondarySelectedText: primitives.accent,
    buttonSecondarySpinnerForeground: primitives.accent700,
    buttonSecondarySpinnerBackground: primitives.accent300,

    linkVisited: primitives.primary400,
  },
}

export const theme = createTheme(primitives, overrides)
