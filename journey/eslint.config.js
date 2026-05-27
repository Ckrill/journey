// External
import react from '@eslint-react/eslint-plugin';
import js from '@eslint/js';
import query from '@tanstack/eslint-plugin-query';
import router from '@tanstack/eslint-plugin-router';
import depend from 'eslint-plugin-depend';
import perfectionist from 'eslint-plugin-perfectionist';
import reactCompiler from 'eslint-plugin-react-compiler';
import reactRefresh from 'eslint-plugin-react-refresh';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

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
  perfectionist.configs['recommended-natural'],
  {
    rules: {
      'perfectionist/sort-imports': 'off',
      'perfectionist/sort-modules': 'off',
    },
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
  // Let @tanstack/router/create-route-property-order control object key order
  // in route files instead of perfectionist.
  {
    files: ['src/routes/**'],
    rules: {
      'perfectionist/sort-objects': 'off',
    },
  },
]);
