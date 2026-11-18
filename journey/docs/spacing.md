# Spacing

How space between elements is set. The tokens are in `src/styles/constants.scss`.

## Rules

1. The parent owns the space between its children. Use `gap` on a flex or grid container, and give the children no outer `margin-block`.
2. Margins are only for:
   - Centering with `margin-inline: auto`.
   - Negative margins that bleed to the edge (`Carousel`, `WeekSwitcher`).
   - Pushing one item away with `auto`.
   - A label or message tied to its field (`FieldLabel`, `FieldMessage`).
3. A component can have an internal `gap`, but never an outer margin. If a component needs different spacing from its neighbours, the parent sets it.
4. If the parent has a `gap`, the children have margin 0. Flex and grid margins do not collapse, so mixing the two adds the values. Do not use `& + &` sibling selectors for spacing.
5. No spacing override variables, such as `--paragraph-space-before`. If a child needs one, the spacing belongs on the parent.
6. A disclosure (`details`) that reveals content sets `gap` on the container only while `[open]`, so the closed state adds no space (`ParagraphGroup`).
7. The page gutter is owned in one place: `Layout > main`, which uses `padding-inline: var(--space-l)`. Components do not add `padding-inline` to keep their distance from the screen edge. Padding that belongs to a component's own look (`Input`, `Button`) is fine.
8. Content width is owned in one place. `Section` sets `max-inline-size` and centres, and its children use `inline-size: 100%` without repeating the max or `margin-inline: auto`. Form widths work the same way: `FieldGroup` owns `--size-form`, so every control, `ButtonGroup`, `Button` and `FormActions` sits inside a `FieldGroup` and does not repeat it. The one exception is the `WeekSwitcher` cap, which stops its bleed from overflowing the section on wide screens.
9. A bleed uses the same token as the padding it cancels. If that padding changes, the negative margin changes with it (`Carousel`, `WeekSwitcher`).
10. A heading sets no margin of its own. The space after every heading is the `gap` of its container, so it is the same everywhere. This includes the content container of a modal.
11. Elements with browser default spacing (`h1`, `h2`, `p`, `ul`, `ol`) are reset once in `generic.scss`: `margin: 0`, and for lists also `padding: 0` and `list-style: none`. A component never needs its own reset.

## Tokens

Pick a token by its role, not by its pixel value.

| Token        | Value | Role                                     | Used for                           |
| ------------ | ----- | ---------------------------------------- | ---------------------------------- |
| `--space-xs` | 4px   | A part tied to its element               | Field label and message, icon gaps |
| `--space-s`  | 8px   | Items in a tight list                    | `DayStrip`, small pairs            |
| `--space-m`  | 12px  | Related items in a group                 | Buttons, paragraphs in a group     |
| `--space-l`  | 24px  | Blocks within a section                  | Heading, paragraph group           |
| `--space-xl` | 48px  | Between sections and between form fields | `SectionContainer`, `FieldGroup`   |

Use no literal pixel values for spacing.

## Layout

- `SectionContainer` is a vertical stack with `gap: var(--space-xl)`. It has no `margin-block` and no first-on-page override.
- `Section` is a vertical stack with `gap: var(--space-l)`. It has no `margin-block-start` and no `:first-of-type` rule.
- A `Divider` between sections has no margin and no `spacing` prop, because the container `gap` already spaces it.
- Groups that hold their own children set a `gap` of their own: `ButtonGroup` and `ParagraphGroup` use `--space-m`, `FormActions` uses `--space-l`, `FieldGroup` uses `--space-xl`.

## Migration

Work top-down. The wrong order doubles the spacing.

1. Add the `gap` to `Section` and `SectionContainer` and remove their margins.
2. In the same step, remove the outer margins from `Heading`, `ParagraphGroup`, `Paragraph` (the standalone ones), `Notice`, `Divider`, `FormActions` and `HabitSummary`, because the gap now covers them. Modals already use `SectionContainer`, so their headings are covered by its `gap`.
3. Remove `--paragraph-space-*` and `--notice-space-*`.
4. Remove the `padding-inline` from `Paragraph`, `ParagraphGroup` and `Section`, so only `Layout > main` sets the gutter. Update the `Carousel` and `WeekSwitcher` bleed in the same step, because it currently cancels the `Section` padding.
5. Replace the remaining literals (`10px`, `20px`, `25px`, `50px` and similar) with tokens.
6. Delete `--space-base`.
7. Remove the repeated `max-inline-size` and `margin-inline: auto` pairs from `Paragraph`, `ParagraphGroup` and `Notice`. Wrap every form control, button group and form-actions block in a `FieldGroup`, then remove `--size-form` from `Input`, `Textarea`, `Select`, `Pillbox`, `CheckboxGroup`, `Button`, `ButtonGroup` and `FormActions`. `WeekSwitcher` keeps its cap. `Section` has `align-items: center`, so children shrink to their content unless they get `inline-size: 100%`. This step carries the most regression risk.
8. Last, enable the Stylelint rules described under Enforcement, so `yarn validate` keeps the result.

Check the settings, habits and retro pages in the browser after step 2, and again after steps 4 and 7. If a heading later needs different spacing, wrap it and its content in an element with its own `gap` instead of adding a margin.

## Enforcement

Once the migration is done, `.stylelintrc.json` enforces the mechanical rules:

- `declaration-property-value-disallowed-list` blocks literal `px`, `rem` and `em` values in `margin`, `padding` and `gap`.
- `property-disallowed-list` blocks `margin-block*` and `margin-top`/`margin-bottom`. `margin-inline*` stays allowed for centering and bleed.
- An `overrides` entry exempts `FieldLabel` and `FieldMessage`, which rule 2 allows. Other exceptions use `stylelint-disable-next-line` with a reason.

Stylelint cannot check whether a parent has a `gap`, so rules 6 to 9 stay a review matter.
