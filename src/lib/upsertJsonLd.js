/**
 * Insert or replace a JSON-LD script by id.
 * Prerendered HTML already includes the node. Updating it avoids a second copy
 * when the SPA boots.
 */
export function upsertJsonLd(id, data) {
  let script = document.getElementById(id);
  if (!script) {
    script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = id;
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(data);
}
