import { fixupConfigRules } from '@eslint/compat'
import nextCoreWebVitals from 'eslint-config-next/core-web-vitals'

export default [
  ...fixupConfigRules(nextCoreWebVitals),
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
