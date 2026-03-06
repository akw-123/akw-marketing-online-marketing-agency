import React from "react";
import { motion } from "framer-motion";
import { Search, UserCheck, Rocket, BarChart3 } from "lucide-react";

const steps = [
  {
    num: "01",
    icon: Search,
    title: "Free Analysis",
    description: "Choose a suitable package and fill out the form. We'll analyse your current standing.",
  },
  {
    num: "02",
    icon: UserCheck,
    title: "Onboarding",
    description: "We'll send you detailed instructions that shows you how we can get secure access to your profile.",
  },
  {
    num: "03",
    icon: Rocket,
    title: "Execution",
    description: "We'll walk through every step of the process so we not only fill your calendar for weeks.",
  },
  {
    num: "04",
    icon: BarChart3,
    title: "What Works?",
    description: "We track relevant data to see what actually works and do more of it.",
  },
];

export default function ProcessSection() {
  return (
    <section id="process" className="py-20 md:py-28 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="inline-flex items-center gap-2 bg-white border border-stone-200 rounded-full px-4 py-1.5 text-xs font-medium text-stone-600 mb-6">
            How Does It Work?
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-stone-900 tracking-tight">
            It's Pretty{" "}
            <span
              className="italic font-bold"
              style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
            >
              Easy
            </span>
            .
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.12 }}
                className="relative bg-white/70 backdrop-blur-sm border border-stone-200/60 rounded-2xl p-7 hover:shadow-lg hover:shadow-stone-200/50 transition-all duration-300"
              >
                <span className="text-5xl font-bold text-stone-100 absolute top-4 right-5">
                  {step.num}
                </span>
                <div className="w-11 h-11 rounded-xl bg-stone-900 flex items-center justify-center mb-5">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-base font-semibold text-stone-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-stone-500 leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}