import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import react from '@eslint-react/eslint-plugin';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import reactCompiler from 'eslint-plugin-react-compiler';
import depend from 'eslint-plugin-depend';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
  globalIgnores([
    'dist/**',
    'node_modules/**',
    '.yarn/**',
    '.pnp.cjs',
    '.pnp.loader.mjs',
    'eslint.config.js',
    'vite.config.js',
  ]),
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    plugins: { js, depend },
    extends: ['js/recommended', 'depend/flat/recommended'],
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        projectService: true,
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  tseslint.configs.strictTypeChecked,
  react.configs['recommended-typescript'],
  reactHooks.configs.flat.recommended,
  reactRefresh.configs.vite,
  reactCompiler.configs.recommended,
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'react-hooks/set-state-in-effect': 'off',
      'react-refresh/only-export-components': 'off',

      // Temp
      '@eslint-react/set-state-in-effect': 'off',
      '@typescript-eslint/no-floating-promises': 'off',
      '@typescript-eslint/no-misused-promises': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/only-throw-error': 'off',
      '@typescript-eslint/unbound-method': 'off',

      // Temp Strict
      '@typescript-eslint/no-unnecessary-condition': 'off',

      '@typescript-eslint/no-deprecated': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
    },
  },
]);
