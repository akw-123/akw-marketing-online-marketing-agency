import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "What is the difference between SEO and Google Ads?",
    a: "SEO (Search Engine Optimization) is a long-term strategy that helps your business rank organically in search results. Google Ads is a pay-per-click model where you pay every time someone clicks your ad. SEO provides sustainable, free traffic once you rank, while ads stop the moment you stop paying.",
  },
  {
    q: "Which companies do you work with?",
    a: "We work with local service-based businesses such as plumbers, dentists, electricians, lawyers, real estate agents, restaurants, and more. Essentially any business that relies on local customers finding them through Google.",
  },
  {
    q: "How much time will I need to invest?",
    a: "Very little. After the initial onboarding which takes about 15 minutes, we handle everything. You'll receive bi-weekly progress updates and can reach out to us anytime with questions.",
  },
  {
    q: "What are the contract terms?",
    a: "We require a 3-month minimum commitment to allow enough time for results. After the initial period, you can cancel monthly. We're confident in our results which is why we offer a money-back guarantee.",
  },
  {
    q: "How can we get started?",
    a: "Simply choose a package below and fill out the intake form. We'll get back to you within 24 hours with a free analysis of your current Google rankings and a clear roadmap to get you into the top 3.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section id="faq" className="py-20 md:py-28 px-6">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="inline-flex items-center gap-2 bg-white border border-stone-200 rounded-full px-4 py-1.5 text-xs font-medium text-stone-600 mb-6">
            FAQs
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-stone-900 tracking-tight">
            Frequently Asked{" "}
            <span
              className="italic font-bold"
              style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
            >
              Questions
            </span>
          </h2>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              className="bg-white/70 backdrop-blur-sm border border-stone-200/60 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full text-left px-6 py-5 flex items-center justify-between hover:bg-stone-50/50 transition-colors"
              >
                <span className="text-sm font-semibold text-stone-900 pr-4">{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-stone-400 flex-shrink-0 transition-transform duration-300 ${
                    openIndex === idx ? "rotate-180" : ""
                  }`}
                />
              </button>
              <AnimatePresence>
                {openIndex === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-6 pb-5 text-sm text-stone-500 leading-relaxed">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}