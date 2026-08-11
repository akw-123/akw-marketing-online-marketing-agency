import React from "react";
import { motion } from "framer-motion";
import { MapPin, ArrowRight } from "lucide-react";

const AREAS = [
  { name: "Kitchener", href: "/kitchener" },
  { name: "Waterloo", href: "/waterloo" },
  { name: "Cambridge", href: "/cambridge" },
  { name: "Guelph", href: "/guelph" },
  { name: "Stratford", href: "/stratford" },
  { name: "Brantford", href: "/brantford" },
  { name: "Hamilton", href: "/hamilton" },
  { name: "Burlington", href: "/burlington" },
];

export default function WhereWeWork({ currentCity }) {
  return (
    <section className="py-20 md:py-28 px-6 border-t border-stone-200/60">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="inline-flex items-center gap-2 bg-white border border-stone-200 rounded-full px-4 py-1.5 text-xs font-medium text-stone-600 mb-6">
            <MapPin className="w-3 h-3" />
            Where We Work
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-stone-900 tracking-tight">
            Ontario Cities We{" "}
            <span
              className="italic font-bold"
              style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
            >
              Serve
            </span>
          </h2>
          <p className="mt-4 text-stone-500 max-w-xl mx-auto text-sm">
            Based in Kitchener, we deliver our Local SEO Top 3 Ranking playbook to businesses across the region.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {AREAS.map((area) => {
            const isCurrent = area.name === currentCity;
            if (isCurrent) {
              return (
                <div
                  key={area.name}
                  aria-current="page"
                  className="bg-stone-900/5 border border-stone-300/60 rounded-xl px-5 py-4 flex items-center justify-between"
                >
                  <span className="text-sm font-bold text-stone-900">{area.name}</span>
                  <MapPin className="w-4 h-4 text-stone-700" />
                </div>
              );
            }
            return (
              <a
                key={area.name}
                href={area.href}
                className="group bg-white/70 backdrop-blur-sm border border-stone-200/60 rounded-xl px-5 py-4 flex items-center justify-between hover:shadow-md hover:border-stone-300 transition-all duration-300"
              >
                <span className="text-sm font-semibold text-stone-900 group-hover:text-stone-700 transition-colors">
                  {area.name}
                </span>
                <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-stone-900 group-hover:translate-x-0.5 transition-all" />
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}