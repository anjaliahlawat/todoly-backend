const OFF = 0;
const WARNING = 1;
const ERROR = 2;

module.exports = {
  extends: [
    "airbnb-base",
    "plugin:prettier/recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:jest/recommended",
  ],
  plugins: ["prettier", "@typescript-eslint", "jest"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 9,
    // project: "./tsconfig.json",
  },
  env: {
    node: true,
    jest: true,
  },
  settings: {
    "import/resolver": {
      node: {
        extensions: [".js", ".ts", ".d.ts"],
      },
    },
  },
  rules: {
    "no-underscore-dangle": OFF,
    "import/extensions": [OFF, "never"],
    "prettier/prettier": ERROR,
    "max-len": [WARNING, { code: 100 }],
    "no-console": WARNING,
    "no-await-in-loop": OFF,
    "class-methods-use-this": OFF,
    "no-unused-vars": WARNING,
  },
};
