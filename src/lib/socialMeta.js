import { canonicalPath } from "./canonicalPath.js";

export const OG_SITE_NAME = "AKW Marketing";

/** Existing public asset. Blog posts ship with an empty cover_image_url. */
export const DEFAULT_OG_IMAGE = "https://akwmarketing.com/assets/hero-1570675559675.jpeg";

/**
 * Blog posts are articles. Every other public route, including /blog, is a website.
 */
export function socialType(pathname) {
  const path = canonicalPath(pathname);
  return path.startsWith("/blog/") ? "article" : "website";
}

/**
 * Absolute site asset URL. Empty covers and off-site URLs use the default image.
 */
export function socialImageUrl(coverImageUrl) {
  const raw = String(coverImageUrl || "").trim();
  if (raw.startsWith("https://akwmarketing.com/assets/")) return raw;
  if (raw.startsWith("/assets/")) return `https://akwmarketing.com${raw}`;
  return DEFAULT_OG_IMAGE;
}

export function socialEntries({ title, description, url, image, type }) {
  return [
    ["property", "og:type", type],
    ["property", "og:site_name", OG_SITE_NAME],
    ["property", "og:title", title],
    ["property", "og:description", description],
    ["property", "og:url", url],
    ["property", "og:image", image],
    ["name", "twitter:card", "summary_large_image"],
    ["name", "twitter:title", title],
    ["name", "twitter:description", description],
    ["name", "twitter:image", image],
  ];
}

function findMeta(doc, attr, key) {
  return [...doc.querySelectorAll("meta")].find((el) => el.getAttribute(attr) === key) || null;
}

/** Keep Open Graph and Twitter tags aligned with the title, description, and canonical. */
export function applySocialMeta(doc, fields) {
  const head = doc.head || doc.querySelector("head");
  if (!head) throw new Error("Document has no head for social meta tags.");
  for (const [attr, key, content] of socialEntries(fields)) {
    let el = findMeta(doc, attr, key);
    if (!el) {
      el = doc.createElement("meta");
      el.setAttribute(attr, key);
      head.appendChild(el);
    }
    el.setAttribute("content", content);
  }
}
