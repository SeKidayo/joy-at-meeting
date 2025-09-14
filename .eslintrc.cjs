module.exports = {
  parser: '@typescript-eslint/parser',
  extends: ['eslint:recommended'],
  plugins: ['@typescript-eslint', 'react-hooks'],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  rules: {
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
  },
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  globals: {
    React: 'readonly',
    NodeJS: 'readonly',
    DocumentEventMap: 'readonly',
    RequestInit: 'readonly',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
