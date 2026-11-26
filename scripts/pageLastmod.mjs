/**
 * lastmod for a page source file.
 *
 * Prefer `git log -1` when this checkout has real history. A shallow clone
 * (rev-list count under MIN_HISTORY) reports one commit for every file, which
 * is the build commit, so that case uses the committed src/data/page-lastmod.json
 * captured from a full history.
 */
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";

const MIN_HISTORY = 30;

export function gitLastmod(file, rootDir) {
  try {
    const count = Number(
      execFileSync("git", ["rev-list", "--count", "HEAD"], {
        cwd: rootDir,
        encoding: "utf8",
        stdio: ["ignore", "pipe", "ignore"],
      }).trim(),
    );
    if (!Number.isFinite(count) || count < MIN_HISTORY) return null;
    const date = execFileSync("git", ["log", "-1", "--format=%cs", "--", file], {
      cwd: rootDir,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return null;
    return date;
  } catch {
    return null;
  }
}

export function committedLastmod(file, rootDir) {
  const table = JSON.parse(
    readFileSync(path.join(rootDir, "src/data/page-lastmod.json"), "utf8"),
  );
  const date = table[file];
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date || "")) {
    throw new Error(`src/data/page-lastmod.json has no lastmod for ${file}`);
  }
  return date;
}

export function pageLastmod(file, rootDir) {
  return gitLastmod(file, rootDir) || committedLastmod(file, rootDir);
}
