import React from "react";
import { motion } from "framer-motion";
import { Check, X, Phone, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const plans = [
  {
    name: "Minimum",
    price: "CA$500",
    period: "/ Month",
    commitment: "3 month commitment. Cancellable monthly thereafter.",
    highlight: "First page on Google within 90 days.",
    noGuarantee: true,
    visibility: "30%",
    features: [
      { text: "Full Competitor's Analysis", included: true },
      { text: "Updates Every Two Weeks", included: true },
      { text: "No Money-Back-Guarantee", included: false },
      { text: "Ranking For Main Search-Term", included: true },
      { text: "Limited Website Optimization", included: false },
      { text: "High Quality Backlinks", included: true },
    ],
    popular: false,
  },
  {
    name: "Standard",
    price: "CA$599",
    period: "/ Month",
    commitment: "3 month commitment. Cancellable monthly thereafter.",
    highlight: "Top 3 on Google within 90 days. Guaranteed or you don't pay.",
    noGuarantee: false,
    visibility: "75%+",
    features: [
      { text: "Full Competitor's Analysis", included: true },
      { text: "Updates Every Two Weeks", included: true },
      { text: "Money-Back-Guarantee", included: true },
      { text: "Ranking For Main Search-Term", included: true },
      { text: "Full Website Optimization", included: true },
      { text: "High Quality Backlinks", included: true },
    ],
    popular: true,
  },
  {
    name: "Best Value",
    price: "CA$999",
    period: "/ Quarter",
    badge: "Save CA$198",
    commitment: "Cancellable every 3 months.",
    highlight: "Top 3 on Google within 90 days. Guaranteed or you don't pay.",
    noGuarantee: false,
    visibility: "75%+",
    features: [
      { text: "Full Competitor's Analysis", included: true },
      { text: "Updates Every Two Weeks", included: true },
      { text: "Money-Back-Guarantee", included: true },
      { text: "Ranking For Main Search-Term", included: true },
      { text: "Full Website Optimization", included: true },
      { text: "High Quality Backlinks", included: true },
    ],
    popular: false,
  },
];

export default function PricingSection() {
  return (
    <section id="pricing" className="py-20 md:py-28 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="inline-flex items-center gap-2 bg-white border border-stone-200 rounded-full px-4 py-1.5 text-xs font-medium text-stone-600 mb-6">
            Packages
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-stone-900 tracking-tight">
            Get{" "}
            <span
              className="italic font-bold"
              style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
            >
              more Clients
            </span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan, idx) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.12 }}
              className={`relative rounded-2xl p-8 border transition-all duration-300 hover:shadow-xl ${
                plan.popular
                  ? "bg-stone-900 border-stone-700 text-white shadow-2xl shadow-stone-900/30 scale-[1.02]"
                  : "bg-white/70 backdrop-blur-sm border-stone-200/60 hover:shadow-stone-200/50"
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    <Sparkles className="w-3 h-3" />
                    {plan.badge}
                  </span>
                </div>
              )}
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1 bg-amber-400 text-stone-900 text-xs font-bold px-3 py-1 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}

              <h3 className={`text-lg font-semibold mb-1 ${plan.popular ? "text-white" : "text-stone-900"}`}>
                {plan.name}
              </h3>
              <div className="flex items-baseline gap-1 mb-2">
                <span className={`text-3xl font-bold ${plan.popular ? "text-white" : "text-stone-900"}`}>
                  {plan.price}
                </span>
                <span className={`text-sm ${plan.popular ? "text-stone-400" : "text-stone-500"}`}>
                  {plan.period}
                </span>
              </div>
              <p className={`text-xs mb-1 ${plan.popular ? "text-stone-400" : "text-stone-400"}`}>
                {plan.commitment}
              </p>
              <p className={`text-xs font-medium mb-2 ${plan.popular ? "text-green-400" : "text-stone-600"}`}>
                {plan.highlight}
              </p>
              <p className={`text-xs mb-6 ${plan.popular ? "text-stone-400" : "text-stone-400"}`}>
                Visible on <strong className={plan.popular ? "text-white" : "text-stone-700"}>{plan.visibility}</strong> of search results.
              </p>

              <div className="space-y-3 mb-8">
                {plan.features.map((f, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    {f.included ? (
                      <Check className={`w-4 h-4 flex-shrink-0 ${plan.popular ? "text-green-400" : "text-green-500"}`} />
                    ) : (
                      <X className={`w-4 h-4 flex-shrink-0 ${plan.popular ? "text-stone-600" : "text-stone-300"}`} />
                    )}
                    <span
                      className={`text-sm ${
                        f.included
                          ? plan.popular
                            ? "text-stone-300"
                            : "text-stone-600"
                          : plan.popular
                          ? "text-stone-600"
                          : "text-stone-400"
                      } ${!f.included ? "line-through" : ""}`}
                    >
                      {f.text}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <Button
                  className={`w-full rounded-xl h-11 font-medium text-sm ${
                    plan.popular
                      ? "bg-white text-stone-900 hover:bg-stone-100"
                      : "bg-stone-900 text-white hover:bg-stone-800"
                  }`}
                >
                  Get Started
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <a href="tel:+447400487527" className="block">
                  <Button
                    variant="outline"
                    className={`w-full rounded-xl h-11 font-medium text-sm ${
                      plan.popular
                        ? "border-stone-700 text-stone-300 hover:bg-stone-800 hover:text-white bg-transparent"
                        : "border-stone-200 text-stone-600 hover:bg-stone-50"
                    }`}
                  >
                    <Phone className="w-3.5 h-3.5 mr-2" />
                    Call
                  </Button>
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}