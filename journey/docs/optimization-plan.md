# Journey — Optimization Plan

> Generated: 2026-05-20

## Rating Scale

- **Value**: Impact on code quality, performance, or maintainability (1–5, 5 = highest)
- **Effort**: Time/complexity required (1–5, 5 = most effort)

## Overview

| Priority | §   | Item                                    | Value | Effort | ROI  | Status  |
| -------- | --- | --------------------------------------- | ----- | ------ | ---- | ------- |
| 1        | 13  | Streak — Simplify Calculation           | 3     | 2      | ★★★  | ⬜ TODO |
| 2        | 17  | Remaining Dead Code                     | 2     | 1      | ★★★★ | ⬜ TODO |
| 3        | 18  | ShowMore — Constant Recreated on Render | 2     | 1      | ★★★★ | ⬜ TODO |
| 4        | 19  | Streak Component — Nested Ternary       | 2     | 1      | ★★★★ | ⬜ TODO |
| 5        | 20  | EventList — Mutable Counter in Map      | 2     | 1      | ★★★★ | ⬜ TODO |
| 6        | 21  | Events — Paginate Instead of Fetch All  | 4     | 3      | ★★★  | ⬜ TODO |

---

## 13. Streak — Simplify Calculation

| Value | Effort | Status  |
| ----- | ------ | ------- |
| 3     | 2      | ⬜ TODO |

**Problem**: `streak.ts` is ~90 lines of complex logic with leniency pools, accumulated days from extra events, and day-by-day backward iteration through a nested year/month/day structure. It also depends on `streak-helpers.ts` and `categorizer.ts` for date lookups.

**Solution**:

- Simplify the rule: streak is broken if there's a gap of more than 3 days between consecutive events
- Sort user's events by date, walk forward checking gaps between consecutive dates
- Remove the leniency pool / accumulated days complexity
- Potentially remove `streak-helpers.ts` and the `categorizeByYearMonthDay` dependency
- Consider calculating streak without fetching ALL events — e.g. fetch only recent events (last N days or since last gap) via a filtered CDA query (`fields.date[gte]=...`)

**References**: [streak.ts](src/helpers/streak.ts), [streak-helpers.ts](src/helpers/streak-helpers.ts), [constants.ts](src/settings/constants.ts)

---

## 17. Remaining Dead Code — Commented-Out Functions

| Value | Effort | Status  |
| ----- | ------ | ------- |
| 2     | 1      | ⬜ TODO |

**Problem**: Several files still contain commented-out code blocks that add noise:

- `dateFormatting.ts` — 3 dead functions: `dateFormatter`, `getMonthDayYear`, `diffDays` (~20 lines)
- `requests.ts` — dead `getItem` function (~3 lines)
- `settings.tsx` — `showData` function + related commented JSX (~8 lines)

**Solution**: Delete all commented-out code. Git history preserves it.

**References**: [dateFormatting.ts](src/helpers/dateFormatting.ts#L1-L7), [dateFormatting.ts](src/helpers/dateFormatting.ts#L21-L35), [requests.ts](src/helpers/requests.ts#L10-L12), [settings.tsx](src/routes/settings.tsx#L44-L51)

---

## 18. ShowMore — `thresholds()` Recreated Every Render

| Value | Effort | Status  |
| ----- | ------ | ------- |
| 2     | 1      | ⬜ TODO |

**Problem**: `ShowMore.tsx` defines `thresholds()` inside the component body, creating a new array of 50 values on every render. This array is constant — it doesn't depend on props or state.

**Solution**:

Move it outside the component as a module-level constant:

```tsx
const THRESHOLDS = Array.from({ length: 51 }, (_, i) => i / 50);

const ShowMore = ({ callback }: Props) => {
  // ...
  const { ref } = useInView({ threshold: THRESHOLDS, ... });
};
```

**References**: [ShowMore.tsx](src/components/ShowMore/ShowMore.tsx#L17-L25)

---

## 19. Streak Component — Nested Ternary

| Value | Effort | Status  |
| ----- | ------ | ------- |
| 2     | 1      | ⬜ TODO |

**Problem**: `Streak.tsx` uses a nested ternary (`streak > 1 ? ... : streak === 0 ? ... : ...`) for conditional rendering. The third branch renders empty spans (effectively nothing). The fragment wrapper is unnecessary.

**Solution**:

Use early returns or a simple `if`/`else` structure:

```tsx
const Streak = () => {
  const streak = useStreak();

  if (streak.streak <= 0) return null;
  if (streak.streak === 0)
    return (
      <div>
        <span>Good to see you!</span>
      </div>
    );

  return (
    <div>
      <span>{streak.streak} days in a row!</span>
      <span className={styles.leniencyCounter}>{streak.leniency || ''}</span>
    </div>
  );
};
```

**References**: [Streak.tsx](src/components/Streak/Streak.tsx#L12-L35)

---

## 20. EventList — Mutable `overallIndex` Counter Inside Map

| Value | Effort | Status  |
| ----- | ------ | ------- |
| 2     | 1      | ⬜ TODO |

**Problem**: `EventList.tsx` uses `let overallIndex = 0` in the render body, incrementing it inside nested `.map()` calls. Mutable variables inside render + side effects inside map functions is fragile and hard to reason about. It's used to calculate staggered animation delays.

**Solution**:

Pre-compute a flat list with indices, or use `flatMap` before grouping:

```tsx
// Compute the flat index before the year was even reached
const eventsBeforeYear = eventsByYear
  .slice(0, yearIdx)
  .reduce(
    (sum, y) => sum + y.months.reduce((s, m) => s + m.events.length, 0),
    0,
  );
```

Or simpler — just pass the event's position in the original `eventsToShow` array:

```tsx
overallIndex={eventsToShow.indexOf(event)}
```

**References**: [EventList.tsx](src/components/EventList/EventList.tsx#L38-L77)

---

## 21. Events — Paginate Instead of Fetch All

| Value | Effort | Status  |
| ----- | ------ | ------- |
| 4     | 3      | ⬜ TODO |

**Problem**: `useEventsQuery` calls `getAll('workout')` which fetches all 1100+ events from Contentful via parallel paginated requests, even though the UI only shows 10 at a time. This wastes bandwidth, increases initial load time, and holds a large array in memory.

**Solution**:

- Replace `useEventsQuery` with `useInfiniteQuery` that fetches one page at a time (e.g. 50 events per page)
- Use Contentful's `skip` and `limit` params for server-side pagination
- Fetch the next page when the user clicks "Show More" (or use intersection observer)
- Remove the client-side `itemsToShow` slicing in `journey.tsx`
- Keep optimistic inserts working by prepending to the first page

**Trade-off**: Streak calculation via `refreshStreak(localEvents)` currently passes the full events cache. With pagination, it would rely on `fetchStreak` (which already fetches only recent events by date) instead of the full local cache.

**References**: [useEventsQuery.ts](src/hooks/useEventsQuery.ts), [requests.ts](src/helpers/requests.ts#L60-L87), [journey.tsx](src/routes/journey.tsx)
