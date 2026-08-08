import React from "react";

export default function TopPagesTable({ data }) {
  return (
    <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-stone-900 mb-4">Top pages</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-stone-500 border-b border-stone-200">
              <th className="pb-2 font-medium">Page</th>
              <th className="pb-2 font-medium text-right">Pageviews</th>
              <th className="pb-2 font-medium text-right">Sessions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((p, i) => (
              <tr key={i} className="border-b border-stone-100 last:border-0">
                <td className="py-2 text-stone-700 truncate max-w-xs">{p.path}</td>
                <td className="py-2 text-right text-stone-900 font-medium">{p.pageviews.toLocaleString()}</td>
                <td className="py-2 text-right text-stone-500">{p.sessions.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}