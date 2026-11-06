# AKW Marketing — Cloudflare Pages preview (Phase 1.1)

Static Vite build of the public AKW Marketing site for a Cloudflare Pages `*.pages.dev` preview. This branch does not change DNS, Namecheap, or the Base44 production site. `main` stays the Base44 GitHub sync.

Gate 0 locked this phase to **Cloudflare Pages**. Cloudflare’s current recommendation for a brand-new site is [Workers Static Assets](https://developers.cloudflare.com/workers/static-assets/); that move can wait until after the preview is accepted. Do not attach `akwmarketing.com` to this project.

## Deploy this branch to a Pages preview

In the Cloudflare dashboard, create a Pages project (direct upload or Git) and use:

| Setting | Value |
| --- | --- |
| Production branch | this branch, not `main` |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory | `/` (repository root) |
| Node | 20 or newer |

`wrangler.jsonc` records the same output directory (`pages_build_output_dir` = `./dist`) for a later `npx wrangler pages deploy dist --project-name=akwmarketing`. Do not run that against a custom domain in this phase.

No `VITE_BASE44_*` variables are required. The build does not boot the Base44 SDK.

### noindex

This preview must not be indexed.

- `public/_headers` (copied to `dist/_headers`) sets `X-Robots-Tag: noindex` on every path.
- `index.html` includes `<meta name="robots" content="noindex">`.
- `public/robots.txt` disallows all crawlers.
- Pages also sends `X-Robots-Tag: noindex` on `*.pages.dev` preview URLs by itself ([Serving Pages](https://developers.cloudflare.com/pages/configuration/serving-pages/)).

Remove all three repo controls before any production DNS cutover.

### Client-side routes

There is no top-level `404.html`. Pages then serves `/` for any path that is not a real file, which is the right fallback for this React Router SPA ([Serving Pages](https://developers.cloudflare.com/pages/configuration/serving-pages/#single-page-application-spa-rendering)). Do not add a `/* /index.html 200` rewrite: Pages follows `_redirects` even when a static asset exists, and that rule would replace JS and CSS with `index.html`.

## What was removed

Verified before deletion. These pieces are Builder login scaffolding. The public marketing pages do not import them, and `OAuthConsent` was not registered on any route.

| Removed | Why |
| --- | --- |
| `AuthProvider` around the whole app | Every page view waited on `GET /api/apps/public/.../public-settings`, which does not exist on Pages. Live public settings are `public_without_login`. |
| `src/lib/AuthContext.jsx`, `src/lib/app-params.js`, `src/api/base44Client.js` | Only served that auth gate and the SDK client. |
| `src/pages/OAuthConsent.jsx`, `src/components/AuthLayout.jsx` | MCP OAuth consent screen. Not linked from the public site. |
| `src/components/ProtectedRoute.jsx`, `src/components/UserNotRegisteredError.jsx` | Unused outside the auth gate. |
| `@base44/sdk` and `@base44/vite-plugin` | The plugin injected Builder HMR, analytics beacons, and the `@/` alias. The alias now lives in `vite.config.js`. Page views no longer download the SDK. |
| `/dashboard` data loading | It called `base44.functions.invoke("ga-traffic")` and `gsc-search-queries`, then `auth.redirectToLogin`. The route remains and explains the gap. Chart components are still in the repo. |

`PageNotFound` no longer calls `base44.auth.me()` to show an admin note.

## What was kept

- Public marketing routes in `src/App.jsx` (home, city pages, service pages, legal pages, newsletter thank-you, and so on).
- `base44/functions`, `base44/entities`, and connectors. They document the live backend and are not part of the Vite bundle.
- Make.com webhook on the home, landing, and newsletter email forms. That path is Brevo signup, not the Base44 SDK. The Base44 `SendEmail` notification that used to run beside it is removed.
- `media.base44.com` images used by the marketing pages, and the Supabase `base44-prod` logo, now point at files in `public/assets`. The favicon is `/assets/logo-official.png` with `type="image/png"` (same bytes as the old Supabase logo and the Base44 media logo).

## Blog

`src/data/blog-posts.json` is the build source: 31 published posts captured from the public Base44 entity API (`fetchedAt` `2026-11-05T18:46:53.785Z`). `npm run build` reads that file and does not call Base44, so a Pages build cannot silently replace or drop posts.

To refresh on purpose, run `npm run blog:refresh`, review the diff, and commit it. The script copies published posts only and does not invent any. If the request fails, the committed file stays as it is. Internal fields such as `created_by_id` are not written.

## Lead forms

`/free-analysis` and the form on `/gbp` POST to the website lead function when a capture URL is set. A preview production build defaults that URL to `https://hzllfwqnsiirlwacaitt.supabase.co/functions/v1/website-lead-capture`. `VITE_LEAD_CAPTURE_URL` overrides it. `npm run dev` without that variable still shows the unavailable message and does not POST. The Turnstile widget renders only on `akwmarketing.pages.dev`, with public site key `0x4AAAAAAF1rkRiBjPcPH2DU`. Both forms keep the honeypot. Newsletter and tip forms still POST to the existing Make.com webhook only.

`supabase/functions/website-lead-capture` checks the honeypot, then Turnstile siteverify when `TURNSTILE_SECRET` is set. Siteverify must return hostname `akwmarketing.pages.dev` unless `TURNSTILE_HOSTNAMES` sets another allowlist. A passing token inserts `crm_lead`, `crm_contact`, `crm_contact_email`, and `crm_contact_phone` for org AKW Marketing (`0ba2a2de-e31d-4f41-8005-4edfadbaed98`) at status New (`640c5886-fe70-43c8-b71d-559c0c82295c`). That is the live schema (hypothesis B, verified 2026-11-05). This function does not create `website_strategy_application` or `akw_website_lead`, and it does not write `prospects`. Inserts use `SUPABASE_URL` plus `SUPABASE_SERVICE_ROLE_KEY` or `SUPABASE_SERVICE_KEY`, never a `VITE_` variable. A database error is HTTP 500 with `stored: false` and no database text. Slack `#inbound-alerts` `C0BJZD8LNPM` stays off because `sendImplemented` is false. Email is the contact@akwmarketing.com Gmail API (`GMAIL_CLIENT_ID`, `GMAIL_CLIENT_SECRET`, `GMAIL_REFRESH_TOKEN`), not Resend or SMTP. `LEAD_NOTIFY_EMAIL` stays false, so Google is not called. `LEAD_NOTIFY_EMAIL_TO` comes from vault contact `3289329` at deploy time. `base44/entities/StrategyApplication.jsonc` is the old Base44 shape, not the Supabase contract. This branch does not deploy the function.

## Pre-render and sitemap

`npm run build` runs Vite, then `scripts/prerender.mjs`. There is one prerender. For each public route it writes the rendered page (body plus that page's title, description, canonical, and JSON-LD) to both `dist/<path>.html` and `dist/<path>/index.html`. Cloudflare Pages serves `/path` from the `.html` file, redirects `/path.html` to `/path`, and serves `/path/` from `index.html`. Both files use the same canonical (`https://akwmarketing.com/path`, or `https://akwmarketing.com/` for `/` and for the `/Home` alias).

`/sitemap.xml` lists each canonical once: the static URLs from `base44/functions/sitemap`, plus the real routes `/gbp-three-free` and `/newsletter-thank-you` (no priority invented for those two), plus one URL per published post. Blog `lastmod` is `published_date`. Static `lastmod` is the build date, matching that function. Not listed: `/Home` (alias of `/`), `/dashboard`, `/landing`, `/Landing`, trailing-slash duplicates, and `.html` duplicates. `/Home` and `/dashboard` are still prerendered so those URLs are not the home shell.

There is still no `404.html`. Unknown paths fall back to `/`, which is the prerendered home page, and the client router then shows the not-found page. Do not add `/* /index.html 200`.

`vite preview` serves `kitchener/index.html` at `/kitchener/` and falls back to `/` for `/kitchener` unless `kitchener.html` is what the static host uses. Pages uses `kitchener.html` for `/kitchener`.

Preview noindex stays: `_headers`, the robots meta copied into every prerendered file, and `robots.txt`.

`aggregateRating` was removed from the Home, Kitchener, and `/gbp` JSON-LD. The visible testimonials stay. The schema counts (6 and 3) were not backed by a review source in the repo.

## Blockers before parity with live akwmarketing.com

1. **Blog freshness.** The committed snapshot is what this build ships. It goes stale until someone runs `npm run blog:refresh` and commits the result. After Base44 is cancelled, that API goes away.
2. **Sitemap on the live host.** This build writes `dist/sitemap.xml`. The preview `robots.txt` still disallows crawling, and `_headers` still sends `noindex`, including on the sitemap. Remove those before any production cutover. The Base44 sitemap function is not deployed with this build.
3. **Lead capture deploy.** The function and the preview forms are wired. They store leads only after `TURNSTILE_SECRET` is set on the function, the service role is available in the function runtime, `supabase functions deploy website-lead-capture` has run, and the Pages preview is deployed. Notification flags stay off. Email, when later enabled, sends through the contact@akwmarketing.com Gmail API. Newsletter and tip signups still post to the existing Make.com webhook only.
4. **Admin analytics.** `ga-traffic`, `gsc-search-queries`, and `gsc-index-monitor` need Base44 auth plus Google and Slack connectors. `/dashboard` does not show live numbers.
5. **Base44 publish-time HTML.** The live response adds app-log beacons (`/api/app-logs/...`), visitor-tracking cookies, and Open Graph tags. This build does not add those. The favicon is the rehosted logo. Google Analytics (`G-2V59RJ0GT7`) and the Meta Pixel in `index.html` are unchanged.
6. **No custom domain and noindex.** `*.pages.dev` is the only target. Remove `_headers`, the robots meta, and `robots.txt` disallow before DNS.
