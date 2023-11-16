/* eslint-env node */
module.exports = {
  '*.{ts,vue}': [
    'eslint . --ext .vue,.js,.jsx,.cjs,.mjs,.ts,.tsx,.cts,.mts --fix',
  ],
  '*.{scss,css,vue}': [
    'stylelint src/**/*.{html,vue,css,sass,scss} --fix --quiet-deprecation-warnings',
  ],
}
