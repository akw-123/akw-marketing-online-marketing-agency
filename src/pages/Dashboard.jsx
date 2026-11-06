import React from "react";
import { Gauge } from "lucide-react";

/**
 * The live /dashboard calls Base44 functions ga-traffic and gsc-search-queries,
 * which require an authenticated admin and Google connectors. Those functions
 * are not part of the static Pages preview.
 */
export default function Dashboard() {
  return (
    <div className="min-h-screen bg-stone-50">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-2xl font-semibold text-stone-900 flex items-center gap-2">
          <Gauge className="w-6 h-6 text-teal-700" /> Traffic Dashboard
        </h1>
        <p className="text-sm text-stone-600 mt-4 leading-relaxed">
          This preview does not load the traffic dashboard. On the live site it
          calls the Base44 functions <span className="font-medium">ga-traffic</span> and{" "}
          <span className="font-medium">gsc-search-queries</span> with an admin
          login. Those functions stay in <span className="font-medium">base44/functions</span> and
          are a later-phase blocker, not part of the public marketing pages.
        </p>
      </div>
    </div>
  );
}
