import React, { useEffect, useState } from "react";
import { TURNSTILE_SITE_KEY, turnstileAllowedHost } from "@/lib/leadCaptureContract";

/**
 * Renders the public Turnstile widget on the lead-capture host allowlist
 * (www.akwmarketing.com, akwmarketing.com, and akwmarketing.pages.dev).
 * Other hosts skip it so local preview does not show a hostname error.
 * The form reads the widget token when it submits.
 */
export default function TurnstileWidget() {
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setAllowed(turnstileAllowedHost(window.location.hostname));
  }, []);

  useEffect(() => {
    if (!allowed) return undefined;
    if (document.querySelector('script[data-akw-turnstile="1"]')) return undefined;
    const script = document.createElement("script");
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
    script.async = true;
    script.defer = true;
    script.dataset.akwTurnstile = "1";
    document.head.appendChild(script);
    return undefined;
  }, [allowed]);

  if (!allowed) return null;
  return <div className="cf-turnstile mt-4" data-sitekey={TURNSTILE_SITE_KEY} />;
}
