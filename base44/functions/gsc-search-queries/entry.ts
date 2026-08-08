import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

const queryApi = (siteUrl) => `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`;

function fmt(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });

    const payload = await req.json().catch(() => ({}));
    const siteUrl = payload.siteUrl || 'sc-domain:akwmarketing.com';
    const days = Number(payload.days) || 30;
    const limit = Number(payload.limit) || 15;

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('google_search_console');

    // GSC data is ~2 days behind
    const today = new Date();
    const endDate = fmt(new Date(today.getTime() - 2 * 86400000));
    const startDate = fmt(new Date(today.getTime() - (days + 1) * 86400000));

    const [queriesRes, totalsRes] = await Promise.all([
      fetch(queryApi(siteUrl), {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ startDate, endDate, dimensions: ['query'], rowLimit: limit, startRow: 0 })
      }),
      fetch(queryApi(siteUrl), {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ startDate, endDate, dimensions: [], rowLimit: 1, startRow: 0 })
      })
    ]);

    if (!queriesRes.ok) {
      const txt = await queriesRes.text();
      return Response.json({ error: `Failed to fetch search queries (${queriesRes.status}): ${txt}` }, { status: 502 });
    }
    const queriesData = await queriesRes.json();
    const totalsData = totalsRes.ok ? await totalsRes.json() : { rows: [] };

    const queries = (queriesData.rows || []).map((r) => ({
      query: r.keys[0],
      clicks: r.clicks,
      impressions: r.impressions,
      ctr: r.ctr,
      position: r.position
    }));

    const totalsRow = (totalsData.rows || [])[0] || { clicks: 0, impressions: 0, ctr: 0, position: 0 };
    const totals = {
      clicks: totalsRow.clicks,
      impressions: totalsRow.impressions,
      ctr: totalsRow.ctr,
      position: totalsRow.position
    };

    return Response.json({ siteUrl, dateRange: { start: startDate, end: endDate }, queries, totals });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}