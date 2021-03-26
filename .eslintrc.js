const OFF = 0;
const WARNING = 1;
const ERROR = 2;

module.exports = {
  extends: ["airbnb-base", "plugin:prettier/recommended"],
  plugins: ["prettier"],
  parserOptions: {
    ecmaVersion: 9,
  },
  env: {
    node: true,
    jest: true,
  },
  rules: {
    "prettier/prettier": ERROR,
    "max-len": [WARNING, { code: 100 }],
    "no-console": WARNING,
    "no-await-in-loop": OFF,
    "class-methods-use-this": OFF,
    "no-unused-vars": WARNING,
  },
};
