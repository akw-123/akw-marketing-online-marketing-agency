/**
 * Routes the Pages build is allowed to publish.
 * scripts/prerender.mjs and scripts/seo-invariants.test.mjs both import this.
 *
 * Sitemap URLs are the canonical, indexable pages. /newsletter-thank-you is a
 * confirmation screen (noindex, not listed). /dashboard is the admin stub
 * (not listed, still prerendered so it is not the home shell).
 */

export const INDEXNOW_KEY = "4467a21e5e259c0d3dac979340460b35";

export const NOINDEX_ROBOTS = "noindex, follow";

/** @type {{ loc: string, source: string, priority: string, changefreq: string }[]} */
export const SITEMAP_PAGES = [
  { loc: "/", source: "src/pages/Home.jsx", priority: "1.0", changefreq: "weekly" },
  { loc: "/gbp", source: "src/pages/MetaAds.jsx", priority: "1.0", changefreq: "weekly" },
  { loc: "/kitchener", source: "src/pages/Kitchener.jsx", priority: "0.9", changefreq: "weekly" },
  { loc: "/waterloo", source: "src/pages/Waterloo.jsx", priority: "0.9", changefreq: "weekly" },
  { loc: "/cambridge", source: "src/pages/Cambridge.jsx", priority: "0.9", changefreq: "weekly" },
  { loc: "/guelph", source: "src/pages/Guelph.jsx", priority: "0.9", changefreq: "weekly" },
  { loc: "/hamilton", source: "src/pages/Hamilton.jsx", priority: "0.9", changefreq: "weekly" },
  { loc: "/burlington", source: "src/pages/Burlington.jsx", priority: "0.9", changefreq: "weekly" },
  { loc: "/brantford", source: "src/pages/Brantford.jsx", priority: "0.9", changefreq: "weekly" },
  { loc: "/stratford", source: "src/pages/Stratford.jsx", priority: "0.9", changefreq: "weekly" },
  { loc: "/local-seo-kitchener", source: "src/pages/LocalSeoKitchener.jsx", priority: "0.8", changefreq: "monthly" },
  { loc: "/seo-services-kitchener", source: "src/pages/SeoServicesKitchener.jsx", priority: "0.8", changefreq: "monthly" },
  { loc: "/google-ads-kitchener", source: "src/pages/GoogleAdsKitchener.jsx", priority: "0.8", changefreq: "monthly" },
  { loc: "/meta-ads-kitchener", source: "src/pages/MetaAdsKitchener.jsx", priority: "0.8", changefreq: "monthly" },
  { loc: "/ai-seo-kitchener", source: "src/pages/AiSeoKitchener.jsx", priority: "0.8", changefreq: "monthly" },
  { loc: "/website-design-kitchener", source: "src/pages/WebsiteDesignKitchener.jsx", priority: "0.8", changefreq: "monthly" },
  { loc: "/content-marketing-kitchener", source: "src/pages/ContentMarketingKitchener.jsx", priority: "0.8", changefreq: "monthly" },
  { loc: "/hardest-working-seo-expert-kitchener-waterloo", source: "src/pages/HardestWorkingSeoExpert.jsx", priority: "0.9", changefreq: "weekly" },
  { loc: "/hardest-working-marketing-agency-kitchener-waterloo", source: "src/pages/HardestWorkingMarketingAgency.jsx", priority: "0.9", changefreq: "weekly" },
  { loc: "/about", source: "src/pages/About.jsx", priority: "0.7", changefreq: "monthly" },
  { loc: "/blog", source: "src/pages/Blog.jsx", priority: "0.8", changefreq: "weekly" },
  { loc: "/free-analysis", source: "src/pages/FreeAnalysis.jsx", priority: "0.7", changefreq: "monthly" },
  { loc: "/get-more-clients", source: "src/pages/GetMoreClients.jsx", priority: "0.8", changefreq: "monthly" },
  { loc: "/newsletter", source: "src/pages/Newsletter.jsx", priority: "0.7", changefreq: "monthly" },
  // Real video page (Wistia "How To Get Into The Top 3 On Google"), same weight as the other lead pages.
  { loc: "/gbp-three-free", source: "src/pages/GbpThreeFree.jsx", priority: "0.7", changefreq: "monthly" },
  { loc: "/privacy-policy", source: "src/pages/PrivacyPolicy.jsx", priority: "0.3", changefreq: "yearly" },
  { loc: "/terms-of-service", source: "src/pages/TermsOfService.jsx", priority: "0.3", changefreq: "yearly" },
];

/** Built and served as HTTP 200, omitted from the sitemap. */
export const UNLISTED_ROUTES = [
  { loc: "/newsletter-thank-you", source: "src/pages/NewsletterThankYou.jsx", robots: NOINDEX_ROBOTS },
  { loc: "/dashboard", source: "src/pages/Dashboard.jsx", robots: "" },
];

export const PRERENDER_PATHS = [
  ...SITEMAP_PAGES.map((entry) => entry.loc),
  ...UNLISTED_ROUTES.map((entry) => entry.loc),
];

export function isNoindexRoute(route) {
  return UNLISTED_ROUTES.some((entry) => entry.loc === route && entry.robots === NOINDEX_ROBOTS);
}

export function blogLastmod(post) {
  const published = String(post?.published_date || "").slice(0, 10);
  const updated = String(post?.updated_date || post?.updated || "").slice(0, 10);
  if (/^\d{4}-\d{2}-\d{2}$/.test(updated) && updated > published) return updated;
  return published;
}

/**
 * Edge 301s. `group` is a comment in public/_redirects.
 * Trailing-slash copies are added by renderRedirects().
 * /BlogPost is a Pages Function so a ?slug= can be read.
 * /blogpost is only a case variant and 301s to /blog (Pages _redirects cannot read the query).
 */
export const LEGACY_REDIRECTS = [
  {
    group: "Observed in App.jsx or the Base44 sitemap",
    from: "/landing",
    to: "/",
    evidence: "App.jsx served Landing here, then NoIndexRedirect to /. public/_redirects already 301s it.",
  },
  {
    group: "Observed in App.jsx or the Base44 sitemap",
    from: "/Landing",
    to: "/",
    evidence: "base44/functions/sitemap listed /Landing. App.jsx NoIndexRedirect. Pages is case-sensitive.",
  },
  {
    group: "Observed in App.jsx or the Base44 sitemap",
    from: "/Home",
    to: "/",
    evidence: "pages.config PAGES key Home mounts /Home. The Base44 sitemap listed /Home. App.jsx later redirected it.",
  },
  {
    group: "Observed in App.jsx or the Base44 sitemap",
    from: "/home",
    to: "/",
    evidence: "App.jsx had NoIndexRedirect from /home to /. canonicalPath already collapses /home to /.",
  },
  {
    group: "Observed in App.jsx or the Base44 sitemap",
    from: "/meta-ads",
    to: "/gbp",
    evidence: "App.jsx route /meta-ads rendered MetaAds until fe0ca4f moved that component to /gbp.",
  },
  {
    group: "Observed in App.jsx or the Base44 sitemap",
    from: "/PrivacyPolicy",
    to: "/privacy-policy",
    evidence: "App.jsx route, sitemap loc, and footer href. External links keep working via this 301. Canonical is now the lowercase kebab path.",
  },
  {
    group: "Observed in App.jsx or the Base44 sitemap",
    from: "/TermsOfService",
    to: "/terms-of-service",
    evidence: "App.jsx route, sitemap loc, and footer href. Same lowercase canonical as the other public pages.",
  },
  {
    group: "Page component filename (createPageUrl uses the page name). Not a separate App.jsx path.",
    from: "/About",
    to: "/about",
    evidence: "src/pages/About.jsx. createPageUrl in src/utils/index.ts returns '/' + pageName.",
  },
  {
    group: "Page component filename (createPageUrl uses the page name). Not a separate App.jsx path.",
    from: "/Blog",
    to: "/blog",
    evidence: "src/pages/Blog.jsx. The registered route has been /blog since the page was added.",
  },
  {
    group: "Page component filename (createPageUrl uses the page name). Not a separate App.jsx path.",
    from: "/ContentMarketingKitchener",
    to: "/content-marketing-kitchener",
    evidence: "src/pages/ContentMarketingKitchener.jsx is the component mounted at that route.",
  },
  {
    group: "Page component filename (createPageUrl uses the page name). Not a separate App.jsx path.",
    from: "/Dashboard",
    to: "/dashboard",
    evidence: "src/pages/Dashboard.jsx is the component mounted at /dashboard.",
  },
  {
    group: "Page component filename (createPageUrl uses the page name). Not a separate App.jsx path.",
    from: "/FreeAnalysis",
    to: "/free-analysis",
    evidence: "src/pages/FreeAnalysis.jsx is the component mounted at /free-analysis.",
  },
  {
    group: "Page component filename (createPageUrl uses the page name). Not a separate App.jsx path.",
    from: "/GbpThreeFree",
    to: "/gbp-three-free",
    evidence: "src/pages/GbpThreeFree.jsx is the component mounted at /gbp-three-free.",
  },
  {
    group: "Page component filename (createPageUrl uses the page name). Not a separate App.jsx path.",
    from: "/GetMoreClients",
    to: "/get-more-clients",
    evidence: "src/pages/GetMoreClients.jsx is the component mounted at /get-more-clients.",
  },
  {
    group: "Page component filename (createPageUrl uses the page name). Not a separate App.jsx path.",
    from: "/HardestWorkingMarketingAgency",
    to: "/hardest-working-marketing-agency-kitchener-waterloo",
    evidence: "That component is imported in App.jsx only on the long kebab route, not on a shorter alias.",
  },
  {
    group: "Page component filename (createPageUrl uses the page name). Not a separate App.jsx path.",
    from: "/HardestWorkingSeoExpert",
    to: "/hardest-working-seo-expert-kitchener-waterloo",
    evidence: "That component is imported in App.jsx only on the long kebab route.",
  },
  {
    group: "Page component filename (createPageUrl uses the page name). Not a separate App.jsx path.",
    from: "/Kitchener",
    to: "/kitchener",
    evidence: "src/pages/Kitchener.jsx is the component mounted at /kitchener.",
  },
  {
    group: "Page component filename (createPageUrl uses the page name). Not a separate App.jsx path.",
    from: "/MetaAds",
    to: "/gbp",
    evidence: "src/pages/MetaAds.jsx is the component mounted at /gbp (moved from /meta-ads).",
  },
  {
    group: "Page component filename (createPageUrl uses the page name). Not a separate App.jsx path.",
    from: "/Newsletter",
    to: "/newsletter",
    evidence: "src/pages/Newsletter.jsx is the component mounted at /newsletter.",
  },
  {
    group: "Page component filename (createPageUrl uses the page name). Not a separate App.jsx path.",
    from: "/NewsletterThankYou",
    to: "/newsletter-thank-you",
    evidence: "src/pages/NewsletterThankYou.jsx is the component mounted at /newsletter-thank-you.",
  },
  {
    group: "Page component filename (createPageUrl uses the page name). Not a separate App.jsx path.",
    from: "/WebsiteDesignKitchener",
    to: "/website-design-kitchener",
    evidence: "src/pages/WebsiteDesignKitchener.jsx is the component mounted at that route.",
  },
  {
    group: "Page component filename (createPageUrl uses the page name). Not a separate App.jsx path.",
    from: "/Hamilton",
    to: "/hamilton",
    evidence: "src/pages/Hamilton.jsx is the component mounted at /hamilton.",
  },
  {
    group: "Page component filename (createPageUrl uses the page name). Not a separate App.jsx path.",
    from: "/LocalSeoKitchener",
    to: "/local-seo-kitchener",
    evidence: "src/pages/LocalSeoKitchener.jsx is the component mounted at that route.",
  },
  {
    group: "Page component filename (createPageUrl uses the page name). Not a separate App.jsx path.",
    from: "/MetaAdsKitchener",
    to: "/meta-ads-kitchener",
    evidence: "src/pages/MetaAdsKitchener.jsx is the component mounted at that route.",
  },
  {
    group: "Page component filename (createPageUrl uses the page name). Not a separate App.jsx path.",
    from: "/SeoServicesKitchener",
    to: "/seo-services-kitchener",
    evidence: "src/pages/SeoServicesKitchener.jsx is the component mounted at that route.",
  },
  {
    group: "Page component filename (createPageUrl uses the page name). Not a separate App.jsx path.",
    from: "/Stratford",
    to: "/stratford",
    evidence: "src/pages/Stratford.jsx is the component mounted at /stratford.",
  },
  {
    group: "Page component filename (createPageUrl uses the page name). Not a separate App.jsx path.",
    from: "/Waterloo",
    to: "/waterloo",
    evidence: "src/pages/Waterloo.jsx is the component mounted at /waterloo.",
  },
  {
    group: "Page component filename (createPageUrl uses the page name). Not a separate App.jsx path.",
    from: "/Brantford",
    to: "/brantford",
    evidence: "src/pages/Brantford.jsx is the component mounted at /brantford.",
  },
  {
    group: "Page component filename (createPageUrl uses the page name). Not a separate App.jsx path.",
    from: "/Burlington",
    to: "/burlington",
    evidence: "src/pages/Burlington.jsx is the component mounted at /burlington.",
  },
  {
    group: "Page component filename (createPageUrl uses the page name). Not a separate App.jsx path.",
    from: "/Cambridge",
    to: "/cambridge",
    evidence: "src/pages/Cambridge.jsx is the component mounted at /cambridge.",
  },
  {
    group: "Page component filename (createPageUrl uses the page name). Not a separate App.jsx path.",
    from: "/GoogleAdsKitchener",
    to: "/google-ads-kitchener",
    evidence: "src/pages/GoogleAdsKitchener.jsx is the component mounted at that route.",
  },
  {
    group: "Page component filename (createPageUrl uses the page name). Not a separate App.jsx path.",
    from: "/Guelph",
    to: "/guelph",
    evidence: "src/pages/Guelph.jsx is the component mounted at /guelph.",
  },
  {
    group: "Case variant of the BlogPost page name. The PascalCase path is a Pages Function.",
    from: "/blogpost",
    to: "/blog",
    evidence: "Lowercase of the BlogPost component path. _redirects cannot keep ?slug=, so this 301s to the blog index. /BlogPost?slug= is the function.",
  },
];

/** Path a Pages Function redirects. _redirects cannot match a query string. One file only: BlogPost.js and blogpost.js collide in the functions bundler. */
export const BLOGPOST_FUNCTION_PATHS = ["/BlogPost"];

/**
 * Old URLs with evidence, and no redirect, because there is no matching current page.
 * They 404 on purpose.
 */
export const UNRESOLVED_LEGACY = [
  {
    path: "/case-studies",
    note: "App.jsx route and Base44 sitemap entry, deleted with the page in ac3d75e. No successor URL.",
  },
  {
    path: "/case-studies/cambridge-hvac-local-seo",
    note: "Deleted in ac3d75e with CaseStudyCambridgeHvac.jsx. Not folded into /cambridge.",
  },
  {
    path: "/case-studies/waterloo-dental-reviews",
    note: "Deleted in ac3d75e with CaseStudyWaterlooDental.jsx. Not folded into /waterloo.",
  },
  {
    path: "/case-studies/burlington-realtor-full-funnel",
    note: "Deleted in ac3d75e with CaseStudyBurlingtonRealtor.jsx. Not folded into /burlington.",
  },
  {
    path: "/case-studies/guelph-cafe-gbp",
    note: "Deleted in ac3d75e with CaseStudyGuelphCafe.jsx. Not folded into /guelph.",
  },
  {
    path: "/case-studies/hamilton-accountant-google-ads",
    note: "Deleted in ac3d75e with CaseStudyHamiltonAccountant.jsx. Not folded into /hamilton.",
  },
  {
    path: "/OnlineMarketingAgency",
    note: "OnlineMarketingAgency.jsx re-exports MetaAds and was the element for `/` in some commits. It was never a /OnlineMarketingAgency route.",
  },
  {
    path: "/GBP",
    note: "No GBP.jsx, route, sitemap loc, or href. The page is /gbp (MetaAds). A case-only alias was not added.",
  },
];

export function formatRedirect(from, to) {
  if (to === "/") return `${from} / 301`;
  return `${from} ${to} 301`;
}

export function redirectRules() {
  const rules = [];
  for (const entry of LEGACY_REDIRECTS) {
    rules.push({ from: entry.from, to: entry.to });
    rules.push({ from: `${entry.from}/`, to: entry.to });
  }
  for (const from of BLOGPOST_FUNCTION_PATHS) {
    rules.push({ from: `${from}/`, to: "/blog" });
  }
  return rules;
}

export function renderRedirects() {
  const lines = [
    "# Legacy paths. The map and the evidence live in src/lib/siteRoutes.js.",
    "# Pages matches these paths case-sensitively. Do not add /* /index.html 200.",
    "# /BlogPost (no trailing slash) is a Pages Function so ?slug= can be read.",
    "# A trailing slash cannot carry the query and 301s to /blog.",
    "",
  ];
  let group = "";
  for (const entry of LEGACY_REDIRECTS) {
    if (entry.group !== group) {
      lines.push(`# ${entry.group}`);
      group = entry.group;
    }
    lines.push(formatRedirect(entry.from, entry.to));
    lines.push(formatRedirect(`${entry.from}/`, entry.to));
  }
  lines.push("# Trailing slash only. The path without a slash is a Pages Function.");
  for (const from of BLOGPOST_FUNCTION_PATHS) {
    lines.push(formatRedirect(`${from}/`, "/blog"));
  }
  lines.push("");
  return lines.join("\n");
}
