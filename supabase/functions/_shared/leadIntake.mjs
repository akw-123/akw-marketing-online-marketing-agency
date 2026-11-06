/**
 * Lead intake for /free-analysis and /gbp.
 *
 * After Turnstile and the honeypot pass, persistLead writes crm_lead,
 * crm_contact, crm_contact_email, and crm_contact_phone on the live CRM
 * project. It does not create a website-lead table and it does not write
 * prospects. Slack and email stay off unless their flags are true and send
 * is implemented. Mail transport is still unchosen, and sendImplemented is
 * false, so this module does not post.
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
 * Live schema verified 2026-11-05 on project hzllfwqnsiirlwacaitt.
 * Hypothesis B: crm_lead plus contact, email, and phone.
 * Do not create website_strategy_application or akw_website_lead.
 */
export const CRM_SCHEMA = {
  liveVerified: true,
  verifiedOn: "2026-11-05",
  hypothesis: "crm_lead_plus_contact",
  orgId: "0ba2a2de-e31d-4f41-8005-4edfadbaed98",
  statusNewId: "640c5886-fe70-43c8-b71d-559c0c82295c",
  doNotWrite: ["prospects", "website_strategy_application", "akw_website_lead"],
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
 * Flags default off. sendImplemented is false and mail transport is unset,
 * so a true flag still does not post.
 */
export function planNotifications(env = {}) {
  const flags = notificationFlags(env);
  if (!flags.slack && !flags.email) {
    return { notified: false, code: "notifications_disabled" };
  }
  return { notified: false, code: "notify_not_implemented" };
}

export function slackInboundPayload({ leadId, source, businessName } = {}) {
  const label = businessName ? `${businessName} ` : "";
  return {
    channel: SLACK_INBOUND_ALERTS.id,
    text: `New website lead (${source || "unknown"}): ${label}${leadId || ""}`.trim(),
  };
}

/**
 * Incoming-webhook POST. Callers must keep this behind LEAD_NOTIFY_SLACK
 * and SLACK_INBOUND_ALERTS.sendImplemented. The request path does not call
 * it while sendImplemented is false.
 */
export async function postSlackWebhook({ webhookUrl, payload, fetchImpl }) {
  if (!webhookUrl || typeof fetchImpl !== "function") {
    return { sent: false, code: "slack_unconfigured" };
  }
  let response;
  try {
    response = await fetchImpl(webhookUrl, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    return { sent: false, code: "slack_failed" };
  }
  if (!response || !response.ok) return { sent: false, code: "slack_failed" };
  return { sent: true, code: "slack_sent" };
}

export function planEmailNotification(env = {}) {
  if (env.LEAD_NOTIFY_EMAIL !== "true") {
    return { sent: false, code: "notifications_disabled" };
  }
  if (!MAIL_TRANSPORT.chosen) {
    return { sent: false, code: "email_transport_unchosen" };
  }
  if (!env[MAIL_TRANSPORT.recipientEnv]) {
    return { sent: false, code: "email_unconfigured" };
  }
  return { sent: false, code: "notify_not_implemented" };
}

export async function dispatchNotifications({ env = {}, fetchImpl, lead, leadId } = {}) {
  const flags = notificationFlags(env);
  if (!flags.slack && !flags.email) {
    return { notified: false, code: "notifications_disabled" };
  }

  let slack = { sent: false, code: "notifications_disabled" };
  if (flags.slack) {
    if (!SLACK_INBOUND_ALERTS.sendImplemented) {
      slack = { sent: false, code: "notify_not_implemented" };
    } else {
      slack = await postSlackWebhook({
        webhookUrl: env.SLACK_WEBHOOK_URL || "",
        payload: slackInboundPayload({
          leadId,
          source: lead && lead.source,
          businessName: lead && lead.business_name,
        }),
        fetchImpl,
      });
    }
  }

  const email = flags.email
    ? planEmailNotification(env)
    : { sent: false, code: "notifications_disabled" };
  const notified = Boolean(slack.sent || email.sent);
  return {
    notified,
    code: notified ? "notified" : "notify_not_implemented",
    slack: slack.code,
    email: email.code,
  };
}

export function turnstileSecret(env = {}) {
  return env.TURNSTILE_SECRET || env.TURNSTILE_SECRET_KEY || "";
}

export function turnstileHostnames(env = {}) {
  const raw = env.TURNSTILE_HOSTNAMES || DEFAULT_TURNSTILE_HOSTNAME;
  return String(raw).split(",").map((item) => item.trim()).filter(Boolean);
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function supabaseRestBase(env = {}) {
  const raw = env.SUPABASE_URL;
  if (typeof raw !== "string" || !raw.trim()) return "";
  try {
    const url = new URL(raw.trim());
    if (url.protocol !== "https:") return "";
    return url.origin;
  } catch {
    return "";
  }
}

export function supabaseServiceKey(env = {}) {
  return env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_SERVICE_KEY || "";
}

/**
 * North American E.164. 10 digits become +1 plus those digits. 11 digits
 * that already start with 1 keep that country code.
 * Live columns (2026-11-05): phone_e164 is NOT NULL text. Constraints are
 * the primary key, FKs to crm_contact and crm_org, and UNIQUE
 * (org_id, phone_e164, contact_id). There is no format CHECK. Values that
 * are not North American E.164 are left in crm_lead.custom.phone and the
 * phone row is skipped so a later check cannot fail the lead.
 */
export function normalizePhoneE164(raw) {
  if (typeof raw !== "string") return null;
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  return null;
}

export function domainFromWebsite(website) {
  if (!website || typeof website !== "string") return null;
  try {
    const host = new URL(website).hostname.toLowerCase().replace(/\.$/, "").replace(/^www\./, "");
    return host || null;
  } catch {
    return null;
  }
}

export function leadSourceLabel(source) {
  if (source === "gbp") return "website:gbp";
  if (source === "free-analysis") return "website:free-analysis";
  return null;
}

export function buildLeadInsert(lead) {
  const custom = {
    form_path: lead.source === "gbp" ? "/gbp" : "/free-analysis",
  };
  if (lead.timeline) custom.timeline = lead.timeline;
  if (lead.google_maps_url) custom.google_maps_url = lead.google_maps_url;
  if (lead.gbp_link) custom.gbp_link = lead.gbp_link;
  if (lead.phone) custom.phone = lead.phone;
  const phoneE164 = normalizePhoneE164(lead.phone || "");
  const contactName = lead.full_name || [lead.first_name, lead.last_name].filter(Boolean).join(" ");
  return {
    lead: {
      org_id: CRM_SCHEMA.orgId,
      name: lead.business_name,
      status_id: CRM_SCHEMA.statusNewId,
      source: leadSourceLabel(lead.source),
      website: lead.website || null,
      domain: domainFromWebsite(lead.website),
      emailable: Boolean(lead.email),
      callable: Boolean(lead.phone),
      custom,
    },
    contact: {
      org_id: CRM_SCHEMA.orgId,
      name: contactName,
      custom: {},
    },
    email: lead.email
      ? {
          org_id: CRM_SCHEMA.orgId,
          email: lead.email,
          unsubscribed: false,
          bounced: false,
        }
      : null,
    phone: phoneE164
      ? {
          org_id: CRM_SCHEMA.orgId,
          phone_e164: phoneE164,
          dnc: false,
          sms_consent: false,
          sms_optout: false,
        }
      : null,
  };
}

function restHeaders(key, prefer) {
  return {
    apikey: key,
    authorization: `Bearer ${key}`,
    "content-type": "application/json",
    accept: "application/json",
    prefer,
  };
}

async function restCall(fetchImpl, url, init) {
  try {
    return await fetchImpl(url, init);
  } catch {
    return null;
  }
}

async function readJson(response) {
  if (!response || typeof response.json !== "function") return null;
  try {
    return await response.json();
  } catch {
    return null;
  }
}

function firstRow(payload) {
  if (Array.isArray(payload)) return payload[0] || null;
  if (isPlainObject(payload)) return payload;
  return null;
}

function storeFailure() {
  return { ok: false, stored: false, code: "store_failed" };
}

/**
 * Inserts one website lead with the service role. Reads SUPABASE_URL and
 * SUPABASE_SERVICE_ROLE_KEY or SUPABASE_SERVICE_KEY. Ignores VITE_* names.
 * crm_recalc_flags overwrites emailable and callable after the child rows,
 * and callable becomes false when the phone row is skipped. A final patch
 * puts those flags back to "true when the form included email or phone".
 */
export async function persistLead(lead, deps = {}) {
  const env = deps.env || {};
  const base = supabaseRestBase(env);
  const key = supabaseServiceKey(env);
  if (!base || !key || typeof deps.fetchImpl !== "function") {
    return { ok: false, stored: false, code: "store_unconfigured" };
  }
  if (!lead || !leadSourceLabel(lead.source) || !lead.business_name) {
    return storeFailure();
  }

  const planned = buildLeadInsert(lead);
  const fetchImpl = deps.fetchImpl;
  const leadResponse = await restCall(fetchImpl, `${base}/rest/v1/crm_lead`, {
    method: "POST",
    headers: restHeaders(key, "return=representation"),
    body: JSON.stringify(planned.lead),
  });
  if (!leadResponse || !leadResponse.ok) return storeFailure();
  const leadRow = firstRow(await readJson(leadResponse));
  const leadId = leadRow && typeof leadRow.id === "string" ? leadRow.id : "";
  if (!UUID.test(leadId)) return storeFailure();

  const cleanup = () => restCall(fetchImpl, `${base}/rest/v1/crm_lead?id=eq.${leadId}`, {
    method: "DELETE",
    headers: restHeaders(key, "return=minimal"),
  });

  const contactResponse = await restCall(fetchImpl, `${base}/rest/v1/crm_contact`, {
    method: "POST",
    headers: restHeaders(key, "return=representation"),
    body: JSON.stringify({ ...planned.contact, lead_id: leadId }),
  });
  if (!contactResponse || !contactResponse.ok) {
    await cleanup();
    return storeFailure();
  }
  const contactRow = firstRow(await readJson(contactResponse));
  const contactId = contactRow && typeof contactRow.id === "string" ? contactRow.id : "";
  if (!UUID.test(contactId)) {
    await cleanup();
    return storeFailure();
  }

  if (planned.email) {
    const emailResponse = await restCall(fetchImpl, `${base}/rest/v1/crm_contact_email`, {
      method: "POST",
      headers: restHeaders(key, "return=representation"),
      body: JSON.stringify({ ...planned.email, contact_id: contactId }),
    });
    if (!emailResponse || !emailResponse.ok) {
      await cleanup();
      return storeFailure();
    }
  }

  if (planned.phone) {
    const phoneResponse = await restCall(fetchImpl, `${base}/rest/v1/crm_contact_phone`, {
      method: "POST",
      headers: restHeaders(key, "return=representation"),
      body: JSON.stringify({ ...planned.phone, contact_id: contactId }),
    });
    if (!phoneResponse) {
      await cleanup();
      return storeFailure();
    }
    // 400 and 409 are constraint or uniqueness failures. Raw phone is already
    // on crm_lead.custom. Other statuses mean the write did not land safely.
    if (!phoneResponse.ok && phoneResponse.status !== 400 && phoneResponse.status !== 409) {
      await cleanup();
      return storeFailure();
    }
  }

  const flagResponse = await restCall(fetchImpl, `${base}/rest/v1/crm_lead?id=eq.${leadId}`, {
    method: "PATCH",
    headers: restHeaders(key, "return=minimal"),
    body: JSON.stringify({
      emailable: Boolean(planned.email),
      callable: Boolean(lead.phone),
    }),
  });
  if (!flagResponse || !flagResponse.ok) {
    await cleanup();
    return storeFailure();
  }

  return { ok: true, stored: true, lead_id: leadId };
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
    let text = value.trim();
    if (rule.kind === "url" && text && !/^[a-z][a-z0-9+.-]*:/i.test(text)) {
      text = `https://${text}`;
    }
    const problem = checkText(text, rule);
    if (problem === "empty") continue;
    if (problem) return invalid(name, problem);
    lead[name] = text;
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

  const saved = await persistLead(validated.lead, { env, fetchImpl: deps.fetchImpl });
  if (!saved.ok) {
    const status = saved.code === "store_unconfigured" ? 503 : 500;
    return result(status, saved.code);
  }

  try {
    await dispatchNotifications({
      env,
      fetchImpl: deps.fetchImpl,
      lead: validated.lead,
      leadId: saved.lead_id,
    });
  } catch {
    // A notify failure does not undo the stored lead.
  }

  return {
    status: 200,
    body: {
      ok: true,
      stored: true,
      lead_id: saved.lead_id,
      notified: false,
    },
  };
}
