# Spacing

How space between elements is set. The tokens and their values are in `src/styles/constants.scss`.

## Rules

1. The parent owns the space between its children. Use `gap` on a flex or grid container. Children get no outer `margin-block` and no `& + &` sibling selector for spacing. Flex and grid margins do not collapse, so a margin next to a `gap` adds both.
2. Margins are only for centering (`margin-inline: auto`), pushing one item away (`auto`), and negative margins that bleed to the edge (`Carousel`, `WeekSwitcher`). A bleed uses the same token as the padding it cancels.
3. A component can have an internal `gap` but no outer margin. If it needs different spacing from its neighbours, the parent sets it. Do not add spacing override variables such as `--paragraph-space-before`.
4. A `details` that reveals content sets `gap` only while `[open]`, so the closed state adds no space (`ParagraphGroup`).
5. `Layout > main` owns the page gutter with `padding-inline`. Components do not add `padding-inline` to keep off the screen edge. Padding that is part of a component's look (`Input`, `Button`) is fine.
6. `Section` owns content width. It sets `max-inline-size` and centres, and its children use `inline-size: 100%`. The exception is the `WeekSwitcher` cap, which stops its bleed from overflowing the section on wide screens.
7. `FieldGroup` owns the form width (`--size-form`). Every control, `ButtonGroup`, `Button` and `FormActions` sits inside a `FieldGroup` and does not repeat the width.
8. A heading has no margin. The space after it is the `gap` of its container, including a modal's content container.
9. `generic.scss` resets the browser default spacing on `h1`, `h2`, `p`, `ul` and `ol` once: `margin: 0`, plus `padding: 0` and `list-style: none` for lists. Components do not reset it again.
10. A field is a flex column with `gap: var(--space-xs)`, so its label, control and message have no margin. An empty `FieldMessage` renders nothing and adds no gap.

## Tokens

Pick a token by its role, not its pixel value. Never use literal pixel values for spacing.

| Token         | Role                         |
| ------------- | ---------------------------- |
| `--space-xs`  | A part tied to its element   |
| `--space-s`   | Items in a tight list        |
| `--space-m`   | Related items in a group     |
| `--space-l`   | Items in a form or list      |
| `--space-xl`  | Blocks within a section      |
| `--space-xxl` | Between sections, page edges |

Each container sets its own `gap` from this table. `SectionContainer` and `Section` have no margin, no first-on-page override and no `:first-of-type` rule.

## Enforcement

`.stylelintrc.json` enforces the mechanical rules:

- `declaration-property-value-disallowed-list` blocks literal `px`, `rem` and `em` values in `margin`, `padding` and `gap`.
- `property-disallowed-list` blocks `margin-block*` and `margin-top`/`margin-bottom`. `margin-inline*` and the `margin` shorthand stay allowed, for centering, bleed and `margin: 0` resets.
- An exception uses `stylelint-disable-next-line` with a reason after `--`. The only one today is the `env()` fallback in `Header`. Center an absolutely positioned box with `align-self: center` in a flex or grid container, not `margin-block: auto`.

Stylelint cannot check whether a parent has a `gap`, so rules 4 to 10 stay a review matter.
