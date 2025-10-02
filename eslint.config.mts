// eslint.config.mts
import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';
import { defineConfig } from 'eslint/config';
import eslintConfigPrettier from 'eslint-config-prettier/flat';

export default defineConfig(
  [
    {
      files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
      ignores: ['node_modules', 'dist', 'build'],
      languageOptions: {
        globals: {
          ...globals.browser,
          ...globals.node,
        },
      },
      extends: [js.configs.recommended],
      rules: {
        'no-self-assign': 'off',
        'no-unsafe-optional-chaining': 'off',
        'no-irregular-whitespace': 'off',
        'no-useless-escape': 'off',
        'prefer-const': 'off',
        'no-prototype-builtins': 'off',
      },
    },

    {
      files: [
        '*.config.js',
        '*.config.cjs',
        '*.config.mjs',
        'metro.config.js',
        'babel.config.js',
      ],
      languageOptions: {
        globals: {
          ...globals.node,
        },
      },
    },

    ...tseslint.configs.recommended,

    {
      plugins: {
        react: pluginReact,
      },
      settings: {
        react: {
          version: 'detect',
        },
      },
      rules: {
        'react/react-in-jsx-scope': 'off',
        'react/prop-types': 'off',
      },
    },

    {
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/ban-ts-comment': 'off',
        '@typescript-eslint/no-non-null-asserted-optional-chain': 'off',
        '@typescript-eslint/no-unused-expressions': 'off',
        '@typescript-eslint/no-empty-object-type': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
        '@typescript-eslint/no-require-imports': 'off',
        '@typescript-eslint/consistent-type-imports': 'off',
        '@typescript-eslint/no-duplicate-enum-values': 'off',
      },
    },
  ],
  eslintConfigPrettier
);
