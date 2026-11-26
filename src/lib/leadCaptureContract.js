/** Public lead-capture values. No secrets. */

export const TURNSTILE_SITE_KEY = "0x4AAAAAAF1rkRiBjPcPH2DU";
/** Hosts that may render the widget and whose siteverify hostname is accepted. */
export const TURNSTILE_HOSTNAMES = [
  "www.akwmarketing.com",
  "akwmarketing.com",
  "akwmarketing.pages.dev",
];
export const HONEYPOT_FIELD = "honeypot";

/** Production builds use this when VITE_LEAD_CAPTURE_URL is unset. */
export const DEFAULT_LEAD_CAPTURE_URL =
  "https://hzllfwqnsiirlwacaitt.supabase.co/functions/v1/website-lead-capture";

export function turnstileAllowedHost(hostname) {
  return TURNSTILE_HOSTNAMES.includes(hostname);
}

export function resolveLeadCaptureUrl(envValue, { production = false } = {}) {
  if (typeof envValue === "string" && envValue.trim()) return envValue.trim();
  if (production) return DEFAULT_LEAD_CAPTURE_URL;
  return "";
}

export function leadCaptureEndpoint(env = import.meta.env) {
  const source = env || {};
  return resolveLeadCaptureUrl(source.VITE_LEAD_CAPTURE_URL, {
    production: Boolean(source.PROD),
  });
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
