import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import react from '@eslint-react/eslint-plugin';
import reactRefresh from 'eslint-plugin-react-refresh';
import reactCompiler from 'eslint-plugin-react-compiler';
import depend from 'eslint-plugin-depend';
import query from '@tanstack/eslint-plugin-query';
import router from '@tanstack/eslint-plugin-router';
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
  ...router.configs['flat/recommended'],
  ...query.configs['flat/recommended'],
  {
    rules: {},
  },
  // Allow TanStack Router's throw redirect() / throw notFound() patterns.
  // https://tanstack.com/router/latest/docs/eslint/eslint-plugin-router#typescript-eslint
  {
    rules: {
      '@typescript-eslint/only-throw-error': [
        'error',
        {
          allow: [
            {
              from: 'package',
              package: '@tanstack/router-core',
              name: 'Redirect',
            },
            {
              from: 'package',
              package: '@tanstack/router-core',
              name: 'NotFoundError',
            },
          ],
        },
      ],
    },
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
