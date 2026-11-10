/**
 * Route HTML and sitemap.xml for the Cloudflare Pages preview.
 *
 * Pages serves a real file when one exists and falls back to /index.html otherwise.
 * The Vite build only emits the SPA shell, so /kitchener and /sitemap.xml were that
 * shell. This step renders each public route's full HTML twice: path.html (Pages
 * serves /path) and path/index.html (Pages serves /path/). Both use one canonical.
 * sitemap.xml lists that canonical once, from the committed blog snapshot.
 *
 * Head tags come from the existing page effects (titles, descriptions, JSON-LD,
 * canonical). Open Graph and Twitter tags are written from those values.
 * Nothing new is added to schema or copy here.
 * Pages have no global robots noindex meta. _headers noindexes *.pages.dev only.
 * robots.txt allows crawling and points the sitemap at www.
 *
 * Chrome is not required. Cloudflare Pages builds do not have a browser.
 */
import { spawn } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { fileURLToPath } from "node:url";
import { build } from "vite";
import { Window } from "happy-dom";
import { CANONICAL_ORIGIN, canonicalUrl } from "../src/lib/canonicalPath.js";
import { socialEntries, socialImageUrl, socialType } from "../src/lib/socialMeta.js";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const distDir = path.join(rootDir, "dist");
const SITE = CANONICAL_ORIGIN;
const SHELL_TITLE = "AKW Marketing | Online Marketing Agency";

/** Public routes from src/App.jsx, excluding client redirects (/landing, /Landing). */
const PAGE_ROUTES = [
  "/",
  "/Home",
  "/PrivacyPolicy",
  "/TermsOfService",
  "/gbp",
  "/kitchener",
  "/seo-services-kitchener",
  "/waterloo",
  "/google-ads-kitchener",
  "/meta-ads-kitchener",
  "/local-seo-kitchener",
  "/cambridge",
  "/guelph",
  "/hamilton",
  "/burlington",
  "/brantford",
  "/stratford",
  "/newsletter",
  "/newsletter-thank-you",
  "/gbp-three-free",
  "/blog",
  "/free-analysis",
  "/about",
  "/hardest-working-seo-expert-kitchener-waterloo",
  "/hardest-working-marketing-agency-kitchener-waterloo",
  "/get-more-clients",
  "/website-design-kitchener",
  "/content-marketing-kitchener",
  "/dashboard",
];

/**
 * Mirrors base44/functions/sitemap STATIC_URLS.
 * lastmod for these URLs is the generation date, same as that function.
 * /gbp-three-free and /newsletter-thank-you are real public routes that
 * function did not list, so they are included without a made-up priority.
 * /Home is the pages.config alias of / and is prerendered but not listed.
 * /dashboard, /landing, trailing-slash URLs, and .html URLs are not listed.
 */
const SITEMAP_STATIC = [
  { loc: "/", priority: "1.0", changefreq: "weekly" },
  { loc: "/gbp", priority: "1.0", changefreq: "weekly" },
  { loc: "/kitchener", priority: "0.9", changefreq: "weekly" },
  { loc: "/waterloo", priority: "0.9", changefreq: "weekly" },
  { loc: "/cambridge", priority: "0.9", changefreq: "weekly" },
  { loc: "/guelph", priority: "0.9", changefreq: "weekly" },
  { loc: "/hamilton", priority: "0.9", changefreq: "weekly" },
  { loc: "/burlington", priority: "0.9", changefreq: "weekly" },
  { loc: "/brantford", priority: "0.9", changefreq: "weekly" },
  { loc: "/stratford", priority: "0.9", changefreq: "weekly" },
  { loc: "/local-seo-kitchener", priority: "0.8", changefreq: "monthly" },
  { loc: "/seo-services-kitchener", priority: "0.8", changefreq: "monthly" },
  { loc: "/google-ads-kitchener", priority: "0.8", changefreq: "monthly" },
  { loc: "/meta-ads-kitchener", priority: "0.8", changefreq: "monthly" },
  { loc: "/website-design-kitchener", priority: "0.8", changefreq: "monthly" },
  { loc: "/content-marketing-kitchener", priority: "0.8", changefreq: "monthly" },
  { loc: "/hardest-working-seo-expert-kitchener-waterloo", priority: "0.9", changefreq: "weekly" },
  { loc: "/hardest-working-marketing-agency-kitchener-waterloo", priority: "0.9", changefreq: "weekly" },
  { loc: "/about", priority: "0.7", changefreq: "monthly" },
  { loc: "/blog", priority: "0.8", changefreq: "weekly" },
  { loc: "/free-analysis", priority: "0.7", changefreq: "monthly" },
  { loc: "/get-more-clients", priority: "0.8", changefreq: "monthly" },
  { loc: "/newsletter", priority: "0.7", changefreq: "monthly" },
  { loc: "/gbp-three-free", priority: null, changefreq: null },
  { loc: "/newsletter-thank-you", priority: null, changefreq: null },
  { loc: "/PrivacyPolicy", priority: "0.3", changefreq: "yearly" },
  { loc: "/TermsOfService", priority: "0.3", changefreq: "yearly" },
];

const EXPECTED = {
  "/": {
    title: "Is Your Business Invisible on Google? | AKW Marketing",
    text: ["Invisible on Google?"],
    types: ["Organization", "WebSite", "ProfessionalService"],
  },
  "/Home": {
    title: "Top 3 on Google in 90 Days | AKW Marketing",
    text: ["Invisible on Google?"],
  },
  "/kitchener": {
    title: "Digital Marketing Agency Kitchener | SEO, Google Ads & Local SEO for Kitchener Businesses | AKW Marketing",
    text: ["Digital Marketing Agency Kitchener"],
    types: ["ProfessionalService"],
  },
  "/free-analysis": {
    title: "Free Google Profile Analysis — AKW Marketing",
    text: ["Get Your", "Profile", "Analyzed"],
  },
  "/blog": {
    title: "AKW Marketing | Blog",
    text: ["The Blog To Get", "More Customers."],
  },
  "/PrivacyPolicy": {
    title: "Privacy Policy | AKW Marketing",
    text: ["Privacy Policy", "Last updated: October 6, 2026"],
  },
  "/TermsOfService": {
    title: "Terms of Service | AKW Marketing",
    text: ["Terms of Service", "Agreement to Terms"],
  },
  "/about": {
    title: "About AKW Marketing | Kitchener Digital Marketing Agency Founded by Andre Kadjo",
    text: ["About AKW Marketing"],
    types: ["AboutPage"],
  },
  "/gbp": {
    title: "Online Marketing Agency in Kitchener-Waterloo | AKW Marketing",
    types: ["ProfessionalService"],
  },
};

function decodeHtml(value) {
  return String(value)
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
}

function escapeText(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function escapeAttr(value) {
  return escapeText(value).replace(/"/g, "&quot;");
}

function xmlEscape(value) {
  return escapeAttr(value);
}

function outputFiles(route) {
  if (route === "/") return [path.join(distDir, "index.html")];
  const segments = route.split("/").filter(Boolean);
  if (segments.some((segment) => segment === "." || segment === ".." || segment === "assets")) {
    throw new Error(`Refusing to write route ${route}`);
  }
  const rel = segments.join("/");
  // Pages serves /path from path.html and /path/ from path/index.html.
  return [path.join(distDir, `${rel}.html`), path.join(distDir, rel, "index.html")];
}

function canonicalFor(route) {
  return canonicalUrl(route);
}

function loadPosts() {
  const catalog = JSON.parse(
    readFileSync(path.join(rootDir, "src/data/blog-posts.json"), "utf8"),
  );
  const posts = Array.isArray(catalog.posts) ? catalog.posts : [];
  const published = posts.filter((post) => post && post.published === true && post.slug && post.title);
  if (published.length !== posts.length) {
    throw new Error(`Blog snapshot has ${posts.length} records but ${published.length} are published with a slug and title.`);
  }
  console.log(
    `Blog snapshot ${catalog.fetchedAt || "undated"}: ${published.length} published posts. This build reads the committed file and does not call Base44.`,
  );
  const slugs = new Set();
  for (const post of published) {
    if (!/^[a-z0-9-]+$/.test(post.slug)) {
      throw new Error(`Blog slug is not a safe path segment: ${post.slug}`);
    }
    if (slugs.has(post.slug)) throw new Error(`Duplicate blog slug: ${post.slug}`);
    slugs.add(post.slug);
    if (!/^\d{4}-\d{2}-\d{2}/.test(String(post.published_date || ""))) {
      throw new Error(`Blog post ${post.slug} has no published_date. Refusing to invent lastmod.`);
    }
  }
  return published;
}

function collectTypes(data, into) {
  if (!data || typeof data !== "object") return;
  if (Array.isArray(data)) {
    for (const item of data) collectTypes(item, into);
    return;
  }
  if (typeof data["@type"] === "string") into.add(data["@type"]);
  else if (Array.isArray(data["@type"])) {
    for (const type of data["@type"]) if (typeof type === "string") into.add(type);
  }
  if (Array.isArray(data["@graph"])) collectTypes(data["@graph"], into);
}

function assertJsonLd(route, scripts) {
  const types = new Set();
  if (scripts.length === 0) {
    throw new Error(`${route} is missing JSON-LD. The shell Organization schema should still be present.`);
  }
  for (const script of scripts) {
    let data;
    try {
      data = JSON.parse(script.textContent || script.innerHTML || script.json || "");
    } catch (error) {
      throw new Error(`${route} has invalid JSON-LD: ${error.message}`);
    }
    if (data["@context"] !== "https://schema.org") {
      throw new Error(`${route} JSON-LD @context is ${JSON.stringify(data["@context"])}`);
    }
    if (!data["@type"] && !Array.isArray(data["@graph"])) {
      throw new Error(`${route} JSON-LD has no @type or @graph`);
    }
    collectTypes(data, types);
    if (Array.isArray(data["@graph"])) {
      for (const node of data["@graph"]) {
        if (!node || !node["@type"]) throw new Error(`${route} @graph node is missing @type`);
      }
    }
  }
  const expected = EXPECTED[route]?.types;
  if (expected) {
    for (const type of expected) {
      if (!types.has(type)) {
        throw new Error(`${route} JSON-LD missing @type ${type}. Found ${[...types].join(", ")}`);
      }
    }
  }
  return types;
}

function stripSocial(html) {
  return html.replace(
    /[ \t]*<meta (?:property="og:[a-z_]+"|name="twitter:[a-z_]+") content="[^"]*"\s*\/>\r?\n?/g,
    "",
  );
}

function renderSocialTags(fields) {
  return socialEntries(fields)
    .map(([attr, key, content]) => `<meta ${attr}="${key}" content="${escapeAttr(content)}" />`)
    .join("\n    ");
}

function assertOgAsset(route, imageUrl) {
  const prefix = `${SITE}/assets/`;
  if (!imageUrl.startsWith(prefix)) {
    throw new Error(`${route} Open Graph image is not an absolute site asset: ${imageUrl}`);
  }
  const rel = imageUrl.slice(prefix.length);
  if (!/^[A-Za-z0-9._-]+$/.test(rel)) {
    throw new Error(`${route} Open Graph image is not a public asset file: ${imageUrl}`);
  }
  const file = path.join(rootDir, "public", "assets", rel);
  if (!existsSync(file)) throw new Error(`${route} Open Graph image file is missing: ${file}`);
}

function stitch(template, { title, description, canonical, ldScripts, appHtml, ogImage, ogType }) {
  let html = template;
  if (!/<div id="root">\s*<\/div>/.test(html)) {
    throw new Error("dist/index.html has no empty #root. Refusing to guess the mount point.");
  }
  html = html.replace(/<div id="root">\s*<\/div>/, `<div id="root">${appHtml}</div>`);
  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeText(title)}</title>`);
  const descriptionTag = `<meta name="description" content="${escapeAttr(description)}" />`;
  if (!/<meta name="description" content="[^"]*"\s*\/>/.test(html)) {
    throw new Error("Could not find the description meta tag in the shell.");
  }
  html = html.replace(/<meta name="description" content="[^"]*"\s*\/>/, descriptionTag);
  html = stripSocial(html);
  if (!/<link rel="canonical" href="[^"]*"\s*\/>/.test(html)) {
    throw new Error("Could not find the canonical link in the shell.");
  }
  const social = renderSocialTags({
    title,
    description,
    url: canonical,
    image: ogImage,
    type: ogType,
  });
  html = html.replace(
    /<link rel="canonical" href="[^"]*"\s*\/>/,
    `<link rel="canonical" href="${escapeAttr(canonical)}" />\n    ${social}`,
  );
  html = html.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>\s*/g, "");
  const block = ldScripts.map(serializeLd).join("\n    ");
  html = html.replace("</head>", `    ${block}\n  </head>`);
  return html;
}

function serializeLd(script) {
  const json = JSON.stringify(JSON.parse(script.json)).replace(/</g, "\\u003c");
  const id = script.id ? ` id="${escapeAttr(script.id)}"` : "";
  return `<script type="application/ld+json"${id}>${json}</script>`;
}

function assertSocialDom(route, doc, fields) {
  const problems = [];
  for (const [attr, key, content] of socialEntries(fields)) {
    const matches = [...doc.querySelectorAll("meta")].filter((el) => el.getAttribute(attr) === key);
    if (matches.length !== 1) {
      problems.push(`${key} count ${matches.length}`);
      continue;
    }
    const value = matches[0].getAttribute("content") || "";
    if (value !== content) problems.push(`${key} is ${JSON.stringify(value)}`);
  }
  if (problems.length) throw new Error(`${route} social meta: ${problems.join("; ")}`);
}

async function readHead(route, shell, create, act, React, PrerenderApp, coverImageUrl) {
  const win = new Window({
    url: canonicalFor(route),
    settings: {
      disableJavaScriptEvaluation: true,
      disableJavaScriptFileLoading: true,
      disableCSSFileLoading: true,
    },
  });
  win.document.open();
  win.document.write(shell);
  win.document.close();
  globalThis.document = win.document;
  let renderer;
  await act(async () => {
    renderer = create(React.createElement(PrerenderApp, { location: route }));
  });
  const title = win.document.title;
  const description = win.document.querySelector('meta[name="description"]')?.getAttribute("content") || "";
  const robots = win.document.querySelector('meta[name="robots"]')?.getAttribute("content") || "";
  const canonical = win.document.querySelector('link[rel="canonical"]')?.getAttribute("href") || "";
  const ldNodes = [...win.document.querySelectorAll('script[type="application/ld+json"]')];
  assertSocialDom(route, win.document, {
    title,
    description,
    url: canonical,
    image: socialImageUrl(coverImageUrl),
    type: socialType(route),
  });
  assertJsonLd(route, ldNodes);
  const ldScripts = ldNodes.map((script) => ({
    id: script.id || "",
    json: script.textContent || script.innerHTML || "",
  }));
  await act(async () => {
    renderer.unmount();
  });
  win.close();
  return { title, description, robots, canonical, ldScripts };
}

function buildSitemap(posts) {
  const today = new Date().toISOString().slice(0, 10);
  const urls = [
    ...SITEMAP_STATIC.map((entry) => ({
      loc: `${SITE}${entry.loc === "/" ? "/" : entry.loc}`,
      lastmod: today,
      changefreq: entry.changefreq,
      priority: entry.priority,
    })),
    ...posts.map((post) => ({
      loc: `${SITE}/blog/${post.slug}`,
      lastmod: String(post.published_date).slice(0, 10),
      changefreq: "monthly",
      priority: "0.6",
    })),
  ];
  const body = urls
    .map((url) => {
      const lines = [
        "  <url>",
        `    <loc>${xmlEscape(url.loc)}</loc>`,
        `    <lastmod>${xmlEscape(url.lastmod)}</lastmod>`,
      ];
      if (url.changefreq) lines.push(`    <changefreq>${xmlEscape(url.changefreq)}</changefreq>`);
      if (url.priority) lines.push(`    <priority>${xmlEscape(url.priority)}</priority>`);
      lines.push("  </url>");
      return lines.join("\n");
    })
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`;
}

function assertSitemap(xml, posts) {
  if (xml.includes("<html") || xml.includes("<!doctype html")) {
    throw new Error("sitemap.xml contains HTML");
  }
  const win = new Window();
  const doc = new win.DOMParser().parseFromString(xml, "text/xml");
  if (doc.querySelector("parsererror")) {
    throw new Error(`sitemap.xml did not parse: ${doc.querySelector("parsererror").textContent}`);
  }
  const locs = [...doc.querySelectorAll("loc")].map((node) => node.textContent);
  const expected = new Set([
    ...SITEMAP_STATIC.map((entry) => `${SITE}${entry.loc === "/" ? "/" : entry.loc}`),
    ...posts.map((post) => `${SITE}/blog/${post.slug}`),
  ]);
  if (locs.length !== expected.size) {
    throw new Error(`sitemap has ${locs.length} URLs, expected ${expected.size}`);
  }
  for (const loc of locs) {
    if (!expected.has(loc)) throw new Error(`Unexpected sitemap URL ${loc}`);
    if (!/^https:\/\/www\.akwmarketing\.com\/[A-Za-z0-9/-]*$/.test(loc) && loc !== `${SITE}/`) {
      throw new Error(`Sitemap URL is not a site path: ${loc}`);
    }
  }
  for (const loc of expected) {
    if (!locs.includes(loc)) throw new Error(`Sitemap missing ${loc}`);
  }
  const banned = [`${SITE}/dashboard`, `${SITE}/Home`, `${SITE}/home`, `${SITE}/landing`, `${SITE}/Landing`];
  for (const loc of locs) {
    if (loc.endsWith(".html") || (loc !== `${SITE}/` && loc.endsWith("/"))) {
      throw new Error(`Sitemap lists an alias instead of the canonical URL: ${loc}`);
    }
  }
  for (const loc of banned) {
    if (locs.includes(loc)) throw new Error(`Sitemap should not list ${loc}`);
  }
  for (const post of posts) {
    const node = [...doc.querySelectorAll("url")].find((url) => url.querySelector("loc")?.textContent === `${SITE}/blog/${post.slug}`);
    const lastmod = node?.querySelector("lastmod")?.textContent;
    if (lastmod !== String(post.published_date).slice(0, 10)) {
      throw new Error(`Blog lastmod for ${post.slug} is ${lastmod}`);
    }
  }
  win.close();
}

function metaContent(html, attr, key) {
  const pattern = new RegExp(`<meta ${attr}="${key}" content="([^"]*)"\\s*/>`, "g");
  const matches = [...html.matchAll(pattern)];
  return {
    count: matches.length,
    value: matches.length === 1 ? decodeHtml(matches[0][1]) : "",
  };
}

function assertSocialHtml(route, html, fields) {
  const problems = [];
  const required = new Set(["og:title", "og:description", "og:image"]);
  for (const [attr, key, content] of socialEntries(fields)) {
    const found = metaContent(html, attr, key);
    if (found.count !== 1 || !found.value) problems.push(`missing ${key}`);
    else if (found.value !== content) problems.push(`${key} is ${JSON.stringify(found.value)}`);
    required.delete(key);
  }
  for (const key of required) problems.push(`${route} missing ${key}`);
  if (!String(fields.image || "").startsWith(`${SITE}/assets/`)) {
    problems.push("og:image is not an absolute site asset");
  }
  return problems;
}

function assertPage(route, html, shell, posts) {
  const problems = [];
  if (/<meta name="robots" content="[^"]*noindex/i.test(html)) {
    problems.push("global noindex robots meta is present");
  }
  if (!html.includes(shell.asset)) problems.push(`missing SPA bundle ${shell.asset}`);
  if (!html.includes(shell.css)) problems.push(`missing CSS ${shell.css}`);
  if (html.includes("base44.com/logo")) problems.push("Base44 favicon URL remains");
  if (!html.includes('rel="icon" type="image/png" href="/assets/logo-official.png"')) {
    problems.push("favicon is not the PNG logo");
  }
  if (html.includes("image/svg+xml")) problems.push("favicon MIME is still image/svg+xml");
  if (html.includes("aggregateRating")) problems.push("aggregateRating has no verifiable review source");
  for (const marker of [
    "https://fast.wistia.com/player.js",
    "https://connect.facebook.net/en_US/fbevents.js",
    "https://www.googletagmanager.com/gtag/js?id=G-2V59RJ0GT7",
  ]) {
    if (!html.includes(marker)) problems.push(`missing preview script ${marker}`);
  }
  if (html.includes("supabase.co/storage") || html.includes("base44-prod")) {
    problems.push("Supabase base44-prod URL remains");
  }
  if (!html.includes('href="/assets/logo-official.png"') && !html.includes("logo-official.png")) {
    problems.push("rehosted logo missing");
  }
  const title = decodeHtml(html.match(/<title>([\s\S]*?)<\/title>/)?.[1] ?? "");
  if (route === "/dashboard") {
    if (title !== SHELL_TITLE) problems.push(`dashboard title changed to ${title}`);
    if (!html.includes("Traffic Dashboard")) problems.push("dashboard body missing");
  } else if (title === SHELL_TITLE) {
    problems.push("still using the site-wide shell title");
  }
  const canonical = html.match(/<link rel="canonical" href="([^"]*)"\s*\/>/)?.[1];
  if (canonical !== canonicalFor(route)) {
    problems.push(`canonical ${canonical} !== ${canonicalFor(route)}`);
  }
  const description = decodeHtml(
    html.match(/<meta name="description" content="([^"]*)"\s*\/>/)?.[1] ?? "",
  );
  const postForImage = posts.find((item) => route === `/blog/${item.slug}`);
  problems.push(
    ...assertSocialHtml(route, html, {
      title,
      description,
      url: canonicalFor(route),
      image: socialImageUrl(postForImage?.cover_image_url),
      type: socialType(route),
    }),
  );
  if (!/<h1[\s>]/.test(html)) problems.push("no h1 in the raw HTML");
  const clientsHeading = html.match(/<(h[1-6])\b[^>]*>[\s\S]*?more Clients[\s\S]*?<\/\1>/)?.[1];
  if (route === "/get-more-clients" && clientsHeading !== "h1") {
    problems.push("pricing heading is not an h1");
  }
  if ((route === "/" || route === "/Home") && clientsHeading !== "h2") {
    problems.push("homepage pricing heading is not an h2");
  }
  const root = html.match(/<div id="root">([\s\S]*)<\/div>\s*(?:<script|<\/body>)/);
  if (!root || root[1].trim().length < 200) problems.push("prerendered #root is empty or tiny");
  const expected = EXPECTED[route];
  if (expected) {
    if (title !== expected.title) problems.push(`title ${JSON.stringify(title)}`);
    for (const phrase of expected.text || []) {
      if (!html.includes(phrase)) problems.push(`missing visible text ${JSON.stringify(phrase)}`);
    }
  }
  const post = posts.find((item) => route === `/blog/${item.slug}`);
  if (post) {
    if (title !== `${post.title} | AKW Marketing`) problems.push(`post title ${JSON.stringify(title)}`);
    if (!html.includes(post.title)) problems.push("post title not in the body");
    if (html.includes("Post not found.")) problems.push("rendered the not-found state");
    const expectedDescription = post.excerpt
      ? post.excerpt
      : `AKW Marketing is the online marketing agency in the Kitchener-Waterloo area that helps local businesses rank higher on Google. ${post.title}`;
    if (description !== expectedDescription) problems.push("description does not match the post");
  }
  if (problems.length) {
    throw new Error(`${route}: ${problems.join("; ")}`);
  }
}

function runRenderChild() {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [fileURLToPath(import.meta.url)], {
      cwd: rootDir,
      stdio: "inherit",
      env: {
        ...process.env,
        NODE_ENV: "development",
        AKW_PRERENDER_RENDER: "1",
      },
    });
    child.on("error", reject);
    child.on("exit", (code) => resolve(code ?? 1));
  });
}

async function main() {
  if (process.env.AKW_PRERENDER_RENDER !== "1") {
    const ssrDir = path.join(rootDir, "node_modules/.cache/akw-prerender");
    await build({
      configFile: path.join(rootDir, "vite.config.js"),
      root: rootDir,
      logLevel: "error",
      build: {
        ssr: path.join(rootDir, "src/prerender-app.jsx"),
        outDir: ssrDir,
        emptyOutDir: true,
        minify: false,
      },
    });
    const code = await runRenderChild();
    if (code !== 0) process.exit(code);
    return;
  }

  const shellCache = path.join(rootDir, "node_modules/.cache/akw-prerender-shell.html");
  let shell = await readFile(path.join(distDir, "index.html"), "utf8");
  if (!/<div id="root">\s*<\/div>/.test(shell)) {
    shell = await readFile(shellCache, "utf8");
  } else {
    await mkdir(path.dirname(shellCache), { recursive: true });
    await writeFile(shellCache, shell);
  }
  const asset = shell.match(/\/assets\/index-[^"]+\.js/)?.[0];
  const css = shell.match(/\/assets\/index-[^"]+\.css/)?.[0];
  if (!asset || !css) throw new Error("Built shell is missing the hashed JS or CSS asset.");
  if (shell.includes("base44.com/logo")) {
    throw new Error("Built shell still points the favicon at base44.com.");
  }

  const posts = loadPosts();
  const routes = [...PAGE_ROUTES, ...posts.map((post) => `/blog/${post.slug}`)];

  const ssrDir = path.join(rootDir, "node_modules/.cache/akw-prerender");
  const reactMod = await import("react");
  const React = reactMod.default?.createElement ? reactMod.default : reactMod;
  const act = reactMod.act || reactMod.default?.act;
  const serverMod = await import("react-dom/server");
  const renderToString = serverMod.renderToString || serverMod.default?.renderToString;
  const testMod = await import("react-test-renderer");
  const create = testMod.create || testMod.default?.create;
  const { PrerenderApp } = await import(pathToFileURL(path.join(ssrDir, "prerender-app.js")).href);
  if (!React?.createElement || !renderToString || !create || !act || !PrerenderApp) {
    throw new Error("Could not load React renderers for prerender.");
  }
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  const reportError = console.error.bind(console);
  console.error = (...args) => {
    const text = args.map((item) => (typeof item === "string" ? item : item?.message || "")).join(" ");
    if (text.includes("Detected multiple renderers concurrently rendering")) return;
    if (text.includes("useLayoutEffect does nothing on the server")) return;
    reportError(...args);
  };

  try {
    for (const route of routes) {
      globalThis.document = undefined;
      const appHtml = renderToString(React.createElement(PrerenderApp, { location: route }));
      const cover = posts.find((item) => route === `/blog/${item.slug}`)?.cover_image_url || "";
      const ogImage = socialImageUrl(cover);
      const ogType = socialType(route);
      assertOgAsset(route, ogImage);
      const head = await readHead(route, shell, create, act, React, PrerenderApp, cover);
      if (head.robots.toLowerCase().includes("noindex")) {
        throw new Error(`${route} still emits a noindex robots meta (${head.robots}).`);
      }
      if (head.canonical !== canonicalFor(route)) {
        throw new Error(`${route} canonical from the page effect is ${head.canonical}, expected ${canonicalFor(route)}`);
      }
      if (!head.description) throw new Error(`${route} has an empty meta description`);
      const html = stitch(shell, { ...head, appHtml, ogImage, ogType });
      assertPage(route, html, { asset, css }, posts);
      const files = outputFiles(route);
      for (const dest of files) {
        await mkdir(path.dirname(dest), { recursive: true });
        await writeFile(dest, html);
      }
      console.log(`${route}  ${head.title}  ${html.length} bytes  canonical ${head.canonical}  files ${files.length}`);
    }
  } finally {
    globalThis.document = undefined;
  }

  const sitemap = buildSitemap(posts);
  assertSitemap(sitemap, posts);
  await writeFile(path.join(distDir, "sitemap.xml"), sitemap);
  const headers = await readFile(path.join(distDir, "_headers"), "utf8");
  const robots = await readFile(path.join(distDir, "robots.txt"), "utf8");
  const redirects = await readFile(path.join(distDir, "_redirects"), "utf8");
  if (!headers.includes("https://:project.pages.dev/*") || !headers.includes("X-Robots-Tag: noindex")) {
    throw new Error("dist/_headers lost the pages.dev noindex rule.");
  }
  if (!headers.includes("https://:preview.:project.pages.dev/*")) {
    throw new Error("dist/_headers does not noindex preview hostnames under *.pages.dev.");
  }
  if (/(^|\n)\/\*/.test(headers)) {
    throw new Error("dist/_headers still applies a global /* rule.");
  }
  if (headers.includes("www.akwmarketing.com") && /www\.akwmarketing\.com\/\*[\s\S]*X-Robots-Tag:\s*noindex/.test(headers)) {
    throw new Error("dist/_headers noindexes the www canonical host.");
  }
  if (!headers.includes("/sitemap.xml") || !headers.includes("Content-Type: application/xml; charset=utf-8")) {
    throw new Error("dist/_headers lost the sitemap content type.");
  }
  if (robots.includes("Disallow: /")) {
    throw new Error("dist/robots.txt still disallows crawlers.");
  }
  if (!robots.includes("Allow: /") || !robots.includes(`Sitemap: ${SITE}/sitemap.xml`)) {
    throw new Error("dist/robots.txt must allow crawling and point Sitemap at www.");
  }
  for (const rule of ["/landing / 301", "/Landing / 301"]) {
    if (!redirects.includes(rule)) {
      throw new Error(`dist/_redirects is missing ${rule}.`);
    }
  }
  console.log(`sitemap.xml  ${SITEMAP_STATIC.length + posts.length} URLs  (${posts.length} blog posts)`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
