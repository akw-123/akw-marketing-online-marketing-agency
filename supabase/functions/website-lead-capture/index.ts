/**
 * HTTP adapter. Not deployed. Does not save a lead or send a notification.
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
    },
    fetchImpl: globalThis.fetch,
    remoteIp: req.headers.get("cf-connecting-ip") ?? "",
  });
  return json(result.body, result.status, origin);
});
