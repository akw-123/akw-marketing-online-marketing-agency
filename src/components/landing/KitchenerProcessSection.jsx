import React from "react";
import { motion } from "framer-motion";
import { CalendarClock, Map, ListChecks, Send } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: CalendarClock,
    title: "Strategy Call",
    description: "Schedule a free call so we can assess your market in Kitchener and review your current rankings.",
  },
  {
    number: "02",
    icon: Map,
    title: "Onboarding",
    description: "We'll send you detailed instructions that show you how we can get secure access to your profile.",
  },
  {
    number: "03",
    icon: ListChecks,
    title: "Execution",
    description: "We'll walk through every step of the process so we not only fill your calendar for weeks.",
  },
  {
    number: "04",
    icon: Send,
    title: "What Works?",
    description: "We track relevant data to see what actually works and do more of it.",
  },
];

export default function KitchenerProcessSection() {
  return (
    <section id="process" className="py-20 md:py-28 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="inline-flex items-center gap-2 bg-white border border-stone-200 rounded-full px-4 py-1.5 text-xs font-medium text-stone-600 mb-6">
            <Send className="w-3 h-3" />
            How Does It Work?
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-stone-900 tracking-tight">
            It's Pretty{" "}
            <span
              className="italic font-bold"
              style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
            >
              Easy.
            </span>
          </h2>
        </motion.div>

        <div className="space-y-4">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="bg-white border border-stone-200/60 rounded-xl px-6 py-5 flex items-center gap-6"
              >
                <Icon className="w-5 h-5 text-stone-500 flex-shrink-0" />
                <span className="text-sm font-bold text-stone-900 w-32 flex-shrink-0">
                  {step.number}. {step.title}
                </span>
                <p className="text-sm text-stone-500 leading-relaxed">{step.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}