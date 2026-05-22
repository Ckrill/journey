import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import react from '@eslint-react/eslint-plugin';
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
  reactRefresh.configs.vite,
  reactCompiler.configs.recommended,
  {
    rules: {},
  },
  // TanStack Router routes must export `Route` alongside the component — splitting
  // is not possible. Context files co-locate provider + hook by convention. Neither
  // pattern benefits from fast refresh isolation since they rarely change in isolation.
  {
    files: ['src/routes/**', 'src/contexts/**'],
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },
]);
