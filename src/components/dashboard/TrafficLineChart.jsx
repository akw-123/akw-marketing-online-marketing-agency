import React from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const fmtDate = (d) => {
  const parts = d.split("-");
  return `${parts[1]}/${parts[2]}`;
};

export default function TrafficLineChart({ data }) {
  return (
    <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-stone-900 mb-4">Sessions over time</h3>
      <div style={{ width: "100%", height: 280 }}>
        <ResponsiveContainer>
          <AreaChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="sessGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0f766e" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#0f766e" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
            <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={fmtDate} minTickGap={24} />
            <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
            <Tooltip labelFormatter={fmtDate} />
            <Area type="monotone" dataKey="sessions" stroke="#0f766e" strokeWidth={2} fill="url(#sessGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}