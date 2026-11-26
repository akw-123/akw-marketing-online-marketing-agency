/**
 * Phase 1.2 replaces Base44 StrategyApplication + SendEmail.
 * Dev servers without VITE_LEAD_CAPTURE_URL still refuse to POST.
 * Preview production builds default the URL in leadCaptureContract.js.
 */
import {
  buildLeadRequest,
  leadCaptureEndpoint,
  turnstileAllowedHost,
} from "./leadCaptureContract.js";

export const LEAD_CAPTURE_UNAVAILABLE =
  "This form is unavailable right now. Email contact@akwmarketing.com and we will follow up.";

export const LEAD_CAPTURE_FAILED =
  "We could not save this request. Please try again later.";

export const LEAD_CAPTURE_RECEIVED =
  "Thanks. We received your request and will follow up.";

export const TURNSTILE_REQUIRED =
  "Complete the verification check, then submit again.";

export function leadCaptureEnabled(env) {
  return Boolean(leadCaptureEndpoint(env));
}

export async function submitLeadCapture({
  source,
  payload,
  turnstileToken,
  honeypot,
  endpoint,
  fetchImpl,
}) {
  const url = endpoint ?? leadCaptureEndpoint();
  if (!url) {
    return { ok: false, message: LEAD_CAPTURE_UNAVAILABLE };
  }
  let response;
  try {
    response = await (fetchImpl || fetch)(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(buildLeadRequest({
        source,
        payload,
        turnstileToken,
        honeypot,
      })),
    });
  } catch {
    return { ok: false, message: LEAD_CAPTURE_FAILED };
  }
  let body = null;
  try {
    body = await response.json();
  } catch {
    body = null;
  }
  if (response.ok && body && body.ok === true && body.stored === true) {
    return { ok: true, message: LEAD_CAPTURE_RECEIVED };
  }
  return { ok: false, message: LEAD_CAPTURE_FAILED };
}

export async function submitFormLead({ source, payload, formEl, hostname, fetchImpl }) {
  const endpoint = leadCaptureEndpoint();
  if (!endpoint) {
    return { ok: false, message: LEAD_CAPTURE_UNAVAILABLE };
  }
  const token = formEl?.querySelector?.('[name="cf-turnstile-response"]')?.value || "";
  if (turnstileAllowedHost(hostname || "") && !token) {
    return { ok: false, message: TURNSTILE_REQUIRED };
  }
  const honeypotEl = formEl?.elements?.namedItem?.("honeypot");
  const honeypot = honeypotEl && "value" in honeypotEl ? honeypotEl.value : "";
  return submitLeadCapture({
    source,
    payload,
    turnstileToken: token,
    honeypot,
    endpoint,
    fetchImpl,
  });
}
