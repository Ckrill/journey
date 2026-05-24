# TanStack Query Migration Plan

## Goal & Scope

**Replace:** `EventsContext` + manual fetch/mutation logic with TanStack Query.
**Keep:** `UserContext` (auth/localStorage), `SettingsContext` (localStorage), `StreakContext` (derived computation + persistence).
**Out of scope:** Streak migration, user auth flow, settings.

## Dependencies

**Add:** `@tanstack/react-query` (+ optionally `@tanstack/react-query-devtools`)
**Remove:** Nothing — `EventsContext` is deleted as a file, not a package.
**Compatibility:** TanStack Query v5 works with React 19 and existing TanStack Router v1.

## Architecture Decisions

| Decision             | Choice                                                                                                   | Rationale                                                                                                        |
| -------------------- | -------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| QueryClient location | Created in `src/lib/queryClient.ts`, passed via `QueryClientProvider`                                    | Standard placement, above router                                                                                 |
| Stale time           | `staleTime: 30_000` (30s)                                                                                | Contentful CDA has propagation delay; avoid refetching stale data immediately after mutations                    |
| After mutations      | Optimistic cache update only; no `invalidateQueries` on success                                          | CDA won't reflect changes for seconds. Rely on the optimistic state. Only invalidate on error (to resync truth). |
| Query key convention | `['events']`                                                                                             | Single resource, no params needed                                                                                |
| Streak interaction   | Mutations call `streakActions.refresh(localEvents)` / `streakActions.increment()` using query cache data | Same pattern as today, but reads from `queryClient.getQueryData` instead of stale closure                        |

## Order of Attack

Each step leaves the app in a working, buildable state.

---

### Step 1 — Install & scaffold

- Install `@tanstack/react-query`
- Create `src/lib/queryClient.ts` — exports configured `QueryClient`
- Wrap app in `QueryClientProvider` in `main.tsx`
- **Verify:** App builds and runs unchanged.

---

### Step 2 — Create `useEventsQuery` hook

- New file: `src/hooks/useEventsQuery.ts`
- `queryFn` calls `getAll<EventsContentful>('workout')` + `parseEvents`
- `staleTime: 30_000`
- **Does not replace anything yet** — just exists alongside context.
- **Verify:** Hook can be imported; types are correct.

---

### Step 3 — Create `useDeleteEvent` mutation

- New file: `src/hooks/useDeleteEvent.ts`
- `mutationFn`: existing `deleteEntry` logic (get → unpublish → delete)
- `onMutate`: cancel queries, snapshot, optimistically remove from cache
- `onError`: rollback to snapshot
- `onSettled`: no invalidation (CDA delay)
- **Verify:** Types compile.

---

### Step 4 — Create `useSubmitEvent` mutation

- New file: `src/hooks/useSubmitEvent.ts`
- `mutationFn`: existing create + publish logic from `useAddEvent`
- `onMutate`: optimistically prepend temp event to cache, call `incrementStreak()`
- `onSuccess`: replace temp event with real entry in cache, call `refreshStreak(updatedEvents)` reading from query cache
- `onError`: rollback cache, call `refreshStreak()` (server recalculation)
- Returns `{ mutate, isPending, isError, isSuccess }` — replaces manual booleans
- **Verify:** Types compile.

---

### Step 5 — Migrate `Event.tsx` to use `useDeleteEvent`

- Remove `removeEvent` prop
- Import and call `useDeleteEvent` mutation directly
- Remove `isDeleted` / `hasWarning` state — replace with `mutation.isPending` / `mutation.isError`
- **Verify:** Deleting an event works. Rapid deletions don't revert each other.

---

### Step 6 — Migrate `EventList.tsx`

- Remove `removeEvent` function
- Stop passing `removeEvent` prop to `Event`
- Remove `useEvents` / `useEventsUpdate` imports
- Receive `eventsToShow` prop as before (parent provides it)
- **Verify:** Event list renders, deletion still works.

---

### Step 7 — Migrate `journey.tsx` route

- Replace `useEvents()` (context) with `useEventsQuery().data`
- **Verify:** Journey page renders events, filtering works.

---

### Step 8 — Migrate `index.tsx` route (add event form)

- Replace `useAddEvent()` with `useSubmitEvent()`
- Map `isPending` / `isError` / `isSuccess` to existing UI feedback
- Remove `showFeedback` / `setShowFeedback` if redundant
- **Verify:** Adding an event works, feedback shows, streak updates.

---

### Step 9 — Migrate `__root.tsx` route

- Remove `useEffect` that syncs loader data → context
- Change router `loader` to use `queryClient.ensureQueryData` (prefetch into TanStack Query cache instead of returning data)
- Remove `useEventsUpdate` import
- **Verify:** Initial load still shows events, no flash of empty state.

---

### Step 10 — Delete dead code

- Delete `src/contexts/eventsContext.tsx`
- Delete `src/hooks/useAddEvent.ts`
- Remove `EventsProvider` from component tree
- Remove `removeEvent` prop type from `Event.tsx`
- Clean up unused imports across touched files
- **Verify:** `yarn typecheck && yarn lint && yarn knip` pass.

---

## File-Level Summary

| Step | Created                       | Modified                     | Deleted                               |
| ---- | ----------------------------- | ---------------------------- | ------------------------------------- |
| 1    | `src/lib/queryClient.ts`      | `main.tsx`, `package.json`   | —                                     |
| 2    | `src/hooks/useEventsQuery.ts` | —                            | —                                     |
| 3    | `src/hooks/useDeleteEvent.ts` | —                            | —                                     |
| 4    | `src/hooks/useSubmitEvent.ts` | —                            | —                                     |
| 5    | —                             | `Event.tsx`                  | —                                     |
| 6    | —                             | `EventList.tsx`              | —                                     |
| 7    | —                             | `journey.tsx`                | —                                     |
| 8    | —                             | `index.tsx`                  | —                                     |
| 9    | —                             | `__root.tsx`                 | —                                     |
| 10   | —                             | `main.tsx` (remove provider) | `eventsContext.tsx`, `useAddEvent.ts` |

## Edge Cases & Risks

| Risk                                  | Mitigation                                                                              |
| ------------------------------------- | --------------------------------------------------------------------------------------- |
| CDA propagation delay after mutations | Don't `invalidateQueries` on success — trust the optimistic cache                       |
| Streak depends on fresh events list   | Pass `queryClient.getQueryData(['events'])` to streak refresh after mutations           |
| Temp ID → real ID swap (add event)    | `onSuccess` uses `setQueryData` to replace temp entry by matching temp ID prefix        |
| React Compiler compatibility          | TanStack Query v5 hooks are compatible — no manual memoization needed                   |
| Concurrent deletes (original bug)     | `setQueryData(prev => prev.filter(...))` is always atomic — bug eliminated structurally |
| Router loader timing vs. QueryClient  | Create `QueryClient` outside React tree (module-level) so it's available in loader      |

## Validation Criteria

After each step, run:

```sh
yarn typecheck && yarn lint
```

After step 10 (final), run:

```sh
yarn typecheck && yarn lint && yarn knip && yarn build
```

### Manual Smoke Tests

1. Load app → events appear (no empty flash)
2. Add event → appears instantly, streak increments, feedback shows
3. Add event with network error → rolls back, streak recalculates
4. Delete event → disappears instantly
5. Delete 3 events rapidly → all three disappear, none reappear
6. Delete event with network error → reappears with warning
7. Switch solo/all mode → filtering works on query data
8. "Show more" pagination → still works
