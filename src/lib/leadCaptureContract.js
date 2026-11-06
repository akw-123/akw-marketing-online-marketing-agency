/** Public lead-capture values. No secrets. */

export const TURNSTILE_SITE_KEY = "0x4AAAAAAF1rkRiBjPcPH2DU";
export const TURNSTILE_HOSTNAME = "akwmarketing.pages.dev";
export const HONEYPOT_FIELD = "honeypot";

export function turnstileAllowedHost(hostname) {
  return hostname === TURNSTILE_HOSTNAME;
}

/**
 * Request shape from the Phase 1.2 brief. The browser does not POST this
 * until capture is explicitly enabled.
 */
export function buildLeadRequest({ source, payload, turnstileToken, honeypot }) {
  return {
    source,
    payload,
    "cf-turnstile-response": turnstileToken || "",
    honeypot: honeypot || "",
  };
}
