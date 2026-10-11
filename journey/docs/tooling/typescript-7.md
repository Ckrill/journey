# TypeScript 7 — Upgrade Blockers

Status: **waiting**. Stay on TypeScript 6.x. No aliases, no side-by-side TS installs.

Checked 2026-10-11 against TypeScript 7.0.2 (`latest`). `tsc --noEmit` on this project passes with 0 errors, so the code is not the blocker. The tooling is.

## Blockers

1. **No programmatic compiler API in 7.0.** The new API is expected in 7.1. The only workaround today is a `@typescript/typescript6` alias next to TS 7, which means two TypeScript installs.
2. **`@typescript-eslint/*` peer range excludes 7.** `utils`, `project-service`, `tsconfig-utils` and `typescript-estree` (pulled in by `@tanstack/eslint-plugin-query` and `@tanstack/eslint-plugin-router`) declare `typescript >=4.8.4 <6.1.0`. `ts-api-utils` has an open-ended `>=4.8.4` peer. The plugins load without `typescript`, but rule-time behaviour was not tested.
3. **Editor setup.** `.vscode/settings.json` points `typescript.tsdk` and `js/ts.tsdk.path` at `node_modules/typescript/lib`. TS 7 uses its own VS Code extension and language server, so these settings need revisiting.

## Minor

- Language-server plugins are not supported in 7.0. None are used here, so this only matters if one is added.
- Types can print differently in error messages, and tsconfig errors may be less helpful.
- Rarely, results depend on `--checkers`. Pin it in CI if it is ever tuned.

## Not a problem

- `oxlint-tsgolint` bundles its own typescript-go, so type-aware linting is independent of the installed `typescript`.
- `knip`, `vite`, `@vitejs/plugin-react`, `@tanstack/router-plugin` and `stylelint` do not depend on `typescript`.
- tsconfig uses `moduleResolution: bundler` and has no `baseUrl` or `target: es5`, so none of the 6.0 removals that 7.0 turns into hard errors apply.

## Upgrade when

- TypeScript 7.1 ships the new API, and
- `@typescript-eslint/*` (or the TanStack ESLint plugins) widen their `typescript` peer range, and
- the VS Code TypeScript 7 setup is settled.

Then: bump `typescript`, update the `.vscode` tsdk settings, run `yarn validate`.

## References

- https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/
