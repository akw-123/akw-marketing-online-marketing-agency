import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

const ADMIN_API = 'https://analyticsadmin.googleapis.com/v1beta/accountSummaries';
const dataApi = (propertyId) => `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`;

function fmt(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

async function runReport(token, propertyId, body) {
  const res = await fetch(dataApi(propertyId), {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`GA report failed (${res.status}): ${txt}`);
  }
  return res.json();
}

function totals(rep) {
  const t = rep.totals && rep.totals[0] ? rep.totals[0].metricValues : [];
  const v = (i) => (t[i] ? Number(t[i].value) || 0 : 0);
  return {
    sessions: v(0),
    users: v(1),
    newUsers: v(2),
    pageviews: v(3),
    avgSessionDuration: v(4),
    engagementRate: v(5)
  };
}

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('google_analytics');
    const payload = await req.json().catch(() => ({}));
    const propertyId = payload.propertyId;

    // No property selected -> list available GA4 properties
    if (!propertyId) {
      const res = await fetch(ADMIN_API, { headers: { 'Authorization': `Bearer ${accessToken}` } });
      if (!res.ok) {
        const txt = await res.text();
        return Response.json({ error: `Failed to list GA properties (${res.status}): ${txt}` }, { status: 502 });
      }
      const data = await res.json();
      const properties = (data.accountSummaries || []).flatMap((acc) =>
        (acc.propertySummaries || [])
          .filter((p) => (p.property || '').startsWith('properties/'))
          .map((p) => ({
            propertyId: (p.property || '').replace('properties/', ''),
            displayName: p.displayName,
            account: acc.displayName
          }))
      );
      return Response.json({ properties });
    }

    const days = Number(payload.days) || 30;
    const today = new Date();
    const end = fmt(today);
    const startCurrent = fmt(new Date(today.getTime() - (days - 1) * 86400000));
    const endPrev = fmt(new Date(today.getTime() - days * 86400000));
    const startPrev = fmt(new Date(today.getTime() - (2 * days - 1) * 86400000));
    const startMonthly = fmt(new Date(today.getFullYear(), today.getMonth() - 11, 1));

    const [timeseries, current, previous, sources, pages, monthly] = await Promise.all([
      runReport(accessToken, propertyId, {
        dateRanges: [{ startDate: startCurrent, endDate: end }],
        dimensions: [{ name: 'date' }],
        metrics: [{ name: 'sessions' }, { name: 'totalUsers' }, { name: 'screenPageViews' }],
        orderBys: [{ dimension: { dimensionName: 'date', orderType: 'ALPHANUMERIC' } }]
      }),
      runReport(accessToken, propertyId, {
        dateRanges: [{ startDate: startCurrent, endDate: end }],
        metrics: [{ name: 'sessions' }, { name: 'totalUsers' }, { name: 'newUsers' }, { name: 'screenPageViews' }, { name: 'averageSessionDuration' }, { name: 'engagementRate' }]
      }),
      runReport(accessToken, propertyId, {
        dateRanges: [{ startDate: startPrev, endDate: endPrev }],
        metrics: [{ name: 'sessions' }, { name: 'totalUsers' }, { name: 'newUsers' }, { name: 'screenPageViews' }, { name: 'averageSessionDuration' }, { name: 'engagementRate' }]
      }),
      runReport(accessToken, propertyId, {
        dateRanges: [{ startDate: startCurrent, endDate: end }],
        dimensions: [{ name: 'sessionDefaultChannelGrouping' }],
        metrics: [{ name: 'sessions' }, { name: 'totalUsers' }],
        orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
        limit: 10
      }),
      runReport(accessToken, propertyId, {
        dateRanges: [{ startDate: startCurrent, endDate: end }],
        dimensions: [{ name: 'pagePath' }],
        metrics: [{ name: 'screenPageViews' }, { name: 'sessions' }],
        orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
        limit: 10
      }),
      runReport(accessToken, propertyId, {
        dateRanges: [{ startDate: startMonthly, endDate: end }],
        dimensions: [{ name: 'month' }],
        metrics: [{ name: 'sessions' }, { name: 'totalUsers' }, { name: 'screenPageViews' }],
        orderBys: [{ dimension: { dimensionName: 'month', orderType: 'ALPHANUMERIC' } }]
      })
    ]);

    const series = (timeseries.rows || []).map((r) => {
      const d = r.dimensionValues[0].value;
      return {
        date: `${d.slice(0, 4)}-${d.slice(4, 6)}-${d.slice(6, 8)}`,
        sessions: Number(r.metricValues[0].value) || 0,
        users: Number(r.metricValues[1].value) || 0,
        pageviews: Number(r.metricValues[2].value) || 0
      };
    });

    const trafficSources = (sources.rows || []).map((r) => ({
      channel: r.dimensionValues[0].value,
      sessions: Number(r.metricValues[0].value) || 0,
      users: Number(r.metricValues[1].value) || 0
    }));

    const topPages = (pages.rows || []).map((r) => ({
      path: r.dimensionValues[0].value,
      pageviews: Number(r.metricValues[0].value) || 0,
      sessions: Number(r.metricValues[1].value) || 0
    }));

    const monthlySeries = (monthly.rows || []).map((r) => {
      const m = r.dimensionValues[0].value;
      return {
        month: `${m.slice(0, 4)}-${m.slice(4, 6)}`,
        sessions: Number(r.metricValues[0].value) || 0,
        users: Number(r.metricValues[1].value) || 0,
        pageviews: Number(r.metricValues[2].value) || 0
      };
    });

    return Response.json({
      propertyId,
      days,
      dateRange: { start: startCurrent, end },
      series,
      current: totals(current),
      previous: totals(previous),
      trafficSources,
      topPages,
      monthlySeries
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}