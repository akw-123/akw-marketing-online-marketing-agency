/**
 * HTTP adapter. Not deployed from this repo.
 * Saves a lead when SUPABASE_URL and the service role key are set.
 * Slack and email send only when their flags are true and the matching secret is set.
 */
import { handleLeadRequest, corsHeaders } from "../_shared/leadIntake.mjs";

function json(body: unknown, status: number, origin: string | null) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      ...corsHeaders(origin),
    },
  });
}

Deno.serve(async (req) => {
  const origin = req.headers.get("origin");
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders(origin) });
  }
  if (req.method !== "POST") {
    return json({ ok: false, stored: false, notified: false, code: "method_not_allowed" }, 405, origin);
  }
  if (origin !== "https://akwmarketing.pages.dev") {
    return json({ ok: false, stored: false, notified: false, code: "origin" }, 403, origin);
  }

  let body: unknown = null;
  try {
    body = await req.json();
  } catch {
    body = null;
  }

  const result = await handleLeadRequest(body, {
    env: {
      TURNSTILE_SECRET: Deno.env.get("TURNSTILE_SECRET") ?? "",
      TURNSTILE_HOSTNAMES: Deno.env.get("TURNSTILE_HOSTNAMES") ?? "",
      LEAD_NOTIFY_SLACK: Deno.env.get("LEAD_NOTIFY_SLACK") ?? "",
      LEAD_NOTIFY_EMAIL: Deno.env.get("LEAD_NOTIFY_EMAIL") ?? "",
      LEAD_NOTIFY_EMAIL_TO: Deno.env.get("LEAD_NOTIFY_EMAIL_TO") ?? "",
      GMAIL_CLIENT_ID: Deno.env.get("GMAIL_CLIENT_ID") ?? "",
      GMAIL_CLIENT_SECRET: Deno.env.get("GMAIL_CLIENT_SECRET") ?? "",
      GMAIL_REFRESH_TOKEN: Deno.env.get("GMAIL_REFRESH_TOKEN") ?? "",
      GMAIL_SENDER: Deno.env.get("GMAIL_SENDER") ?? "",
      SLACK_BOT_TOKEN: Deno.env.get("SLACK_BOT_TOKEN") ?? "",
      SLACK_INBOUND_ALERTS_CHANNEL_ID: Deno.env.get("SLACK_INBOUND_ALERTS_CHANNEL_ID") ?? "",
      SLACK_WEBHOOK_URL: Deno.env.get("SLACK_WEBHOOK_URL") ?? "",
      SUPABASE_URL: Deno.env.get("SUPABASE_URL") ?? "",
      SUPABASE_SERVICE_ROLE_KEY: Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      SUPABASE_SERVICE_KEY: Deno.env.get("SUPABASE_SERVICE_KEY") ?? "",
    },
    fetchImpl: globalThis.fetch,
    remoteIp: req.headers.get("cf-connecting-ip") ?? "",
  });
  return json(result.body, result.status, origin);
});
