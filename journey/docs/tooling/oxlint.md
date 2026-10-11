# Oxlint Migration — Blockers

Status: **waiting**. Stay on ESLint. No hacks, no ESLint kept around as a peer dependency, no multiple TypeScript versions.

Evaluated 2026-10-11 with oxlint 1.87.0 and oxlint-tsgolint 7.0.2003. A trial migration lint-checks and builds the project, and the React Compiler rules are covered natively. The blockers below are about tooling gaps.

## Blockers

1. **Needs the `node-modules` linker.** `tsgolint` cannot resolve packages or `tsconfig` `extends` through Yarn PnP, so type-aware results were unreliable (false "error type" diagnostics). The only fix is `nodeLinker: node-modules`, which gives up PnP's dependency strictness.
2. **ESLint stays installed.** `@tanstack/eslint-plugin-query` and `@tanstack/eslint-plugin-router` require `eslint` as a peer. They cannot run without it, so the migration cannot remove ESLint from the tree.
3. **JS plugins are alpha.** Perfectionist and the two TanStack plugins run through oxlint `jsPlugins`, which the docs describe as "not subject to semver". Plugin rules cannot use type information.
4. **Perfectionist coverage shrinks.** Only `sort-objects`, `sort-enums` and `sort-union-types` were carried over. The rest of the `recommended-natural` preset (for example object-type sorting) is lost.
5. **Type-aware linting runs on typescript-go (a TS 7-based engine) while the project stays on TS 6.** `tsgolint` can reject a `tsconfig` that TS 6 accepts, for example if options removed in TS 7 such as `baseUrl` are added. See [typescript-7.md](typescript-7.md).

## Minor

- `@eslint-react/eslint-plugin` is replaced by the native `react` plugin. Most rules have equivalents, not all.
- `eslint-plugin-depend` has no replacement.
- 59 of typescript-eslint's 61 type-aware rules are implemented in `tsgolint`.
- The rule set differs from the old `strictTypeChecked`. New `jsx-a11y`, `unicorn`, `no-unsafe-type-assertion` and `consistent-return` findings appear (11 in this project), so expect tuning.
- Editor setup (oxc extension, `typeAware` setting) is not configured.
- Pin `oxlint` and `oxlint-tsgolint`, since categories and rule names are still moving.

## Not a problem

- The React Compiler lint rules are covered natively (`purity`, `immutability`, `refs` and others).
- Existing `eslint-disable` comments are still honoured.
- Lint speed is better. This was not measured against the old setup.

## Revisit when

- `@tanstack/eslint-plugin-query` and `@tanstack/eslint-plugin-router` no longer need `eslint` as a peer, or oxlint ships native equivalents.
- JS plugins leave alpha.
- `tsgolint` works under Yarn PnP, or you decide to move off PnP anyway.
- The TypeScript 7 upgrade is possible (see [typescript-7.md](typescript-7.md)), so the type-aware engine and `tsc` agree.

## References

- https://oxc.rs/docs/guide/usage/linter/js-plugins.html
- https://oxc.rs/docs/guide/usage/linter/type-aware.html
- https://oxc.rs/blog/2026-08-18-react-compiler-support
