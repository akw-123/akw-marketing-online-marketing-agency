import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { canonicalUrl } from "../src/lib/canonicalPath.js";
import { legacyBlogPostPath } from "../src/lib/legacyBlogPost.js";
import {
  BLOGPOST_FUNCTION_PATHS,
  INDEXNOW_KEY,
  NOINDEX_ROBOTS,
  PRERENDER_PATHS,
  SITEMAP_PAGES,
  UNLISTED_ROUTES,
  UNRESOLVED_LEGACY,
  redirectRules,
  renderRedirects,
} from "../src/lib/siteRoutes.js";
import { committedLastmod, gitLastmod } from "./pageLastmod.mjs";
import {
  SEO_PLANS,
  bestValueSavingsCad,
  cardPeriod,
  cardPrice,
  formatCad,
  prosePrice,
  tablePrice,
  threeMonthsOfStandardCad,
} from "../src/data/seoPlans.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function read(rel) {
  return readFileSync(path.join(root, rel), "utf8");
}

describe("sitemap and canonical routes", () => {
  it("lists only prerendered indexable paths, with priority and changefreq", () => {
    const locs = SITEMAP_PAGES.map((entry) => entry.loc);
    assert.equal(new Set(locs).size, locs.length);
    for (const entry of SITEMAP_PAGES) {
      assert.ok(PRERENDER_PATHS.includes(entry.loc), entry.loc);
      assert.match(entry.priority, /^\d\.\d$/);
      assert.match(entry.changefreq, /^(weekly|monthly|yearly)$/);
      assert.equal(canonicalUrl(entry.loc), `https://www.akwmarketing.com${entry.loc === "/" ? "/" : entry.loc}`);
    }
    assert.ok(locs.includes("/gbp-three-free"));
    assert.equal(locs.includes("/newsletter-thank-you"), false);
    assert.equal(locs.includes("/dashboard"), false);
    assert.equal(locs.includes("/privacy-policy"), true);
    assert.equal(locs.includes("/PrivacyPolicy"), false);
    assert.equal(locs.includes("/terms-of-service"), true);
  });

  it("noindexes the newsletter confirmation page and keeps it out of the sitemap", () => {
    const thankYou = UNLISTED_ROUTES.find((entry) => entry.loc === "/newsletter-thank-you");
    assert.equal(thankYou.robots, NOINDEX_ROBOTS);
    assert.equal(SITEMAP_PAGES.some((entry) => entry.loc === "/newsletter-thank-you"), false);
    assert.equal(SITEMAP_PAGES.some((entry) => entry.robots), false);
  });

  it("keeps static lastmod equal to the page source git date", () => {
    for (const entry of SITEMAP_PAGES) {
      const committed = committedLastmod(entry.source, root);
      assert.match(committed, /^\d{4}-\d{2}-\d{2}$/);
      const fromGit = gitLastmod(entry.source, root);
      if (fromGit) assert.equal(fromGit, committed, entry.source);
    }
  });
});

describe("legacy redirects", () => {
  it("writes public/_redirects from the route table, including /landing", () => {
    const redirects = read("public/_redirects");
    assert.equal(redirects, renderRedirects());
    assert.match(redirects, /\/landing \/ 301/);
    assert.match(redirects, /\/Landing \/ 301/);
    assert.doesNotMatch(redirects, /(^|\n)\/\*/);
    const rules = redirectRules();
    const sources = rules.map((rule) => rule.from);
    assert.equal(new Set(sources).size, sources.length);
    const built = new Set(PRERENDER_PATHS);
    for (const rule of rules) {
      assert.equal(built.has(rule.to), true, `${rule.from} -> ${rule.to}`);
      assert.equal(built.has(rule.from), false, rule.from);
      assert.equal(SITEMAP_PAGES.some((entry) => entry.loc === rule.from), false);
    }
  });

  it("does not invent a target for removed or uncertain paths", () => {
    const sources = new Set(redirectRules().map((rule) => rule.from));
    for (const entry of UNRESOLVED_LEGACY) {
      assert.equal(sources.has(entry.path), false, entry.path);
      assert.equal(sources.has(`${entry.path}/`), false, entry.path);
    }
  });

  it("sends BlogPost query slugs only when the slug is published", () => {
    const published = new Set(["work-life-balance-isnt-real"]);
    const known = (slug) => published.has(slug);
    assert.equal(legacyBlogPostPath(null, known), "/blog");
    assert.equal(legacyBlogPostPath("  ", known), "/blog");
    assert.equal(legacyBlogPostPath("work-life-balance-isnt-real", known), "/blog/work-life-balance-isnt-real");
    assert.equal(legacyBlogPostPath("../secret", known), null);
    assert.equal(legacyBlogPostPath("not-a-real-post", known), null);
    assert.match(read("functions/BlogPost.js"), /onRequest/);
    assert.equal(BLOGPOST_FUNCTION_PATHS.includes("/blogpost"), false);
    assert.deepEqual(BLOGPOST_FUNCTION_PATHS, ["/BlogPost"]);
  });
});

describe("indexing files", () => {
  it("keeps pages.dev noindex host-scoped and robots.txt open", () => {
    const headers = read("public/_headers");
    const robots = read("public/robots.txt");
    assert.match(headers, /https:\/\/:project\.pages\.dev\/\*/);
    assert.match(headers, /https:\/\/:preview\.:project\.pages\.dev\/\*/);
    assert.match(headers, /X-Robots-Tag: noindex/);
    assert.doesNotMatch(headers, /(^|\n)\/\*/);
    assert.doesNotMatch(headers, /www\.akwmarketing\.com\/\*[\s\S]*X-Robots-Tag:\s*noindex/);
    assert.match(robots, /Allow: \//);
    assert.doesNotMatch(robots, /Disallow: \//);
    assert.match(robots, /Sitemap: https:\/\/www\.akwmarketing\.com\/sitemap\.xml/);
  });

  it("publishes the IndexNow key at the site root", () => {
    assert.match(INDEXNOW_KEY, /^[a-f0-9]{32}$/);
    const body = readFileSync(path.join(root, "public", `${INDEXNOW_KEY}.txt`));
    assert.equal(body.toString("utf8"), INDEXNOW_KEY);
    assert.equal(body.length, 32);
  });
});

describe("live SEO plan prices", () => {
  it("keeps Minimum, Standard, and Best Value on one source", () => {
    assert.deepEqual(
      [SEO_PLANS.minimum.amount, SEO_PLANS.standard.amount, SEO_PLANS.bestValue.amount],
      [500, 599, 999],
    );
    assert.equal(prosePrice(SEO_PLANS.minimum), "CA$500 a month");
    assert.equal(prosePrice(SEO_PLANS.standard), "CA$599 a month");
    assert.equal(prosePrice(SEO_PLANS.bestValue), "CA$999 a quarter");
    assert.equal(tablePrice(SEO_PLANS.minimum), "$500 a month");
    assert.equal(tablePrice(SEO_PLANS.standard), "$599 a month");
    assert.equal(tablePrice(SEO_PLANS.bestValue), "$999 a quarter");
    assert.equal(cardPrice(SEO_PLANS.minimum), "CA$500");
    assert.equal(cardPeriod(SEO_PLANS.minimum), "/ Month");
    assert.equal(cardPrice(SEO_PLANS.standard), "CA$599");
    assert.equal(cardPeriod(SEO_PLANS.standard), "/ Month");
    assert.equal(cardPrice(SEO_PLANS.bestValue), "CA$999");
    assert.equal(cardPeriod(SEO_PLANS.bestValue), "/ Quarter");
    assert.equal(threeMonthsOfStandardCad(), 1797);
    assert.equal(bestValueSavingsCad(), 798);
    assert.equal(formatCad(bestValueSavingsCad()), "CA$798");
    assert.equal(formatCad(threeMonthsOfStandardCad()), "CA$1,797");

    const pricing = read("src/components/landing/PricingSection.jsx");
    const cost = read("src/pages/SeoCostKitchener.jsx");
    const baseline = read("src/pages/AiVisibilityBaseline.jsx");
    assert.match(pricing, /@\/data\/seoPlans/);
    assert.match(cost, /@\/data\/seoPlans/);
    assert.match(baseline, /@\/data\/seoPlans/);
    assert.doesNotMatch(pricing, /CA\$\d/);
    assert.doesNotMatch(baseline, /CA\$\d/);
    assert.doesNotMatch(baseline, /\u2014/);
    assert.doesNotMatch(baseline, /Offer/);
    assert.match(baseline, /href="\/seo-cost-kitchener"/);
    assert.match(
      cost,
      /With AKW Marketing, local SEO costs CA\$500 a month \(Minimum\), CA\$599 a month \(Standard\), or CA\$999 a quarter \(Best Value\)\./,
    );
    const faqPrice = `With AKW Marketing, local SEO costs ${prosePrice(SEO_PLANS.minimum)} (Minimum), ${prosePrice(SEO_PLANS.standard)} (Standard), or ${prosePrice(SEO_PLANS.bestValue)} (Best Value).`;
    assert.ok(cost.includes(faqPrice));
  });
});
