// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parserOptions: {
    parser: "babel-eslint"
  },
  env: {
    browser: true
  },

  extends: [
    // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
    // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
    "plugin:vue/essential",
    // eslint规则类型：
    // 具体见：https://github.com/standard/standard/blob/master/docs/RULES-en.md
    "standard"
  ],

  // required to lint *.vue files
  plugins: ["vue"],

  // 添加自定义规则，会覆盖上面定义的标准规则：
  // "off" 或 0 - 关闭规则
  // "warn" 或 1 - 开启规则，使用警告级别的错误：warn (不会导致程序退出)
  // "error" 或 2 - 开启规则，使用错误级别的错误：error (当被触发的时候，程序会退出)
  rules: {
    // allow async-await
    "generator-star-spacing": "off",
    // allow debugger during development
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
    semi: ["error", "always"],
    "no-tabs": 0,
    indent: 0,
    "space-before-function-paren": 0
  }
};
