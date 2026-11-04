# Safe area insets (revisit)

Side quest from the navigation-position work. Not implemented.

## Current state

- `index.html` viewport: `width=device-width, initial-scale=1` (no `viewport-fit=cover`).
- `public/site.webmanifest`: `"display": "standalone"`.
- No `apple-mobile-web-app-status-bar-style` meta tag; `theme-color` is `#ff6c55`.
- Result: the page does not draw under the status bar or notch, so `env(safe-area-inset-top)` is `0`.
- `Layout.module.scss` already adds `env(safe-area-inset-bottom)` padding to the header in the `.bottomNavigation` variant. It is effectively a no-op until `viewport-fit=cover` is set.

## Option: edge-to-edge

1. Add `viewport-fit=cover` to the viewport meta tag.
2. Optionally add `<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">`.
3. In `.header`, add `padding-block-start: calc(20px + env(safe-area-inset-top))`.
4. Check the bottom variant and any full-height content against the home indicator and notch (including landscape).

## Notes

- `env(safe-area-inset-*)` is non-zero only when the page draws under system UI.
- Leaving things as they are is fine unless the edge-to-edge look is wanted.
