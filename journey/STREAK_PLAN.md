# Streak Simplification Plan

## Current Problem

The streak calculation walks backwards day-by-day from today through a year/month/day tree, using a "leniency pool" + "banked days from extra events" system. This requires **all events** in memory — you can't short-circuit because banked days from earlier might cover gaps later.

## New Rule

> Streak = number of unique dates with events, within an unbroken chain (no gap > 3 days between consecutive event dates).

- Drop the "banking" mechanic entirely
- A miss is just a miss — you get 3 grace days, period
- `daysRemaining` tells the user how close they are to breaking (3 - days since last event)

## Phase 1 — Simplify Algorithm (use in-memory events) ✅

Events are already loaded for the journey view, so no fetch change needed yet.

**New implementation** (~15 lines):

```ts
import type { Events, User } from '../types/types';

const daysBetween = (dateA: string, dateB: string) => {
  const msPerDay = 86_400_000;
  return Math.round(
    (new Date(dateB).getTime() - new Date(dateA).getTime()) / msPerDay,
  );
};

export const calculateStreak = (user: User | null, events: Events) => {
  if (!user) return { streak: 0, daysRemaining: 3 };

  // Unique dates for this user, sorted descending
  const dates = [
    ...new Set(events.filter((e) => e.user.id === user.id).map((e) => e.date)),
  ].sort((a, b) => b.localeCompare(a));

  if (!dates.length) return { streak: 0, daysRemaining: 3 };

  const today = new Date().toISOString().split('T')[0];
  const daysSinceLast = daysBetween(dates[0], today);

  // Streak already broken
  if (daysSinceLast > 3) return { streak: 0, daysRemaining: 3 };

  // Walk consecutive pairs — break on first gap > 3
  let streak = 1;
  for (let i = 0; i < dates.length - 1; i++) {
    if (daysBetween(dates[i + 1], dates[i]) > 3) break;
    streak++;
  }

  return { streak, daysRemaining: 3 - daysSinceLast };
};
```

**Files to change:**

| File                                   | Action                                                    |
| -------------------------------------- | --------------------------------------------------------- |
| `src/helpers/streak.ts`                | Replace with new implementation                           |
| `src/helpers/streak-helpers.ts`        | Delete (no longer needed)                                 |
| `src/settings/constants.ts`            | Delete or remove `leniency` (only consumer was streak)    |
| `src/contexts/eventsContext.tsx`       | Update `Streak` type: `leniency` → `daysRemaining`        |
| `src/components/Streak/Streak.tsx`     | Update to use `daysRemaining`                             |
| `src/components/Feedback/Feedback.tsx` | No change (only reads `streak.streak`)                    |
| `src/hooks/useAddEvent.ts`             | Update streak comparison (§16 can be done simultaneously) |

**Files to delete:**

- `src/helpers/streak-helpers.ts`
- `src/helpers/categorizer.ts` — only if `categorizeByYearMonthDay` has no other consumers (check: `categorizeByYearAndMonth` is still used by `EventList.tsx`, so keep the file but can remove `categorizeByYearMonthDay` export)

---

## Phase 2 — Decouple Streak from Event List (with pagination)

When the journey view is paginated, streak needs its own data source.

**Approach:** Dedicated date-filtered CDA query.

```
GET /spaces/{space}/environments/{env}/entries
  ?content_type=workout
  &order=-fields.date
  &fields.date[gte]=2026-04-21   ← 30 days ago
  &limit=100
```

Filter by user client-side (Contentful CDA can't filter by linked entry fields directly without `links_to_entry`).

- If no gap > 3 days found within the window → expand window and re-fetch (rare for real usage)
- Streak calculation stays the same algorithm, just fed by a smaller dataset

**Context changes:**

- `EventsProvider` splits into two data sources: paginated events (for display) + recent events (for streak)
- Or: streak gets its own context/hook with an independent fetch

---

## Migration Notes

- The `Streak` type changes from `{ streak: number; leniency: number }` to `{ streak: number; daysRemaining: number }`
- `daysRemaining` semantics: 3 = logged today, 2 = last event was yesterday, 0 = about to break
- The `bestStreak` logic in `useAddEvent` remains unchanged (it just compares numbers)
