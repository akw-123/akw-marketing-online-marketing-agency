import React from "react";
import { Loader2 } from "lucide-react";

const fmtPct = (r) => `${(Number(r) * 100).toFixed(1)}%`;
const fmtNum = (n) => Number(n).toLocaleString();
const fmtPos = (p) => (p == null ? "—" : Number(p).toFixed(1));

export default function TopQueriesTable({ data, loading }) {
  return (
    <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-stone-900">Top Search Queries</h3>
        <span className="text-xs text-stone-400">Google Search Console · last 30 days</span>
      </div>
      {loading ? (
        <div className="flex items-center justify-center py-10">
          <Loader2 className="w-5 h-5 animate-spin text-stone-400" />
        </div>
      ) : !data || !data.queries || data.queries.length === 0 ? (
        <p className="text-sm text-stone-500 py-6 text-center">No search query data available.</p>
      ) : (
        <>
          {data.totals && (
            <div className="flex flex-wrap gap-x-6 gap-y-2 mb-4 text-xs">
              <span className="text-stone-500">Total clicks: <span className="font-semibold text-stone-900">{fmtNum(data.totals.clicks)}</span></span>
              <span className="text-stone-500">Impressions: <span className="font-semibold text-stone-900">{fmtNum(data.totals.impressions)}</span></span>
              <span className="text-stone-500">Avg CTR: <span className="font-semibold text-stone-900">{fmtPct(data.totals.ctr)}</span></span>
              <span className="text-stone-500">Avg position: <span className="font-semibold text-stone-900">{fmtPos(data.totals.position)}</span></span>
            </div>
          )}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-stone-500 border-b border-stone-200">
                  <th className="pb-2 font-medium">Query</th>
                  <th className="pb-2 font-medium text-right">Clicks</th>
                  <th className="pb-2 font-medium text-right">Impr.</th>
                  <th className="pb-2 font-medium text-right">CTR</th>
                  <th className="pb-2 font-medium text-right">Position</th>
                </tr>
              </thead>
              <tbody>
                {data.queries.map((q, i) => (
                  <tr key={i} className="border-b border-stone-100 last:border-0">
                    <td className="py-2 text-stone-700 truncate max-w-xs">{q.query}</td>
                    <td className="py-2 text-right text-stone-900 font-medium">{fmtNum(q.clicks)}</td>
                    <td className="py-2 text-right text-stone-500">{fmtNum(q.impressions)}</td>
                    <td className="py-2 text-right text-stone-500">{fmtPct(q.ctr)}</td>
                    <td className="py-2 text-right text-stone-500">{fmtPos(q.position)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}