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
- `media.base44.com` images used by the marketing pages, and the Supabase `base44-prod` logo, now point at files in `public/assets`. The favicon is `/assets/logo-official.png` (same bytes as the old Supabase logo and the Base44 media logo).

## Blog

Published `BlogPost` records are not in git on `main`. They are public at `https://base44.app/api/apps/69aa2d66169a7c4374014381/entities/BlogPost` (same filter the live page uses: `published: true`). `npm run build` runs `scripts/fetch-blog-posts.mjs`, which copies those posts into `src/data/blog-posts.json`. The blog pages read that file. The script does not invent posts. If the request fails and a previous snapshot exists, the build keeps it and still succeeds.

Internal fields such as `created_by_id` are not written into the snapshot.

## Lead forms (not Phase 1.2)

`/free-analysis` and the GBP form on `/gbp` only stored leads through `StrategyApplication.create` and `Core.SendEmail`. Those calls are removed. Submitting either form shows that this preview cannot store the application. Supabase lead capture is Phase 1.2 and is not implemented here.

## Pre-render and sitemap

`npm run build` renders each public route to `dist/<route>/index.html` after the Vite build (`scripts/prerender.mjs`). The HTML is the React tree for that URL, with the title, description, canonical, and JSON-LD that the page already sets in the browser. `/sitemap.xml` is real XML: the static URLs from `base44/functions/sitemap`, `/gbp-three-free` (a public route that function did not list), and one URL per published post in `src/data/blog-posts.json`. Blog `lastmod` is `published_date`. Static `lastmod` is the build date, matching that function.

There is still no `404.html`. Unknown paths fall back to `/`, which is now the prerendered home page, and the client router then shows the not-found page. Do not add `/* /index.html 200`.

`vite preview` serves `kitchener/index.html` at `/kitchener/` and falls back to `/` for `/kitchener`. Cloudflare Pages serves that file for both URLs.

Preview noindex stays: `_headers`, the robots meta copied into every prerendered file, and `robots.txt`.

## Blockers before parity with live akwmarketing.com

1. **Blog source of truth.** Logos, the founder photo, the SEO hero, manifest icons, schema logos, and the favicon now use `public/assets`. The snapshot still goes stale when someone publishes in Base44. After Base44 is cancelled, the public entity API goes away.
2. **Sitemap on the live host.** This build writes `dist/sitemap.xml`. The preview `robots.txt` still disallows crawling, and `_headers` still sends `noindex`, including on the sitemap. Remove those before any production cutover. The Base44 sitemap function is not deployed with this build.
3. **Lead storage and notification email.** `StrategyApplication` and `Core.SendEmail` are unwired until Phase 1.2. Newsletter and tip signups still post to the existing Make.com webhook only.
4. **Admin analytics.** `ga-traffic`, `gsc-search-queries`, and `gsc-index-monitor` need Base44 auth plus Google and Slack connectors. `/dashboard` does not show live numbers.
5. **Base44 publish-time HTML.** The live response adds app-log beacons (`/api/app-logs/...`), visitor-tracking cookies, and Open Graph tags. This build does not add those. The favicon is the rehosted logo. Google Analytics (`G-2V59RJ0GT7`) and the Meta Pixel in `index.html` are unchanged.
6. **No custom domain and noindex.** `*.pages.dev` is the only target. Remove `_headers`, the robots meta, and `robots.txt` disallow before DNS.
