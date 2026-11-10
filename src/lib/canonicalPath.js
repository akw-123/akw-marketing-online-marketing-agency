/**
 * One preferred path per page.
 * /Home is the pages.config alias of /. A trailing slash is the same page.
 * www is the canonical host. The bare domain 301s to www outside this repo.
 */
export const CANONICAL_ORIGIN = "https://www.akwmarketing.com";

export function canonicalPath(pathname) {
  let path = pathname || "/";
  if (path.length > 1 && path.endsWith("/")) path = path.slice(0, -1);
  if (path.toLowerCase() === "/home") return "/";
  return path;
}

export function canonicalUrl(pathname) {
  const path = canonicalPath(pathname);
  return path === "/" ? `${CANONICAL_ORIGIN}/` : `${CANONICAL_ORIGIN}${path}`;
}
