import React from "react";
import { motion } from "framer-motion";
import { TrendingDown, TrendingUp, MapPin, BarChart3, MousePointerClick, Users } from "lucide-react";

export default function BeforeAfterSection() {
  return (
    <section id="before-after" className="py-20 md:py-28 px-6">
      <div className="max-w-7xl mx-auto">
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
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Before */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative bg-white border border-stone-200 rounded-2xl p-8 overflow-hidden"
          >
            <div className="absolute top-0 right-0 bg-red-50 text-red-500 text-xs font-semibold px-4 py-1.5 rounded-bl-xl">
              BEFORE
            </div>
            <div className="flex items-center gap-3 mb-6 mt-2">
              <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center">
                <MapPin className="w-4 h-4 text-stone-400" />
              </div>
              <div>
                <p className="font-semibold text-stone-900 text-sm">Your Company</p>
                <p className="text-xs text-stone-400">Example Address 12, NYC</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-stone-100">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-stone-400" />
                  <span className="text-sm text-stone-500">Average Ranking</span>
                </div>
                <span className="text-2xl font-bold text-red-400">86</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-stone-100">
                <div className="flex items-center gap-2">
                  <TrendingDown className="w-4 h-4 text-stone-400" />
                  <span className="text-sm text-stone-500">Marketshare</span>
                </div>
                <span className="text-2xl font-bold text-red-400">1%</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-stone-100">
                <div className="flex items-center gap-2">
                  <MousePointerClick className="w-4 h-4 text-stone-400" />
                  <span className="text-sm text-stone-500">Clicks per Month</span>
                </div>
                <span className="text-2xl font-bold text-red-400">5</span>
              </div>
              <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-stone-400" />
                  <span className="text-sm text-stone-500">Customers per Month</span>
                </div>
                <span className="text-2xl font-bold text-red-400">1-2</span>
              </div>
            </div>
          </motion.div>

          {/* After */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative bg-stone-900 border border-stone-700 rounded-2xl p-8 overflow-hidden"
          >
            <div className="absolute top-0 right-0 bg-green-500/10 text-green-400 text-xs font-semibold px-4 py-1.5 rounded-bl-xl">
              AFTER
            </div>
            <div className="flex items-center gap-3 mb-6 mt-2">
              <div className="w-10 h-10 rounded-full bg-stone-800 flex items-center justify-center">
                <MapPin className="w-4 h-4 text-green-400" />
              </div>
              <div>
                <p className="font-semibold text-white text-sm">Your Company</p>
                <p className="text-xs text-stone-400">Example Address 12, NYC</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-stone-800">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-stone-500" />
                  <span className="text-sm text-stone-400">Average Ranking</span>
                </div>
                <span className="text-2xl font-bold text-green-400">1</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-stone-800">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-stone-500" />
                  <span className="text-sm text-stone-400">Marketshare</span>
                </div>
                <span className="text-2xl font-bold text-green-400">48%</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-stone-800">
                <div className="flex items-center gap-2">
                  <MousePointerClick className="w-4 h-4 text-stone-500" />
                  <span className="text-sm text-stone-400">Clicks per Month</span>
                </div>
                <span className="text-2xl font-bold text-green-400">312</span>
              </div>
              <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-stone-500" />
                  <span className="text-sm text-stone-400">Customers per Month</span>
                </div>
                <span className="text-2xl font-bold text-green-400">30+</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}