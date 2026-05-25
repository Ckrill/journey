import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import react from '@eslint-react/eslint-plugin';
import reactRefresh from 'eslint-plugin-react-refresh';
import reactCompiler from 'eslint-plugin-react-compiler';
import depend from 'eslint-plugin-depend';
import query from '@tanstack/eslint-plugin-query';
import router from '@tanstack/eslint-plugin-router';
import perfectionist from 'eslint-plugin-perfectionist';
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
  perfectionist.configs['recommended-natural'],
  {
    rules: {
      'perfectionist/sort-imports': [
        'warn',
        {
          sortSideEffects: true,
          type: 'natural',
          groups: [
            'type',
            { group: ['builtin', 'external'], commentAbove: 'External' },
            { group: 'settings', commentAbove: 'Settings' },
            'type-internal',
            'internal',
            { group: 'utils', commentAbove: 'Utilities' },
            { group: 'api', commentAbove: 'API' },
            { group: 'context', commentAbove: 'Contexts' },
            { group: 'hooks', commentAbove: 'Hooks' },
            { group: 'data', commentAbove: 'Data' },
            { group: 'assets', commentAbove: 'Assets' },
            {
              group: ['parent', 'sibling', 'index'],
              commentAbove: 'Miscellaneous',
            },
            {
              group: ['type-parent', 'type-sibling', 'type-index', 'types'],
              commentAbove: 'Types',
            },
            { group: ['style', 'styles'], commentAbove: 'Styles' },
            'unknown',
          ],
          customGroups: [
            {
              // Includes "settings/".
              groupName: 'settings',
              elementNamePattern: 'settings/',
            },
            {
              // Contain "/api/".
              groupName: 'api',
              elementNamePattern: '/api/',
            },
            {
              // Contain "/utils/" or end with "utils" or "util" or contain "/helpers/" or end with "helpers" or "helper".
              groupName: 'utils',
              elementNamePattern: [
                '/utils/',
                'utils$',
                'util$',
                '/helpers/',
                'helpers$',
                'helper$',
              ],
            },
            {
              // Contain "/contexts/" or end with ".context".
              groupName: 'context',
              elementNamePattern: ['/contexts/', 'Context$'],
            },
            {
              // Contain "/hooks/ or contain "/use" followed by a capital letter" or start with "use" followed by a capital letter.
              groupName: 'hooks',
              elementNamePattern: ['/hooks/', '/use[A-Z]', '^use[A-Z]'],
            },
            {
              // Contain "/data/" or end with ".json".
              groupName: 'data',
              elementNamePattern: ['/data/', '.json$'],
            },
            {
              // Contain "/assets/".
              groupName: 'assets',
              elementNamePattern: '/assets/',
            },
            {
              // Contain "/types/" or end with ".types".
              groupName: 'types',
              elementNamePattern: ['/types/', '.types$'],
            },
            {
              // Contain "/styles" or end with ".styles".
              groupName: 'styles',
              elementNamePattern: ['/styles/', '.styles$', '.css$', '.scss$'],
            },
          ],
        },
      ],
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
