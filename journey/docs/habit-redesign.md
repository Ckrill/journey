# Habit Tracker Redesign

## Current System

- **Contentful content types**: `workout` (event) with fields `{date, name, user}` and `user` with `{name, bestStreak, currentStreak, streakUpdatedDate}`
- **Streak logic**: Counts consecutive unique dates (across all habits) with a 3-day leniency gap. One global streak per user.
- **UI**: Chronological event list, single "submit event" action, global streak counter.

---

## Proposed Content Models (Contentful)

### `habit` (new)

| Field          | Type             | Description                       |
| -------------- | ---------------- | --------------------------------- |
| `name`         | Short text       | e.g. "Meditation", "Exercise"     |
| `user`         | Reference → User | Owner                             |
| `weeklyTarget` | Integer          | How many days/week (e.g. 2, 5, 7) |
| `active`       | Boolean          | Whether it's currently tracked    |

> No streak fields are stored. Both current and best streaks are **derived live** from `event` history (see Streak Calculation) — there is nothing to cache, sync, or keep clean.

### `event` (reshaped `workout`)

| Field   | Type              | Description                             |
| ------- | ----------------- | --------------------------------------- |
| `habit` | Reference → Habit | Which habit the event belongs to        |
| `date`  | Date              | The day it was done (ISO date, no time) |

> Reuses the existing `event` vocabulary. The old `name` field is dropped — the `habit` reference replaces it. Single-user: no `user` reference needed — events are reachable via `habit → user`.

### `user` (updated)

| Field  | Type       | Description |
| ------ | ---------- | ----------- |
| `name` | Short text |             |

> Streak fields are removed from `user`. Streaks are now per-habit and **derived live** from events — not stored anywhere. Deleting a habit takes its events (and therefore its streak) with it — no orphaned data.

---

## TypeScript Types

```typescript
type Habit = {
  id: string;
  name: string;
  weeklyTarget: number; // e.g. 2 = "2 times per week"
  active: boolean;
};

type Event = {
  id: string;
  habitId: string;
  date: string; // ISO date
};

// Derived for the week view
type WeekView = {
  weekStart: string; // Monday ISO date
  habits: {
    habit: Habit;
    events: boolean[]; // [Mon, Tue, Wed, Thu, Fri, Sat, Sun]
    completedCount: number;
    targetMet: boolean;
  }[];
};
```

---

## Streak Calculation

Since habits have a **weekly target** (not daily), the streak unit becomes **weeks**:

```
streak = number of consecutive weeks where eventCount >= weeklyTarget
```

### Algorithm

1. For each habit, group events by ISO week.
2. Walk backwards from the current week.
3. A week counts as "hit" if `events_in_week >= weeklyTarget`.
4. Streak breaks on the first week that doesn't meet the target.
5. The current week is only counted if already met; otherwise it's "in progress" (doesn't break the streak yet).

### Example

Habit "Exercise" with `weeklyTarget: 3`:

- This week: 2/3 done → in progress, streak not broken yet
- Last week: 4/3 → ✓
- Two weeks ago: 3/3 → ✓
- Three weeks ago: 1/3 → ✗ → **streak = 2 weeks**

Each habit gets its own independent streak.

### Storage: none (computed live)

Streaks are **never persisted** — a streak is a pure function of a habit's events, its `weeklyTarget`, and today's date. Keeping a stored copy would create a second source of truth that can drift (the "dirty" problem: write triggers, staleness guards, reconciliation). Deriving on demand removes all of that — the only mutation in the app is toggling an `event`; streaks just re-derive.

- **Current streak**: walk backwards from the current week to the first unmet week.
- **Best streak**: the longest run of consecutive met-weeks anywhere in the fetched history (same backward pass can track the max).
- **Fetch cost is bounded**: the existing expanding-window fetch only pulls history back to where the streak breaks, then caches it (TanStack Query). A typical streak resolves in one request; events are tiny (`{ habitId, date }`). Because the DB is never pruned, full history stays derivable, so even best-streak needs no stored value.

### Habit ordering

Habits in the week view are sorted by **current streak, descending** (longest active streak first), with **`sys.createdAt` (ascending) as the tiebreaker** when streaks are equal (e.g. all at 0 for a fresh user). Ordering is purely derived from the live streak calc \u2014 no stored sort field on `habit`.

---

## UI: Weekly Habit View

```
┌─────────────────────────────────────────────────┐
│  ‹  Week of Jun 9 – Jun 15  ›        [ Today ]  │
├─────────────────────────────────────────────────┤
│  Exercise (3×/week)          🔥 streak: 4 weeks │
│  [M✓] [T✓] [W ] [T ] [F ] [S ] [S ]   2/3     │
│                                                  │
│  Meditation (5×/week)        🔥 streak: 12 weeks│
│  [M✓] [T✓] [W✓] [T✓] [F✓] [S ] [S ]   5/5 ✓  │
│                                                  │
│  Reading (2×/week)           🔥 streak: 1 week  │
│  [M ] [T ] [W ] [T ] [F ] [S ] [S ]   0/2      │
│                                                  │
│                   [  +  ]                        │
└─────────────────────────────────────────────────┘
```

Tapping a day cell toggles the event (creates/deletes an `event` entry in Contentful).
While that create/delete is in flight, **the cell is disabled** (non-interactive, with a pending indicator) and re-enables once the mutation settles — preventing double-taps from racing a create against a delete.
The **+** button at the bottom opens the new-habit flow (see Habit Management).

---

## Habit Management

Habits are created and edited directly from the week view — no separate page needed.
A single shared **habit form** handles both creating and editing.

### The habit form

- Lives in a **modal** (overlay), not an inline row.
- Fields: **name** and **weeklyTarget** (1–7).
- **Create**: the **+** button at the bottom of the week view opens the modal empty. On submit, a `habit` entry is created (`active: true`) and appears in the list immediately (optimistic).
- **Edit**: tapping a habit (its name/label) opens the _same_ modal, pre-filled with that habit's values. On submit, the `habit` entry is updated.
- The modal is the only habit editor — there is no separate Settings screen for this.

### Modal animation

Reuse the `Feedback` component's reveal technique (see `Feedback.module.scss`):

- A full-screen overlay fades in (`pointer-events` toggled with a `.show` class).
- A large pseudo-element circle (`::before`, `border-radius` + `scale(0) → scale(1)`) expands from center as a radial reveal, timed _after_ the overlay fade so the wipe reads cleanly.
- Form contents slide/skew in (the Feedback heading/paragraph use `skewY(-20deg)` + `translateX` → settle), staggered behind the circle via transition delays.
- Driven by CSS transitions on a `show` boolean + the shared timing vars (`--instant`, `--fast`, `--slow`, `--rapid`), matching the existing feel.
- Dismiss reverses the animation; tapping the overlay or a close action sets `show = false`.

### Archiving

- Archiving (`active: false`) is offered from the edit form (e.g. an "Archive" action).
- `active: false` hides the habit from the week view but keeps its events and streak history intact.

---

## Week Navigation

A persistent week switcher at the top of the view: **‹ prev**, current week label, **next ›**, plus a **Today** shortcut.

### Behaviour

- **Weeks always start on Monday and end on Sunday** (ISO-8601 week), regardless of device locale. Day columns are fixed `Mon \u2026 Sun`. The streak's weekly grouping uses the same ISO week boundaries.- **Timezone: device-local clock.** The device's local time determines what "today" (and therefore the current week) is. Events are stored as plain calendar dates (`YYYY-MM-DD`, no time/offset), so once written a date never shifts when read in another zone. The clock only decides _which_ day a tap belongs to. (Matches existing `Temporal.Now.plainDateISO()` usage.)- The view is driven by a single `weekStart` (Monday, ISO date) held in route/URL state, e.g. `/?week=2026-06-08`. No param = current week.
- **‹ / ›** shift `weekStart` by ∓7 days. **Today** resets to the current week (clears the param).
- **Next ›** is disabled when `weekStart` is the current week — no navigating into the future.
- Each habit row only shows day cells for days that fall within the selected week.
- Toggling an event on a past week is allowed (back-fill / corrections); the cell writes/deletes an `event` with that exact date.
- Streak (🔥) always reflects the habit's overall streak as of the current week, independent of which week is being viewed.

### Data fetching

- **One events query, single source of truth.** Events are fetched once via the existing expanding-window mechanism (back to where the longest streak breaks) and cached (TanStack Query). The visible week grid and the streaks are both derived **client-side** from that one cached array.
- The streak fetch is a superset of any single week, so there is no separate per-week request and no double-fetching of the current week.
- **Week navigation within the fetched window costs zero requests** — switching weeks just re-filters the cached events by date. Only navigating _past_ the window triggers the expanding-window fetch to pull more history.
- Events are tiny (`{ habitId, date }`), so holding the recent set in memory is negligible.

### Habit fetching

- The week view fetches **active habits only**, filtered server-side via `content_type=habit&fields.active=true` — fetch only what's rendered.
- Archived habits (`active: false`) are simply excluded by the query. A separate fetch-all can be added later if an "archived habits" view is ever built.

---

## Routing Changes

| Route       | Before                 | After                            |
| ----------- | ---------------------- | -------------------------------- |
| `/`         | Add Event form         | **Weekly habit view** (new home) |
| `/journey`  | Chronological timeline | **Removed**                      |
| `/time`     | Time progress          | Unchanged                        |
| `/settings` | Settings               | Unchanged                        |

Header nav drops the separate "Add Event" entry; the home route keeps the name **"Journey"**.

---

## Resolved Decisions

| #   | Question               | Decision                                                                                 |
| --- | ---------------------- | ---------------------------------------------------------------------------------------- |
| 1   | **Streak granularity** | Weekly — consecutive weeks meeting `weeklyTarget`.                                       |
| 2   | **Multi-user**         | **Removed** — single-user only.                                                          |
| 3   | **History view**       | **Removed** — weekly view replaces the timeline.                                         |
| 4   | **Week navigation**    | **Yes** — prev/next/today switcher; no future weeks; past weeks editable.                |
| 5   | **Streak storage**     | **None** — streaks (current _and_ best) are derived live from events; nothing persisted. |
| 6   | **Settings profile**   | Keep the streak copy, driven by an **overall best** across all habits (computed live).   |
| 7   | **Celebration**        | Fire the `Feedback` celebration when a habit **hits its weekly target** for the week.    |

---

## Migration Path

> Existing data is **not** migrated — the database will be refreshed (wiped) and started clean. No back-fill of old `workout` entries, and no dedupe concerns: there is exactly **one `event` per habit per day**, so toggling off deletes the single matching event unambiguously.

1. Create `habit` content type in Contentful
2. Create the `event` content type (`habit` reference + `date`)
3. Update TypeScript types (`Event` reshaped to `{ id, habitId, date }`; drop `user` from `Habit`)
4. Rewrite streak calculation (weekly-based, per-habit, **computed live** — no persistence; current + best from the same fetched window)
5. Build the weekly view component as the home route (`/`)
6. Add the week navigation switcher (URL-driven `week` param, prev/next/today)
7. Add the shared **habit form modal** on the week view: **+** creates a habit, tapping a habit opens the same modal pre-filled to edit (and archive); animate the reveal in the style of `Feedback`
8. Remove the `/journey` timeline route, the old Add Event form, and multi-user filtering
9. Update the submit flow (tap day cell → toggle event)
10. Simplify header navigation
11. **Clean up dead code** left behind by the removed timeline / Add Event / multi-user features. Candidates to audit and delete (verify each is unreferenced before removing — `knip` can confirm):
    - `src/components/EventList/` (`EventList`, `Event`, `eventTransition`)
    - `src/components/ShowMore/`
    - `src/helpers/categorizer.ts` (year/month grouping for the timeline)
    - Multi-user helpers/types in `dataHandler.ts` and the user filtering logic
    - Streak helpers tied to the old daily model (`streak.ts`, `streakFetch.ts`, `streakPersist.ts`) — replace rather than keep
    - Old hooks: `useSubmitEvent`, `useDeleteEvent`, `useEventsQuery` if superseded by the new event/week hooks
    - Unused `requests.ts` URL builders (e.g. `getItemsByAttribute`) once query patterns change
