import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  DEFAULT_LEAD_CAPTURE_URL,
  HONEYPOT_FIELD as CLIENT_HONEYPOT,
  TURNSTILE_SITE_KEY as CLIENT_SITE_KEY,
  buildLeadRequest,
  resolveLeadCaptureUrl,
} from "../../../src/lib/leadCaptureContract.js";
import {
  LEAD_CAPTURE_FAILED,
  LEAD_CAPTURE_RECEIVED,
  LEAD_CAPTURE_UNAVAILABLE,
  submitLeadCapture,
} from "../../../src/lib/previewLeadCapture.js";
import {
  ALLOWED_ORIGIN,
  CRM_SCHEMA,
  FORM_FIELDS,
  HONEYPOT_FIELD,
  MAIL_TRANSPORT,
  SLACK_INBOUND_ALERTS,
  TURNSTILE_SITEVERIFY_URL,
  TURNSTILE_SITE_KEY,
  buildLeadInsert,
  dispatchNotifications,
  handleLeadRequest,
  normalizePhoneE164,
  persistLead,
  planEmailNotification,
  planNotifications,
  postSlackWebhook,
  slackInboundPayload,
  validateLead,
  verifyTurnstile,
} from "./leadIntake.mjs";

const freeFields = {
  full_name: "Ada Lovelace",
  email: "ada@example.com",
  phone: "555-0100",
  website: "https://example.com",
  business_name: "Analytical Engines",
  google_maps_url: "https://maps.example.com/place",
  timeline: "Today",
};

const gbpFields = {
  first_name: "Ada",
  last_name: "Lovelace",
  email: "ada@example.com",
  phone: "5550100",
  business_name: "Analytical Engines",
};

const freeAnalysis = envelope("free-analysis", freeFields);
const gbp = envelope("gbp", gbpFields);

function envelope(source, payload, extra = {}) {
  return {
    source,
    payload,
    "cf-turnstile-response": "token-ok",
    honeypot: "",
    ...extra,
  };
}

function siteverifyFetch(success, hostname = "akwmarketing.pages.dev") {
  const calls = [];
  const fetchImpl = async (url, init) => {
    calls.push({ url, init });
    return {
      ok: true,
      json: async () => ({ success, hostname }),
    };
  };
  return { fetchImpl, calls };
}

describe("form contracts match the pages", () => {
  it("covers only the two lead forms", () => {
    assert.deepEqual(Object.keys(FORM_FIELDS).sort(), ["free-analysis", "gbp"]);
  });

  it("keeps the public site key out of the secret path", () => {
    assert.equal(TURNSTILE_SITE_KEY.startsWith("0x"), true);
    assert.equal(TURNSTILE_SITE_KEY.includes("SECRET"), false);
    assert.equal(CLIENT_SITE_KEY, TURNSTILE_SITE_KEY);
    assert.equal(CLIENT_HONEYPOT, HONEYPOT_FIELD);
  });

  it("accepts the client request builder", () => {
    const built = buildLeadRequest({
      source: "gbp",
      payload: gbpFields,
      turnstileToken: "token-ok",
      honeypot: "",
    });
    assert.equal(validateLead(built).ok, true);
  });
});

describe("validateLead", () => {
  it("accepts a free-analysis payload from the current fields", () => {
    const result = validateLead(freeAnalysis);
    assert.equal(result.ok, true);
    assert.equal(result.lead.full_name, "Ada Lovelace");
    assert.equal(result.lead.timeline, "Today");
    assert.equal(result.lead.turnstileToken, undefined);
  });

  it("accepts a gbp payload and treats website and gbp_link as optional", () => {
    const result = validateLead(gbp);
    assert.equal(result.ok, true);
    assert.equal(result.lead.website, undefined);
    assert.equal(result.lead.gbp_link, undefined);
  });

  it("rejects a filled honeypot", () => {
    const result = validateLead({ ...freeAnalysis, [HONEYPOT_FIELD]: "https://spam.example" });
    assert.equal(result.ok, false);
    assert.equal(result.code, "honeypot");
  });

  it("rejects an unknown source and unknown keys", () => {
    assert.equal(validateLead({ ...freeAnalysis, source: "newsletter" }).ok, false);
    assert.equal(validateLead({
      ...gbp,
      payload: { ...gbp.payload, monthly_budget: "$500" },
    }).field, "monthly_budget");
  });

  it("rejects a free-analysis timeline that the buttons do not offer", () => {
    const result = validateLead({
      ...freeAnalysis,
      payload: { ...freeAnalysis.payload, timeline: "Immediately" },
    });
    assert.equal(result.ok, false);
    assert.equal(result.field, "timeline");
  });

  it("adds https when a website is typed without a scheme", () => {
    const result = validateLead(envelope("gbp", { ...gbpFields, website: "example.com/path" }));
    assert.equal(result.ok, true);
    assert.equal(result.lead.website, "https://example.com/path");
  });

  it("does not require google_maps_url because that input is not marked required", () => {
    const payload = { ...freeFields };
    delete payload.google_maps_url;
    assert.equal(validateLead(envelope("free-analysis", payload)).ok, true);
  });

  it("records the Slack channel as verified and mail transport as unchosen", () => {
    assert.equal(SLACK_INBOUND_ALERTS.id, "C0BJZD8LNPM");
    assert.equal(SLACK_INBOUND_ALERTS.liveVerified, true);
    assert.equal(SLACK_INBOUND_ALERTS.sendImplemented, false);
    assert.equal(MAIL_TRANSPORT.chosen, null);
    assert.equal(MAIL_TRANSPORT.vaultContactId, "3289329");
    assert.equal(CRM_SCHEMA.liveVerified, true);
    assert.equal(CRM_SCHEMA.hypothesis, "crm_lead_plus_contact");
    assert.equal(CRM_SCHEMA.orgId, "0ba2a2de-e31d-4f41-8005-4edfadbaed98");
    assert.equal(CRM_SCHEMA.statusNewId, "640c5886-fe70-43c8-b71d-559c0c82295c");
    assert.equal(CRM_SCHEMA.doNotWrite.includes("prospects"), true);
    assert.equal(CRM_SCHEMA.doNotWrite.includes("website_strategy_application"), true);
    assert.equal(CRM_SCHEMA.doNotWrite.includes("akw_website_lead"), true);
  });
});

describe("verifyTurnstile", () => {
  it("does not call siteverify when the secret is unset", async () => {
    let called = false;
    const result = await verifyTurnstile({
      token: "token-ok",
      secret: "",
      fetchImpl: async () => {
        called = true;
        return { ok: true, json: async () => ({ success: true }) };
      },
    });
    assert.equal(result.code, "turnstile_unconfigured");
    assert.equal(called, false);
  });

  it("posts the token to the Cloudflare siteverify URL", async () => {
    const { fetchImpl, calls } = siteverifyFetch(true);
    const result = await verifyTurnstile({
      token: "token-ok",
      secret: "server-secret",
      remoteIp: "203.0.113.5",
      hostnames: ["akwmarketing.pages.dev"],
      fetchImpl,
    });
    assert.equal(result.ok, true);
    assert.equal(calls.length, 1);
    assert.equal(calls[0].url, TURNSTILE_SITEVERIFY_URL);
    const body = new URLSearchParams(calls[0].init.body);
    assert.equal(body.get("secret"), "server-secret");
    assert.equal(body.get("response"), "token-ok");
    assert.equal(body.get("remoteip"), "203.0.113.5");
  });

  it("rejects a token issued for a hostname outside the allowlist", async () => {
    const { fetchImpl } = siteverifyFetch(true, "evil.example");
    const result = await verifyTurnstile({
      token: "token-ok",
      secret: "server-secret",
      fetchImpl,
    });
    assert.equal(result.code, "turnstile_hostname");
  });

  it("fails closed when siteverify says the token is bad", async () => {
    const { fetchImpl } = siteverifyFetch(false);
    const result = await verifyTurnstile({
      token: "token-bad",
      secret: "server-secret",
      fetchImpl,
    });
    assert.equal(result.code, "turnstile_failed");
  });
});

const STORE_ENV = {
  TURNSTILE_SECRET: "server-secret",
  SUPABASE_URL: "https://hzllfwqnsiirlwacaitt.supabase.co",
  SUPABASE_SERVICE_ROLE_KEY: "service-role-test",
};

const LEAD_ID = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
const CONTACT_ID = "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb";

function jsonResponse(status, payload) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => payload,
  };
}

function crmFetch({ phoneStatus = 201, contactStatus = 201, leadStatus = 201, patchStatus = 204 } = {}) {
  const calls = [];
  const fetchImpl = async (url, init) => {
    const href = String(url);
    calls.push({ url: href, init });
    if (href === TURNSTILE_SITEVERIFY_URL) {
      return jsonResponse(200, { success: true, hostname: "akwmarketing.pages.dev" });
    }
    const path = new URL(href).pathname;
    const method = init && init.method;
    if (method === "POST" && path.endsWith("/crm_lead")) {
      return jsonResponse(leadStatus, leadStatus < 300 ? [{ id: LEAD_ID }] : { message: "duplicate key secret-leak" });
    }
    if (method === "POST" && path.endsWith("/crm_contact")) {
      return jsonResponse(contactStatus, contactStatus < 300 ? [{ id: CONTACT_ID }] : { message: "contact failed secret-leak" });
    }
    if (method === "POST" && path.endsWith("/crm_contact_email")) {
      return jsonResponse(201, [{ id: "cccccccc-cccc-4ccc-8ccc-cccccccccccc" }]);
    }
    if (method === "POST" && path.endsWith("/crm_contact_phone")) {
      return jsonResponse(phoneStatus, phoneStatus < 300 ? [{ id: "dddddddd-dddd-4ddd-8ddd-dddddddddddd" }] : { message: "phone_e164 check secret-leak" });
    }
    if (method === "PATCH" || method === "DELETE") {
      return jsonResponse(patchStatus, {});
    }
    return jsonResponse(404, { message: "prospects secret-leak" });
  };
  return { fetchImpl, calls };
}

function posted(calls, table) {
  return calls.filter((call) => {
    const method = call.init && call.init.method;
    return method === "POST" && new URL(call.url).pathname.endsWith(`/${table}`);
  });
}

function bodyOf(call) {
  return JSON.parse(call.init.body);
}

describe("persistLead", () => {
  it("normalizes a 10-digit North American number and skips the rest", () => {
    assert.equal(normalizePhoneE164("(519) 555-0100"), "+15195550100");
    assert.equal(normalizePhoneE164("1-519-555-0100"), "+15195550100");
    assert.equal(normalizePhoneE164("555-0100"), null);
    assert.equal(normalizePhoneE164("+44 7911 123456"), null);
  });

  it("maps a free-analysis lead onto crm_lead and skips a short phone", () => {
    const lead = validateLead(freeAnalysis).lead;
    const rows = buildLeadInsert(lead);
    assert.equal(rows.lead.org_id, CRM_SCHEMA.orgId);
    assert.equal(rows.lead.status_id, CRM_SCHEMA.statusNewId);
    assert.equal(rows.lead.source, "website:free-analysis");
    assert.equal(rows.lead.name, "Analytical Engines");
    assert.equal(rows.lead.website, "https://example.com");
    assert.equal(rows.lead.domain, "example.com");
    assert.equal(rows.lead.emailable, true);
    assert.equal(rows.lead.callable, true);
    assert.equal(rows.lead.custom.timeline, "Today");
    assert.equal(rows.lead.custom.google_maps_url, "https://maps.example.com/place");
    assert.equal(rows.lead.custom.phone, "555-0100");
    assert.equal(rows.lead.custom.form_path, "/free-analysis");
    assert.equal(rows.contact.name, "Ada Lovelace");
    assert.equal(rows.email.email, "ada@example.com");
    assert.equal(rows.phone, null);
    assert.equal(JSON.stringify(rows).includes("prospects"), false);
  });

  it("strips www and stores a gbp phone as E.164", () => {
    const lead = validateLead(envelope("gbp", {
      ...gbpFields,
      phone: "5195550100",
      website: "https://www.Example.com/about",
      gbp_link: "https://maps.example.com/gbp",
    })).lead;
    const rows = buildLeadInsert(lead);
    assert.equal(rows.lead.source, "website:gbp");
    assert.equal(rows.lead.domain, "example.com");
    assert.equal(rows.lead.custom.form_path, "/gbp");
    assert.equal(rows.lead.custom.gbp_link, "https://maps.example.com/gbp");
    assert.equal(rows.contact.name, "Ada Lovelace");
    assert.equal(rows.phone.phone_e164, "+15195550100");
  });

  it("inserts the lead, contact, and email, then patches flags", async () => {
    const { fetchImpl, calls } = crmFetch();
    const saved = await persistLead(validateLead(freeAnalysis).lead, {
      env: STORE_ENV,
      fetchImpl,
    });
    assert.equal(saved.ok, true);
    assert.equal(saved.lead_id, LEAD_ID);
    assert.equal(posted(calls, "crm_lead").length, 1);
    assert.equal(posted(calls, "crm_contact").length, 1);
    assert.equal(posted(calls, "crm_contact_email").length, 1);
    assert.equal(posted(calls, "crm_contact_phone").length, 0);
    const leadCall = posted(calls, "crm_lead")[0];
    assert.equal(leadCall.init.headers.authorization, "Bearer service-role-test");
    assert.equal(leadCall.init.headers.apikey, "service-role-test");
    assert.equal(bodyOf(posted(calls, "crm_contact")[0]).lead_id, LEAD_ID);
    const patch = calls.find((call) => call.init.method === "PATCH");
    assert.deepEqual(bodyOf(patch), { emailable: true, callable: true });
    assert.equal(calls.some((call) => call.url.includes("prospects")), false);
    assert.equal(calls.some((call) => call.url.includes("website_strategy_application")), false);
  });

  it("accepts SUPABASE_SERVICE_KEY and ignores VITE_ names", async () => {
    const { fetchImpl, calls } = crmFetch();
    const saved = await persistLead(validateLead(gbp).lead, {
      env: {
        SUPABASE_URL: "https://hzllfwqnsiirlwacaitt.supabase.co/",
        SUPABASE_SERVICE_KEY: "alt-service-test",
        VITE_SUPABASE_URL: "https://vite.example",
        VITE_SUPABASE_SERVICE_ROLE_KEY: "vite-secret",
      },
      fetchImpl,
    });
    assert.equal(saved.stored, true);
    assert.equal(calls[0].url.startsWith("https://hzllfwqnsiirlwacaitt.supabase.co/rest/v1/"), true);
    assert.equal(calls[0].init.headers.authorization, "Bearer alt-service-test");
    assert.equal(JSON.stringify(calls).includes("vite.example"), false);
    assert.equal(JSON.stringify(calls).includes("vite-secret"), false);
  });

  it("keeps the lead when the phone row hits a constraint", async () => {
    const { fetchImpl, calls } = crmFetch({ phoneStatus: 400 });
    const lead = validateLead(envelope("gbp", { ...gbpFields, phone: "5195550100" })).lead;
    const saved = await persistLead(lead, { env: STORE_ENV, fetchImpl });
    assert.equal(saved.stored, true);
    assert.equal(saved.lead_id, LEAD_ID);
    assert.equal(calls.some((call) => call.init.method === "DELETE"), false);
    assert.equal(JSON.stringify(saved).includes("secret-leak"), false);
  });

  it("deletes the lead and hides database text when the contact insert fails", async () => {
    const { fetchImpl, calls } = crmFetch({ contactStatus: 500 });
    const saved = await persistLead(validateLead(freeAnalysis).lead, {
      env: STORE_ENV,
      fetchImpl,
    });
    assert.deepEqual(saved, { ok: false, stored: false, code: "store_failed" });
    assert.equal(calls.some((call) => call.init.method === "DELETE" && call.url.includes(LEAD_ID)), true);
    assert.equal(JSON.stringify(saved).includes("secret-leak"), false);
  });

  it("does not call the database when the service role is missing", async () => {
    let called = false;
    const saved = await persistLead(validateLead(freeAnalysis).lead, {
      env: { VITE_SUPABASE_URL: "https://hzllfwqnsiirlwacaitt.supabase.co" },
      fetchImpl: async () => {
        called = true;
        return jsonResponse(200, []);
      },
    });
    assert.equal(saved.code, "store_unconfigured");
    assert.equal(called, false);
  });
});

describe("notifications stay off", () => {
  it("builds a Slack payload for the inbound channel and does not post it from dispatch", async () => {
    const payload = slackInboundPayload({
      leadId: LEAD_ID,
      source: "free-analysis",
      businessName: "Analytical Engines",
    });
    assert.equal(payload.channel, "C0BJZD8LNPM");
    let postedTo = "";
    const sent = await postSlackWebhook({
      webhookUrl: "https://hooks.example.test/webhook",
      payload,
      fetchImpl: async (url) => {
        postedTo = url;
        return jsonResponse(200, { ok: true });
      },
    });
    assert.equal(sent.sent, true);
    assert.equal(postedTo, "https://hooks.example.test/webhook");

    let called = false;
    const planned = await dispatchNotifications({
      env: {
        LEAD_NOTIFY_SLACK: "true",
        LEAD_NOTIFY_EMAIL: "true",
        SLACK_WEBHOOK_URL: "https://hooks.example.test/webhook",
        LEAD_NOTIFY_EMAIL_TO: "alerts@example.com",
      },
      lead: { source: "free-analysis", business_name: "Analytical Engines" },
      leadId: LEAD_ID,
      fetchImpl: async () => {
        called = true;
        return jsonResponse(200, {});
      },
    });
    assert.equal(planned.notified, false);
    assert.equal(planned.code, "notify_not_implemented");
    assert.equal(planEmailNotification({ LEAD_NOTIFY_EMAIL: "true" }).code, "email_transport_unchosen");
    assert.equal(called, false);
  });
});

describe("handleLeadRequest", () => {
  it("stores a valid free-analysis lead and does not notify", async () => {
    const { fetchImpl, calls } = crmFetch();
    const result = await handleLeadRequest(freeAnalysis, {
      env: STORE_ENV,
      fetchImpl,
    });
    assert.equal(result.status, 200);
    assert.deepEqual(result.body, {
      ok: true,
      stored: true,
      lead_id: LEAD_ID,
      notified: false,
    });
    assert.equal(calls[0].url, TURNSTILE_SITEVERIFY_URL);
    assert.equal(JSON.stringify(result.body).includes("Ada"), false);
    assert.equal(JSON.stringify(result.body).includes("service-role-test"), false);
  });

  it("stores a valid gbp lead with an E.164 phone", async () => {
    const { fetchImpl, calls } = crmFetch();
    const result = await handleLeadRequest(envelope("gbp", { ...gbpFields, phone: "5195550100" }), {
      env: STORE_ENV,
      fetchImpl,
    });
    assert.equal(result.body.stored, true);
    assert.equal(result.body.lead_id, LEAD_ID);
    assert.equal(bodyOf(posted(calls, "crm_contact_phone")[0]).phone_e164, "+15195550100");
    assert.equal(bodyOf(posted(calls, "crm_lead")[0]).source, "website:gbp");
  });

  it("fails closed before the database when Supabase env is missing", async () => {
    const { fetchImpl, calls } = siteverifyFetch(true);
    const result = await handleLeadRequest(freeAnalysis, {
      env: { TURNSTILE_SECRET: "server-secret" },
      fetchImpl,
    });
    assert.equal(result.status, 503);
    assert.equal(result.body.code, "store_unconfigured");
    assert.equal(result.body.stored, false);
    assert.equal(calls.length, 1);
    assert.equal(calls[0].url, TURNSTILE_SITEVERIFY_URL);
  });

  it("returns 500 without database text when the insert fails", async () => {
    const { fetchImpl } = crmFetch({ leadStatus: 500 });
    const result = await handleLeadRequest(freeAnalysis, {
      env: STORE_ENV,
      fetchImpl,
    });
    assert.equal(result.status, 500);
    assert.equal(result.body.stored, false);
    assert.equal(result.body.ok, false);
    assert.equal(JSON.stringify(result.body).includes("secret-leak"), false);
    assert.equal(JSON.stringify(result.body).includes("duplicate"), false);
  });

  it("stops before siteverify when the honeypot is filled", async () => {
    let called = false;
    const result = await handleLeadRequest(
      { ...gbp, [HONEYPOT_FIELD]: "bot" },
      {
        env: { TURNSTILE_SECRET: "server-secret" },
        fetchImpl: async () => {
          called = true;
          return { ok: true, json: async () => ({ success: true }) };
        },
      },
    );
    assert.equal(result.status, 400);
    assert.equal(result.body.code, "honeypot");
    assert.equal(called, false);
  });

  it("does not send when notification flags and a webhook URL are set", async () => {
    const { fetchImpl, calls } = crmFetch();
    const flags = planNotifications({
      LEAD_NOTIFY_SLACK: "true",
      LEAD_NOTIFY_EMAIL: "true",
    });
    assert.equal(flags.code, "notify_not_implemented");
    const result = await handleLeadRequest(freeAnalysis, {
      env: {
        ...STORE_ENV,
        LEAD_NOTIFY_SLACK: "true",
        LEAD_NOTIFY_EMAIL: "true",
        SLACK_WEBHOOK_URL: "https://hooks.example.test/webhook",
        LEAD_NOTIFY_EMAIL_TO: "alerts@example.com",
      },
      fetchImpl,
    });
    assert.equal(result.body.notified, false);
    assert.equal(result.body.stored, true);
    assert.equal(result.body.notifications, undefined);
    assert.equal(calls.some((call) => call.url.includes("hooks.example.test")), false);
    assert.equal(calls.some((call) => call.url.includes("slack.com")), false);
  });

  it("fails closed when the Turnstile secret is absent", async () => {
    let called = false;
    const result = await handleLeadRequest(freeAnalysis, {
      env: {},
      fetchImpl: async () => {
        called = true;
        return { ok: true, json: async () => ({ success: true }) };
      },
    });
    assert.equal(result.status, 503);
    assert.equal(result.body.code, "turnstile_unconfigured");
    assert.equal(result.body.stored, false);
    assert.equal(called, false);
  });

  it("allows only the Pages preview origin", () => {
    assert.equal(
      ALLOWED_ORIGIN,
      "https://akwmarketing.pages.dev",
    );
  });
});

describe("browser capture URL", () => {
  it("defaults the preview production URL and stays empty in dev", () => {
    assert.equal(resolveLeadCaptureUrl(undefined, { production: false }), "");
    assert.equal(
      resolveLeadCaptureUrl(undefined, { production: true }),
      DEFAULT_LEAD_CAPTURE_URL,
    );
    assert.equal(
      resolveLeadCaptureUrl(" https://example.test/fn ", { production: true }),
      "https://example.test/fn",
    );
    assert.equal(DEFAULT_LEAD_CAPTURE_URL.includes("website-lead-capture"), true);
  });

  it("posts when a capture URL is set and stays quiet when it is not", async () => {
    const quiet = await submitLeadCapture({
      source: "gbp",
      payload: gbpFields,
      turnstileToken: "token-ok",
      honeypot: "",
      endpoint: "",
      fetchImpl: async () => {
        throw new Error("should not post");
      },
    });
    assert.equal(quiet.message, LEAD_CAPTURE_UNAVAILABLE);

    let sent;
    const saved = await submitLeadCapture({
      source: "gbp",
      payload: gbpFields,
      turnstileToken: "token-ok",
      honeypot: "",
      endpoint: DEFAULT_LEAD_CAPTURE_URL,
      fetchImpl: async (url, init) => {
        sent = { url, init };
        return {
          ok: true,
          json: async () => ({ ok: true, stored: true, lead_id: LEAD_ID, notified: false }),
        };
      },
    });
    assert.equal(saved.ok, true);
    assert.equal(saved.message, LEAD_CAPTURE_RECEIVED);
    assert.equal(sent.url, DEFAULT_LEAD_CAPTURE_URL);
    const body = JSON.parse(sent.init.body);
    assert.equal(body.source, "gbp");
    assert.equal(body["cf-turnstile-response"], "token-ok");
    assert.equal(body.honeypot, "");
    assert.equal(body.payload.business_name, "Analytical Engines");

    const failed = await submitLeadCapture({
      source: "gbp",
      payload: gbpFields,
      endpoint: DEFAULT_LEAD_CAPTURE_URL,
      fetchImpl: async () => ({
        ok: false,
        json: async () => ({ code: "store_failed", message: "duplicate key secret-leak" }),
      }),
    });
    assert.equal(failed.ok, false);
    assert.equal(failed.message, LEAD_CAPTURE_FAILED);
    assert.equal(failed.message.includes("secret-leak"), false);
  });
});
