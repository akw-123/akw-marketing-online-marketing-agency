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
- Remote images on `media.base44.com` and the Base44 Supabase storage bucket. They still load while those hosts stay up.

## Blog

Published `BlogPost` records are not in git on `main`. They are public at `https://base44.app/api/apps/69aa2d66169a7c4374014381/entities/BlogPost` (same filter the live page uses: `published: true`). `npm run build` runs `scripts/fetch-blog-posts.mjs`, which copies those posts into `src/data/blog-posts.json`. The blog pages read that file. The script does not invent posts. If the request fails and a previous snapshot exists, the build keeps it and still succeeds.

Internal fields such as `created_by_id` are not written into the snapshot.

## Lead forms (not Phase 1.2)

`/free-analysis` and the GBP form on `/gbp` only stored leads through `StrategyApplication.create` and `Core.SendEmail`. Those calls are removed. Submitting either form shows that this preview cannot store the application. Supabase lead capture is Phase 1.2 and is not implemented here.

## Pre-render

The exit plan calls for React pre-render. This phase ships the static SPA shell (`dist/index.html` plus hashed assets). A follow-up should pre-render the public routes so crawlers see page HTML without executing the client bundle. Do not block the preview on that work.

## Blockers before parity with live akwmarketing.com

1. **media.base44.com and Base44 Supabase storage.** Logos, the founder photo, the SEO hero image, manifest icons, and schema `logo` URLs are hotlinked. Cancelling Base44 breaks them until the files move (for example to R2 or Cloudflare Images). `index.html` in this repo still points the favicon at `https://base44.com/logo_v2.svg`; the live publish step rewrites that to the AKW logo on `media.base44.com`.
2. **Blog source of truth.** The snapshot goes stale when someone publishes in Base44. After Base44 is cancelled, the public entity API goes away. Phase 1.3 needs a new store. The sitemap function (`base44/functions/sitemap`) is not deployed with this build, so `/sitemap.xml` is absent on Pages.
3. **Lead storage and notification email.** `StrategyApplication` and `Core.SendEmail` are unwired until Phase 1.2. Newsletter and tip signups still post to the existing Make.com webhook only.
4. **Admin analytics.** `ga-traffic`, `gsc-search-queries`, and `gsc-index-monitor` need Base44 auth plus Google and Slack connectors. `/dashboard` does not show live numbers.
5. **Base44 publish-time HTML.** The live response adds app-log beacons (`/api/app-logs/...`), visitor-tracking cookies, Open Graph tags, and a swapped favicon. This Vite build does not. Google Analytics (`G-2V59RJ0GT7`) and the Meta Pixel in `index.html` are unchanged.
6. **No custom domain and noindex.** `*.pages.dev` is the only target. Remove `_headers`, the robots meta, and `robots.txt` disallow before DNS.
