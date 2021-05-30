module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },
  extends: "eslint:recommended",
  plugins: ["jest"],
  parserOptions: {
    ecmaVersion: 12,
  },
  overrides: [
    {
      files: ["**/*.test.js"],
      extends: ["plugin:jest/recommended", "plugin:jest/style"],
    },
  ],
};
