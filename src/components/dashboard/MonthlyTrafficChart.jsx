import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const fmtMonth = (m) => {
  const parts = m.split("-");
  return MONTHS[Number(parts[1]) - 1];
};

const tooltipFormatter = (value, name) => {
  const labels = { sessions: "Sessions", users: "Users", pageviews: "Pageviews" };
  return [Number(value).toLocaleString(), labels[name] || name];
};

export default function MonthlyTrafficChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-stone-900 mb-4">Monthly traffic (last 12 months)</h3>
        <p className="text-sm text-stone-400 py-20 text-center">No monthly data available.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-stone-900 mb-4">Monthly traffic (last 12 months)</h3>
      <div style={{ width: "100%", height: 280 }}>
        <ResponsiveContainer>
          <BarChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} tickFormatter={fmtMonth} />
            <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
            <Tooltip labelFormatter={fmtMonth} formatter={tooltipFormatter} />
            <Bar dataKey="sessions" fill="#0f766e" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}