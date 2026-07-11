import React from "react";
import { GraduationCap, ArrowRight } from "lucide-react";

export default function SkipTheWorkCard() {
  const points = [
    "Google Business Profile optimization",
    "Backend website fixes",
    "Local authority building",
  ];

  return (
    <div className="bg-white rounded-3xl border border-stone-200/70 p-8 md:p-12 shadow-sm text-center">
      <div className="flex justify-center mb-6">
        <div className="w-14 h-14 rounded-xl bg-stone-900 flex items-center justify-center">
          <GraduationCap className="w-7 h-7 text-white" />
        </div>
      </div>

      <span className="inline-flex items-center bg-stone-100 text-stone-500 rounded-full px-3 py-1 text-xs font-medium mb-5">
        Skip The Work
      </span>

      <h2 className="text-2xl md:text-3xl font-bold text-stone-900 tracking-tight mb-4">
        Want Us To <span className="italic">Do</span> This For You?
      </h2>

      <p className="text-stone-500 text-sm leading-relaxed max-w-md mx-auto mb-6">
        These tips will get you started, but ranking in the top 3 takes a full strategy.
      </p>

      <ul className="text-left space-y-2 max-w-sm mx-auto mb-6">
        {points.map((p) => (
          <li key={p} className="flex items-start gap-2 text-sm text-stone-700">
            <span className="text-stone-900 mt-0.5">•</span>
            <span>{p}</span>
          </li>
        ))}
      </ul>

      <p className="text-stone-500 text-sm leading-relaxed max-w-md mx-auto mb-8">
        We handle all of it. If you'd rather skip the work and let us take care of it, click the link below.
      </p>

      <a
        href="/gbp"
        className="inline-flex items-center gap-2 bg-stone-900 hover:bg-stone-800 text-white font-semibold px-8 py-4 rounded-full text-sm transition-colors"
      >
        See How We Get You to The Top 3
        <ArrowRight className="w-4 h-4" />
      </a>
    </div>
  );
}