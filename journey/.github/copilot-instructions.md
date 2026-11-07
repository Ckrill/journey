# Project preferences

- Do not add `prefers-reduced-motion` handling to new code (CSS media queries or `matchMedia` checks). Animations and smooth scrolling always run.
- The primary target is the installed web app (PWA) in the newest stable Chrome on Android. Use modern web platform features freely there (Vibration API, Web Push, scroll-driven animations, `color-mix`).
- Support other browsers only when it is an easy fix. Otherwise degrade gracefully, e.g. feature-detect with `'vibrate' in navigator` and skip the effect.
- Use the `modern-web-guidance` skill first for HTML, CSS and client-side JS work, and prefer the platform features it recommends over polyfills or extra libraries.
- Skills installed globally live in `~/.agents/skills/`. Not every skill is there, but check it first. The `modern-web-guidance` guides are in `~/.agents/skills/modern-web-guidance/guides/`, grouped by category. Read them from there instead of running `npx modern-web-guidance`, which also breaks the `yarn`-only rule below.

## Workflow

- After editing, run `yarn validate` (Oxfmt, Stylelint, ESLint, `tsc`). `yarn format:fix` and `yarn lint:css:fix` fix most formatting and CSS property-order issues.
- Yarn 4 is the package manager. Run tools through `yarn` scripts, not `npx`. `yarn knip` reports unused files and exports.
- Oxfmt owns formatting and import order, not Prettier. ESLint is strict type-checked with `sonarjs` (for example, no nested ternaries).

## Conventions

- Imports are grouped under comments (`// External`, `// Utilities`, `// Contexts`, `// Hooks`, `// Data`, `// Assets`, `// Miscellaneous`, `// Types`, `// Styles`). Use `import type` for type-only imports.
- Object keys and JSX props are alphabetized (enforced by the `perfectionist` ESLint rule).
- CSS lives in a per-component `.module.scss`. Use logical instead of physical properties (for example, `inline-size` rather than `width`) and `calc(16rem / 16)` for font sizes.

## React 19

- Pass `ref` as a normal prop; do not use `forwardRef`.
- Ref callbacks are called with `null` on unmount, so guard against it.
- The React Compiler is enabled. Do not add `useMemo`, `useCallback` or `memo` for cheap work.
- `@eslint-react/exhaustive-deps` warns about values built during render even though the React Compiler memoizes them. Compute the value inside the effect instead of adding `useMemo`.

## App behavior

- The app is online-only. Queries and mutations use `networkMode: 'always'` so offline requests fail visibly instead of pausing. Do not add offline support unless asked.
- Show user feedback with `Warning`, `ErrorMessage` and `SuccessMessage` from `components/Notice`. Shared haptic patterns live in `src/helpers/vibrate.ts`. All haptics must be feature-detected and respect `settings.vibration`.

## Stack

- The backend is Supabase with row-level security (`supabase/schema.sql`). `supabase/functions/` are Deno edge functions outside the TS project.
- Do not edit generated files: `src/types/database.types.ts` (`yarn gen:types`) and `src/routeTree.gen.ts` (TanStack Router plugin).
- Query keys include the user id. Query options live in `src/hooks/` next to their hook, and route loaders use `queryClient` with `userId` from the router context.
- Use the native `Temporal` API for dates. No date libraries or polyfills.
- `docs/habit-redesign.md` holds the habit, streak and week-view design notes.
