import { createTheme, lightThemePrimitives } from 'baseui'

const primitives = {
  ...lightThemePrimitives,
  primary: '#247aff',
  primary50: '#FDEDFC',
  primary100: '#a8f0fc',
  primary200: '#55dcf8',
  primary300: '#41adf4',
  primary400: '#1574f1',
  primary500: '#1a2bd6',
  primary600: '#1828a5',
  primary700: '#101960',


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
