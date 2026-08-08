import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

const SITES_API = 'https://www.googleapis.com/webmasters/v3/sites';
const sitemapsApi = (siteUrl) => `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/sitemaps`;
const SLACK_POST = 'https://slack.com/api/chat.postMessage';
const SLACK_LIST = 'https://slack.com/api/conversations.list';

function buildSlackMessage(report) {
  const t = report.totals;
  const hasIssues = t.errors > 0 || t.warnings > 0;
  const statusEmoji = hasIssues ? ':warning:' : ':white_check_mark:';

  const problemSitemaps = report.sitemaps.filter((s) => s.errors > 0 || s.warnings > 0);

  const blocks = [
    { type: 'header', text: { type: 'plain_text', text: `GSC Indexing Health ${statusEmoji}` } },
    { type: 'section', text: { type: 'mrkdwn', text: `*Site:* ${report.siteUrl}` } },
    {
      type: 'section',
      fields: [
        { type: 'mrkdwn', text: `*Submitted URLs:* ${t.submitted.toLocaleString()}` },
        { type: 'mrkdwn', text: `*Indexed URLs:* ${t.indexed.toLocaleString()}` },
        { type: 'mrkdwn', text: `*Errors:* ${t.errors}` },
        { type: 'mrkdwn', text: `*Warnings:* ${t.warnings}` }
      ]
    }
  ];

  if (report.sitemaps.length === 0) {
    blocks.push({ type: 'section', text: { type: 'mrkdwn', text: '_No sitemaps submitted for this site._' } });
  } else if (problemSitemaps.length > 0) {
    blocks.push({
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: '*Sitemaps with issues:*\n' + problemSitemaps.map((s) => `• ${s.path} — ${s.errors} err, ${s.warnings} warn`).join('\n')
      }
    });
  }

  blocks.push({ type: 'context', elements: [{ type: 'mrkdwn', text: `Generated ${new Date(report.generatedAt).toUTCString()}` }] });

  const text = `${statusEmoji} GSC Indexing Health — ${report.siteUrl}\nSubmitted: ${t.submitted} | Indexed: ${t.indexed} | Errors: ${t.errors} | Warnings: ${t.warnings}`;
  return { text, blocks };
}

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);

    // Allow workflow (no user) and admin direct calls; block non-admins.
    let user = null;
    try { user = await base44.auth.me(); } catch {}
    if (user && user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });

    const payload = await req.json().catch(() => ({}));
    const { accessToken: gscToken } = await base44.asServiceRole.connectors.getConnection('google_search_console');
    const { accessToken: slackToken } = await base44.asServiceRole.connectors.getConnection('slackbot');

    // Discovery mode: no siteUrl -> list GSC sites + Slack channels
    if (!payload.siteUrl) {
      const sitesRes = await fetch(SITES_API, { headers: { Authorization: `Bearer ${gscToken}` } });
      const sitesData = sitesRes.ok ? await sitesRes.json() : { error: await sitesRes.text() };
      const sites = (sitesData.siteEntry || []).map((s) => ({ siteUrl: s.siteUrl, permissionLevel: s.permissionLevel }));

      const listRes = await fetch(`${SLACK_LIST}?types=public_channel&limit=200`, { headers: { Authorization: `Bearer ${slackToken}` } });
      const listData = listRes.ok ? await listRes.json() : { ok: false };
      const channels = (listData.channels || []).map((c) => ({ id: c.id, name: c.name, num_members: c.num_members }));

      return Response.json({ sites, channels });
    }

    // Monitor mode: fetch sitemaps for the configured site
    const siteUrl = payload.siteUrl;
    const smRes = await fetch(sitemapsApi(siteUrl), { headers: { Authorization: `Bearer ${gscToken}` } });
    if (!smRes.ok) {
      const txt = await smRes.text();
      return Response.json({ error: `Failed to fetch sitemaps for ${siteUrl} (${smRes.status}): ${txt}` }, { status: 502 });
    }
    const smData = await smRes.json();
    const sitemaps = (smData.sitemap || []).map((s) => ({
      path: s.path,
      submitted: Number(s.submitted) || 0,
      indexed: Number(s.indexed) || 0,
      errors: Number(s.errors) || 0,
      warnings: Number(s.warnings) || 0,
      isPending: s.isPending,
      lastDownloaded: s.lastDownloaded,
      lastSubmitted: s.lastSubmitted
    }));

    const totals = sitemaps.reduce(
      (acc, s) => {
        acc.submitted += s.submitted;
        acc.indexed += s.indexed;
        acc.errors += s.errors;
        acc.warnings += s.warnings;
        return acc;
      },
      { submitted: 0, indexed: 0, errors: 0, warnings: 0 }
    );

    const report = { siteUrl, sitemaps, totals, generatedAt: new Date().toISOString() };

    // Post digest to Slack if a channel is provided
    if (payload.channel) {
      const message = buildSlackMessage(report);
      const postRes = await fetch(SLACK_POST, {
        method: 'POST',
        headers: { Authorization: `Bearer ${slackToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channel: payload.channel,
          text: message.text,
          blocks: message.blocks,
          username: 'GSC Index Monitor',
          icon_emoji: ':mag:'
        })
      });
      const postData = await postRes.json();
      if (!postData.ok) {
        return Response.json({ error: `Slack post failed: ${postData.error}`, report }, { status: 502 });
      }
      report.posted = true;
    }

    return Response.json(report);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}