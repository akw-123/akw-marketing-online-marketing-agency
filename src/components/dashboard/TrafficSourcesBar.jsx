import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

const COLORS = ["#0f766e", "#14b8a6", "#5eead4", "#f59e0b", "#f97316", "#6366f1", "#a855f7", "#ec4899", "#64748b", "#94a3b8"];

export default function TrafficSourcesBar({ data }) {
  return (
    <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-stone-900 mb-4">Traffic by channel</h3>
      <div style={{ width: "100%", height: 280 }}>
        <ResponsiveContainer>
          <BarChart data={data} layout="vertical" margin={{ left: 10, right: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 11 }} allowDecimals={false} />
            <YAxis type="category" dataKey="channel" tick={{ fontSize: 11 }} width={100} />
            <Tooltip />
            <Bar dataKey="sessions" radius={[0, 4, 4, 0]}>
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}