import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

export default function KpiCard({ label, value, delta, icon: Icon }) {
  const showDelta = delta !== null && delta !== undefined && isFinite(delta);
  const up = delta >= 0;
  return (
    <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-stone-500">{label}</p>
        {Icon ? <Icon className="w-4 h-4 text-stone-400" /> : null}
      </div>
      <p className="mt-2 text-2xl font-semibold text-stone-900">{value}</p>
      {showDelta && (
        <div className={`mt-2 flex items-center gap-1 text-xs font-medium ${up ? "text-emerald-600" : "text-rose-600"}`}>
          {up ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
          {Math.abs(delta).toFixed(1)}% vs previous
        </div>
      )}
    </div>
  );
}