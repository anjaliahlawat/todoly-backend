const OFF = 0;
const WARNING = 1;
const ERROR = 2;

module.exports = {
  extends: ["airbnb-base", "plugin:prettier/recommended"],
  plugins: ["prettier"],
  parserOptions: {
    ecmaVersion: 9,
    project: "./tsconfig.json",
  },
  env: {
    node: true,
    jest: true,
  },
  settings: {
    "import/resolver": {
      node: {
        extensions: [".js", ".ts"],
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
