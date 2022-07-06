// https://javascriptplayground.com/typescript-eslint/
module.exports = {
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  rules: {
    "no-unexpected-multiline": "error",
    "@typescript-eslint/no-unused-vars": [
      "warn",
      {
        ignoreRestSiblings: true,
        varsIgnorePattern: "^_.*",
        argsIgnorePattern: "^_.*",
      },
    ],
  },
};
