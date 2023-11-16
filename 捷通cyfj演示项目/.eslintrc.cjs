/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')
const { defineConfig } = require('eslint-define-config')

module.exports = defineConfig({
  root: true,
  extends: [
    'plugin:vue/essential',
    'eslint:recommended',
    '@vue/eslint-config-standard-with-typescript',
    '@vue/eslint-config-standard-with-typescript/allow-tsx-in-vue',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    quotes: ['error', 'single'],
    'no-prototype-builtins': 'off',
    'prefer-promise-reject-errors': 'off',
    'no-new': 'off',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'warn',
    'space-before-function-paren': ['error', 'never'],
    '@typescript-eslint/space-before-function-paren': ['error', 'never'],
    semi: 'off',
    '@typescript-eslint/semi': ['error', 'never'],
    'comma-dangle': 'off',
    '@typescript-eslint/comma-dangle': ['error', 'always-multiline'],
    '@typescript-eslint/no-floating-promises': 'off',
    '@typescript-eslint/promise-function-async': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/strict-boolean-expressions': 'off',
    '@typescript-eslint/no-dynamic-delete': 'off',
    '@typescript-eslint/no-this-alias': 'off',
    'import/no-unresolved': 'off',
    'vue/block-lang': 'off',
    'vue/html-indent': [
      'error',
      2,
      {
        attribute: 1,
        baseIndent: 1,
        closeBracket: 0,
        alignAttributesVertically: true,
        ignores: [],
      },
    ],
    'vue/singleline-html-element-content-newline': 'off',
    'vue/multi-word-component-names': 'off',
    'vue/no-reserved-component-names': 'off',
    'vue/require-default-prop': 'off',
    'vue/no-mutating-props': [
      'error',
      {
        shallowOnly: true,
      },
    ],
    'vue/no-side-effects-in-computed-properties': 'off',
  },
})
