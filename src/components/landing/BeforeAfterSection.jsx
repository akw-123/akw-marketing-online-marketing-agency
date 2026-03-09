import React from "react";
import { motion } from "framer-motion";
import { MapPin, BarChart3, MousePointerClick, Users, TrendingDown, TrendingUp } from "lucide-react";

// Heat map grid: 0 = red (not ranked), 1 = orange (ranked 4-10), 2 = green (top 3)
const beforeGrid = [
  [0,0,0,0,0,0,0],
  [0,0,0,1,0,0,0],
  [0,0,1,2,1,0,0],
  [0,1,2,2,2,1,0],
  [0,0,1,2,1,0,0],
  [0,0,0,1,0,0,0],
  [0,0,0,0,0,0,0],
];

const afterGrid = [
  [2,2,2,2,2,2,2],
  [2,2,2,2,2,2,2],
  [2,2,2,2,2,2,2],
  [2,2,2,2,2,2,2],
  [2,2,2,2,2,2,2],
  [2,2,2,2,2,2,2],
  [2,2,2,2,2,2,2],
];

const dotColor = {
  0: "#ef4444", // red
  1: "#f97316", // orange
  2: "#22c55e", // green
};

function HeatMap({ grid }) {
  return (
    <div className="flex flex-col items-center gap-1.5 py-2">
      {grid.map((row, ri) => (
        <div key={ri} className="flex gap-1.5">
          {row.map((val, ci) => (
            <div
              key={ci}
              className="w-7 h-7 rounded-full flex items-center justify-center text-white font-bold"
              style={{
                backgroundColor: dotColor[val],
                fontSize: "9px",
                boxShadow: val === 2 ? "0 0 6px rgba(34,197,94,0.5)" : val === 0 ? "0 0 4px rgba(239,68,68,0.3)" : "none",
              }}
            >
              {val === 0 ? "20" : val === 1 ? "5" : "1"}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default function BeforeAfterSection() {
  return (
    <section id="before-after" className="py-20 md:py-28 px-6 bg-[#FAF8F5]">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="inline-flex items-center gap-2 bg-white border border-stone-200 rounded-full px-4 py-1.5 text-xs font-medium text-stone-600 mb-6">
            Before / After
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-stone-900 tracking-tight">
            The{" "}
            <span
              className="italic font-bold"
              style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
            >
              Difference
            </span>
          </h2>
          <p className="mt-4 text-stone-500 max-w-xl mx-auto text-sm">
            Each dot represents a search from that area. Green = Top 3. Red = Invisible.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Before */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative bg-white border border-stone-200 rounded-2xl p-8 overflow-hidden"
          >
            <div className="absolute top-0 right-0 bg-red-50 text-red-500 text-xs font-semibold px-4 py-1.5 rounded-bl-xl tracking-wide">
              BEFORE
            </div>

            <div className="flex items-center gap-3 mb-5 mt-2">
              <div className="w-9 h-9 rounded-full bg-stone-100 flex items-center justify-center">
                <MapPin className="w-4 h-4 text-stone-400" />
              </div>
              <div>
                <p className="font-semibold text-stone-900 text-sm">Your Company</p>
                <p className="text-xs text-stone-400">Example Address 12, NYC</p>
              </div>
            </div>

            {/* Heat map */}
            <div className="bg-stone-50 rounded-xl p-4 mb-6 flex justify-center">
              <HeatMap grid={beforeGrid} />
            </div>

            <div className="space-y-3">
              {[
                { Icon: BarChart3, label: "Average Ranking", value: "86", color: "text-red-400" },
                { Icon: TrendingDown, label: "Marketshare", value: "1%", color: "text-red-400" },
                { Icon: MousePointerClick, label: "Clicks / Month", value: "5", color: "text-red-400" },
                { Icon: Users, label: "Customers / Month", value: "1–2", color: "text-red-400" },
              ].map(({ Icon, label, value, color }) => (
                <div key={label} className="flex items-center justify-between py-2.5 border-b border-stone-100 last:border-0">
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-stone-300" />
                    <span className="text-sm text-stone-500">{label}</span>
                  </div>
                  <span className={`text-xl font-bold ${color}`}>{value}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* After */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative bg-stone-900 border border-stone-700 rounded-2xl p-8 overflow-hidden"
          >
            <div className="absolute top-0 right-0 bg-green-500/10 text-green-400 text-xs font-semibold px-4 py-1.5 rounded-bl-xl tracking-wide">
              AFTER
            </div>

            <div className="flex items-center gap-3 mb-5 mt-2">
              <div className="w-9 h-9 rounded-full bg-stone-800 flex items-center justify-center">
                <MapPin className="w-4 h-4 text-green-400" />
              </div>
              <div>
                <p className="font-semibold text-white text-sm">Your Company</p>
                <p className="text-xs text-stone-400">Example Address 12, NYC</p>
              </div>
            </div>

            {/* Heat map */}
            <div className="bg-stone-800 rounded-xl p-4 mb-6 flex justify-center">
              <HeatMap grid={afterGrid} />
            </div>

            <div className="space-y-3">
              {[
                { Icon: BarChart3, label: "Average Ranking", value: "1", color: "text-green-400" },
                { Icon: TrendingUp, label: "Marketshare", value: "48%", color: "text-green-400" },
                { Icon: MousePointerClick, label: "Clicks / Month", value: "312", color: "text-green-400" },
                { Icon: Users, label: "Customers / Month", value: "30+", color: "text-green-400" },
              ].map(({ Icon, label, value, color }) => (
                <div key={label} className="flex items-center justify-between py-2.5 border-b border-stone-800 last:border-0">
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-stone-600" />
                    <span className="text-sm text-stone-400">{label}</span>
                  </div>
                  <span className={`text-xl font-bold ${color}`}>{value}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Legend */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex items-center justify-center gap-6 mt-8 text-xs text-stone-500"
        >
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span>Top 3 (Dominant)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-orange-400"></div>
            <span>Ranked 4–10</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span>Not Ranked</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}