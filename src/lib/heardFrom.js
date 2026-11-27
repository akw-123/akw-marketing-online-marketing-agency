/** Values shared by /free-analysis and /gbp. The lead function whitelists the same list. */

export const HEARD_OPTIONS = [
  "Google search",
  "Google Maps",
  "ChatGPT or another AI tool",
  "Facebook or Instagram",
  "YouTube",
  "Friend or colleague",
  "Review site or directory",
  "Reddit or a forum",
  "Other",
];

export const HEARD_DETAIL_LABELS = {
  "ChatGPT or another AI tool": "Which one, and what did you ask it?",
  Other: "Please tell us where",
};

/** Include heard_from_detail only when the follow-up is shown and not blank. */
export function withHeardFromDetail(form) {
  const payload = { ...form };
  const label = HEARD_DETAIL_LABELS[form.heard_from];
  const detail = String(form.heard_from_detail || "").trim();
  if (label && detail) payload.heard_from_detail = detail.slice(0, 200);
  else delete payload.heard_from_detail;
  return payload;
}
