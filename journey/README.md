# Journey

A habit tracker built as an installable web app (PWA), primarily for Chrome on Android.

- **Habits.** Set a weekly target, tap the days you did it, and build streaks measured in weeks. See [docs/habit-redesign.md](docs/habit-redesign.md).
- **Retro.** A weekly summary and reflection, with an optional Web Push reminder.
- **Journey.** Time-progress bars, including your life expectancy based on your profile settings.

## Stack

- React 19 with the React Compiler, TypeScript and Vite
- TanStack Router (file-based) and TanStack Query
- Supabase (Postgres with row-level security, Auth and an Edge Function for reminders)
- SCSS modules, `motion` and `react-icons`
- Hosted on Vercel

## Getting started

Yarn 4 is the package manager.

```sh
yarn install
yarn dev
```

The dev server runs on <http://localhost:3000>.

Create a `.env.local` file with:

| Variable                        | Description                                    |
| ------------------------------- | ---------------------------------------------- |
| `VITE_SUPABASE_URL`             | Supabase project URL                           |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase publishable key (public by design)    |
| `VITE_VAPID_PUBLIC_KEY`         | Public VAPID key used to subscribe to Web Push |

## Scripts

| Command             | Description                                                        |
| ------------------- | ------------------------------------------------------------------ |
| `yarn validate`     | Runs Oxfmt, Stylelint, ESLint and `tsc`                            |
| `yarn format:fix`   | Formats with Oxfmt                                                 |
| `yarn lint:css:fix` | Fixes Stylelint issues                                             |
| `yarn lint:js:fix`  | Fixes ESLint issues                                                |
| `yarn knip`         | Reports unused files and exports                                   |
| `yarn gen:types`    | Regenerates `src/types/database.types.ts` from the Supabase schema |
| `yarn build`        | Production build (also writes `stats.html`)                        |

## Backend

- The database schema, row-level security policies and the reminder cron job are in [supabase/schema.sql](supabase/schema.sql).
- `supabase/functions/send-reminders` sends due reminders as Web Push. It runs every 15 minutes through `pg_cron`. The comment at the top of `index.ts` lists the deploy steps and the required secrets.
