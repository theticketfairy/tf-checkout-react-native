import baseConfig from '../eslint.config.base.mjs'

export default [
  ...baseConfig,
  {
    files: ['**/*.{ts,tsx}'],
    rules: {
      // React Native specific overrides
      'no-self-assign': 'off',
      'no-unsafe-optional-chaining': 'off',
      'no-irregular-whitespace': 'off',
      'no-useless-escape': 'off',
      'prefer-const': 'off',
      'no-prototype-builtins': 'off',
      '@typescript-eslint/no-require-imports': 'off', // React Native uses require() for assets
    },
  },
]
