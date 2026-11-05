/**
 * Refresh the committed BlogPost snapshot from the public Base44 entity API.
 *
 * The live site reads `entities.BlogPost` in the browser. This script copies
 * published posts into src/data/blog-posts.json so the Pages build does not
 * call Base44 when someone opens /blog. It never invents posts.
 *
 * Failure does not fail `npm run build`: the last committed snapshot is kept.
 */
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const APP_ID = "69aa2d66169a7c4374014381";
const ENDPOINT = `https://base44.app/api/apps/${APP_ID}/entities/BlogPost`;
const OUT_FILE = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../src/data/blog-posts.json",
);

const PUBLIC_FIELDS = [
  "id",
  "title",
  "slug",
  "excerpt",
  "content",
  "cover_image_url",
  "category",
  "published",
  "published_date",
  "read_time_minutes",
];

function emptyCatalog(reason) {
  return {
    source: ENDPOINT,
    fetchedAt: null,
    unavailableReason: reason,
    posts: [],
  };
}

async function readExisting() {
  try {
    const raw = await readFile(OUT_FILE, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed.posts) ? parsed : null;
  } catch {
    return null;
  }
}

function toPublicPost(record) {
  if (!record || record.published !== true || !record.slug || !record.title) {
    return null;
  }
  const post = {};
  for (const field of PUBLIC_FIELDS) {
    if (record[field] !== undefined) post[field] = record[field];
  }
  post.published = true;
  return post;
}

async function main() {
  const url = new URL(ENDPOINT);
  url.searchParams.set("q", JSON.stringify({ published: true }));
  url.searchParams.set("sort", "-published_date");
  url.searchParams.set("limit", "500");

  let response;
  try {
    response = await fetch(url, {
      headers: {
        Accept: "application/json",
        "X-App-Id": APP_ID,
      },
    });
  } catch (error) {
    await keepPrevious(`request failed: ${error.message}`);
    return;
  }

  if (!response.ok) {
    await keepPrevious(`HTTP ${response.status}`);
    return;
  }

  let body;
  try {
    body = await response.json();
  } catch (error) {
    await keepPrevious(`invalid JSON: ${error.message}`);
    return;
  }

  if (!Array.isArray(body)) {
    await keepPrevious("response was not a list");
    return;
  }

  const posts = body
    .map(toPublicPost)
    .filter(Boolean)
    .sort((a, b) => String(b.published_date || "").localeCompare(String(a.published_date || "")));

  if (posts.length === 0) {
    await keepPrevious("API returned no published posts");
    return;
  }

  const catalog = {
    source: ENDPOINT,
    fetchedAt: new Date().toISOString(),
    unavailableReason: null,
    posts,
  };
  await writeFile(OUT_FILE, `${JSON.stringify(catalog, null, 2)}\n`);
  console.log(`Wrote ${posts.length} published blog posts to ${path.relative(process.cwd(), OUT_FILE)}`);
}

async function keepPrevious(reason) {
  const existing = await readExisting();
  if (existing && existing.posts.length > 0) {
    console.warn(
      `Blog snapshot refresh skipped (${reason}). Keeping ${existing.posts.length} committed posts.`,
    );
    return;
  }
  await writeFile(OUT_FILE, `${JSON.stringify(emptyCatalog(reason), null, 2)}\n`);
  console.warn(
    `Blog snapshot refresh skipped (${reason}). Wrote an empty catalog. No posts were invented.`,
  );
}

main();
