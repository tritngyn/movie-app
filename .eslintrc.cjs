module.exports = {
  globals: {
    process: "readonly",
  },
  env: {
    browser: true,
    es2021: true,
  },
  extends: ["eslint:recommended", "plugin:react/recommended"],
  parserOptions: {
    ecmaFeatures: { jsx: true },
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["react"],
  rules: {
    "react/react-in-jsx-scope": "off", // React 17+ không cần import React nữa
    "no-unused-vars": "warn",
    semi: ["warn", "always"],
    quotes: ["warn", "double"],
    "react/prop-types": "off",
  },
  settings: {
    react: { version: "detect" },
  },
};
