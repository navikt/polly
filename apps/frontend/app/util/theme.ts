export const primitives = {
  primary: 'var(--a-surface-action)',
  primary50: 'var(--a-surface-subtle)',
  primary100: 'var(--a-surface-subtle)',
  primary150: 'var(--a-surface-subtle)',
  primary200: 'var(--a-border-action)',
  primary300: 'var(--a-surface-action)',
  primary400: 'var(--a-surface-action)',
} as const

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

export const theme = {
  colors: {
    primary: primitives.primary,
    primary50: primitives.primary50,
    primary100: primitives.primary100,
    primary150: primitives.primary150,
    primary200: primitives.primary200,
    primary300: primitives.primary300,
    primary400: primitives.primary400,

    accent100: 'var(--a-surface-info-subtle)',
    accent300: 'var(--a-surface-info)',

    positive300: 'var(--a-surface-success)',
    positive400: 'var(--a-text-success)',

    warning300: 'var(--a-surface-warning)',
    warning400: 'var(--a-text-warning)',

    negative400: 'var(--a-surface-danger)',
    negative500: 'var(--a-text-danger)',

    mono100: 'var(--a-surface-subtle)',
    mono600: 'var(--a-border-subtle)',
    mono1000: 'var(--a-text-default)',
  },
  sizing: {
    scale100: '0.25rem',
    scale200: '0.5rem',
    scale300: '0.75rem',
    scale500: '1rem',
    scale600: '1.25rem',
    scale700: '1.5rem',
    scale800: '2rem',
    scale1200: '3rem',
    scale2400: '6rem',
  },
} as const
