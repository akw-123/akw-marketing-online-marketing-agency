/**
 * Build-time HTML shells for public marketing routes.
 *
 * Vite still emits one SPA bundle. After that, this script copies dist/index.html
 * to dist/<path>/index.html and dist/<path>.html and swaps in the title, meta
 * description, canonical, and JSON-LD each page already sets in useEffect.
 * Strings are read from the page source and src/data/blog-posts.json. Nothing
 * new is written as marketing copy.
 *
 * Cloudflare Pages serves /contact from contact.html (and redirects /contact.html
 * to /contact) and serves /contact/ from contact/index.html. Both files are
 * written so either URL form carries the same head. No top-level 404.html is
 * added, so paths without a shell (dashboard, redirects, unknown URLs) keep
 * the SPA fallback.
 *
 * Sitemap priorities for paths the old function already listed come from
 * base44/functions/sitemap/entry.ts. That module is not called.
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const distDir = path.join(root, "dist");
const SITE = "https://akwmarketing.com";

/** Inventory hints copied from base44/functions/sitemap/entry.ts. */
const SITEMAP_HINTS = {
  "/": { priority: "1.0", changefreq: "weekly" },
  "/gbp": { priority: "1.0", changefreq: "weekly" },
  "/kitchener": { priority: "0.9", changefreq: "weekly" },
  "/waterloo": { priority: "0.9", changefreq: "weekly" },
  "/cambridge": { priority: "0.9", changefreq: "weekly" },
  "/guelph": { priority: "0.9", changefreq: "weekly" },
  "/hamilton": { priority: "0.9", changefreq: "weekly" },
  "/burlington": { priority: "0.9", changefreq: "weekly" },
  "/brantford": { priority: "0.9", changefreq: "weekly" },
  "/stratford": { priority: "0.9", changefreq: "weekly" },
  "/local-seo-kitchener": { priority: "0.8", changefreq: "monthly" },
  "/seo-services-kitchener": { priority: "0.8", changefreq: "monthly" },
  "/google-ads-kitchener": { priority: "0.8", changefreq: "monthly" },
  "/meta-ads-kitchener": { priority: "0.8", changefreq: "monthly" },
  "/website-design-kitchener": { priority: "0.8", changefreq: "monthly" },
  "/content-marketing-kitchener": { priority: "0.8", changefreq: "monthly" },
  "/hardest-working-seo-expert-kitchener-waterloo": { priority: "0.9", changefreq: "weekly" },
  "/hardest-working-marketing-agency-kitchener-waterloo": { priority: "0.9", changefreq: "weekly" },
  "/about": { priority: "0.7", changefreq: "monthly" },
  "/blog": { priority: "0.8", changefreq: "weekly" },
  "/free-analysis": { priority: "0.7", changefreq: "monthly" },
  "/get-more-clients": { priority: "0.8", changefreq: "monthly" },
  "/newsletter": { priority: "0.7", changefreq: "monthly" },
  "/PrivacyPolicy": { priority: "0.3", changefreq: "yearly" },
  "/TermsOfService": { priority: "0.3", changefreq: "yearly" },
};

const DEFAULT_HINT = { priority: "0.5", changefreq: "monthly" };
const BLOG_HINT = { priority: "0.6", changefreq: "monthly" };

const SKIP_COMPONENTS = new Set([
  "NoIndexRedirect",
  "Navigate",
  "PageNotFound",
  "Dashboard",
]);

const PREVIEW_MARKERS = [
  'name="robots" content="noindex"',
  "https://fast.wistia.com/player.js",
  "https://connect.facebook.net/en_US/fbevents.js",
  "https://www.googletagmanager.com/gtag/js?id=G-2V59RJ0GT7",
];

function skipWs(source, i) {
  while (i < source.length && /\s/.test(source[i])) i += 1;
  return i;
}

function readStringLiteral(source, i) {
  i = skipWs(source, i);
  const quote = source[i];
  if (quote !== '"' && quote !== "'" && quote !== "`") return null;
  i += 1;
  let value = "";
  while (i < source.length) {
    const ch = source[i];
    if (ch === "\\") {
      const next = source[i + 1];
      if (next === "u" && /^[0-9a-fA-F]{4}/.test(source.slice(i + 2, i + 6))) {
        value += String.fromCharCode(parseInt(source.slice(i + 2, i + 6), 16));
        i += 6;
        continue;
      }
      const map = { n: "\n", r: "\r", t: "\t", "\\": "\\", "'": "'", '"': '"', "`": "`" };
      value += map[next] ?? next ?? "";
      i += 2;
      continue;
    }
    if (quote === "`" && ch === "$" && source[i + 1] === "{") {
      const err = new Error("template interpolation is not a static string");
      err.code = "DYNAMIC_TEMPLATE";
      throw err;
    }
    if (ch === quote) return { value, next: i + 1 };
    value += ch;
    i += 1;
  }
  throw new Error("unterminated string");
}

function readStringExpression(source, i) {
  const first = readStringLiteral(source, i);
  if (!first) return null;
  let value = first.value;
  i = first.next;
  while (true) {
    const j = skipWs(source, i);
    if (source[j] !== "+") break;
    const next = readStringLiteral(source, j + 1);
    if (!next) throw new Error("expected a string after +");
    value += next.value;
    i = next.next;
  }
  return { value, next: i };
}

export function readTitle(source, routePath) {
  const idx = source.indexOf("document.title");
  if (idx < 0) return null;
  let i = skipWs(source, idx + "document.title".length);
  if (source[i] !== "=") {
    throw new Error(`${routePath}: expected document.title =`);
  }
  i = skipWs(source, i + 1);
  if (/[A-Za-z_$]/.test(source[i])) {
    const ident = source.slice(i).match(/^[A-Za-z_$][\w$]*/)[0];
    const j = skipWs(source, i + ident.length);
    if (source[j] === "?") {
      if (!/pathname\.toLowerCase\(\)\s*===\s*['"]\/home['"]/.test(source)) {
        throw new Error(`${routePath}: title ternary is not the /home pathname check`);
      }
      const truthy = readStringLiteral(source, j + 1);
      if (!truthy) throw new Error(`${routePath}: title ternary true branch is not a string`);
      const colon = skipWs(source, truthy.next);
      if (source[colon] !== ":") throw new Error(`${routePath}: expected : in title ternary`);
      const falsy = readStringLiteral(source, colon + 1);
      if (!falsy) throw new Error(`${routePath}: title ternary false branch is not a string`);
      return routePath.toLowerCase() === "/home" ? truthy.value : falsy.value;
    }
  }
  const str = readStringExpression(source, i);
  if (!str) throw new Error(`${routePath}: document.title is not a static string`);
  return str.value;
}

export function readDescription(source, routePath) {
  const idx = source.indexOf("meta.content");
  if (idx < 0) return null;
  let i = skipWs(source, idx + "meta.content".length);
  if (source[i] !== "=") throw new Error(`${routePath}: expected meta.content =`);
  const str = readStringExpression(source, i + 1);
  if (!str) throw new Error(`${routePath}: meta description is not a static string`);
  return str.value;
}

function findMatchingBrace(source, openIndex) {
  let depth = 0;
  let quote = null;
  for (let i = openIndex; i < source.length; i += 1) {
    const ch = source[i];
    if (quote) {
      if (ch === "\\") {
        i += 1;
        continue;
      }
      if (ch === quote) quote = null;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === "`") {
      quote = ch;
      continue;
    }
    if (ch === "{") depth += 1;
    else if (ch === "}") {
      depth -= 1;
      if (depth === 0) return i;
    }
  }
  throw new Error("unbalanced brace");
}

export function extractJsonLd(source, routePath) {
  const names = [];
  const stringifyRe = /\.textContent\s*=\s*JSON\.stringify\(\s*([A-Za-z_$][\w$]*)\s*\)/g;
  for (const match of source.matchAll(stringifyRe)) names.push(match[1]);
  if (names.length === 0) return [];

  const ids = [...source.matchAll(/\.id\s*=\s*['"]([^'"]+)['"]/g)].map((match) => match[1]);
  if (ids.length !== names.length) {
    throw new Error(
      `${routePath}: JSON-LD script ids (${ids.length}) do not match schemas (${names.length})`,
    );
  }

  return names.map((name, index) => {
    const decl = new RegExp(`const\\s+${name}\\s*=\\s*\\{`).exec(source);
    if (!decl) throw new Error(`${routePath}: missing const ${name}`);
    const open = decl.index + decl[0].length - 1;
    const close = findMatchingBrace(source, open);
    const literal = source.slice(open, close + 1);
    try {
      return { id: ids[index], data: JSON.parse(literal) };
    } catch (error) {
      throw new Error(`${routePath}: schema ${name} is not JSON (${error.message})`);
    }
  });
}

function parseImports(source) {
  const map = new Map();
  const importRe = /import\s+(\w+)\s+from\s+['"](\.[^'"]+)['"]/g;
  for (const match of source.matchAll(importRe)) map.set(match[1], match[2]);
  return map;
}

function resolvePageFile(importPath) {
  const rel = importPath.replace(/^\.\//, "");
  const withExt = /\.(jsx|js)$/.test(rel) ? rel : `${rel}.jsx`;
  return path.join(root, "src", withExt);
}

function parsePages(configSource) {
  const cleaned = configSource.replace(/\/\*[\s\S]*?\*\//g, "");
  const marker = "export const PAGES = {";
  const start = cleaned.indexOf(marker);
  if (start < 0) throw new Error("pages.config.js: PAGES block not found");
  const open = cleaned.indexOf("{", start);
  const close = findMatchingBrace(cleaned, open);
  const body = cleaned.slice(open + 1, close);
  const entries = [];
  for (const match of body.matchAll(/"([^"]+)"\s*:\s*([A-Za-z_$][\w$]*)/g)) {
    entries.push({ path: `/${match[1]}`, component: match[2] });
  }
  if (entries.length === 0) throw new Error("pages.config.js: PAGES is empty");
  return entries;
}

export function collectStaticRoutes(appSource, pages) {
  const routeRe = /<Route\s+path="([^"]+)"\s+element=\{(?:<(\w+)|)/g;
  const simple = [...appSource.matchAll(routeRe)].map((match) => ({
    index: match.index,
    path: match[1],
    component: match[2] || null,
  }));
  const pagesMarker = "path={`/${path}`}";
  const pagesIdx = appSource.indexOf(pagesMarker);
  const routeTags = (appSource.match(/<Route\b/g) || []).length;
  const expected = simple.length + (pagesIdx >= 0 ? 1 : 0);
  if (routeTags !== expected) {
    throw new Error(
      `Unrecognized <Route> markup: found ${routeTags} tags, classified ${expected}. Update scripts/prerender-html.mjs.`,
    );
  }

  const ordered = [];
  const push = (route) => ordered.push(route);
  let insertedPages = pagesIdx < 0;
  for (const route of simple) {
    if (!insertedPages && route.index > pagesIdx) {
      for (const page of pages) push(page);
      insertedPages = true;
    }
    push(route);
  }
  if (!insertedPages) {
    for (const page of pages) push(page);
  }
  return ordered;
}

function fillPostTemplate(template, post, label) {
  const allowed = new Set(["post.title", "post.excerpt"]);
  const unknown = [];
  const filled = template.replace(/\$\{([^}]+)\}/g, (full, expr) => {
    const key = expr.trim();
    if (!allowed.has(key)) {
      unknown.push(key);
      return full;
    }
    return post[key.slice("post.".length)] ?? "";
  });
  if (unknown.length) {
    throw new Error(`${label}: unsupported template field ${unknown.join(", ")}`);
  }
  return filled;
}

export function blogHeadFromSource(source, post) {
  const titleMatch = source.match(/document\.title\s*=\s*`([^`]*)`/);
  if (!titleMatch) throw new Error("BlogPost.jsx: title template missing");
  const title = fillPostTemplate(titleMatch[1], post, "BlogPost.jsx title");

  const fallbackMatch = source.match(/:\s*`([^`]*)`/);
  if (!fallbackMatch) throw new Error("BlogPost.jsx: excerpt fallback template missing");
  const description = post.excerpt
    ? post.excerpt
    : fillPostTemplate(fallbackMatch[1], post, "BlogPost.jsx description");
  return { title, description, jsonLd: [] };
}

function hintFor(routePath) {
  return SITEMAP_HINTS[routePath] || DEFAULT_HINT;
}

export function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function escapeXml(text) {
  return escapeHtml(text).replace(/'/g, "&apos;");
}

function replaceTag(html, pattern, replacement, label) {
  if (!pattern.test(html)) throw new Error(`built index.html is missing ${label}`);
  // Function replacer so `$` in titles, descriptions, and JSON-LD stays literal.
  return html.replace(pattern, () => replacement);
}

export function applyHead(html, { title, description, canonical, jsonLd }) {
  let out = html;
  if (title != null) {
    out = replaceTag(out, /<title>[^<]*<\/title>/, `<title>${escapeHtml(title)}</title>`, "<title>");
  }
  if (description != null) {
    out = replaceTag(
      out,
      /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/,
      `<meta name="description" content="${escapeHtml(description)}" />`,
      "meta description",
    );
  }
  out = replaceTag(
    out,
    /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/,
    `<link rel="canonical" href="${escapeHtml(canonical)}" />`,
    "canonical link",
  );

  if (jsonLd.length) {
    const blocks = jsonLd
      .map(({ id, data }) => {
        const json = JSON.stringify(data).replace(/</g, "\\u003c");
        return `    <script type="application/ld+json" id="${escapeHtml(id)}">${json}</script>`;
      })
      .join("\n");
    const withLd = out.replace("</head>", () => `${blocks}\n  </head>`);
    if (withLd === out) throw new Error("built index.html is missing </head>");
    out = withLd;
  }
  return out;
}

function assertPreviewControls(html, label) {
  for (const marker of PREVIEW_MARKERS) {
    if (!html.includes(marker)) {
      throw new Error(`${label} dropped a Phase 1 preview control or tracking script (${marker})`);
    }
  }
}

export function renderSitemap(entries, today) {
  const urls = entries.map((entry) => {
    const hint = entry.hint;
    const loc = `${SITE}${entry.path === "/" ? "/" : entry.path}`;
    return [
      "  <url>",
      `    <loc>${escapeXml(loc)}</loc>`,
      `    <lastmod>${entry.lastmod || today}</lastmod>`,
      `    <changefreq>${hint.changefreq}</changefreq>`,
      `    <priority>${hint.priority}</priority>`,
      "  </url>",
    ].join("\n");
  });
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>\n`;
}

async function readText(file) {
  return readFile(file, "utf8");
}

export async function loadEntries() {
  const appSource = await readText(path.join(root, "src/App.jsx"));
  const configSource = await readText(path.join(root, "src/pages.config.js"));
  const imports = parseImports(appSource);
  for (const [name, spec] of parseImports(configSource)) imports.set(name, spec);

  const routes = collectStaticRoutes(appSource, parsePages(configSource));
  const staticRoutes = [];
  let blogPostImport = null;

  for (const route of routes) {
    if (route.path.includes(":")) {
      if (route.path === "/blog/:slug" && route.component === "BlogPost") {
        blogPostImport = imports.get("BlogPost");
        if (!blogPostImport) throw new Error("App.jsx imports BlogPost from an unexpected path");
        continue;
      }
      throw new Error(`Unsupported dynamic route ${route.path}`);
    }
    if (route.path === "*" || route.path === "/dashboard") continue;
    if (!route.component || SKIP_COMPONENTS.has(route.component)) continue;

    const spec = imports.get(route.component);
    if (!spec || !spec.includes("/pages/")) {
      throw new Error(`${route.path}: no page file for ${route.component}`);
    }
    const file = resolvePageFile(spec);
    const source = await readText(file);
    staticRoutes.push({
      path: route.path,
      head: {
        title: readTitle(source, route.path),
        description: readDescription(source, route.path),
        jsonLd: extractJsonLd(source, route.path),
      },
      hint: hintFor(route.path),
    });
  }

  if (!blogPostImport) throw new Error("App.jsx is missing /blog/:slug");
  const blogSource = await readText(resolvePageFile(blogPostImport));
  const catalog = JSON.parse(await readText(path.join(root, "src/data/blog-posts.json")));
  const posts = Array.isArray(catalog.posts) ? catalog.posts : [];
  const seen = new Set();
  const blogEntries = [];
  for (const post of posts) {
    if (!post || post.published !== true || !post.slug || !post.title) continue;
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(post.slug)) {
      throw new Error(`Blog slug is not a safe path segment: ${post.slug}`);
    }
    if (seen.has(post.slug)) throw new Error(`Duplicate blog slug: ${post.slug}`);
    seen.add(post.slug);
    const lastmod = /^\d{4}-\d{2}-\d{2}$/.test(post.published_date || "")
      ? post.published_date
      : null;
    blogEntries.push({
      path: `/blog/${post.slug}`,
      head: blogHeadFromSource(blogSource, post),
      hint: BLOG_HINT,
      lastmod,
    });
  }
  if (blogEntries.length === 0) {
    throw new Error("No published blog posts in src/data/blog-posts.json");
  }

  const paths = new Set();
  for (const entry of [...staticRoutes, ...blogEntries]) {
    if (paths.has(entry.path)) throw new Error(`Duplicate public route ${entry.path}`);
    paths.add(entry.path);
  }
  return { staticRoutes, blogEntries };
}

function shellFiles(routePath) {
  if (routePath === "/") return [path.join(distDir, "index.html")];
  const rel = routePath.slice(1);
  if (!rel || rel.includes("..") || path.isAbsolute(rel)) {
    throw new Error(`Refusing to write shell for ${routePath}`);
  }
  return [path.join(distDir, `${rel}.html`), path.join(distDir, rel, "index.html")];
}

async function writeShell(routePath, html) {
  const files = shellFiles(routePath);
  for (const file of files) {
    await mkdir(path.dirname(file), { recursive: true });
    await writeFile(file, html);
  }
}

function assertShell(file, entry) {
  const html = file.html;
  assertPreviewControls(html, entry.path);
  if (entry.head.title && !html.includes(`<title>${escapeHtml(entry.head.title)}</title>`)) {
    throw new Error(`${entry.path}: shell title does not match the page source`);
  }
  if (entry.head.description && !html.includes(`content="${escapeHtml(entry.head.description)}"`)) {
    throw new Error(`${entry.path}: shell description does not match the page source`);
  }
  const canonical = `${SITE}${entry.path === "/" ? "/" : entry.path}`;
  if (!html.includes(`href="${canonical}"`)) {
    throw new Error(`${entry.path}: canonical is not ${canonical}`);
  }
  for (const block of entry.head.jsonLd) {
    const json = JSON.stringify(block.data).replace(/</g, "\\u003c");
    if (!html.includes(`id="${block.id}"`) || !html.includes(json)) {
      throw new Error(`${entry.path}: JSON-LD ${block.id} does not match the page source`);
    }
  }
}

export async function main() {
  const templatePath = path.join(distDir, "index.html");
  const template = await readText(templatePath);
  assertPreviewControls(template, "dist/index.html");
  if (!template.includes('<div id="root">')) {
    throw new Error("dist/index.html is not the Vite SPA shell");
  }

  const today = new Date().toISOString().split("T")[0];
  const { staticRoutes, blogEntries } = await loadEntries();
  const entries = [...staticRoutes, ...blogEntries].map((entry) => ({
    ...entry,
    lastmod: entry.lastmod || today,
  }));

  const defaulted = entries.filter((entry) => !entry.path.startsWith("/blog/") && !SITEMAP_HINTS[entry.path]);
  if (defaulted.length) {
    console.log(
      `Sitemap priority defaulted to ${DEFAULT_HINT.priority}/${DEFAULT_HINT.changefreq} for: ${defaulted.map((entry) => entry.path).join(", ")}`,
    );
  }

  for (const entry of entries) {
    const html = applyHead(template, {
      title: entry.head.title,
      description: entry.head.description,
      canonical: `${SITE}${entry.path === "/" ? "/" : entry.path}`,
      jsonLd: entry.head.jsonLd,
    });
    assertShell({ html }, entry);
    await writeShell(entry.path, html);
  }

  const sitemap = renderSitemap(entries, today);
  if (!sitemap.startsWith("<?xml") || !sitemap.includes("<urlset")) {
    throw new Error("sitemap.xml is not an XML urlset");
  }
  if (sitemap.includes("<div id=\"root\">") || sitemap.includes("/dashboard") || sitemap.includes("/landing")) {
    throw new Error("sitemap.xml contains an excluded path or the SPA shell");
  }
  const required = ["/", "/kitchener", "/blog", blogEntries[0].path];
  for (const routePath of required) {
    const loc = `${SITE}${routePath === "/" ? "/" : routePath}`;
    if (!sitemap.includes(`<loc>${loc}</loc>`)) {
      throw new Error(`sitemap.xml is missing ${loc}`);
    }
  }
  await writeFile(path.join(distDir, "sitemap.xml"), sitemap);

  const home = staticRoutes.find((entry) => entry.path === "/");
  const kitchener = staticRoutes.find((entry) => entry.path === "/kitchener");
  const blog = staticRoutes.find((entry) => entry.path === "/blog");
  if (!home?.head.title || !kitchener?.head.title || !blog?.head.title) {
    throw new Error("Home, Kitchener, or Blog did not define a title");
  }
  if (home.head.title === "AKW Marketing | Online Marketing Agency") {
    throw new Error("Home shell kept the generic index.html title");
  }

  console.log(
    `Prerendered ${entries.length} public routes (${staticRoutes.length} static, ${blogEntries.length} blog posts) and wrote dist/sitemap.xml`,
  );
}

const invoked = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (invoked) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
