# Habit tracker design

Design notes for habits, events, completed weeks and the weekly view. The data lives in Supabase (`supabase/schema.sql`).

## Data model

- The `habits` table holds `name`, `weeklyTarget` (1 to 7 days per week), `plannedDays`, `goalDescription`, `goalMonths`, `active` and `createdAt`. The database uses snake_case and `src/helpers/mappers.ts` converts to camelCase.
- The `events` table has one row per habit per day (`habitId`, `date`). A `unique (habit_id, date)` constraint means toggling a day off deletes exactly one event.
- Events store plain calendar dates (`YYYY-MM-DD`, no time or offset), so a date never shifts when read in another time zone.
- Archiving a habit sets `active: false`. It disappears from the week view, but its events stay intact.
- Row-level security isolates each user's data. Nothing is shared between users.

## Completed weeks

Habits have a weekly target, so the unit is weeks. A week is completed when its event count is at least `weeklyTarget`. A habit's count is the number of completed weeks anywhere in its history. The weeks don't need to be consecutive, and a missed week costs nothing. The app calls this count "weeks travelled".

1. Group a habit's events by ISO week.
2. Count the weeks that hit the habit's current `weeklyTarget`.

The current week counts as soon as its target is met.

Example: "Exercise" with `weeklyTarget: 3`.

- This week: 2/3, not counted yet.
- Last week: 4/3, completed.
- Two weeks ago: 3/3, completed.
- Three weeks ago: 1/3, not counted.
- Four weeks ago: 5/3, completed. The count is 3.

Each habit has its own count. The count uses the habit's current `weeklyTarget`, so changing the target changes past weeks retroactively.

### Storage

The count is never stored. It is a pure function of a habit's events and its `weeklyTarget`. A stored copy would be a second source of truth that can drift, so it re-derives whenever events or the target change. See `src/helpers/completedWeeks.ts`.

## Weekly view

- The home route (`/`) shows the active habits, each with a row of day cells for the selected week.
- Tapping a cell toggles that day's event. The cell is disabled while the request is in flight, so a double tap can't race a create against a delete.
- Habits are listed newest first (`createdAt` descending), here and on the Journey page. The habits query orders them in the database, and the create and update mutations keep that order in the cache.
- Hitting a habit's weekly target for the week triggers the `Feedback` celebration.
- The + Add habit button opens the habit form modal empty. Tapping a habit opens the same modal pre-filled to edit or archive it. The modal is the only habit editor.

## Week navigation

- Weeks follow ISO 8601 and run Monday to Sunday regardless of device locale. Completed-week grouping uses the same boundaries.
- The device's local clock decides what "today" and the current week are.
- The selected week is the `week` search param on `/` (for example `/?week=2026-06-08`). No param means the current week.
- A switcher offers previous, next and a shortcut back to the current week, and swiping the pager also changes weeks.
- Next is disabled on the current week, so you can't navigate into the future.
- Past weeks are editable, so you can back-fill or correct a day. The cell writes or deletes the event for that exact date.
- The completed-weeks count always covers all weeks, regardless of which week is being viewed.
- There is no history view. Week navigation replaces a timeline.

### Data fetching

- The app fetches all of the user's events once, in pages of 1000, and caches them with TanStack Query. The week grid and the completed-weeks counts both derive from that array on the client, so changing weeks makes no requests.
- The query fetches only active habits (`active = true`), so archived habits never reach the client.
