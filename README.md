# AKW Marketing — Cloudflare Pages

Static Vite build of the public AKW Marketing site for Cloudflare Pages project `akwmarketing`. The canonical host is `https://www.akwmarketing.com`. Namecheap stays the DNS host: `www` is a CNAME to `akwmarketing.pages.dev`, and the bare `akwmarketing.com` 301s to www through an external HTTPS redirect that is not in this repo. This repo does not change DNS and does not deploy. `*.pages.dev` stays noindexed.

Gate 0 locked this phase to **Cloudflare Pages**. Cloudflare’s current recommendation for a brand-new site is [Workers Static Assets](https://developers.cloudflare.com/workers/static-assets/); that move can wait. `main` stays the Base44 GitHub sync.

## Deploy this branch to Cloudflare Pages

In the Cloudflare dashboard, create a Pages project (direct upload or Git) and use:

| Setting | Value |
| --- | --- |
| Production branch | this branch, not `main` |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory | `/` (repository root) |
| Node | 20 or newer |

`wrangler.jsonc` records the same output directory (`pages_build_output_dir` = `./dist`) for a later `npx wrangler pages deploy dist --project-name=akwmarketing`. Do not run that from this repo, and do not change DNS here. The owner attaches `www` in the Cloudflare dashboard.

No `VITE_BASE44_*` variables are required. The build does not boot the Base44 SDK.

### Indexing

`https://www.akwmarketing.com` is indexable. `*.pages.dev` is not.

- `public/_headers` (copied to `dist/_headers`) sets `X-Robots-Tag: noindex` only on Pages hosts. The rule `https://:project.pages.dev/*` matches `https://akwmarketing.pages.dev/*`. The rule `https://:preview.:project.pages.dev/*` matches one extra label, such as a branch or deployment preview. Placeholders match a single host label, and a rule may contain only one splat ([Headers](https://developers.cloudflare.com/pages/configuration/headers/)). There is no global `/*` noindex rule, and there is no `<meta name="robots" content="noindex">`.
- `public/robots.txt` allows crawling and lists `Sitemap: https://www.akwmarketing.com/sitemap.xml`.
- Pages also sends `X-Robots-Tag: noindex` on preview deployment URLs by itself ([Serving Pages](https://developers.cloudflare.com/pages/configuration/serving-pages/)).

`robots.txt` is one file for every host. The pages.dev copy therefore also allows crawling and advertises the www sitemap. The host-scoped `X-Robots-Tag` is what keeps `*.pages.dev` out of the index. A crawler that ignores `X-Robots-Tag` could still fetch pages.dev URLs.

### Client-side routes

Each public route is prerendered to its own HTML file. `dist/404.html` is the not-found page. Pages serves that file with status 404 for a path that is not a real file, and it does not fall back to `/` ([Serving Pages](https://developers.cloudflare.com/pages/configuration/serving-pages/#not-found-behavior)). Do not add a `/* /index.html 200` rewrite: Pages follows `_redirects` even when a static asset exists, and that rule would replace JS and CSS with `index.html` and bring the soft 404s back. Do not add `404/index.html` either. Pages would treat `/404/` as a normal page and would also use it as a nested 404.

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

`/free-analysis` and the form on `/gbp` POST to the website lead function when a capture URL is set. A production build defaults that URL to `https://hzllfwqnsiirlwacaitt.supabase.co/functions/v1/website-lead-capture`. `VITE_LEAD_CAPTURE_URL` overrides it. `npm run dev` without that variable still shows the unavailable message and does not POST. The Turnstile widget renders on `www.akwmarketing.com`, `akwmarketing.com`, and `akwmarketing.pages.dev`, with public site key `0x4AAAAAAF1rkRiBjPcPH2DU`. Both forms keep the honeypot. Newsletter and tip forms still POST to the existing Make.com webhook only.

`supabase/functions/website-lead-capture` checks the honeypot, then Turnstile siteverify when `TURNSTILE_SECRET` is set. The origin allowlist is `https://www.akwmarketing.com`, `https://akwmarketing.com`, and `https://akwmarketing.pages.dev`. When `TURNSTILE_HOSTNAMES` is unset, siteverify must return one of `www.akwmarketing.com`, `akwmarketing.com`, or `akwmarketing.pages.dev`. A set value replaces that default. It does not merge with it. A passing token inserts `crm_lead`, `crm_contact`, `crm_contact_email`, and `crm_contact_phone` for org AKW Marketing (`0ba2a2de-e31d-4f41-8005-4edfadbaed98`) at status New (`640c5886-fe70-43c8-b71d-559c0c82295c`). That is the live schema (hypothesis B, verified 2026-11-05). This function does not create `website_strategy_application` or `akw_website_lead`, and it does not write `prospects`. Inserts use `SUPABASE_URL` plus `SUPABASE_SERVICE_ROLE_KEY` or `SUPABASE_SERVICE_KEY`, never a `VITE_` variable. A database error is HTTP 500 with `stored: false` and no database text. Slack `#inbound-alerts` `C0BJZD8LNPM` uses `chat.postMessage` when `LEAD_NOTIFY_SLACK=true` and `SLACK_BOT_TOKEN` is set. The flag stays false, so Slack is not called. Email is the contact@akwmarketing.com Gmail API (`GMAIL_CLIENT_ID`, `GMAIL_CLIENT_SECRET`, `GMAIL_REFRESH_TOKEN`), not Resend or SMTP. `LEAD_NOTIFY_EMAIL` stays false, so Google is not called. `LEAD_NOTIFY_EMAIL_TO` comes from vault contact `3289329` at deploy time. `base44/entities/StrategyApplication.jsonc` is the old Base44 shape, not the Supabase contract. This branch does not deploy the function and does not change secrets. The Cloudflare Turnstile widget hostname list has to include the same three hosts before the widget succeeds on www.

## Pre-render and sitemap

`npm run build` runs Vite, then `scripts/prerender.mjs`. There is one prerender. For each public route it writes the rendered page (body plus that page's title, description, canonical, and JSON-LD) to both `dist/<path>.html` and `dist/<path>/index.html`. Cloudflare Pages serves `/path` from the `.html` file, redirects `/path.html` to `/path`, and serves `/path/` from `index.html`. Both files use the same canonical (`https://www.akwmarketing.com/path`, or `https://www.akwmarketing.com/` for `/` and for the `/Home` alias).

`/sitemap.xml` lists each canonical once: the static marketing URLs, `/gbp-three-free` (the video page, priority `0.7` / monthly, same weight as `/newsletter` and `/free-analysis`), and one URL per published post. Blog `lastmod` is `published_date` (the snapshot has no updated date; every current post is `2026-05-14`). Static `lastmod` is `git log -1` of that page's source file, or `src/data/page-lastmod.json` when the clone is too shallow to trust. Not listed: `/Home` (301 to `/`), `/dashboard`, `/landing`, `/Landing`, `/newsletter-thank-you`, trailing-slash duplicates, and `.html` duplicates. `/dashboard` is still prerendered so that URL is not the home shell. `/newsletter-thank-you` is prerendered with `<meta name="robots" content="noindex, follow">`.

`/privacy-policy` and `/terms-of-service` are the canonical legal URLs. `/PrivacyPolicy` and `/TermsOfService` 301 to them so older links keep working.

`dist/404.html` is a branded page (logo, short explanation, links home, to the blog, and to the free analysis) with `noindex, follow` and no canonical. It does not load the React bundle, so an unknown URL cannot hydrate into the home page. Unknown paths, including a blog slug that was not prerendered, are HTTP 404.

`vite preview` serves `kitchener/index.html` at `/kitchener/` and falls back to `/` for `/kitchener` unless `kitchener.html` is what the static host uses. Pages uses `kitchener.html` for `/kitchener`. `vite preview` does not apply `_redirects` or `404.html`. `npx wrangler pages dev dist` does.

Prerendered marketing pages do not include a robots noindex meta. `dist/_headers` noindexes `*.pages.dev` only. `dist/robots.txt` allows crawling and points the sitemap at www. `public/_redirects` 301s `/landing`, `/Landing`, and the other legacy paths in `src/lib/siteRoutes.js`. `/BlogPost` is a Pages Function because `_redirects` cannot match `?slug=`. The key file `public/<indexnow-key>.txt` is the IndexNow key for www.

`base44/functions/sitemap` is not deployed with this build. It still lists `/PrivacyPolicy` and `/TermsOfService` and stamps static `lastmod` with the request date.

`aggregateRating` was removed from the Home, Kitchener, and `/gbp` JSON-LD. The visible testimonials stay. The schema counts (6 and 3) were not backed by a review source in the repo.

## Blockers before parity with live akwmarketing.com

1. **Blog freshness.** The committed snapshot is what this build ships. It goes stale until someone runs `npm run blog:refresh` and commits the result. After Base44 is cancelled, that API goes away.
2. **DNS cutover.** This build writes `dist/sitemap.xml` with www URLs, and `robots.txt` allows crawling. Attaching the www CNAME and the external apex 301 is still an owner step, outside this repo. `base44/functions/sitemap` now uses the same www origin, and it is not deployed with this build.
3. **Lead capture deploy.** The function and the preview forms are wired. They store leads only after `TURNSTILE_SECRET` is set on the function, the service role is available in the function runtime, `supabase functions deploy website-lead-capture` has run, and the Pages preview is deployed. Notification flags stay off. Email, when later enabled, sends through the contact@akwmarketing.com Gmail API. Slack, when later enabled, posts with `SLACK_BOT_TOKEN` to `C0BJZD8LNPM`. Newsletter and tip signups still post to the existing Make.com webhook only.
4. **Admin analytics.** `ga-traffic`, `gsc-search-queries`, and `gsc-index-monitor` need Base44 auth plus Google and Slack connectors. `/dashboard` does not show live numbers.
5. **Base44 publish-time HTML.** The live response adds app-log beacons (`/api/app-logs/...`), visitor-tracking cookies, and Open Graph tags. This build does not add those. The favicon is the rehosted logo. Google Analytics (`G-2V59RJ0GT7`) and the Meta Pixel in `index.html` are unchanged.
6. **pages.dev stays noindexed.** `www.akwmarketing.com` is the indexable host. `_headers` keeps `X-Robots-Tag: noindex` on `*.pages.dev` after the custom domain is attached. `robots.txt` cannot do that on its own because every host serves the same file.
