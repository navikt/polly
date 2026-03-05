import nextCoreWebVitals from 'eslint-config-next/core-web-vitals'

export default [
  ...nextCoreWebVitals,
  {
    linterOptions: {
      reportUnusedDisableDirectives: false,
    },
    rules: {
      semi: ['warn', 'never'],
      quotes: ['warn', 'single'],
      'react-hooks/exhaustive-deps': 'off',
      'react-hooks/set-state-in-effect': 'off',
    },
  },
]
