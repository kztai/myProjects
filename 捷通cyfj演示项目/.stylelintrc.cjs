/* eslint-env node */
module.exports = {
  root: true,
  extends: [
    'stylelint-config-standard',
    'stylelint-config-standard-scss',
    'stylelint-config-recommended-vue/scss',
    'stylelint-config-recess-order',
  ],
  rules: {
    'color-function-notation': 'legacy',
    'no-descending-specificity': null,
    'selector-class-pattern': null,
    'keyframes-name-pattern': null,
    'selector-pseudo-element-no-unknown': [true, {
      ignorePseudoElements: ['v-deep'],
    }],
    'selector-pseudo-class-no-unknown': [true, {
      ignorePseudoClasses: ['export'],
    }],
    'scss/at-import-partial-extension': 'always',
    'scss/dollar-variable-pattern': null,
    'scss/at-mixin-pattern': null,
  },
}
