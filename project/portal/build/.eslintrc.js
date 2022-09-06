// https://eslint.org/docs/user-guide/configuring
module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint'
  },
  env: {
    browser: true
  },
  extends: [
    // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
    // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
    'plugin:vue/essential',
    // https://github.com/standard/standard/blob/master/docs/RULES-en.md
    'standard'
  ],
  // required to lint *.vue files
  plugins: [
    'vue'
  ],
  // add your custom rules here
  rules: {
    // allow async-await
    'generator-star-spacing': 'off',
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    // 暂时去除 vue v-for 必须设置 key 的 lint
    'vue/require-v-for-key': 'off',
    'vue/valid-v-for': 'off',
    'spaced-comment': ['error', 'always', { 'markers': ['?', '!', '*'] }],
    'object-curly-spacing': 'off',
    'spaced-comment': 'off',
    'eol-last': 'off',
    'no-new': 'off',
    'no-useless-escape': 'off',
    'no-unused-vars': 'off',
    'indent': 'off',
    'no-undef': 'off',
    'new-cap': 'off',
    'standard/computed-property-even-spacing': 'off',
    'quotes': 'off',
    'no-trailing-spaces': 'off',
    'space-before-function-paren': 'off',
    'semi': 'off',
    'eqeqeq': 'off',
    'no-useless-call': 'off',
    'comma-spacing': 'off',
    'vue/no-side-effects-in-computed-properties': 'off'
  }
}
