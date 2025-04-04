import { config, configs } from 'typescript-eslint';

import tsParser from '@typescript-eslint/parser';
import stylisticPlugin from '@stylistic/eslint-plugin-ts'

import importPlugin from 'eslint-plugin-import';
import prettierPlugin from 'eslint-plugin-prettier';

export default config(
  configs.recommended,
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: new URL('.', import.meta.url),
        sourceType: 'module',
      },
      globals: {
        jest: 'readonly',
        NodeJS: 'readonly',
      },
    },
    plugins: {
      '@stylistic/ts': stylisticPlugin,
      importPlugin,
      prettierPlugin,
    },
    extends: [],
    rules: {
      'semi': 'off',
      'no-extra-semi': 'off',
      'quotes': 'off',
      'curly': 'error',
      'linebreak-style': ['error', 'unix'],
      'object-curly-spacing': ['error', 'always'],
      'space-before-function-paren': ['error', {
        'anonymous': 'always',
        'named': 'never',
        'asyncArrow': 'always'
      }],
      'no-multiple-empty-lines': ['error', { max: 1 }],
      'no-trailing-spaces': ['error', { ignoreComments: true }],
      'no-console': ['warn'],
      'keyword-spacing': ['error', { before: true, after: true }],

      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@stylistic/ts/semi': ['error'],
      '@typescript-eslint/no-extra-semi': 'off',
      '@typescript-eslint/indent': ['off'],
      '@typescript-eslint/no-unused-vars': ['error', {
        "argsIgnorePattern": '^_', 
        "caughtErrorsIgnorePattern": "^_",
        "destructuredArrayIgnorePattern": "^_",
        "varsIgnorePattern": "^_",
      }],
    },
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
        },
      },
    },
  },
);
