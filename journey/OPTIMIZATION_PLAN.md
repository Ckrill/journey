# Journey — Optimization Plan

> Generated: 2026-05-20

## Rating Scale

- **Value**: Impact on code quality, performance, or maintainability (1–5, 5 = highest)
- **Effort**: Time/complexity required (1–5, 5 = most effort)

## Overview

| Priority | §   | Item                                | Value | Effort | ROI   | Status  |
| -------- | --- | ----------------------------------- | ----- | ------ | ----- | ------- |
| 1        | 3   | Derived State — Replace useEffect   | 4     | 1      | ★★★★★ | ⬜ TODO |
| 2        | 1   | Data Fetching — Parallel Requests   | 5     | 2      | ★★★★★ | ✅ Done |
| 3        | 5   | Contentful Client — Single Instance | 3     | 1      | ★★★★  | ⬜ TODO |
| 4        | 8   | Dead Code — Remove Commented Code   | 2     | 1      | ★★★★  | ⬜ TODO |
| 5        | 9   | firstRender Anti-Pattern in Root    | 3     | 2      | ★★★   | ✅ Done |
| 6        | 4   | Deletion Queue — Simplify EventList | 4     | 2      | ★★★   | ⬜ TODO |
| 7        | 12  | Form — Index Route Complexity       | 3     | 2      | ★★★   | ⬜ TODO |
| 8        | 7   | Bundle Size — Lazy-Load Contentful  | 3     | 2      | ★★★   | ⬜ TODO |
| 9        | 6   | ESLint — Re-enable Strict Rules     | 3     | 3      | ★★★   | ⬜ TODO |
| 10       | 2   | Type Safety — Remove `any` Types    | 4     | 3      | ★★★   | ⬜ TODO |
| 11       | 11  | Context Re-renders — Combine        | 2     | 2      | ★★    | ⬜ TODO |
| 12       | 10  | Service Worker — Modernize          | 2     | 3      | ★★    | ⬜ TODO |

---

## 1. Data Fetching — Parallel Requests & Error Handling

| Value | Effort | Status  |
| ----- | ------ | ------- |
| 5     | 2      | ⬜ TODO |

**Problem**: In `__root.tsx`, two sequential API calls create a waterfall (`getEvents().then(() => getEvents2().then(...))`). No error handling exists — a failed request silently breaks the app.

**Solution**:

- Use `Promise.all` to fetch both pages in parallel
- Add error state and loading state to the root component
- Consider moving data fetching to TanStack Router's `loader` for proper suspense/error boundaries

**References**: [\_\_root.tsx](src/routes/__root.tsx#L57-L72)

---

## 2. Type Safety — Remove `any` Types in Data Layer

| Value | Effort | Status  |
| ----- | ------ | ------- |
| 4     | 3      | ⬜ TODO |

**Problem**: `dataHandler.ts` uses `any` extensively for Contentful data mapping. This hides potential runtime bugs and defeats the purpose of TypeScript.

**Solution**:

- Type `primeEvents` return properly using the existing `Event`/`Events` types
- Remove intermediate `any` casts — use proper mapped types from Contentful response shapes
- Re-enable disabled ESLint `@typescript-eslint/no-unsafe-*` rules one by one

**References**: [dataHandler.ts](src/helpers/dataHandler.ts#L25-L45), [eslint.config.js](eslint.config.js#L53-L68)

---

## 3. Derived State — Replace `useState` + `useEffect` with Computed Values

| Value | Effort | Status  |
| ----- | ------ | ------- |
| 4     | 1      | ⬜ TODO |

**Problem**: `journey.tsx` stores `eventsFiltered` in state via `useEffect`, but it's a pure derivation of `events` + `soloMode` + `user`. This adds unnecessary re-renders and complexity.

**Solution**:

```tsx
// Replace useState + useEffect with:
const eventsFiltered = soloMode
  ? events.filter((item) => item.user.id === user?.id)
  : events;
```

**References**: [journey.tsx](src/routes/journey.tsx#L34-L48)

---

## 4. Deletion Queue — Simplify EventList State Machine

| Value | Effort | Status  |
| ----- | ------ | ------- |
| 4     | 2      | ⬜ TODO |

**Problem**: `EventList.tsx` implements a deletion queue with `useEffect` that processes one item at a time, recalculating streak on each deletion. The effect depends on `events` which it also mutates, creating subtle timing issues.

**Solution**:

- Replace the queue with a direct callback: delete → remove from state → recalculate streak
- Move deletion logic into a `useDeleteEvent` hook that encapsulates the API call + state update
- Eliminate the intermediate `deletionQueue` state entirely

**References**: [EventList.tsx](src/components/EventList/EventList.tsx#L46-L71)

---

## 5. Contentful Client — Single Instance

| Value | Effort | Status  |
| ----- | ------ | ------- |
| 3     | 1      | ⬜ TODO |

**Problem**: `contentful-management` client is instantiated in both `index.tsx` (route) and `deleteEntry.tsx` with the same config. This creates multiple SDK instances and duplicates configuration.

**Solution**:

- Create a single `src/api/contentful.ts` module that exports the client instance
- Import from that module in both places

**References**: [index.tsx](src/routes/index.tsx#L33-L35), [deleteEntry.tsx](src/helpers/deleteEntry.tsx#L6-L8)

---

## 6. ESLint — Re-enable Disabled Strict Rules Incrementally

| Value | Effort | Status  |
| ----- | ------ | ------- |
| 3     | 3      | ⬜ TODO |

**Problem**: 17 TypeScript-ESLint rules are disabled under "Temp" comments. These rules catch real bugs (`no-floating-promises`, `no-misused-promises`, `restrict-template-expressions`).

**Solution** (incremental):

- [ ] `@typescript-eslint/no-unnecessary-template-expression` — easy auto-fixable
- [ ] `@typescript-eslint/restrict-template-expressions` — prevents `[object Object]` in strings
- [ ] `@typescript-eslint/no-floating-promises` — ensures async errors are handled
- [ ] `@typescript-eslint/no-confusing-void-expression` — quick fixes
- [ ] Remaining rules as type coverage improves

**References**: [eslint.config.js](eslint.config.js#L50-L69)

---

## 7. Bundle Size — Lazy-Load `contentful-management`

| Value | Effort | Status  |
| ----- | ------ | ------- |
| 3     | 2      | ⬜ TODO |

**Problem**: `contentful-management` is a heavy SDK (~50KB+ gzipped) used only for write operations (add/delete events). It's imported at the top level of the index route and `deleteEntry.tsx`, meaning it's loaded even when users just browse.

**Solution**:

- Dynamic `import('contentful-management')` only when the user submits or deletes
- Or move write operations behind route-level code splitting (dedicated `/add` route)

**References**: [index.tsx](src/routes/index.tsx#L3), [deleteEntry.tsx](src/helpers/deleteEntry.tsx#L1)

---

## 8. Dead Code — Remove Commented-Out Code and Unused Types

| Value | Effort | Status  |
| ----- | ------ | ------- |
| 2     | 1      | ⬜ TODO |

**Problem**: Multiple files contain large blocks of commented-out code (`types.tsx`, `dataHandler.ts`, `settings.tsx`). These add noise and confusion — git history preserves the original code.

**Solution**:

- Run `knip` to identify unused exports/types
- Remove all commented-out type definitions in `types.tsx`
- Remove commented-out functions in `dataHandler.ts`
- Remove commented `showData` in `settings.tsx`

**References**: [types.tsx](src/types/types.tsx#L14-L56), [settings.tsx](src/routes/settings.tsx#L48-L51)

---

## 9. `firstRender` Anti-Pattern in Root

| Value | Effort | Status  |
| ----- | ------ | ------- |
| 3     | 2      | ⬜ TODO |

**Problem**: `__root.tsx` uses `useState(true)` + checking `firstRender` inside a `useEffect` to run initialization once. This is an anti-pattern — the dependency array `[firstRender, ...]` causes lint warnings and the manual `setFirstRender(false)` is fragile.

**Solution**:

- Use an empty dependency array `[]` for the init effect (it genuinely runs once)
- Or move data fetching to TanStack Router's `beforeLoad`/`loader` which is designed for this

**References**: [\_\_root.tsx](src/routes/__root.tsx#L48-L73)

---

## 10. Service Worker Registration — Modernize

| Value | Effort | Status  |
| ----- | ------ | ------- |
| 2     | 3      | ⬜ TODO |

**Problem**: The service worker setup is directly ported from Create React App. It uses `serviceWorkerRegistration.ts` with CRA-specific patterns. Vite has better PWA tooling via `vite-plugin-pwa`.

**Solution**:

- Evaluate if offline support is still needed
- If yes: migrate to `vite-plugin-pwa` which auto-generates the SW from config
- If no: remove the service worker files entirely to reduce complexity

**References**: [service-worker.ts](src/service-worker.ts), [serviceWorkerRegistration.ts](src/serviceWorkerRegistration.ts)

---

## 11. Context Re-renders — Combine Related Contexts

| Value | Effort | Status  |
| ----- | ------ | ------- |
| 2     | 2      | ⬜ TODO |

**Problem**: The app wraps 4 context providers at the root. The split context pattern (value + updater) is good, but `events` and `streak` are tightly coupled — every event change triggers a streak recalculation scattered across multiple components.

**Solution**:

- Combine `events` + `streak` into a single context/reducer where streak is derived automatically on event changes
- This eliminates the duplicated `calculateStreak` calls in `EventList.tsx`, `index.tsx`, and `__root.tsx`

**References**: [main.tsx](src/main.tsx#L30-L38), [EventList.tsx](src/components/EventList/EventList.tsx#L68), [index.tsx](src/routes/index.tsx#L56)

---

## 12. Form — Index Route Complexity

| Value | Effort | Status  |
| ----- | ------ | ------- |
| 3     | 2      | ⬜ TODO |

**Problem**: `src/routes/index.tsx` is ~310 lines handling form state, Contentful API calls, optimistic updates, error handling, streak recalculation, and user updates. Multiple concerns are tangled.

**Solution**:

- Extract `useAddEvent` hook to encapsulate: API call, optimistic update, streak recalc, best-streak update
- The route component becomes just form UI + hook consumption
- Reduces the component from ~310 to ~80 lines

**References**: [index.tsx](src/routes/index.tsx)
