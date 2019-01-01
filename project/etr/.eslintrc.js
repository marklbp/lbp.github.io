// https://eslint.org/docs/user-guide/configuring

module.exports = {
  // for special directory
  root: true,
  // for custom parser
  parser: 'babel-eslint',
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    "sourceType": "module"
  },
  // for your code run in environment
  env: {
    browser: true
  },
  // a subset for rules
  extends: [
    'eslint:recommended',
    'plugin:react/recommended'
  ],
  // required to lint *.jsx? files
  plugins: [
    'react'
  ],
  // add your custom rules here
  rules: {
    'eol-last': 'off',
    'react/prop-types': 'off',
    'react/display-name': 'off',
    'no-console': 'off'
  }
}
