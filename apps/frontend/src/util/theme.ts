import {createTheme, lightThemePrimitives} from 'baseui';
const primitives = {
  ...lightThemePrimitives,
  primary: '#6699ff', // hot pink
  primary50: '#FDEDFC',
  primary100: '#FCD3F9',
  primary200: '#F89FF3',
  primary300: '#F45AEA',
  primary400: '#F127E4',
  primary500: '#B71DAD',
  primary600: '#901788',
  primary700: '#600F5B',
};

export const theme = createTheme(primitives);