import React, { useState, useEffect, useCallback } from "react";
import { base44 } from "@/api/base44Client";
import { Users, MousePointerClick, Eye, UserPlus, Clock, Activity, LogIn, ShieldAlert, Loader2, Gauge } from "lucide-react";
import KpiCard from "@/components/dashboard/KpiCard";
import TrafficLineChart from "@/components/dashboard/TrafficLineChart";
import TrafficSourcesBar from "@/components/dashboard/TrafficSourcesBar";
import TopPagesTable from "@/components/dashboard/TopPagesTable";
import TopQueriesTable from "@/components/dashboard/TopQueriesTable";
import MonthlyTrafficChart from "@/components/dashboard/MonthlyTrafficChart";

const pctChange = (curr, prev) => {
  if (prev === 0 || prev == null) return null;
  return ((curr - prev) / prev) * 100;
};
const fmtNum = (n) => (n == null ? "—" : Number(n).toLocaleString());
const fmtDuration = (s) => {
  if (s == null) return "—";
  const m = Math.floor(s / 60);
  const sec = Math.round(s % 60);
  return m > 0 ? `${m}m ${sec}s` : `${sec}s`;
};
const fmtRate = (r) => (r == null ? "—" : `${(r * 100).toFixed(1)}%`);

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [authState, setAuthState] = useState(null);
  const [properties, setProperties] = useState([]);
  const [propertyId, setPropertyId] = useState(null);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [queries, setQueries] = useState(null);
  const [queriesLoading, setQueriesLoading] = useState(true);

  const handleRes = useCallback((res) => {
    if (res.status === 401) { setAuthState("login"); return false; }
    if (res.status === 403) { setAuthState("forbidden"); return false; }
    if (res.status !== 200) { setError(res.data?.error || "Something went wrong"); return false; }
    return true;
  }, []);

  const loadProperties = useCallback(async () => {
    setLoading(true);
    const res = await base44.functions.invoke("ga-traffic", {});
    setLoading(false);
    if (!handleRes(res)) return;
    const props = res.data.properties || [];
    setProperties(props);
    if (props.length === 1) setPropertyId(props[0].propertyId);
  }, [handleRes]);

  const loadData = useCallback(async (pid) => {
    setLoading(true);
    setError(null);
    const res = await base44.functions.invoke("ga-traffic", { propertyId: pid, days: 30 });
    setLoading(false);
    if (!handleRes(res)) return;
    setData(res.data);
  }, [handleRes]);

  useEffect(() => { loadProperties(); }, [loadProperties]);
  useEffect(() => { if (propertyId) loadData(propertyId); }, [propertyId, loadData]);
  useEffect(() => {
    base44.functions.invoke("gsc-search-queries", {}).then((res) => {
      setQueriesLoading(false);
      if (res.status === 200) setQueries(res.data);
    }).catch(() => setQueriesLoading(false));
  }, []);

  if (authState === "login") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-stone-50 px-6">
        <LogIn className="w-10 h-10 text-stone-400" />
        <p className="text-stone-600">Sign in to view your traffic dashboard.</p>
        <button onClick={() => base44.auth.redirectToLogin()} className="px-4 py-2 rounded-lg bg-stone-900 text-white text-sm font-medium hover:bg-stone-700">Sign in</button>
      </div>
    );
  }
  if (authState === "forbidden") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-stone-50 px-6">
        <ShieldAlert className="w-10 h-10 text-stone-400" />
        <p className="text-stone-600">This dashboard is restricted to admins.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-stone-900 flex items-center gap-2">
              <Gauge className="w-6 h-6 text-teal-700" /> Traffic Dashboard
            </h1>
            <p className="text-sm text-stone-500 mt-1">Google Analytics · last 30 days</p>
          </div>
          {properties.length > 1 && (
            <select
              value={propertyId || ""}
              onChange={(e) => setPropertyId(e.target.value)}
              className="rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm"
            >
              {properties.map((p) => (
                <option key={p.propertyId} value={p.propertyId}>{p.displayName}</option>
              ))}
            </select>
          )}
        </div>

        {error && (
          <div className="rounded-lg border border-rose-200 bg-rose-50 text-rose-700 text-sm p-4 mb-6">{error}</div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-6 h-6 animate-spin text-stone-400" />
          </div>
        ) : data ? (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
              <KpiCard label="Sessions" value={fmtNum(data.current.sessions)} delta={pctChange(data.current.sessions, data.previous.sessions)} icon={MousePointerClick} />
              <KpiCard label="Users" value={fmtNum(data.current.users)} delta={pctChange(data.current.users, data.previous.users)} icon={Users} />
              <KpiCard label="Pageviews" value={fmtNum(data.current.pageviews)} delta={pctChange(data.current.pageviews, data.previous.pageviews)} icon={Eye} />
              <KpiCard label="New Users" value={fmtNum(data.current.newUsers)} delta={pctChange(data.current.newUsers, data.previous.newUsers)} icon={UserPlus} />
              <KpiCard label="Avg Session" value={fmtDuration(data.current.avgSessionDuration)} delta={pctChange(data.current.avgSessionDuration, data.previous.avgSessionDuration)} icon={Clock} />
              <KpiCard label="Engagement" value={fmtRate(data.current.engagementRate)} delta={pctChange(data.current.engagementRate, data.previous.engagementRate)} icon={Activity} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
              <TrafficLineChart data={data.series} />
              <TrafficSourcesBar data={data.trafficSources} />
            </div>

            <div className="mb-6">
              <MonthlyTrafficChart data={data.monthlySeries} />
            </div>

            <TopPagesTable data={data.topPages} />
          </>
        ) : (
          <div className="text-center py-24 text-stone-500">
            <p>{properties.length === 0 ? "No Google Analytics properties found in your account." : "Select a property above."}</p>
          </div>
        )}

        <div className="mt-6">
          <TopQueriesTable data={queries} loading={queriesLoading} />
        </div>
      </div>
    </div>
  );
}