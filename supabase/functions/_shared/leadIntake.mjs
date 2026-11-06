/**
 * Lead intake for /free-analysis and /gbp.
 *
 * This checks the fields those forms already collect. It does not name a CRM
 * table or RPC. Persistence stays blocked until a source-grounded contract
 * exists. Notifications do not send, even if their flags are set.
 */

export const TURNSTILE_SITEVERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export const ALLOWED_ORIGIN = "https://akwmarketing.pages.dev";

/** Public site key. Hostname-locked to akwmarketing.pages.dev. Not a secret. */
export const TURNSTILE_SITE_KEY = "0x4AAAAAAF1rkRiBjPcPH2DU";

export const HONEYPOT_FIELD = "honeypot";
export const TURNSTILE_TOKEN_FIELD = "cf-turnstile-response";
export const DEFAULT_TURNSTILE_HOSTNAME = "akwmarketing.pages.dev";

/**
 * Slack #inbound-alerts was live-checked as a private, unarchived channel.
 * This constant is the notify target. This module does not post.
 */
export const SLACK_INBOUND_ALERTS = {
  name: "#inbound-alerts",
  id: "C0BJZD8LNPM",
  workspace: "akwmarketing.slack.com",
  liveVerified: true,
  sendImplemented: false,
};

/**
 * Mail recipient is vault contact 3289329, read at deploy time into
 * LEAD_NOTIFY_EMAIL_TO. No transport is selected, and this module does not send.
 */
export const MAIL_TRANSPORT = {
  chosen: null,
  notedOptions: ["resend", "smtp", "gmail"],
  vaultContactId: "3289329",
  recipientEnv: "LEAD_NOTIFY_EMAIL_TO",
};

/**
 * Names below are from the Phase 1.2 brief. They are not a live schema
 * inspection. Do not insert into them until the Supabase connector or
 * dashboard confirms columns.
 */
export const CRM_SCHEMA = {
  liveVerified: false,
  doNotWrite: ["prospects"],
  documentedTableNames: [
    "crm_org",
    "crm_member",
    "crm_status",
    "crm_lead",
    "crm_contact",
    "crm_contact_email",
    "crm_contact_phone",
    "crm_opportunity",
    "crm_activity",
    "crm_task",
    "crm_smart_view",
    "crm_suppression",
    "crm_alert",
  ],
  hypotheses: ["website_lead_table", "crm_lead_plus_contact"],
};

export const FREE_ANALYSIS_TIMELINES = ["Today", "Tomorrow", "In a few weeks"];

/**
 * Field names match the React state on each form.
 * HTML `required` is what the browser enforces today. Placeholders that say
 * "*" are not treated as required when the input has no required attribute.
 */
export const FORM_FIELDS = {
  "free-analysis": {
    full_name: { required: true, max: 200 },
    email: { required: true, max: 320, kind: "email" },
    phone: { required: true, max: 40, kind: "phone" },
    website: { required: true, max: 500, kind: "url" },
    business_name: { required: true, max: 200 },
    google_maps_url: { required: false, max: 500, kind: "url" },
    timeline: { required: true, enum: FREE_ANALYSIS_TIMELINES },
  },
  gbp: {
    first_name: { required: true, max: 100 },
    last_name: { required: true, max: 100 },
    email: { required: true, max: 320, kind: "email" },
    phone: { required: true, max: 40, kind: "phone" },
    business_name: { required: true, max: 200 },
    website: { required: false, max: 500, kind: "url" },
    gbp_link: { required: false, max: 500, kind: "url" },
  },
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isPlainObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function result(status, code, extra = {}) {
  return {
    status,
    body: {
      ok: false,
      stored: false,
      notified: false,
      code,
      ...extra,
    },
  };
}

export function notificationFlags(env = {}) {
  return {
    slack: env.LEAD_NOTIFY_SLACK === "true",
    email: env.LEAD_NOTIFY_EMAIL === "true",
  };
}

/**
 * Flags default off. Turning a flag on does not send. There is no Slack or
 * email client in this module.
 */
export function planNotifications(env = {}) {
  const flags = notificationFlags(env);
  if (!flags.slack && !flags.email) {
    return { notified: false, code: "notifications_disabled" };
  }
  return { notified: false, code: "notify_not_implemented" };
}

export function turnstileSecret(env = {}) {
  return env.TURNSTILE_SECRET || env.TURNSTILE_SECRET_KEY || "";
}

export function turnstileHostnames(env = {}) {
  const raw = env.TURNSTILE_HOSTNAMES || DEFAULT_TURNSTILE_HOSTNAME;
  return String(raw).split(",").map((item) => item.trim()).filter(Boolean);
}

export function persistLead() {
  return {
    ok: false,
    stored: false,
    code: "crm_schema_unverified",
    schema: {
      liveVerified: CRM_SCHEMA.liveVerified,
      hypotheses: CRM_SCHEMA.hypotheses,
    },
  };
}

function invalid(field, reason) {
  return { ok: false, field, reason };
}

function checkText(value, rule) {
  if (typeof value !== "string") return "type";
  const trimmed = value.trim();
  if (!trimmed) return rule.required ? "required" : "empty";
  if (trimmed.length > rule.max) return "length";
  if (rule.enum && !rule.enum.includes(trimmed)) return "enum";
  if (rule.kind === "email" && !EMAIL.test(trimmed)) return "email";
  if (rule.kind === "phone" && (trimmed.match(/\d/g) || []).length < 7) return "phone";
  if (rule.kind === "url") {
    try {
      const url = new URL(trimmed);
      if (url.protocol !== "http:" && url.protocol !== "https:") return "url";
    } catch {
      return "url";
    }
  }
  return null;
}

export function validateLead(body) {
  if (!isPlainObject(body)) return { ok: false, field: "body", reason: "type" };
  const honeypot = body[HONEYPOT_FIELD];
  if (honeypot !== undefined && honeypot !== null && String(honeypot).trim() !== "") {
    return { ok: false, code: "honeypot" };
  }
  const envelope = new Set(["source", "payload", TURNSTILE_TOKEN_FIELD, HONEYPOT_FIELD]);
  for (const key of Object.keys(body)) {
    if (!envelope.has(key)) return invalid(key, "unknown");
  }
  const source = body.source;
  const fields = FORM_FIELDS[source];
  if (!fields) return invalid("source", "unknown");
  if (!isPlainObject(body.payload)) return invalid("payload", "type");

  const allowed = new Set(Object.keys(fields));
  for (const key of Object.keys(body.payload)) {
    if (!allowed.has(key)) return invalid(key, "unknown");
  }

  const lead = { source };
  for (const [name, rule] of Object.entries(fields)) {
    const value = body.payload[name];
    const missing = value === undefined || value === null || (typeof value === "string" && value.trim() === "");
    if (missing) {
      if (rule.required) return invalid(name, "required");
      continue;
    }
    const problem = checkText(value, rule);
    if (problem === "empty") continue;
    if (problem) return invalid(name, problem);
    lead[name] = value.trim();
  }
  return { ok: true, lead };
}

export async function verifyTurnstile({ token, secret, remoteIp, fetchImpl, hostnames }) {
  if (!secret) {
    return { ok: false, code: "turnstile_unconfigured" };
  }
  if (typeof token !== "string" || token.trim() === "") {
    return { ok: false, code: "turnstile_missing" };
  }
  if (typeof fetchImpl !== "function") {
    return { ok: false, code: "turnstile_unconfigured" };
  }
  const form = new URLSearchParams();
  form.set("secret", secret);
  form.set("response", token.trim());
  if (remoteIp) form.set("remoteip", remoteIp);
  let response;
  try {
    response = await fetchImpl(TURNSTILE_SITEVERIFY_URL, {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: form.toString(),
    });
  } catch {
    return { ok: false, code: "turnstile_unreachable" };
  }
  if (!response || !response.ok) {
    return { ok: false, code: "turnstile_unreachable" };
  }
  let payload;
  try {
    payload = await response.json();
  } catch {
    return { ok: false, code: "turnstile_unreachable" };
  }
  if (!payload || payload.success !== true) {
    return { ok: false, code: "turnstile_failed" };
  }
  const allowed = new Set(hostnames && hostnames.length ? hostnames : [DEFAULT_TURNSTILE_HOSTNAME]);
  if (!allowed.has(payload.hostname)) {
    return { ok: false, code: "turnstile_hostname" };
  }
  return { ok: true };
}

export function corsHeaders(origin) {
  if (origin !== ALLOWED_ORIGIN) return {};
  return {
    "access-control-allow-origin": ALLOWED_ORIGIN,
    "access-control-allow-methods": "POST, OPTIONS",
    "access-control-allow-headers": "content-type",
    vary: "origin",
  };
}

/**
 * @param {unknown} body
 * @param {{ env?: Record<string, string | undefined>, fetchImpl?: typeof fetch, remoteIp?: string }} [deps]
 */
export async function handleLeadRequest(body, deps = {}) {
  const env = deps.env || {};
  const validated = validateLead(body);
  if (!validated.ok) {
    const code = validated.code === "honeypot" ? "honeypot" : "validation";
    return result(400, code);
  }

  const turnstile = await verifyTurnstile({
    token: isPlainObject(body) ? body[TURNSTILE_TOKEN_FIELD] : "",
    secret: turnstileSecret(env),
    remoteIp: deps.remoteIp || "",
    fetchImpl: deps.fetchImpl,
    hostnames: turnstileHostnames(env),
  });
  if (!turnstile.ok) {
    const status = turnstile.code === "turnstile_failed" || turnstile.code === "turnstile_missing"
      ? 403
      : 503;
    return result(status, turnstile.code);
  }

  const notifications = planNotifications(env);
  const saved = persistLead(validated.lead);
  return {
    status: 503,
    body: {
      ok: false,
      stored: false,
      notified: false,
      code: saved.code,
      notifications: notifications.code,
    },
  };
}
