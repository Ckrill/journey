# Head and manifest review

Findings for `index.html` and `public/site.webmanifest` that the `modern-web-guidance` guides do not cover. They come from general platform guidance (web.dev, Lighthouse installability checks, Chrome release notes), so confirm details before acting. The target is the installed web app in the newest stable Chrome on Android.

## Worth fixing

- [ ] Manifest icons use `"purpose": "any maskable"`. Ship separate icons instead: one `any` and one `maskable` with the logo inside the central 80% safe zone. Otherwise Android crops the artwork or the `any` use looks padded.
- [ ] `start_url` is absolute (`https://journey.vercel.app`) and the manifest has no `id`. Set `"id": "/"` and `"start_url": "/"`, which keeps the same app identity.
- [ ] The HTML description ("Start your journey.") and the manifest description ("Journey is a motivator and a journal for making behavioral change") differ. Pick one.
- [ ] `categories` has `"health and fitness"`, which is not a conventional value. Use `"health"` and `"fitness"`.
- [ ] Chrome on Android resizes only the visual viewport when the keyboard opens, so fixed bottom elements can end up behind it. If this shows up in the modals or the bottom navigation, add `interactive-widget=resizes-content` to the viewport `content`.

## Optional

- [ ] `og:image` (`logo.png`) is 1080x500. Platforms prefer about 1.91:1 (1200x630). Add `og:url`, `og:site_name` and `twitter:card` set to `summary_large_image`. The app is behind sign-in, so sharing probably matters little.
- [ ] Remove tags that do nothing in Chrome on Android: `mask-icon` with `safari-pinned-tab.svg`, `msapplication-TileColor`, `browserconfig.xml` (not linked) and the five `mstile-*.png` files. Keep the `apple-mobile-web-app-*` tags only if iOS installs matter.
- [ ] `index.html` has two `favicon.ico` style links: a bare one at the top and the generated group. Keep one.
- [ ] Move `viewport` right after `charset`, before the links.

## Already correct

- `viewport` uses `width=device-width, initial-scale=1, viewport-fit=cover`, does not block zoom, and the header handles `env(safe-area-inset-*)`.
- `theme-color`, the manifest `theme_color` and `background_color`, and the `#root:empty` splash all use `#ff6c55`, so there is no flash on launch.
- `color-scheme: light` and `text-scale` are set.
