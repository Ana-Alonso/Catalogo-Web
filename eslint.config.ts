import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import reactPlugin from "eslint-plugin-react";
import simpleImportSort from "eslint-plugin-simple-import-sort";

export default tseslint.config(
  {
    // Ignorar carpetas comunes de compilación y dependencias
    ignores: ["dist", "node_modules", "build"],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{ts,tsx,js,jsx}"],
    plugins: {
      react: reactPlugin,
      "simple-import-sort": simpleImportSort,
    },
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      // Reglas para ordenar imports y exports automáticamente
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",

      // Reglas recomendadas de React
      ...reactPlugin.configs.recommended.rules,
      "react/react-in-jsx-scope": "off", // Innecesario en React moderno
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  }
);