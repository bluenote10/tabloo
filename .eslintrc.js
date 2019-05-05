// https://javascriptplayground.com/typescript-eslint/
module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: ['plugin:@typescript-eslint/recommended'],
  rules:  {
    "no-unexpected-multiline": "error",
  }
}
