// External
import react from '@eslint-react/eslint-plugin';
import js from '@eslint/js';
import query from '@tanstack/eslint-plugin-query';
import router from '@tanstack/eslint-plugin-router';
import depend from 'eslint-plugin-depend';
import perfectionist from 'eslint-plugin-perfectionist';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import sonarjs from 'eslint-plugin-sonarjs';
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
    'public/**',
    'src/types/database.types.ts',
  ]),

  js.configs.recommended,
  depend.configs['flat/recommended'],

  tseslint.configs.strictTypeChecked,
  tseslint.configs.stylisticTypeChecked,

  react.configs['strict-type-checked'],

  reactHooks.configs.flat.recommended,
  react.configs['disable-conflict-eslint-plugin-react-hooks'],

  reactRefresh.configs.vite,

  ...router.configs['flat/recommended'],
  ...query.configs['flat/recommended'],

  sonarjs.configs.recommended,

  perfectionist.configs['recommended-natural'],

  {
    files: ['src/**'],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { projectService: true },
    },
  },

  {
    rules: {
      // Allow TanStack Router's throw redirect() / throw notFound() patterns.
      // https://tanstack.com/router/latest/docs/eslint/eslint-plugin-router#typescript-eslint
      '@typescript-eslint/only-throw-error': [
        'error',
        {
          allow: [
            {
              from: 'package',
              name: 'Redirect',
              package: '@tanstack/router-core',
            },
            {
              from: 'package',
              name: 'NotFoundError',
              package: '@tanstack/router-core',
            },
          ],
        },
      ],

      // Import order is owned by oxfmt (`sortImports` in .oxfmtrc.jsonc).
      'perfectionist/sort-imports': 'off',
      // Would reorder top-level declarations; keep them in hand-written order.
      'perfectionist/sort-modules': 'off',

      // The conflict preset turns these off, but @eslint-react only enables its versions in `all`
      // (experimental). Remove once a stable @eslint-react preset (recommended/strict) enables
      // @eslint-react/{globals,immutability,refs}.
      'react-hooks/globals': 'error',
      'react-hooks/immutability': 'error',
      'react-hooks/refs': 'error',
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

  // Root config files are outside tsconfig's `include`, so type-aware rules can't run on them.
  {
    extends: [
      tseslint.configs.disableTypeChecked,
      react.configs['disable-type-checked'],
    ],
    files: ['*.{js,mjs,cjs}'],
    languageOptions: { globals: globals.node },
  },
]);
