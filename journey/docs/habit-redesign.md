# Habit tracker design

Design notes for habits, events, streaks and the weekly view. The data lives in Supabase (`supabase/schema.sql`).

## Data model

- The `habits` table holds `name`, `weeklyTarget` (1 to 7 days per week), `plannedDays`, `goalDescription`, `goalMonths`, `active` and `createdAt`.
- The `events` table has one row per habit per day (`habitId`, `date`). A `unique (habit_id, date)` constraint means toggling a day off deletes exactly one event.
- Events store plain calendar dates (`YYYY-MM-DD`, no time or offset), so a date never shifts when read in another time zone.
- Archiving a habit sets `active: false`. It disappears from the week view, but its events and streak history stay intact.

## Streak calculation

Habits have a weekly target, so the streak unit is weeks:

```
streak = number of consecutive weeks where eventCount >= weeklyTarget
```

1. Group a habit's events by ISO week.
2. Walk backwards from the current week.
3. A week "hits" when `events_in_week >= weeklyTarget`. The streak breaks on the first week that doesn't.
4. The current week counts only if it is already met. If it isn't, it is "in progress" and doesn't break the streak.

Example: "Exercise" with `weeklyTarget: 3`.

- This week: 2/3, in progress, so the streak is not broken yet.
- Last week: 4/3, hit.
- Two weeks ago: 3/3, hit.
- Three weeks ago: 1/3, miss. The streak is 2 weeks.

Each habit has its own streak. The best streak is the longest run of consecutive hit weeks anywhere in the history.

### Storage

Streaks are never persisted. A streak is a pure function of a habit's events, its `weeklyTarget` and today's date. A stored copy would be a second source of truth that can drift. Toggling an event is the only mutation in the app, and streaks re-derive from it. See `src/helpers/streak.ts`.

## Weekly view

- The home route (`/`) shows the active habits, each with a row of day cells for the selected week.
- Tapping a cell toggles that day's event. The cell is disabled while the request is in flight, so a double tap can't race a create against a delete.
- Habits are listed oldest first (`createdAt` ascending).
- Hitting a habit's weekly target for the week triggers the `Feedback` celebration.
- The + Add habit button opens the habit form modal empty. Tapping a habit opens the same modal pre-filled to edit or archive it. The modal is the only habit editor.

## Week navigation

- Weeks follow ISO 8601 and run Monday to Sunday regardless of device locale. Streak grouping uses the same boundaries.
- The device's local clock decides what "today" and the current week are.
- The selected week is the `week` search param on `/` (for example `/?week=2026-06-08`). No param means the current week.
- A switcher offers previous, next and a shortcut back to the current week, and swiping the pager also changes weeks.
- Next is disabled on the current week, so you can't navigate into the future.
- Past weeks are editable, so you can back-fill or correct a day. The cell writes or deletes the event for that exact date.
- The streak always reflects the current week, regardless of which week is being viewed.

### Data fetching

- The app fetches all of the user's events once, in pages of 1000, and caches them with TanStack Query. The week grid and the streaks both derive from that array on the client, so changing weeks makes no requests.
- The query fetches only active habits (`active = true`), so archived habits never reach the client.

## Resolved decisions

| #   | Question           | Decision                                                              |
| --- | ------------------ | --------------------------------------------------------------------- |
| 1   | Streak granularity | Weekly. Consecutive weeks meeting `weeklyTarget`.                     |
| 2   | Multi-user         | Not shared. Each user's data is isolated by row-level security.       |
| 3   | History view       | None. The weekly view with week navigation replaces a timeline.       |
| 4   | Week navigation    | Previous, next and current. No future weeks. Past weeks are editable. |
| 5   | Streak storage     | None. Current and best are derived live from events.                  |
| 6   | Celebration        | Fire the `Feedback` celebration when a habit hits its weekly target.  |
