# Web guidance audit

Places where the code does not follow the `modern-web-guidance` guides or `.github/copilot-instructions.md`. `yarn validate` passes, so none of these are caught by tooling.

The guides are in `~/.agents/skills/modern-web-guidance/guides/` (194 files). All of them were read except `built-in-ai`, `wasm` and `webmcp`, where only the opening paragraphs were read to confirm they do not apply. Findings were checked against the code, but nothing was run in a browser. The benchmark under batch 5 was run in Node, not on a device.

## Work plan

Work through the batches in order. Run `yarn validate` after each batch and tick the boxes as items are done. Items marked "unverified" should be checked before changing code for them.

1. Real bugs. Behavior that is broken today.
2. Quick wins. Small, low-risk, mostly mechanical changes.
3. Forms and dialogs. Accessibility wiring, validation timing, focus and dismissal.
4. Design decisions. Need your call first, and several touch many files (contrast tokens, dark mode, heading levels, typography).
5. Performance. Measure first, then fix.
6. Hardening and optional. CSP, Trusted Types and other defense in depth.

Guide advice that the project rules reject is under "Conflicts with project rules", and what is left to review is under "Follow-up".

## 1. Real bugs

- [ ] `src/components/Form/Input/Input.tsx` destructures `required` and never passes it to the `<input>`. It only feeds the label asterisk and `aria-required`, so native `required` does not apply anywhere `Input` is used (no `:invalid` or `:user-invalid`, no native validation). On the sign-in form the `required: true` rules have no message, so an empty submit fails silently. Forward `required` to the input. `Select` does forward it, and also sets `aria-required`, which is redundant there.
- [ ] `src/components/Form/Checkbox/Checkbox.module.scss` (line 36): `border-color: 2px solid var(...)` is an invalid declaration, so the checkbox shows no focus indicator.
- [ ] `src/components/Header/Header.module.scss` (line 46): `.link` sets `outline: none` with no `:focus-visible` style, so keyboard focus on the nav links is invisible. The guide marks this mandatory.
- [ ] `public/site.webmanifest` shortcuts (lines 31, 44 and 57) open `/?name=Stretching`, `/?name=Yoga` and `/?name=Running`, but the `/` route's `validateSearch` keeps only `week`, so the shortcuts do nothing.
- [ ] `supabase/functions/send-reminders/index.ts` (lines 49-70, 72-82 and 141) extracts the local time with `Intl.DateTimeFormat#formatToParts()` and minutes-since-midnight arithmetic. The 60-minute window cannot cross midnight, so a Sunday 23:30 reminder is not due at 00:10 on Monday. Use `Temporal.ZonedDateTime`. Check Temporal support in the Deno edge runtime first.
- [ ] `src/helpers/retro.ts` (line 44) compares `habit.createdAt.slice(0, 10)`, a UTC date, with a device-local week date. A habit created near midnight lands in the wrong week. Reuse the conversion in `timeBars.ts` `getHabitStart`.
- [ ] The reminder time zone is stored only on save (`useRetroReminderMutations.ts` line 39). `NotificationsModal.tsx` (lines 74-78) closes without saving when the form is not dirty, which contradicts the text on line 142, so a traveling user keeps the old zone.
- [ ] `src/components/Settings/Profile.tsx` (lines 47-50 and 66): the birth year is written to settings on every keystroke and shows "Please enter a valid year." immediately, so typing "198" flashes an error. Drop the live `errorText`, forward `min` and `max`, and style `:user-invalid`.

## 2. Quick wins

Instructions file

- [ ] Remove the `prefers-reduced-motion` blocks in `src/components/Modal/Modal.module.scss` (line 64), `src/components/ParagraphGroup/ParagraphGroup.module.scss` (line 51) and `src/components/TimeProgress/TimeProgress.module.scss` (line 103). The instructions say animations and smooth scrolling always run.

Headers and security (`vercel.json`, `public/sw.js`, build)

- [ ] Add the low-risk response headers, which the security guide says carry little breakage risk. `vercel.json` currently sets none, and a live request to `https://journey.vercel.app/` returns only HSTS. Add `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy: camera=(), geolocation=(), microphone=()`, and `Content-Security-Policy: frame-ancestors 'none'` with `X-Frame-Options: DENY`. There are no iframes in `src`, so the app never needs framing.
- [ ] Add `Cross-Origin-Opener-Policy: same-origin-allow-popups` (the guide's default). `src` has no `window.open`, popups or OAuth, so plain `same-origin` would also be safe. If you add `Cross-Origin-Resource-Policy: same-origin`, leave `/logo.png` cross-origin because `index.html` uses it as the `og:image`.
- [ ] `public/sw.js` (lines 31-41) passes the push payload `url` to `openWindow` and `navigate` with no same-origin check. The payload is VAPID-authenticated, so risk is low. Resolve it with `new URL(url, self.location.origin)` and ignore other origins.
- [ ] `supabase/functions/send-reminders/index.ts` compares `x-cron-secret` with `!==`, which is not constant-time. Low risk, but use a constant-time comparison. The function has no CORS handling, which is right for a cron-only endpoint.
- [ ] `public/site.webmanifest` has an absolute `start_url` (`https://journey.vercel.app`) and no `id`. Set `"id": "/"` and `"start_url": "/"`, which keeps the same app identity.
- [ ] Outside the guide: `vite.config.js` sets `build.sourcemap: true`, which ships source maps publicly, and `visualizer({ open: true })` writes `stats.html` and opens a browser on every build, which will also run in CI.

Semantics

- [ ] `src/components/Header/Header.tsx`: the nav links sit in a `<header>` and `<ul>` with no `<nav>` landmark.
- [ ] `src/components/Habit/HabitList/HabitList.tsx` (lines 48-59): habit rows are bare `<div>`s. Use `<ul>` and `<li>`.
- [ ] `src/components/TimeProgress/TimeProgress.tsx` (lines 44-55) uses `<div role="progressbar">`. The guide wants a native `<progress>`.
- [ ] Decorative icons without `aria-hidden`: `DayToggle.tsx` (line 81) and `WeekSwitcher.tsx` (lines 32 and 47).
- [ ] `index.html`: `<title>` is static. The guide wants unique titles updated on SPA route changes.
- [ ] `src/components/RouteError/RouteError.tsx` (lines 24-27): the error paragraph has no `role="alert"`.
- [ ] `index.html` has no `<meta name="text-scale" content="scale">` (Chrome on Android 146 and later).

Loading and layout

- [ ] `src/components/Feedback/Feedback.tsx` (line 62) always mounts `<audio preload="auto">`, so the 113 KB `thump.mp3` downloads on the home route even when `settings.sound` is off. Use `preload="none"`, or create the `Audio` only when sound is enabled.
- [ ] `index.html` has no `preconnect` to the Supabase origin, which is the first request the app makes. Vite can substitute `%VITE_SUPABASE_URL%` in `index.html`.
- [ ] Fonts use `font-display: swap` but are not preloaded, although Rubik 900 and Plex Regular are used on the first paint of the sign-in screen. When adding preloads, include `crossorigin` and limit them to two or three fonts.
- [ ] `overflow: hidden` where only clipping is wanted. Use `overflow: clip` in `Feedback`, `DayStrip`, `DayStatus`, `Pillbox`, `SignIn`, `WeekSwitcher`, `TimeProgress` (two places) and `Modal.module.scss` (line 13). Line 30 of `Modal.module.scss` sets it on `::backdrop`, where it has no effect.
- [ ] `vh` units in `SignIn.module.scss` (line 13, `5vh`) and `SignIn/transition.ts` (`10vh` and `0vh`). Use `dvh`.
- [ ] Permanent `will-change: transform` in `Feedback.module.scss` (lines 32, 73 and 116) on layers that are always mounted, since `Feedback` renders unconditionally in `src/routes/index.tsx`. Remove them or apply them only under `.show`.

CSS

- [ ] Single-transform states use the `transform` shorthand with no identity value on the base element. The guide wants `scale: 1` on the base, `scale: ...` on the state, and `transition: scale`. Files: `Button`, `Input`, `Select`, `Textarea`, `Pillbox`, `WeekSwitcher`, `Checkbox`, `Modal`, `Feedback` and `Spinner` (use `rotate`). `DayToggle` already does this. The `skewY` in `Feedback.module.scss` (lines 71 and 114) cannot be converted.
- [ ] `allow-discrete` is written inside the `transition` shorthand in `Modal.module.scss` (lines 96-100 and 115-118) and `ParagraphGroup.module.scss` (lines 35-38). The guide says to use a separate `transition-behavior`. Harmless in current Chrome.
- [ ] Dead or duplicate code: `Checkbox.tsx` (line 35) applies `styles.pulse` with no matching rule, `SectionContainer.module.scss` (lines 12-14) targets `[is-first-on-page='true']` that no component sets, `generic.scss` (lines 9-12) repeats lines 1-7, `src/index.css` is a leftover, and `WeekSwitcher.module.scss` (lines 4-5) declares `justify-content` twice.
- [ ] Token drift: `--border-width` is used only by `Divider` while `2px` is literal in many files, `--pill-radius` duplicates `--radius-base`, `Spinner` uses a literal `1s` instead of `--duration-turtle`, `WeekSwitcher`, `DayToggle` and `Modal` use literal scales instead of `--scale-*`, the Rubik stack appears three times, and the Modal backdrop `0.35` appears twice.
- [ ] Low priority: `color-mix(in srgb, ...)` in `Button` (lines 57-61 and 68), `Select` (lines 96-100), `Notice` (lines 13-14), `Spinner` (lines 5-6) and `TimeProgress` (line 84). Use `in oklab`. Only `Button` lines 57-61 change visibly.
- [ ] Low priority: no `accent-color` is set, which affects the native time input in `NotificationsModal.tsx` (line 156). `Modal.module.scss` (line 62) sets `scrollbar-width: none` on a scrollable region, with little effect on Android.
- [ ] Low priority: static inline styles in `SignIn.tsx` (line 38) and `src/screens/SignIn.tsx` (line 69).
- [ ] Low priority: `ParagraphGroup.module.scss` (lines 24-25) uses `flex-direction: column-reverse`, so visual order differs from DOM order. Harmless today.

Dates

- [ ] `src/helpers/mappers.ts` (line 36) uses `row.remind_time.slice(0, 5)`. Use `Temporal.PlainTime.from(...).toString({ smallestUnit: 'minute' })`.
- [ ] Low priority: `week.ts` (lines 60-62) hard-codes `'en-US'`, habits are sorted by string comparison of timestamps in `HabitList.tsx` (lines 34-36) and `retro.ts` (line 42) instead of `Temporal.Instant.compare`, and `BarDetail.tsx` pluralizes months by hand instead of using `Duration#toLocaleString`.

## 3. Forms and dialogs

Fields and validation

- [ ] `src/components/Form/FieldMessage/FieldMessage.tsx`, `Input.tsx`, `Textarea.tsx`, `Select.tsx`: help and error text is not linked to its field with `aria-describedby`, errors are not announced, and only `Select` sets `aria-invalid`. `FieldMessage` also renders an empty `<p>` when there is no text.
- [ ] `src/components/SignIn/SignIn.tsx`: the email field only needs `spellCheck={false}`, because the guide says `autocorrect` and `autocapitalize` are always off for `type="email"`. Add `enterKeyHint` (`next` on email, `go` on password), a show/hide toggle on the password field and a "Forgot password" link.
- [ ] `src/components/ChangePassword/ChangePasswordModal.tsx` (lines 78-96): the 8-character rule only appears after a failed submit. Add `minLength={8}` and a hint.
- [ ] `ChangePasswordModal.tsx` (lines 98-119) asks for the new password twice. The guide advises against repeated fields. Remove the confirm field and add the show-password toggle.
- [ ] `ChangePasswordModal.tsx` (line 51) calls `updateUser({ password })` with no re-authentication. Check Supabase's secure password change setting.
- [ ] Hints render below the input (`Input.tsx` line 47). The guide wants format hints above so autofill popovers do not cover them. `DeleteAccountModal.tsx` (line 109) puts the "Type ... to confirm" instruction there.
- [ ] No `autocomplete` token on the birth year (`bday-year`, `Profile.tsx` lines 64-74) or the weekly target (`HabitFormModal.tsx` lines 165-183).
- [ ] Selected or done state is shown by color only in `Pillbox.module.scss` (lines 94-97, checked option) and `DayStrip.module.scss` (lines 34-37, done day). Add a check mark or underline. `DayToggle` already has a check icon.
- [ ] Optional: textareas are fixed at `min-block-size: 96px` (`Textarea.module.scss` lines 12 and 18), while the retro textareas hold up to 2000 characters. `field-sizing: content` with a `max-block-size` would fit the content.
- [ ] Low priority and unverified: `Input.tsx` hides the suffix ("days", "months") with `aria-hidden`, so screen reader users lose the unit. No guide rule covers it.

Dialogs and overlays

- [ ] `src/components/Feedback/Feedback.tsx` (lines 56-61) and `Feedback.module.scss` (lines 1-45): the celebration overlay is a plain full-screen `<div>` with click-only dismissal. There is no Esc handling, the back gesture on Android leaves the page instead of closing it, and the page behind is not inert. The hidden overlay (`opacity: 0`, no `inert`) also seems to stay in the accessibility tree, so its text may be announced (unverified). Render it as a `<dialog>` or popover, or auto-dismiss it.
- [ ] No modal has a visible close or Cancel control (`Modal.tsx` lines 85-119). `DeleteAccountModal.tsx` has no safe action, and the guide wants `autofocus` on the safe action in a destructive confirmation.
- [ ] There is no `autoFocus` anywhere. In `HabitFormModal.tsx` (lines 128-141) the `ParagraphGroup` summary comes before the Name input, so initial focus probably lands on "Show more" (inferred, not tested). Add `autoFocus` to the Name input.
- [ ] `Modal.tsx` (line 86) names the dialog with `aria-label` although every caller renders a heading. Use `aria-labelledby`.
- [ ] Low priority: `Modal.tsx` (line 109) puts `role="presentation"` on the scroller that wraps the focusable dialog body. No practical impact.
- [ ] Low priority: `Modal.tsx` (line 88) has no fallback for browsers without `closedby`. Below 600px `handleScrollerClick` covers it.
- [ ] Optional: the week arrows hard-cut (`WeekPager.tsx` lines 68-75, `Carousel.tsx` line 30) while a swipe animates. Make the arrows smooth-scroll the pager.

## 4. Design decisions

Decide these first, because they touch many files.

Contrast

Ratios are WCAG 2.x values computed against `--color-background` (#f5f5f5, "bg") and `--color-field` (#fff, "field"). Disabled controls are exempt.

- [ ] Input, select, textarea, checkbox and pillbox boundaries are a 2px `--color-border-subtle` (#eee) border, which is 1.16:1 on field. The guide wants 3:1 for control boundaries. A border near #8a8a8a gives 3.17:1 on bg. `--color-border-strong` (#9098a9) is not enough either (2.66:1).
- [ ] Orange `--color-warning` (#ffa500) is used for error and required text, 1.81:1 on bg. Use a text-safe token near #9a5b00 (4.98:1) and keep orange for fills. Files: `FieldMessage.module.scss`, `FieldLabel.module.scss`.
- [ ] `Notice.module.scss` colors its text with the tone color on its own 10% tint: warning 1.70:1, error 2.32:1, success 2.40:1. Keep the tone for the icon, border and tint and use `--color-text` (9.2:1) for the text.
- [ ] `--color-text-faint` (#bbb) is used for real content at 1.76:1 on bg: `DayStrip.module.scss` (line 28), `Pillbox.module.scss` (line 88), `WeekSwitcher.module.scss` (line 63) and `HabitItem.module.scss` (line 32, dimmed further with `opacity: 0.4`). A text token near #6f6f6f gives 4.61:1 on bg.
- [ ] `--color-brand-secondary` on `--color-brand-primary` is 3.45:1 for 16px bold text, which needs 4.5:1. Files: `DayStrip.module.scss`, `Pillbox.module.scss`, `Header.module.scss` (nav links), `DayToggle.module.scss`. Darkening secondary to about #4a2846 gives 4.47:1.
- [ ] White on `--color-error` (#ff6c55) is 2.79:1 in the danger button (`Button.module.scss` line 55). Error-colored text on bg is 2.56:1 (line 76). A token near #c73a25 gives white 5.17:1. `Button.module.scss` (lines 2, 3 and 55) hard-codes white, so `contrast-color(var(--button-background))` would pick a readable color instead, and would pick black on the error background.
- [ ] `--color-text-muted` (#787987) is 3.94:1 on bg for small text in `Paragraph.module.scss` (line 26) and `ParagraphGroup.module.scss` (line 64). A token near #696a79 gives 4.89:1.
- [ ] Text dimmed with opacity: `HabitSummaryItem.module.scss` (line 13, `opacity: .5`, 2.52:1) and `TimeProgress.module.scss` (line 70, `opacity: .6`, 3.17:1). Use a solid color of at least 4.5:1.
- [ ] The TimeProgress info bar (`--color-info`, #3498db) is 2.89:1 on bg and 2.55:1 against its own track (`TimeProgress.module.scss` line 25). Needs 3:1 as a non-text element.
- [ ] `src/components/Button/Button.module.scss` (line 22): `outline: none`. The replacement is a small background shift (`#34495e` to `#2c3e50`) plus a scale, which is probably below the 3:1 contrast the guide requires. Not measured.
- [ ] Unverified: picker option hover and `:focus-visible` in `Select.module.scss` (lines 108-111) use `#eee` on a `#fff` picker, which is a weak keyboard focus indicator.

Color schemes

- [ ] No dark mode and no `color-scheme` anywhere. Missing `<meta name="color-scheme">` in `index.html`, `color-scheme: light dark` in `src/styles/constants.scss`, and `light-dark()` color tokens. Native controls and `<audio>` render light only.
- [ ] Low priority: no `forced-colors` handling. State is carried only by background color in `Pillbox.module.scss` (checked option) and `Header.module.scss` (active underline). Chrome on Android does not support forced colors, so this has little value for the primary target.

Structure and layout

- [ ] No view has an `<h1>`. Every page heading in `src/components/Heading/Heading.tsx` is an `<h2>`, the Feedback overlay renders `<h1>`s instead, and the sign-in title in `src/screens/SignIn.tsx` (lines 49-58) is a `<div>`.
- [ ] The sticky `Header` never hides. By my estimate it is about 81px tall, or about 117px with bottom navigation (roughly 14% of an 800px viewport), and the guide says to keep fixed bars under 12%. Confirm in devtools. The guide suggests hiding it on scroll down with a `scroll-state` container query.
- [ ] `src/styles/generic.scss` (line 14): a global `* { user-select: none; ... }`. The guide says no global resets, and it blocks text selection and copying everywhere.
- [ ] Low priority: BEM-style modifiers (`input--error`, `select--error`, `heading--m`), which the guide advises against.
- [ ] Low priority: `src/components/Spinner/Spinner.tsx` uses `role="status"`. The guide recommends `progress` or a `progressbar` role for loading states.

Typography and text scaling

- [ ] No `text-wrap` anywhere. Use `balance` on headings (`Heading.module.scss`, `Feedback.module.scss` `.heading` and `.paragraph`) and `pretty` on body text (`Paragraph.module.scss`, `Notice.module.scss`).
- [ ] Fixed-length `line-height` values instead of unitless ones in `Button`, `Divider`, `FieldMessage`, `Input`, `Select`, `Textarea`, `Heading`, `Notice` and `Paragraph`. `body` in `src/styles/generic.scss` sets none, so it is `normal`. Use ratios such as `1.5` and add `body { line-height: 1.5 }`.
- [ ] The `clamp()` font sizes in `Feedback.module.scss` and `SignIn.module.scss` use `vw` alone as the middle term (the guide combines viewport and font-relative units, for example `calc(1rem + 2vw)`), and some ranges exceed the guide's 2.5x limit: `Feedback.module.scss` (line 92, 3x, and line 96, 5x) and `SignIn.module.scss` (line 20, 5x). At 200% zoom the viewport term falls below the floor and the text stops scaling.
- [ ] `Feedback.module.scss` (lines 60-97) has five hand-tuned size classes picked in JS by `getHeadingSize` (`src/helpers/synonyms.ts` lines 35-54), and `SignIn.module.scss` (line 20) hand-tunes `15vw`. `text-fit: grow per-line-all` (Chrome 150 and later) would replace both. Keep `clamp()` as the fallback.
- [ ] Fixed pixel heights on text boxes inside clipping parents: `DayToggleGroup.module.scss` (line 3, 44px), `DayStatus.module.scss` (line 2, 36px), `Pillbox.module.scss` (line 28, 44px) and `Checkbox.module.scss` (line 36, 44px). Use `min-block-size`.
- [ ] Fonts: `src/styles/fonts.scss` has no `size-adjust` or metric overrides, nothing sets `font-size-adjust`, and the Rubik fallback is a literal `Arial, Helvetica, sans-serif` in `Feedback.module.scss` (lines 64 and 109) and `SignIn.module.scss` (line 19). Use `font-size-adjust` or metric-matched fallback faces.
- [ ] Plex Mono is loaded at weight 500 only (`fonts.scss` lines 78-91), but weight 600 is requested in `HabitSummary`, `HabitItem` and `HabitSummaryItem`, so bold is probably synthesized. Not checked in a browser.
- [ ] Sans and mono text sit side by side in `HabitItem.module.scss` (line 28), `HabitSummaryItem.module.scss` (line 9) and `TimeProgress.module.scss` (line 66). The mono fallback (`courier`) is not metric-matched, so use `font-size-adjust`.
- [ ] Low priority: `text-transform: uppercase` in about 13 files (Button, HabitItem, Header, FieldLabel and others). The guide advises against all-caps for emphasis, but it looks like deliberate visual identity.
- [ ] Low priority: `letter-spacing: 1px` in `Input`, `Select` and `Checkbox` does not scale with font size. No guide rule covers it. `0.055em` would scale.
- [ ] Low priority: `TimeProgress.module.scss` (lines 54-58) uses `white-space: nowrap` with an ellipsis on the habit name. The pixel breakpoint `600px` in `Modal.module.scss` (line 87) could be `38em`. `Modal.tsx` (line 19) reads `window.matchMedia('(width < 600px)')` once, duplicating that breakpoint, with no `change` listener.
- [ ] Low priority: `text-box: trim-both cap alphabetic` would simplify the padding on `Button.module.scss` (lines 11-19) and the icon alignment in `Notice.module.scss` (lines 30-42).

Motion

- [ ] `TimeProgress.module.scss` (line 89) animates `inline-size` (layout) every frame through a registered `--progress` property. The guide prefers `opacity` and `transform`. Set the final width statically and animate `clip-path` instead.
- [ ] Low priority: the modal backdrop fade in `Modal.module.scss` (line 24) scroll-drives a registered custom property that feeds `::backdrop` opacity, which runs on the main thread. Only worth revisiting if jank shows up.
- [ ] Optional: the `motion` library is used in `Header.tsx` (underline `layoutId`), `PageTransition.tsx`, `Spinner.tsx` and `SignIn/transition.ts`. The guide prefers View Transitions for layout state changes, which would remove the `vendor-motion` chunk.

Refactors

- [ ] `calc(Nrem / 16)` appears 57 times in 22 files. Add a Sass `rem()` function, and a shared mixin for the field box that `Input`, `Select` and `Textarea` each repeat.

Privacy and browser support

- [ ] `src/lib/supabase.ts` uses the default `createClient`, so the session JWT and refresh token live in `localStorage`. This is the Supabase default for SPAs. The realistic options are a short session lifetime or accepting the risk.
- [ ] Low priority: the `settings:<userId>` key stays in `localStorage` after sign-out. It is intentional, holds no PII beyond the UUID in the key, and is removed on account deletion.
- [ ] `Profile.tsx` (line 20) calls `Temporal.Now` at module scope and `week.ts` calls it during render, with no feature check. Browsers without Temporal (Chrome below 144, Safari) get the generic route error. The guides suggest a polyfill, which your rules reject, so a "browser not supported" screen is the in-rule option.

## 5. Performance

- [ ] Toggling a habit does the streak work up to five times per render, once for each `HabitList` in the `WeekPager` slides (`HabitList.tsx` lines 29-33, `WeekPager.tsx` lines 19 and 45-58, `streak.ts` lines 21-45), and twice per toggle (`onMutate` and `onSuccess` in `useToggleEvent.ts`). A Node micro-benchmark (V8's experimental Temporal on a desktop CPU, so not representative of a phone) measured about 31 ms for 5 habits and 915 events, and about 87 ms for 10 habits and 5,480 events, per render of five slides. Measure it first in Chrome DevTools with 4x or 6x CPU throttling, or on a real device, looking at long tasks and the Interactions track. Then compute streaks once and pass them down, and cache `weekStartOf` per date. Removing `useMemo` earlier does not change this, since each slide computed its own streaks before too.
- [ ] `src/lib/router.tsx` (lines 15-16) sets `defaultPreload: 'viewport'`. All three header links are always in view, so `/settings` and its reminders fetch load at startup. Use `'intent'`. `/retro` is reached through `navigate()` on a `<Button>` (`routes/index.tsx` lines 117-125), so it is never preloaded. Use a `<Link preload="intent">`.
- [ ] Low priority: `usePushSync.ts` (line 26) and `helpers/push.ts` (lines 30-35) upsert the push subscription at every start at default priority, alongside the first data loads. Use `priority: 'low'` through a custom `fetch` for that URL, and `scheduler.postTask` where available.
- [ ] Optional: `content-visibility: auto` with `contain-intrinsic-size` on the four off-screen slides. The main cost is React render, so fixing the streak work helps more.

## 6. Hardening and optional

- [ ] Add a Content Security Policy, in report-only mode first. The app has no inline scripts and no third-party scripts, so the guide's nonce or hash approach adds nothing and `script-src 'self' 'report-sample'` is the practical form. A fuller policy is `default-src 'self'; connect-src 'self' https://<ref>.supabase.co; form-action 'self'; worker-src 'self'; object-src 'none'; base-uri 'self'`. Fonts and the sound file are same-origin and larger than Vite's 4 KB inline limit, so `default-src 'self'` covers them. The only inline code is the `<style>#root:empty` block in `index.html`, which needs a `sha256-` hash in `style-src` or a move into a stylesheet. A personal app has no report collector, so use the DevTools Issues tab.
- [ ] Add `Connection-Allowlist: (response-origin "https://<ref>.supabase.co")` (Chrome 152) with `Vary: Sec-Fetch-Dest`, and serve a superset allowlist on `/sw.js`. The only outbound connections in `src` go to `VITE_SUPABASE_URL`.
- [ ] Try `require-trusted-types-for 'script'` in `Content-Security-Policy-Report-Only`. The only `innerHTML` in `src` is a read in `src/main.tsx` (line 20), but React and other dependencies may still use sinks internally.
- [ ] Optional: reject requests to `send-reminders` that carry a `Sec-Fetch-Site` header, since the cron caller is not a browser.
- Not applicable, checked in `src`, `index.html` and `public/sw.js`: cookies (the session is in `localStorage`, covered in batch 4), `postMessage` and `message` listeners, `eval`, `document.write`, `dangerouslySetInnerHTML`, external scripts and stylesheets (so no SRI), cross-origin isolation (no `SharedArrayBuffer`), `Clear-Site-Data` (sign-out is client-side, and the settings key is kept on purpose), and HSTS (already served).

## Conflicts with project rules

These are guide recommendations that the project rules reject, so they are not tracked as findings.

- The motion guide asks for `prefers-reduced-motion` handling, pause controls and static defaults for persistent animations (the infinite `Spinner` and the TimeProgress fill), and marks it mandatory for the `Modal` at 600px and wider and the `TimeProgress` stagger. The project rule says no.
- Service worker caching. No violation in the code: `public/sw.js` has push and notification-click handlers plus an empty `fetch` handler, and no caching. It is registered in `src/main.tsx` (line 37). The performance guide ("Service Workers & Caching Strategies") recommends `CacheFirst` for hashed static assets, `NetworkFirst` for HTML (falling back to cache when offline), and size and expiry limits. The project rule is online-only with no offline support unless asked. `NetworkFirst` for HTML is offline support, so it conflicts. `CacheFirst` for hashed assets only is a load-speed optimization and could be considered separately.
- `npx`. No violation in the repo: nothing in `package.json`, `scripts/`, `docs/` or `.github/` runs `npx`. The conflict is the skill's own commands (`npx -y modern-web-guidance@latest ...`). `yarn dlx modern-web-guidance@latest ...` would follow the rule if you want it enforced for the skill too, and the guides are also available locally (see `.github/copilot-instructions.md`).
- Many guides tell you to load polyfills (`scheduler-polyfill`, `temporal-polyfill`, `webauthn-polyfills`, DOMPurify, `fetchLater`). The project rule is no polyfills.
- The `switch` guide: `<input type="checkbox" switch>` is supported only by Safari, so Chrome on Android would need a polyfill. The on/off toggles are in `Preferences.tsx` (lines 23-50), `Notifications.tsx` (lines 78-86) and `NotificationsModal.tsx` (lines 118-125). Not tracked.
- Fallbacks that guides mark mandatory, which degrade gracefully instead under your rules: `scrollsnapchanging` in `Carousel.tsx` (line 45), `sibling-index()` in `TimeProgress.module.scss` (lines 8-12 and 26), `:has()` and `font-size-adjust`.
- The privacy guide recommends `Clear-Site-Data` on logout, but the settings key is kept on purpose.
- Forced-colors advice targets desktop browsers, while the primary target is Chrome on Android.
- Passkeys, `quick-sign-ins` and `verify-email-ownership` are not recommended for this email and password Supabase app. Autofill already works through the `username` and `current-password` tokens.
- Speculation rules: the guide itself says not to use them in SPAs, and the router preload is the equivalent.

## Follow-up

- [ ] Finish the review of what the guide pass did not cover.
  - Read the `journey`, `retro` and `settings` routes, `Reflection`, `Notice` and `DownloadData` in full. Only parts of them were read.
  - Read the sections of the `accessibility` guide that were skipped (images, SVG, skip links), and the `built-in-ai`, `wasm` and `webmcp` guides beyond their opening paragraphs.
  - Verify at runtime with axe or Lighthouse and manual keyboard and screen reader checks. Contrast ratios come from token values, and several findings are unconfirmed (Feedback overlay in the accessibility tree, Button focus contrast, the Header height estimate, the streak benchmark on a real phone).
- [ ] Check areas the guides do not cover.
  - Instructions file: run `yarn knip`, check that ref callbacks guard against `null`, check that `docs/habit-redesign.md` still matches the code, and decide whether `stats.html` in the repo root (a build artifact) should be committed.
  - Backend security: review row-level security in `supabase/schema.sql`. `send-reminders` was reviewed for its time logic and its secret check, but not for how `pg_cron` calls it.
  - PWA: check manifest icons (maskable) and the notification options in `public/sw.js` such as `badge`.
  - Dependencies: check for outdated or unused packages and review bundle size.
  - Tests: check whether any exist and what they cover.
  - Loading and error states: check how routes behave while pending and on failure.
  - Touch: check for hover-only interactions on touch devices and measure target sizes.
