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
