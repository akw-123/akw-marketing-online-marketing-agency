import React from "react";
import { motion } from "framer-motion";
import { Eye, CircleDollarSign, RefreshCcw } from "lucide-react";

const advantages = [
  {
    icon: Eye,
    title: "Visibility",
    description:
      "75% of all leads who are searching for your services go to the top 3 results. If you're not there, you're invisible.",
  },
  {
    icon: CircleDollarSign,
    title: "Free",
    description:
      "No pay per click or huge ad budgets as with running Google Ads, Meta Ads or alike.",
  },
  {
    icon: RefreshCcw,
    title: "Long Term Strategy",
    description:
      "As soon as you're in the top 3, you'll usually stay there for years. Without any additional monthly costs.",
  },
];

export default function AdvantagesSection() {
  return (
    <section className="py-20 md:py-28 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="inline-flex items-center gap-2 bg-white border border-stone-200 rounded-full px-4 py-1.5 text-xs font-medium text-stone-600 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
            The Advantage
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-stone-900 tracking-tight">
            <span
              className="italic font-bold"
              style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
            >
              But
            </span>
            , Is This Even Worth It?
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {advantages.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                className="bg-white/70 backdrop-blur-sm border border-stone-200/60 rounded-2xl p-8 hover:shadow-lg hover:shadow-stone-200/50 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-stone-100 flex items-center justify-center mb-5">
                  <Icon className="w-5 h-5 text-stone-600" />
                </div>
                <h3 className="text-lg font-semibold text-stone-900 mb-3">
                  {item.title}
                </h3>
                <p className="text-sm text-stone-500 leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}