import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { HONEYPOT_FIELD as CLIENT_HONEYPOT, TURNSTILE_SITE_KEY as CLIENT_SITE_KEY, buildLeadRequest } from "../../../src/lib/leadCaptureContract.js";
import {
  ALLOWED_ORIGIN,
  CRM_SCHEMA,
  FORM_FIELDS,
  HONEYPOT_FIELD,
  MAIL_TRANSPORT,
  SLACK_INBOUND_ALERTS,
  TURNSTILE_SITEVERIFY_URL,
  TURNSTILE_SITE_KEY,
  handleLeadRequest,
  planNotifications,
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
    const result = validateLead({ ...freeAnalysis, timeline: "Immediately" });
    assert.equal(result.ok, false);
    assert.equal(result.field, "timeline");
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
    assert.equal(CRM_SCHEMA.liveVerified, false);
    assert.equal(CRM_SCHEMA.doNotWrite.includes("prospects"), true);
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

describe("handleLeadRequest", () => {
  it("does not store or notify a valid free-analysis lead", async () => {
    const { fetchImpl, calls } = siteverifyFetch(true);
    const result = await handleLeadRequest(freeAnalysis, {
      env: { TURNSTILE_SECRET: "server-secret" },
      fetchImpl,
    });
    assert.equal(result.status, 503);
    assert.equal(result.body.stored, false);
    assert.equal(result.body.notified, false);
    assert.equal(result.body.ok, false);
    assert.equal(result.body.code, "crm_schema_unverified");
    assert.equal(result.body.notifications, "notifications_disabled");
    assert.equal(calls.length, 1);
    assert.equal(calls[0].url, TURNSTILE_SITEVERIFY_URL);
    assert.equal(JSON.stringify(result.body).includes("Ada"), false);
  });

  it("does not store a valid gbp lead", async () => {
    const { fetchImpl } = siteverifyFetch(true);
    const result = await handleLeadRequest(gbp, {
      env: { TURNSTILE_SECRET: "server-secret" },
      fetchImpl,
    });
    assert.equal(result.body.code, "crm_schema_unverified");
    assert.equal(result.body.stored, false);
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

  it("does not send when notification flags are turned on", async () => {
    const { fetchImpl, calls } = siteverifyFetch(true);
    const flags = planNotifications({
      LEAD_NOTIFY_SLACK: "true",
      LEAD_NOTIFY_EMAIL: "true",
    });
    assert.equal(flags.code, "notify_not_implemented");
    const result = await handleLeadRequest(freeAnalysis, {
      env: {
        TURNSTILE_SECRET: "server-secret",
        LEAD_NOTIFY_SLACK: "true",
        LEAD_NOTIFY_EMAIL: "true",
      },
      fetchImpl,
    });
    assert.equal(result.body.notified, false);
    assert.equal(result.body.notifications, "notify_not_implemented");
    assert.equal(result.body.stored, false);
    assert.deepEqual(calls.map((call) => call.url), [TURNSTILE_SITEVERIFY_URL]);
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
